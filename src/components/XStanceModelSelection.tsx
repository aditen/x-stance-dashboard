import * as React from "react";
import {FormControl, FormLabel, MenuItem, Select} from "@material-ui/core";
import {ModelType} from "../models/ModelType";

type Props = {
    current: string,
    change: (s: ModelType) => void
}
export const XStanceModelSelection: React.FC<Props> = (props: Props) => {
    return (<FormControl fullWidth={true} variant={"standard"}>
            <FormLabel component="legend">Choose the model to display:</FormLabel>
            <Select
                value={props.current}
                onChange={(e) => {
                    props.change(e.target.value as any)
                }}
            >
                <MenuItem value={"bow_own_tiny"}>BoW own (XS)</MenuItem>
                <MenuItem value={"bow_own_small"}>BoW own (S)</MenuItem>
                <MenuItem value={"bow_own_medium"}>BoW own (M)</MenuItem>
                <MenuItem value={"bow_own_large"}>BoW own (L)</MenuItem>
                <MenuItem value={"bow_own_huge"}>BoW own (XL)</MenuItem>
                <MenuItem value={"bow_bigrams"}>BoW own Bigrams</MenuItem>
                <MenuItem value={"bow_trigrams"}>BoW own Trigrams</MenuItem>
                <MenuItem value={"bow_fourgrams"}>BoW own Four-Grams</MenuItem>
                <MenuItem value={"bow_fivegrams"}>BoW own Five-Grams</MenuItem>
                <MenuItem value={"bow_bpemb_s"}>BPEmb (S) + SVM</MenuItem>
                <MenuItem value={"bow_bpemb_m"}>BPEmb (M) + SVM</MenuItem>
                <MenuItem value={"bow_fasttext"}>Fasttext aligned + SVM</MenuItem>
                <MenuItem value={"custom_transformer_small"}>Self-Attention (S)</MenuItem>
                <MenuItem value={"custom_transformer_medium"}>Self-Attention (M)</MenuItem>
                <MenuItem value={"custom_transformer_large"}>Self-Attention (L)</MenuItem>
                <MenuItem value={"mask_baseline_small"}>Mask Baseline (S)</MenuItem>
                <MenuItem value={"mask_baseline_large"}>Mask Baseline (L)</MenuItem>
                <MenuItem value={"bertolt_small"}>BERTolt (S)</MenuItem>
                <MenuItem value={"bertolt_large"}>BERTolt (L)</MenuItem>
                <MenuItem value={"bertrand_small"}>BERTrand (S)</MenuItem>
                <MenuItem value={"bertrand_large"}>BERTrand (L)</MenuItem>
                <MenuItem value={"fasttext_library"}>Baseline: Fasttext library</MenuItem>
                <MenuItem value={"mbert"}>Baseline: M-BERT</MenuItem>
            </Select>
        </FormControl>
    );
};
