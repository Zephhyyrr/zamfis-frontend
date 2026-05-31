import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { IUser, ICreateUserPayload, IUpdateUserPayload, IUpdateUserFotoPayload } from '~/domain/models/IUser';
import type { IApiResponse } from '~/domain/types/IApiResponse';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export class UserService extends BaseService {

    static async getAllUsers(params?: IPaginationQuery): Promise<IApiResponse<IUser[]>> {
        return await this.api<IApiResponse<IUser[]>>(endpoints.USER.GET_ALL, {
            method: 'GET',
            query: params,
        });
    }

    static async getUserById(id: number): Promise<IApiResponse<IUser>> {
        return await this.api<IApiResponse<IUser>>(endpoints.USER.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async createUser(payload: ICreateUserPayload): Promise<IApiResponse<IUser>> {
        return await this.api<IApiResponse<IUser>>(endpoints.USER.CREATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async updateUser(id: number, payload: IUpdateUserPayload): Promise<IApiResponse<IUser>> {
        return await this.api<IApiResponse<IUser>>(endpoints.USER.UPDATE(id), {
            method: 'PUT',
            body: payload,
        });
    }

    static async deleteUser(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.USER.DELETE(id), {
            method: 'DELETE',
        });
    }

    static async deletePermanentUser(id: number): Promise<IApiResponse<null>> {
        return await this.api<IApiResponse<null>>(endpoints.USER.DELETE_PERMANENT(id), {
            method: 'DELETE',
        });
    }

    static async updateFotoProfil(id: number, payload: IUpdateUserFotoPayload): Promise<IApiResponse<IUser>> {
        const formData = new FormData();
        formData.append('fotoProfile', payload.fotoProfile);
        return await this.api<IApiResponse<IUser>>(endpoints.USER.FOTO_PROFIL(id), {
            method: 'PATCH',
            body: formData,
        });
    }

    static async isActivateUser(id: number): Promise<IApiResponse<IUser>> {
        return await this.api<IApiResponse<IUser>>(endpoints.USER.ACTIVE(id), {
            method: 'PATCH',
        });
    }

    static async getDraftUsers(params?: IPaginationQuery): Promise<IApiResponse<IUser[]>> {
        return await this.api<IApiResponse<IUser[]>>(endpoints.USER.GET_DRAFT, {
            method: 'GET',
            query: params,
        });
    }
}