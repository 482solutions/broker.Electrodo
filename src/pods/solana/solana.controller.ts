import { Controller, Post, Body, UseInterceptors, UseGuards, HttpStatus, UploadedFiles, Logger } from '@nestjs/common';
import { SolanaService } from './solana.service';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { FileUploadDto } from './file-upload.dto';
import { FILE_SUPPORTED_MIMETYPES } from 'src/configuration/config';

const maxFilesLimit = parseInt(process.env.FILE_MAX_FILES, 10) || 1;
const maxFileSize = parseInt(process.env.FILE_MAX_FILE_SIZE, 10) || 5242880;
@Controller('solana')
export class SolanaController {
    constructor(private readonly solanaService: SolanaService) {}

    // @Post()
    // async create(@Body() data: any) {
    //     const { report, walletAddress, companyData } = data;
    //     // Generate PDF
    //     const pdfBuffer = await this.solanaService.generateESGReport(report, companyData);
    //     //Upload PDF to Pinata
    //     const pinataHash = await this.solanaService.uploadToPinata(pdfBuffer);
    //     return this.solanaService.transferToSolana(pinataHash, walletAddress);
    // }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @UseInterceptors(
        FileFieldsInterceptor([{ name: 'files', maxCount: maxFilesLimit }], {
            storage: multer.memoryStorage(),
            fileFilter: (req: Request, file, callback) => {
                if (!FILE_SUPPORTED_MIMETYPES.includes(file.mimetype)) {
                    callback(new Error('Unsupported file type'), false);
                }

                callback(null, true);
            },
            limits: {
                files: maxFilesLimit,
                fileSize: maxFileSize,
            },
        }),
    )
    @ApiResponse({ status: HttpStatus.CREATED, type: String, description: 'Upload a file' })
    async uploadToIPFS(
        @UploadedFiles()
        uploadedFiles: {
            files: Express.Multer.File[];
        },
    ): Promise<string> {
        const [file] = uploadedFiles.files;
        const ipfsLink = await this.solanaService.uploadToChainstack(file.buffer, file.originalname);
        const solanaHash = await this.solanaService.transferToSolana(ipfsLink, 'A1SUNBHvTBHb749ViFoeM1XLiPRgzozs1CRAGVo5zbav');
        const explorerLink = `https://explorer.solana.com/tx/${solanaHash}`
        return explorerLink;
    }
}
