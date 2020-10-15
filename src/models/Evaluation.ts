export interface Evaluation {
    tokens: string[],
    result: "AGAINST" | "FAVOR",
    modelEvaluationDuration: number,
    attnWeights?: number[][][]
}
