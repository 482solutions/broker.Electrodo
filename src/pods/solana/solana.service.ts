import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PinataSDK from '@pinata/sdk';
import axios from 'axios';
import FormData from 'form-data';
import PDFDocument from 'pdfkit';
import { Readable } from 'typeorm/platform/PlatformTools';
import bs58 from 'bs58';

import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
    createAssociatedTokenAccountIdempotent,
    createInitializeInstruction,
    createInitializeMetadataPointerInstruction,
    createInitializeMintInstruction,
    createTransferInstruction,
    createUpdateFieldInstruction,
    ExtensionType,
    getMintLen,
    LENGTH_SIZE,
    mintTo,
    TOKEN_2022_PROGRAM_ID,
    TYPE_SIZE,
} from '@solana/spl-token';
import { pack, TokenMetadata } from '@solana/spl-token-metadata';
import { UploadedFile } from 'src/utils';

@Injectable()
export class SolanaService {
    private readonly logger = new Logger(SolanaService.name);
    private connection: Connection;
    private keypair: Keypair;

    constructor(private readonly config: ConfigService) {
        const SOLANA_ENDPOINT = this.config.get<string>('SOLANA_ENDPOINT');
        const SOLANA_PRIVATE_KEY = this.config.get<string>('SOLANA_PRIVATE_KEY');
        this.connection = new Connection(SOLANA_ENDPOINT, { commitment: 'confirmed' }); // Mainnet Beta endpoint
        this.keypair = Keypair.fromSecretKey(bs58.decode(SOLANA_PRIVATE_KEY));
    }

