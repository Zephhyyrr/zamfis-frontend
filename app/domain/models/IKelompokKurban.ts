export interface IKelompokKurban {
    id: number;
    nama: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateKelompokKurbanPayload {
    nama: string;
}

export interface IUpdateKelompokKurbanPayload {
    nama?: string;
}
