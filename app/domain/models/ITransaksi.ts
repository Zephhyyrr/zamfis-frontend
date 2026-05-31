import type { IUser } from './IUser';
import type { IJenisKas } from './IJenisKas';
import type { IMediaPembayaran } from './IMediaPembayaran';

export interface ITransaksi {
    id: number;
    uraian: string;
    tipe: 'uang_masuk' | 'uang_keluar';
    nominal: number;
    debit: number;
    kredit: number;
    tanggal: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
    jenisKasId: number;
    mediaPembayaranId: number;
    user?: IUser;
    jenisKas?: IJenisKas;
    mediaPembayaran?: IMediaPembayaran;
}

export interface ICreateTransaksiPayload {
    uraian: string;
    tipe: 'uang_masuk' | 'uang_keluar';
    nominal: number;
    debit: number;
    kredit: number;
    tanggal: string;
    jenisKasId: number;
    mediaPembayaranId: number;
}

export interface IUpdateTransaksiPayload extends Partial<ICreateTransaksiPayload> {}
