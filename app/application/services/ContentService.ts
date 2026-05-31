import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';
import type { IContent, ICreateContentPayload, IUpdateContentPayload } from '~/domain/models/IContent';

export class ContentService extends BaseService {

    static async getAllContents(params?: IPaginationQuery): Promise<IApiResponse<IContent[]>> {
        return await this.api<IApiResponse<IContent[]>>(endpoints.CONTENT.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getContentById(id: number): Promise<IApiResponse<IContent>> {
        return await this.api<IApiResponse<IContent>>(endpoints.CONTENT.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async createContent(payload: ICreateContentPayload): Promise<IApiResponse<IContent>> {
        const formData = new FormData();
        formData.append('judul', payload.judul);
        formData.append('jenis', payload.jenis);
        if (payload.isTampil !== undefined) {
            formData.append('isTampil', String(payload.isTampil));
        }
        if (payload.gambarUrl instanceof File) {
            formData.append('gambarUrl', payload.gambarUrl);
        }
        return await this.api<IApiResponse<IContent>>(endpoints.CONTENT.CREATE, {
            method: 'POST',
            body: formData,
        });
    }

    static async updateContent(id: number, payload: IUpdateContentPayload): Promise<IApiResponse<IContent>> {
        const formData = new FormData();
        if (payload.judul) formData.append('judul', payload.judul);
        if (payload.jenis) formData.append('jenis', payload.jenis);
        if (payload.isTampil !== undefined) {
            formData.append('isTampil', String(payload.isTampil));
        }
        if (payload.gambarUrl instanceof File) {
            formData.append('gambarUrl', payload.gambarUrl);
        }
        return await this.api<IApiResponse<IContent>>(endpoints.CONTENT.UPDATE(id), {
            method: 'PUT',
            body: formData,
        });
    }

    static async deleteContent(id: number): Promise<IApiResponse<void>> {
        return await this.api<IApiResponse<void>>(endpoints.CONTENT.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async getDraftContents(params?: IPaginationQuery): Promise<IApiResponse<IContent[]>> {
        return await this.api<IApiResponse<IContent[]>>(endpoints.CONTENT.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }

    static async deleteContentPermanently(id: number): Promise<IApiResponse<void>> {
        return await this.api<IApiResponse<void>>(endpoints.CONTENT.DELETE_PERMANENT(id), {
            method: 'DELETE',
        });
    }
}