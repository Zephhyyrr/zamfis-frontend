import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { 
    IJenisKas, 
    ICreateJenisKasPayload, 
    IUpdateJenisKasPayload 
} from '~/domain/models/IJenisKas';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class JenisKasService extends BaseService {
    static async getAll(params?: IPaginationQuery): Promise<IApiResponse<IJenisKas[]>> {
        return await this.api<IApiResponse<IJenisKas[]>>(endpoints.JENIS_KAS.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getById(id: number): Promise<IApiResponse<IJenisKas>> {
        return await this.api<IApiResponse<IJenisKas>>(endpoints.JENIS_KAS.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async create(payload: ICreateJenisKasPayload | FormData): Promise<IApiResponse<IJenisKas>> {
        return await this.api<IApiResponse<IJenisKas>>(endpoints.JENIS_KAS.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async update(id: number, payload: IUpdateJenisKasPayload | FormData): Promise<IApiResponse<IJenisKas>> {
        return await this.api<IApiResponse<IJenisKas>>(endpoints.JENIS_KAS.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async delete(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.JENIS_KAS.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async getDraft(params?: IPaginationQuery): Promise<IApiResponse<IJenisKas[]>> {
        return await this.api<IApiResponse<IJenisKas[]>>(endpoints.JENIS_KAS.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }

    static async deletePermanent(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.JENIS_KAS.DELETE_PERMANENT(id), {
            method: 'DELETE',
        });
    }
}
