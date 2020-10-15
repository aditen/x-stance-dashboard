import * as React from "react";
import {useEffect, useState} from "react";
import {
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
    Typography
} from "@material-ui/core";
import {PredictionUtils} from "../utils/PredictionUtils";
import {Summary} from "../models/Summary";
import {Prediction} from "../models/Prediction";
import {ModelType} from "../models/ModelType";
import IconButton from "@material-ui/core/IconButton";
import BackendClient from "../http/BackendClient";

type Props = {
    modelType: ModelType,
    openQuestion: Summary,
    allPredictions: Prediction[]
}

type ResultState = "loading" | "favor" | "against" | "error" | "initialized";

export const XStanceQuestion: React.FC<Props> = (props: Props) => {
    const [customQuestion, setCustomQuestion] = useState<Prediction | undefined>(undefined);
    const [responseStatus, setResponseStatus] = useState<ResultState>("initialized");

    const fetchPrediction = async () => {
        if (!!customQuestion) {
            try {
                setResponseStatus("loading");
                const res = await BackendClient.fetchPrediction(props.modelType, customQuestion);
                if (res.data.result === "AGAINST") {
                    setResponseStatus("against");
                } else {
                    setResponseStatus("favor");
                }
            } catch (e) {
                setResponseStatus("error");
            }
        }
    };

    const getResultVis = (type: ResultState) => {
        if (type === "favor") {
            return <Icon style={{color: "green"}}>thumb_up</Icon>;
        } else if (type === "against") {
            return <Icon style={{color: "red"}}>thumb_down</Icon>;
        } else if (type === "loading") {
            return <CircularProgress/>;
        }
    };

    useEffect(() => {
        if (props.modelType === "bow_own_tiny" || props.modelType === "bertrand_small") {
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
                <Typography align={"center"} component={"div"}
                            style={{marginTop: 20}}>{getResultVis(responseStatus)}</Typography>
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
