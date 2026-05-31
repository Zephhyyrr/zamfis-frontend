import type { ITransaksi } from './ITransaksi';

export interface IJenisKas {
    id: number;
    nama: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    transactions: ITransaksi[];
}

export interface ICreateJenisKasPayload extends Omit<IJenisKas, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'transactions'> {}

export interface IUpdateJenisKasPayload extends Partial<Omit<IJenisKas, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'transactions'>> {}
