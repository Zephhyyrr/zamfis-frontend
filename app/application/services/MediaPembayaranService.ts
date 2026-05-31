import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { IMediaPembayaran, ICreateMediaPembayaranPayload, IUpdateMediaPembayaranPayload } from '~/domain/models/IMediaPembayaran';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class MediaPembayaranService extends BaseService {
    static async getAll(params?: IPaginationQuery): Promise<IApiResponse<IMediaPembayaran[]>> {
        return await this.api<IApiResponse<IMediaPembayaran[]>>(endpoints.MEDIA_PEMBAYARAN.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getById(id: number): Promise<IApiResponse<IMediaPembayaran>> {
        return await this.api<IApiResponse<IMediaPembayaran>>(endpoints.MEDIA_PEMBAYARAN.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async create(payload: ICreateMediaPembayaranPayload): Promise<IApiResponse<IMediaPembayaran>> {
        return await this.api<IApiResponse<IMediaPembayaran>>(endpoints.MEDIA_PEMBAYARAN.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async update(id: number, payload: IUpdateMediaPembayaranPayload): Promise<IApiResponse<IMediaPembayaran>> {
        return await this.api<IApiResponse<IMediaPembayaran>>(endpoints.MEDIA_PEMBAYARAN.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async delete(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.MEDIA_PEMBAYARAN.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async getDraft(params?: IPaginationQuery): Promise<IApiResponse<IMediaPembayaran[]>> {
        return await this.api<IApiResponse<IMediaPembayaran[]>>(endpoints.MEDIA_PEMBAYARAN.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }

    static async deletePermanent(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.MEDIA_PEMBAYARAN.DELETE_PERMANENT(id), {
            method: 'DELETE',
        });
    }
}
