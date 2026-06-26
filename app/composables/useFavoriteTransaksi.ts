import { FavoriteTransaksiService } from '~/application/services/FavoriteTransaksiService';
import type { ICreateFavoriteTransaksiPayload, IUpdateFavoriteTransaksiPayload } from '~/domain/models/IFavoriteTransaksi';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useFavoriteTransaksi = () => {
    const fetchFavoriteTransaksiList = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'favorite-transaksi-list',
            () => FavoriteTransaksiService.getAll(params.value),
            { watch: [params] }
        );
    };

    const fetchFavoriteTransaksiDetail = (id: number) => {
        return useAsyncData(
            `favorite-transaksi-detail-${id}`,
            () => FavoriteTransaksiService.getById(id)
        );
    };

    const fetchDraftFavoriteTransaksi = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'favorite-transaksi-draft',
            () => FavoriteTransaksiService.getDraft(params.value),
            { watch: [params] }
        );
    };

    const createFavoriteTransaksi = async (payload: ICreateFavoriteTransaksiPayload) => {
        return await FavoriteTransaksiService.create(payload);
    };

    const updateFavoriteTransaksi = async (id: number, payload: IUpdateFavoriteTransaksiPayload) => {
        return await FavoriteTransaksiService.update(id, payload);
    };

    const deleteFavoriteTransaksi = async (id: number) => {
        return await FavoriteTransaksiService.delete(id);
    };

    
    return {
        fetchFavoriteTransaksiList,
        fetchFavoriteTransaksiDetail,
        fetchDraftFavoriteTransaksi,
        createFavoriteTransaksi,
        updateFavoriteTransaksi,
        deleteFavoriteTransaksi,
    };
};
