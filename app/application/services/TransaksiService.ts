import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { ITransaksi, ICreateTransaksiPayload, IUpdateTransaksiPayload } from '~/domain/models/ITransaksi';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class TransaksiService extends BaseService {
    static async getAll(params?: IPaginationQuery): Promise<IApiResponse<ITransaksi[]>> {
        return await this.api<IApiResponse<ITransaksi[]>>(endpoints.TRANSAKSI.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getById(id: number): Promise<IApiResponse<ITransaksi>> {
        return await this.api<IApiResponse<ITransaksi>>(endpoints.TRANSAKSI.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async create(payload: ICreateTransaksiPayload): Promise<IApiResponse<ITransaksi>> {
        return await this.api<IApiResponse<ITransaksi>>(endpoints.TRANSAKSI.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async update(id: number, payload: IUpdateTransaksiPayload): Promise<IApiResponse<ITransaksi>> {
        return await this.api<IApiResponse<ITransaksi>>(endpoints.TRANSAKSI.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async delete(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.TRANSAKSI.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async getDraft(params?: IPaginationQuery): Promise<IApiResponse<ITransaksi[]>> {
        return await this.api<IApiResponse<ITransaksi[]>>(endpoints.TRANSAKSI.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }

    static async deletePermanent(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.TRANSAKSI.DELETE_PERMANENT(id), {
            method: 'DELETE',
        });
    }

    static async getDashboard(year: number): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.TRANSAKSI.GET_DASHBOARD, {
            method: 'GET',
            query: { year }
        });
    }

}