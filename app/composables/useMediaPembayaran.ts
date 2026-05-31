import { MediaPembayaranService } from '~/application/services/MediaPembayaranService';
import type { ICreateMediaPembayaranPayload, IUpdateMediaPembayaranPayload } from '~/domain/models/IMediaPembayaran';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useMediaPembayaran = () => {
    const fetchMediaPembayaranList = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'media-pembayaran-list',
            () => MediaPembayaranService.getAll(params.value),
            { watch: [params] }
        );
    };

    const fetchMediaPembayaranDetail = (id: number) => {
        return useAsyncData(
            `media-pembayaran-detail-${id}`,
            () => MediaPembayaranService.getById(id)
        );
    };

    const fetchDraftMediaPembayaran = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'media-pembayaran-draft',
            () => MediaPembayaranService.getDraft(params.value),
            { watch: [params] }
        );
    };

    const createMediaPembayaran = async (payload: ICreateMediaPembayaranPayload) => {
        return await MediaPembayaranService.create(payload);
    };

    const updateMediaPembayaran = async (id: number, payload: IUpdateMediaPembayaranPayload) => {
        return await MediaPembayaranService.update(id, payload);
    };

    const deleteMediaPembayaran = async (id: number) => {
        return await MediaPembayaranService.delete(id);
    };

    const deletePermanentMediaPembayaran = async (id: number) => {
        return await MediaPembayaranService.deletePermanent(id);
    };

    return {
        fetchMediaPembayaranList,
        fetchMediaPembayaranDetail,
        fetchDraftMediaPembayaran,
        createMediaPembayaran,
        updateMediaPembayaran,
        deleteMediaPembayaran,
        deletePermanentMediaPembayaran,
    };
};
