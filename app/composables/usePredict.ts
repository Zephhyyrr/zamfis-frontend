import { PredictService } from '~/application/services/PredictService';

export const usePredict = () => {

    const getIncomePrediction = async () => {
        return await PredictService.getIncomePrediction();
    };

    const getExpensePrediction = async () => {
        return await PredictService.getExpensePrediction();
    };

    const savePrediction = async (payload: any) => {
        return await PredictService.savePrediction(payload);
    };

    const allocatePrediction = async (payload: any) => {
        return await PredictService.allocatePrediction(payload);
    };

    const saveAllocations = async (payload: any) => {
        return await PredictService.saveAllocations(payload);
    };

    const getPredictionHistory = async () => {
        return await PredictService.getPredictionHistory();
    };

    const getPredictionById = async (id: number) => {
        return await PredictService.getPredictionById(id);
    };

    const deletePrediction = async (id: number) => {
        return await PredictService.deletePrediction(id);
    };

    return {
        getIncomePrediction,
        getExpensePrediction,
        savePrediction,
        allocatePrediction,
        saveAllocations,
        getPredictionHistory,
        getPredictionById,
        deletePrediction
    };
};
