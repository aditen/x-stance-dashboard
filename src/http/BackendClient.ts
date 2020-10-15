import getConfig from "next/config";
import axios from 'axios';
import {ModelSummary} from "../models/ModelSummary";
import {ModelType} from "../models/ModelType";
import {Evaluation} from "../models/Evaluation";
import {Prediction} from "../models/Prediction";

// TODO: add URL to config for prediction URL. Could also fetch results from there
const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();

export default class BackendClient {

    public static fetchBachiContent = (modelType: ModelType) => {
        const url = "/files/results_from_script_" + modelType + ".json";
        return axios.get<ModelSummary>(url);
    };

    public static fetchPrediction = (modelType: ModelType, pred: Prediction) => {
        const suffix: string = modelType === "bow_own_tiny" ? "predict_bow" : "predict_attention";
        return axios.post<Evaluation>("http://localhost:5000/" + suffix, pred)
    }
}
