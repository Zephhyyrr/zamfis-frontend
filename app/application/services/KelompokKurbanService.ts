import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { IKelompokKurban, ICreateKelompokKurbanPayload, IUpdateKelompokKurbanPayload } from '~/domain/models/IKelompokKurban';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class KelompokKurbanService extends BaseService {
    static async getAll(params?: IPaginationQuery): Promise<IApiResponse<IKelompokKurban[]>> {
        return await this.api<IApiResponse<IKelompokKurban[]>>(endpoints.KELOMPOK_KURBAN.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getById(id: number): Promise<IApiResponse<IKelompokKurban>> {
        return await this.api<IApiResponse<IKelompokKurban>>(endpoints.KELOMPOK_KURBAN.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async create(payload: ICreateKelompokKurbanPayload): Promise<IApiResponse<IKelompokKurban>> {
        return await this.api<IApiResponse<IKelompokKurban>>(endpoints.KELOMPOK_KURBAN.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async update(id: number, payload: IUpdateKelompokKurbanPayload): Promise<IApiResponse<IKelompokKurban>> {
        return await this.api<IApiResponse<IKelompokKurban>>(endpoints.KELOMPOK_KURBAN.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async delete(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.KELOMPOK_KURBAN.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async getDraft(params?: IPaginationQuery): Promise<IApiResponse<IKelompokKurban[]>> {
        return await this.api<IApiResponse<IKelompokKurban[]>>(endpoints.KELOMPOK_KURBAN.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }

    }
