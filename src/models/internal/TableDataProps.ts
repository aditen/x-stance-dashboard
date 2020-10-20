import {Metric} from "../Metric";

export interface TableDataProps {
    lang: 'all' | 'de' | 'fr' | 'it';
    topic?: string
    order: 'asc' | 'desc';
    metric: Metric
}
