export interface IKelompokKurban {
    id: number;
    nama: string;
    tahun: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateKelompokKurbanPayload {
    nama: string;
    tahun?: string;
}

export interface IUpdateKelompokKurbanPayload {
    nama?: string;
    tahun?: string;
}
