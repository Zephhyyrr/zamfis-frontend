import { BaseService } from './BaseService';
import { endpoints } from '~/infrastructure/http/endpoints';
import type { IApiResponse } from '~/domain/types/IApiResponse';

export class PredictService extends BaseService {

    static async getIncomePrediction(): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.INCOME, {
            method: 'GET',
        });
    }

    static async getExpensePrediction(): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.EXPENSE, {
            method: 'GET',
        });
    }

    static async savePrediction(payload: any): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.SAVE, {
            method: 'POST',
            body: payload,
        });
    }

    static async allocatePrediction(payload: any): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.ALLOCATE, {
            method: 'POST',
            body: payload,
        });
    }

    static async saveAllocations(payload: any): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.SAVE_ALLOCATIONS, {
            method: 'POST',
            body: payload,
        });
    }

    static async getPredictionHistory(): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.HISTORY, {
            method: 'GET',
        });
    }

    static async getPredictionById(id: number): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.GET_BY_ID(id), {
            method: 'GET',
        });
    }

    static async deletePrediction(id: number): Promise<IApiResponse<any>> {
        return await this.api<IApiResponse<any>>(endpoints.PREDICT.DELETE(id), {
            method: 'DELETE',
        });
    }
}
