import { ContentService } from '~/application/services/ContentService';
import type { ICreateContentPayload, IUpdateContentPayload } from '~/domain/models/IContent';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useContent = () => {
    const fetchContents = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'contents-list',
            () => ContentService.getAllContents(params.value),
            { watch: [params] }
        );
    };

    const fetchContentDetail = (id: number) => {
        return useAsyncData(
            `content-detail-${id}`,
            () => ContentService.getContentById(id)
        );
    };

    const createContent = async (payload: ICreateContentPayload) => {
        return await ContentService.createContent(payload);
    };

    const updateContent = async (id: number, payload: IUpdateContentPayload) => {
        return await ContentService.updateContent(id, payload);
    };

    const deleteContent = async (id: number) => {
        return await ContentService.deleteContent(id);
    };

    const fetchDraftContents = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'contents-draft-list',
            () => ContentService.getDraftContents(params.value),
            { watch: [params] }
        );
    };

    const deletePermanentContent = async (id: number) => {
        return await ContentService.deleteContentPermanently(id);
    };

    return {
        fetchContents,
        fetchContentDetail,
        createContent,
        updateContent,
        deleteContent,
        fetchDraftContents,
        deletePermanentContent
    };
};