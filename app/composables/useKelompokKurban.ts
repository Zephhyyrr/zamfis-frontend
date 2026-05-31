import { KelompokKurbanService } from '~/application/services/KelompokKurbanService';
import type { ICreateKelompokKurbanPayload, IUpdateKelompokKurbanPayload } from '~/domain/models/IKelompokKurban';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useKelompokKurban = () => {
    const fetchKelompokKurbanList = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'kelompok-kurban-list',
            () => KelompokKurbanService.getAll(params.value),
            { watch: [params] }
        );
    };

    const fetchKelompokKurbanDetail = (id: number) => {
        return useAsyncData(
            `kelompok-kurban-detail-${id}`,
            () => KelompokKurbanService.getById(id)
        );
    };

    const fetchDraftKelompokKurban = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'kelompok-kurban-draft',
            () => KelompokKurbanService.getDraft(params.value),
            { watch: [params] }
        );
    };

    const createKelompokKurban = async (payload: ICreateKelompokKurbanPayload) => {
        return await KelompokKurbanService.create(payload);
    };

    const updateKelompokKurban = async (id: number, payload: IUpdateKelompokKurbanPayload) => {
        return await KelompokKurbanService.update(id, payload);
    };

    const deleteKelompokKurban = async (id: number) => {
        return await KelompokKurbanService.delete(id);
    };

    const deletePermanentKelompokKurban = async (id: number) => {
        return await KelompokKurbanService.deletePermanent(id);
    };

    return {
        fetchKelompokKurbanList,
        fetchKelompokKurbanDetail,
        fetchDraftKelompokKurban,
        createKelompokKurban,
        updateKelompokKurban,
        deleteKelompokKurban,
        deletePermanentKelompokKurban,
    };
};
