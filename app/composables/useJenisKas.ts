import { JenisKasService } from '~/application/services/JenisKasService';
import type { 
    ICreateJenisKasPayload, 
    IUpdateJenisKasPayload 
} from '~/domain/models/IJenisKas';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useJenisKas = () => {
    const fetchJenisKasList = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'jenis-kas-list',
            () => JenisKasService.getAll(params.value),
            { watch: [params] }
        );
    };

    const fetchJenisKasDetail = (id: number) => {
        return useAsyncData(
            'jenis-kas-detail-' + id,
            () => JenisKasService.getById(id)
        );
    };

    const fetchDraftKas = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'jenis-kas-draft',
            () => JenisKasService.getDraft(params.value),
            { watch: [params] }
        );
    };

    const createKas = async (payload: ICreateJenisKasPayload | FormData) => {
        return await JenisKasService.create(payload);
    };

    const updateKas = async (id: number, payload: IUpdateJenisKasPayload | FormData) => {
        return await JenisKasService.update(id, payload);
    };

    const deleteKas = async (id: number) => {
        return await JenisKasService.delete(id);
    };

    const deletePermanentKas = async (id: number) => {
        return await JenisKasService.deletePermanent(id);
    };

    return {
        fetchJenisKasList,
        fetchJenisKasDetail,
        fetchDraftKas,
        createKas,
        updateKas,
        deleteKas,
        deletePermanentKas
    };
};

