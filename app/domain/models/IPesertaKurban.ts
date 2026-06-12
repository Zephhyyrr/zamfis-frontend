import type { IMediaPembayaran } from './IMediaPembayaran';
import type { IKelompokKurban } from './IKelompokKurban';

export type TipeKurban = 'individu_sapi' | 'individu_kambing' | 'kelompok';

export interface IPesertaKurban {
    id: number;
    nama: string;
    nominal: number;
    tahun: string;
    tipe: TipeKurban;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    mediaPembayaranId: number;
    kelompokKurbanId: number | null;
    mediaPembayaran?: IMediaPembayaran;
    kelompokKurban?: IKelompokKurban;
}

export interface ICreatePesertaKurbanPayload {
    nama: string;
    nominal: number;
    tahun?: string;
    tipe: TipeKurban;
    mediaPembayaranId: number;
    kelompokKurbanId?: number | null;
}

export interface IUpdatePesertaKurbanPayload extends Partial<ICreatePesertaKurbanPayload> {}
