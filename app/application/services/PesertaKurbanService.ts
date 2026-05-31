import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { IPesertaKurban, ICreatePesertaKurbanPayload, IUpdatePesertaKurbanPayload } from '~/domain/models/IPesertaKurban';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class PesertaKurbanService extends BaseService {
    static async getAll(params?: IPaginationQuery): Promise<IApiResponse<IPesertaKurban[]>> {
        return await this.api<IApiResponse<IPesertaKurban[]>>(endpoints.PESERTA_KURBAN.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getById(id: number): Promise<IApiResponse<IPesertaKurban>> {
        return await this.api<IApiResponse<IPesertaKurban>>(endpoints.PESERTA_KURBAN.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async create(payload: ICreatePesertaKurbanPayload): Promise<IApiResponse<IPesertaKurban>> {
        return await this.api<IApiResponse<IPesertaKurban>>(endpoints.PESERTA_KURBAN.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async update(id: number, payload: IUpdatePesertaKurbanPayload): Promise<IApiResponse<IPesertaKurban>> {
        return await this.api<IApiResponse<IPesertaKurban>>(endpoints.PESERTA_KURBAN.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async delete(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.PESERTA_KURBAN.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async getDraft(params?: IPaginationQuery): Promise<IApiResponse<IPesertaKurban[]>> {
        return await this.api<IApiResponse<IPesertaKurban[]>>(endpoints.PESERTA_KURBAN.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }

    static async deletePermanent(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.PESERTA_KURBAN.DELETE_PERMANENT(id), {
            method: 'DELETE',
        });
    }
}
