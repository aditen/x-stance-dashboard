import {Prediction} from "./Prediction";

export interface ModelSummary {
    modelId: string,
    trainingTime: number,
    predictions: Prediction[],
    trainingLossHistory: number[],
    trainingAccuracyHistory: number[],
    validationLossHistory: number[],
    validationAccuracyHistory: number[]
}