    private async delay(ms) {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async getAccountBalance(publicKey: PublicKey): Promise<any> {
        try {
            const balance = await this.connection.getBalance(publicKey);
            return balance;
        } catch (error) {
            this.logger.error(`Error getting balance. Message: `, error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }

    private async requestLamports() {
        try {
            await this.connection.requestAirdrop(this.keypair.publicKey, LAMPORTS_PER_SOL);
        } catch (error) {
            this.logger.error(`Error requesting lamports. Message: `, error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }

    async transfer(from: string, to: string) {
        const source = await createAssociatedTokenAccountIdempotent(
            this.connection,
            this.keypair,
            new PublicKey(from),
            this.keypair.publicKey,
            { commitment: 'confirmed' },
            TOKEN_2022_PROGRAM_ID,
        );
        this.logger.log(`Source account: ${source}`);
        const destination = await createAssociatedTokenAccountIdempotent(
            this.connection,
            this.keypair,
            new PublicKey(from),
            new PublicKey(to),
            { commitment: 'confirmed' },
            TOKEN_2022_PROGRAM_ID,
        );
        this.logger.log(`Destination: ${destination}`);
        const tx = new Transaction().add(
            createTransferInstruction(
                source,
                destination,
                this.keypair.publicKey,
                1,
                [this.keypair],
                TOKEN_2022_PROGRAM_ID,
            ),
        );
        const transactionSignature = await sendAndConfirmTransaction(this.connection, tx, [this.keypair]);
        this.logger.log(`Signed transaction: ${transactionSignature}`);
        return transactionSignature;
    }

    private async createTokenAndMint(ipfsLink: string): Promise<string> {
        try {
            const decimals = 0;
            const mintAmount = 1;

            const payer = this.keypair;
            const mint = Keypair.generate();
            this.logger.log(`Mint account: ${mint.publicKey.toBase58()}`);

            const metadata: TokenMetadata = {
                mint: mint.publicKey,
                updateAuthority: mint.publicKey,
                name: 'ESG Report 2023',
                symbol: 'ESG',
                uri: '',
                additionalMetadata: [
                    ['tag', 'Link to IPFS'],
                    ['data', ipfsLink],
                ],
            };

            // Calculate the minimum balance for the mint account
            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
            const mintLamports = await this.connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: payer.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: mintLen,
                    lamports: mintLamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(
                    mint.publicKey,
                    mint.publicKey,
                    mint.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
                createInitializeMintInstruction(mint.publicKey, decimals, mint.publicKey, null, TOKEN_2022_PROGRAM_ID),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    metadata: mint.publicKey,
                    updateAuthority: mint.publicKey,
                    mint: mint.publicKey,
                    mintAuthority: mint.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                }),

                createUpdateFieldInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    metadata: mint.publicKey,
                    updateAuthority: mint.publicKey,
                    field: metadata.additionalMetadata[0][0],
                    value: metadata.additionalMetadata[0][1],
                }),
                createUpdateFieldInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    metadata: mint.publicKey,
                    updateAuthority: mint.publicKey,
                    field: metadata.additionalMetadata[1][0],
                    value: metadata.additionalMetadata[1][1],
                }),
            );

            transaction.feePayer = payer.publicKey;
            const signedTransaction = await sendAndConfirmTransaction(this.connection, transaction, [payer, mint]);
            // Create associated token account
            const sourceAccount = await createAssociatedTokenAccountIdempotent(
                this.connection,
                payer,
                mint.publicKey,
                payer.publicKey,
                { commitment: 'confirmed' },
                TOKEN_2022_PROGRAM_ID,
            );
            // Mint NFT to associated token account
            await mintTo(
                this.connection,
                payer,
                mint.publicKey,
                sourceAccount,
                mint.publicKey,
                mintAmount,
                [mint],
                { commitment: 'confirmed' },
                TOKEN_2022_PROGRAM_ID,
            );
            return mint.publicKey.toBase58();
        } catch (error) {
            this.logger.error(`Error creating transaction. Message: `, error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }

    private calculateTextHeight(doc: any, width: number, text: string) {
        return doc.heightOfString(text, {
            width,
            align: 'left',
        });
    }

    async generateESGReport(data: any[], companyData: any): Promise<Buffer> {
        try {
            if (!data || !companyData) {
                throw new BadRequestException({ message: 'Missing required information to generate ESG Report' });
            }
            const doc = new PDFDocument({ size: 'A3', font: 'Times-Roman', info: { Title: 'ESG Report 2023' } });

            const columnPositions = [70, 230, 330, 550];
            const columnWidths = [150, 80, 200, 250];
            let y = 50;

            const table = {
                headers: ['Category', 'Identifier', 'Disclosure Requirement', 'Notes'],
                rows: data,
            };

            doc.font('Times-Bold')
                .fontSize(16)
                .text(`${companyData?.companyShortName} Corporate ESG Report: ESRS E1 - CLIMATE CHANGE Disclosure`, {
                    align: 'center',
                })
                .moveDown(1.5)
                .fontSize(14)
                .text(`About ${companyData?.companyShortName}`)
                .moveDown(1);

            Object.entries(companyData).forEach(([key, value]) => {
                if (key !== 'companyShortName') {
                    doc.font('Times-Bold')
                        .fontSize(11)
                        .text(`${key}: `, { continued: true })
                        .font('Times-Roman')
                        .text(`${value}`)
                        .moveDown(0.8);
                }
            });

            doc.addPage({ size: 'A3' });
            table.headers.forEach((header, columnIndex) => {
                doc.font('Times-Bold').fontSize(12).text(header, columnPositions[columnIndex], y);
            });
            y += 50;

            table.rows.forEach((row) => {
                let height = 0;
                Object.values(row).forEach((cell, columnIndex) => {
                    const text = cell.toString();
                    height = this.calculateTextHeight(doc, columnWidths[columnIndex], text);
                    doc.font('Times-Roman').fontSize(11).text(text, columnPositions[columnIndex], y, {
                        width: columnWidths[columnIndex],
                        height,
                        align: 'left',
                    });
                });
                y += height + 20;
            });

            return new Promise((resolve) => {
                const buffers: Buffer[] = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => resolve(Buffer.concat(buffers)));
                doc.end();
            });
        } catch (error) {
            this.logger.error(`Error generating pdf file. Message: `, error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }

    async uploadToPinata(pdfBuffer: Buffer): Promise<string> {
        try {
            if (pdfBuffer) {
                const readableStreamForFile = Readable.from(pdfBuffer);
                const options = { pinataMetadata: { name: 'ESG-Report.pdf' } };

                const PINATA_API_KEY = this.config.get<string>('PINATA_API_KEY');
                const PINATA_API_SECRET = this.config.get<string>('PINATA_API_SECRET');

                const pinata = new PinataSDK(PINATA_API_KEY, PINATA_API_SECRET);
                const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
                return result?.IpfsHash;
            }
        } catch (error) {
            this.logger.error(
                `Error uploading file to Pinata. Message: `,
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
            throw error;
        }
    }

    async uploadToChainstack(pdfBuffer: Buffer, fileName: string): Promise<UploadedFile> {
        try {
            const readableStreamForFile = Readable.from(pdfBuffer);

            const CHAINSTACK_BUCKET_ID = this.config.get<string>('CHAINSTACK_BUCKET_ID');
            const CHAINSTACK_API_KEY = this.config.get<string>('CHAINSTACK_API_KEY');

            const formData = new FormData();
            formData.append('bucket_id', CHAINSTACK_BUCKET_ID);
            formData.append('file', readableStreamForFile, fileName);
            const uploadResponse = await axios.post('https://api.chainstack.com/v1/ipfs/pins/pinfile', formData, {
                headers: {
                    ...formData.getHeaders(),
                    accept: 'application/json',
                    authorization: `Bearer ${CHAINSTACK_API_KEY}`,
                },
            });

            const pinId = uploadResponse.data.id;
            const publicLink = await this.getFileChainstack(pinId);

            return { name: fileName, ipfsLink: publicLink };
        } catch (error) {
            this.logger.error(
                `Error uploading file to Chainstack. Message: ${error?.message}. Errors: ${error.response.data}`,
                error.stack,
            );
            throw error;
        }
    }

    private async getFileChainstack(pinId: string): Promise<string> {
        const maxRetries = 10;
        const delayBetweenRetries = 5000;
        const CHAINSTACK_API_KEY = this.config.get<string>('CHAINSTACK_API_KEY');

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await axios.get(`https://api.chainstack.com/v1/ipfs/pins/${pinId}`, {
                    headers: {
                        accept: 'application/json',
                        authorization: `Bearer ${CHAINSTACK_API_KEY}`,
                    },
                });

                const { status, public_link } = response.data;

                if (status !== 'pinning' && public_link) {
                    return public_link;
                }

                await this.delay(delayBetweenRetries);
            } catch (error) {
                this.logger.error(
                    `Error fetching file status from Chainstack. Message: ${error?.message}`,
                    error.stack,
                );
                throw error;
            }
        }

        throw new Error('Getting public link error. Too many retries.');
    }

    async transferToSolana(ipfsLink: string, walletAddress: string): Promise<string> {
        try {
            if (!ipfsLink) {
                throw new ForbiddenException({ message: 'IPFS Hash - necessary information for data transfer.' });
            }
            if (!walletAddress) {
                throw new BadRequestException({ message: 'Wallet address is required' });
            }
            const payerPublicKey = this.keypair?.publicKey;
            const balance = await this.getAccountBalance(payerPublicKey);
            this.logger.log(`${balance / LAMPORTS_PER_SOL} SOL`);

            const transaction = this.createTokenAndMint(ipfsLink).then(
                async (publicKey) => await this.transfer(publicKey, walletAddress),
            );
            return transaction;
        } catch (error) {
            this.logger.error(`Token transfering error. Message: `, error?.message, 'Stack Trace: ', error?.stack);
            throw error;
        }
    }
}
