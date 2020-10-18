import * as React from "react";
import {useEffect, useState} from "react";
import {
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Icon,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import {PredictionUtils} from "../utils/PredictionUtils";
import {Summary} from "../models/Summary";
import {Prediction} from "../models/Prediction";
import {ModelType} from "../models/ModelType";
import IconButton from "@material-ui/core/IconButton";
import BackendClient from "../http/BackendClient";
import {Evaluation} from "../models/Evaluation";

type Props = {
    modelType: ModelType,
    openQuestion: Summary,
    allPredictions: Prediction[]
}

type ResultState = "loading" | "favor" | "against" | "error" | "initialized";

export const XStanceQuestion: React.FC<Props> = (props: Props) => {
    const [customQuestion, setCustomQuestion] = useState<Prediction | undefined>(undefined);
    const [responseStatus, setResponseStatus] = useState<ResultState>("initialized");
    const [evaluation, setEvaluation] = useState<Evaluation | undefined>(undefined);
    const [showAttentionWeight, setShowAttentionWeight] = useState<boolean>(false);

    const fetchPrediction = async () => {
        if (!!customQuestion && !!customQuestion.comment) {
            try {
                setResponseStatus("loading");
                setEvaluation(undefined);
                const res = await BackendClient.fetchPrediction(props.modelType, customQuestion);
                if (res.data.result === "AGAINST") {
                    setResponseStatus("against");
                } else {
                    setResponseStatus("favor");
                }
                setEvaluation(res.data);
            } catch (e) {
                setResponseStatus("error");
                setEvaluation(undefined);
            }
        }
    };

    const getResultVis = (type: ResultState) => {
        let child = undefined;
        if (type === "favor") {
            child = <Icon style={{color: "green"}}>thumb_up</Icon>;
        } else if (type === "against") {
            child = <Icon style={{color: "red"}}>thumb_down</Icon>;
        } else if (type === "loading") {
            child = <CircularProgress/>;
        } else if (type == "error") {
            child = <span><Icon fontSize={"inherit"} color={"error"}>clear</Icon> Evaluation server offline <Icon
                fontSize={"inherit"} color={"error"}>clear</Icon></span>
        }
        return <Typography align={"center"} component={"div"}
                           style={{marginTop: 20}}>{child}</Typography>;
    };

    const getAttentionMatrix = (evaluation: Evaluation | undefined) => {
        if (!evaluation || !evaluation.attnWeights || !evaluation.attnWeights.length) {
            return undefined;
        } else {
            const firstLayerWeights: number[][] = evaluation.attnWeights[1];
            const scalingFactor = evaluation.attnWeights[0].length / 20;
            return <Box>
                {firstLayerWeights.slice(0, 50).map((val, i) => <Box height={10}
                                                                     key={"attn-row-" + i}>{val.slice(0, 50).map((weight, j) =>
                    <Tooltip title={evaluation.tokens[j] + " -> " + evaluation.tokens[i]}
                             key={"tip-" + i + "-" + j}><Box style={{
                        backgroundColor: "blue",
                        opacity: weight * scalingFactor,
                        width: 10,
                        height: 10,
                        display: "inline-block"
                    }}/></Tooltip>)}</Box>)}
            </Box>;
        }
    };

    useEffect(() => {
        if (responseStatus !== "error" && (props.modelType === "bow_own_tiny" || props.modelType === "bertrand_small")) {
            fetchPrediction().catch(console.error);
        }
    }, [customQuestion]);
    return (<>
        {customQuestion &&
        <Dialog maxWidth={"sm"} open={!!customQuestion}
                onClose={() => setCustomQuestion(undefined)}>
            <DialogTitle>{customQuestion.question}</DialogTitle>
            <DialogContent>
                <form noValidate autoComplete="off">
                    <TextField
                        fullWidth={true}
                        multiline
                        label={"Comment"}
                        value={customQuestion.comment}
                        onChange={(e) => setCustomQuestion({...customQuestion, comment: e.target.value})}
                    />
                </form>
                {getResultVis(responseStatus)}
                <IconButton onClick={() => setShowAttentionWeight(true)}><Icon>dashboard</Icon></IconButton>
                <div>{!!evaluation && evaluation.tokens.map((token, i) => <Chip
                    style={{margin: 2}} label={token}
                    key={"chip-" + i}/>)}</div>
            </DialogContent>
        </Dialog>}
        {showAttentionWeight &&
        <Dialog maxWidth={"md"} fullWidth={true} open={showAttentionWeight}
                onClose={() => setShowAttentionWeight(false)}>
            <DialogTitle>Attention Weights</DialogTitle>
            <DialogContent>
                {getAttentionMatrix(evaluation)}
            </DialogContent>
        </Dialog>}
        <DialogTitle>{props.openQuestion.question}</DialogTitle>
        <DialogContent>
            <DialogContentText>{props.openQuestion.topic} ({props.openQuestion.language})</DialogContentText>
            <TableContainer component={"table"}>
                <TableHead>
                    <TableRow>
                        <TableCell>Answer</TableCell>
                        <TableCell align="right">Prediction by model</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {PredictionUtils.getAllOfQuestion(props.allPredictions, props.openQuestion.language, props.openQuestion.questionId).map((row, i) => (
                        <TableRow key={"row-ans-" + i}>
                            <TableCell component="th" scope="row">
                                {row.comment}
                            </TableCell>
                            {(props.modelType !== "bow_own_tiny" && props.modelType !== "bertrand_small") &&
                            <TableCell
                                align="right"><Icon
                                color={row.label !== row.predicted ? "error" : "inherit"}>{row.predicted === "FAVOR" ? "thumb_up" : "thumb_down"}</Icon>
                            </TableCell>}
                            {(props.modelType === "bow_own_tiny" || props.modelType === "bertrand_small") &&
                            <TableCell
                                align="right"><IconButton onClick={() => setCustomQuestion(row)}><Icon
                                color={row.label !== row.predicted ? "error" : "inherit"}>{row.predicted === "FAVOR" ? "thumb_up" : "thumb_down"}</Icon></IconButton>
                            </TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </TableContainer>
        </DialogContent>
    </>);
};
