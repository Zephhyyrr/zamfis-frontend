import { TransaksiService } from '~/application/services/TransaksiService';
import type { ICreateTransaksiPayload, IUpdateTransaksiPayload } from '~/domain/models/ITransaksi';
import type { IPaginationQuery } from '~/domain/types/IPaginationQuery';

export const useTransaksi = () => {
    const fetchTransactions = (params: Ref<IPaginationQuery>, customKey?: string) => {
        const key = customKey || 'transactions-list';
        return useAsyncData(
            key,
            () => TransaksiService.getAll(params.value),
            { watch: [params], lazy: true }
        );
    };

    const fetchAllTransactionsForDashboard = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'dashboard-all-transactions',
            () => TransaksiService.getAll(params.value),
            { watch: [params], lazy: true }
        );
    };

    const fetchTransactionDetail = (id: number) => {
        return useAsyncData(
            `transaction-detail-${id}`,
            () => TransaksiService.getById(id)
        );
    };

    const createTransaction = async (payload: ICreateTransaksiPayload) => {
        return await TransaksiService.create(payload);
    };

    const updateTransaction = async (id: number, payload: IUpdateTransaksiPayload) => {
        return await TransaksiService.update(id, payload);
    };

    const deleteTransaction = async (id: number) => {
        return await TransaksiService.delete(id);
    };

    const fetchDraftTransactions = (params: Ref<IPaginationQuery>) => {
        return useAsyncData(
            'transactions-draft-list',
            () => TransaksiService.getDraft(params.value),
            { watch: [params], lazy: true }
        );
    }

        const fetchDashboardSummary = (year: Ref<number | 'all'>, customKey?: string) => {
        const key = customKey || 'dashboard-summary';
        return useAsyncData(
            key,
            () => TransaksiService.getDashboard(year.value),
            { watch: [year], lazy: true }
        );
    };

    return {
        fetchTransactions,
        fetchAllTransactionsForDashboard,
        fetchTransactionDetail,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        fetchDraftTransactions,
        fetchDashboardSummary
    };
};