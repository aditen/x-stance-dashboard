import getConfig from "next/config";
import axios from 'axios';
import {ModelSummary} from "../models/ModelSummary";

const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();

export default class BackendClient {

    public static fetchBachiContent = (model_id: string) => {
        const url = "/files/results_from_script_" + model_id + ".json";
        return axios.get<ModelSummary>(url);
    }
}
