export interface IFavoriteTransaksi {
    id: number;
    uraian: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ICreateFavoriteTransaksiPayload {
    uraian: string;
}

export interface IUpdateFavoriteTransaksiPayload {
    uraian?: string;
}
