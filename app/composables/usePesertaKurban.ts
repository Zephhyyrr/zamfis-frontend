import { PesertaKurbanService } from '~/application/services/PesertaKurbanService';
import type { ICreatePesertaKurbanPayload, IUpdatePesertaKurbanPayload } from '~/domain/models/IPesertaKurban';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const usePesertaKurban = () => {
    const fetchPesertaKurbanList = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'peserta-kurban-list',
            () => PesertaKurbanService.getAll(params.value),
            { watch: [params] }
        );
    };

    const fetchPesertaKurbanDetail = (id: number) => {
        return useAsyncData(
            `peserta-kurban-detail-${id}`,
            () => PesertaKurbanService.getById(id)
        );
    };

    const createPesertaKurban = async (payload: ICreatePesertaKurbanPayload) => {
        return await PesertaKurbanService.create(payload);
    };

    const updatePesertaKurban = async (id: number, payload: IUpdatePesertaKurbanPayload) => {
        return await PesertaKurbanService.update(id, payload);
    };

    const deletePesertaKurban = async (id: number) => {
        return await PesertaKurbanService.delete(id);
    };

    
    return {
        fetchPesertaKurbanList,
        fetchPesertaKurbanDetail,
        createPesertaKurban,
        updatePesertaKurban,
        deletePesertaKurban,
    };
};
