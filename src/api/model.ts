export interface StoreApiResponse {
    message?: string;
    success: boolean;
}

export interface SessionRequestBody {
    key: string;
    data: string;
    signature?: string;
    timeout: number;
}

export interface ShareMetadata {
    iv: string;
    ephemPublicKey: string;
    ciphertext: string;
    mac: string;
}