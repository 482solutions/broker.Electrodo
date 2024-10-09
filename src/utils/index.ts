export * from './baseFiles';
export * from './jws-helper';
export * from './app-shutdown';

export interface UploadedFile {
    name: string;
    ipfsHash?: string;
    ipfsLink?: string;
}

export interface TokenizedFile {
    explorerLink: string;
}
