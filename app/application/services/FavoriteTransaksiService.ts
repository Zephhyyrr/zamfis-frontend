import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { IFavoriteTransaksi, ICreateFavoriteTransaksiPayload, IUpdateFavoriteTransaksiPayload } from '~/domain/models/IFavoriteTransaksi';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class FavoriteTransaksiService extends BaseService {
    static async getAll(params?: IPaginationQuery): Promise<IApiResponse<IFavoriteTransaksi[]>> {
        return await this.api<IApiResponse<IFavoriteTransaksi[]>>(endpoints.FAVORITE_TRANSAKSI.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getById(id: number): Promise<IApiResponse<IFavoriteTransaksi>> {
        return await this.api<IApiResponse<IFavoriteTransaksi>>(endpoints.FAVORITE_TRANSAKSI.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async create(payload: ICreateFavoriteTransaksiPayload): Promise<IApiResponse<IFavoriteTransaksi>> {
        return await this.api<IApiResponse<IFavoriteTransaksi>>(endpoints.FAVORITE_TRANSAKSI.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async update(id: number, payload: IUpdateFavoriteTransaksiPayload): Promise<IApiResponse<IFavoriteTransaksi>> {
        return await this.api<IApiResponse<IFavoriteTransaksi>>(endpoints.FAVORITE_TRANSAKSI.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async delete(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.FAVORITE_TRANSAKSI.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async getDraft(params?: IPaginationQuery): Promise<IApiResponse<IFavoriteTransaksi[]>> {
        return await this.api<IApiResponse<IFavoriteTransaksi[]>>(endpoints.FAVORITE_TRANSAKSI.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }

    static async deletePermanent(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.FAVORITE_TRANSAKSI.DELETE_PERMANENT(id), {
            method: 'DELETE',
        });
    }
}
