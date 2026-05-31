export interface IMediaPembayaran {
    id: number;
    nama: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateMediaPembayaranPayload {
    nama: string;
}

export interface IUpdateMediaPembayaranPayload {
    nama?: string;
}
