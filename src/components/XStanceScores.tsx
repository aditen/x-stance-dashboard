import * as React from "react";
import {Grid, Icon, LinearProgress, Typography} from "@material-ui/core";
import dynamic from "next/dist/next-server/lib/dynamic";
import {Figures} from "../models/internal/Figures";
import {Metric} from "../models/Metric";
import {PredictionUtils} from "../utils/PredictionUtils";
import {Prediction} from "../models/results/Prediction";
// @ts-ignore
const ReactCountryFlag: any = dynamic(() => import('react-country-flag'), {ssr: false});

type Props = {
    scores: Figures,
    metric: Metric,
    allPredictions: Prediction[],
    onSelectLang: (lang: 'all' | 'de' | 'fr' | 'it') => void
}

export const XStanceScore: React.FC<Props> = (props: Props) => {

    const figuresPerLang = PredictionUtils.figuresByLang(props.allPredictions);

    return (<Grid justify={"center"} container={true} spacing={2}>
        <Grid item={true} md={3} xs={12}>
            <Typography variant={"h2"} align={"center"}> <ReactCountryFlag style={{cursor: "pointer"}}
                                                                           onClick={() => props.onSelectLang("all")}
                                                                           countryCode={"CH"}
                                                                           svg
                                                                           cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                                                           cdnSuffix="svg"
                                                                           title="CH"
            />
            </Typography>
            <Typography variant={"h6"}
                        align={"center"}>{props.metric === "accuracy" ? "Accuracy" : "F1 Score"}: {PredictionUtils.getCurrentScore(props.scores as any, props.metric)}</Typography>
            <Typography component={"p"} variant={"caption"}
                        align={"center"}><Icon title={"New Topics"}
                                               fontSize={"inherit"}>tour</Icon> {PredictionUtils.getCurrentScore(PredictionUtils.getFigures(props.allPredictions.filter(value => value.testSet === "new_topics_defr" || value.testSet === "new_topics_it")), props.metric)}
                <Icon title={"New Questions"} style={{marginLeft: 5}}
                      fontSize={"inherit"}>search</Icon>{PredictionUtils.getCurrentScore(PredictionUtils.getFigures(props.allPredictions.filter(value => value.testSet === "new_questions_defr" || value.testSet === "new_questions_it")), props.metric)}
                <Icon title={"New Comments"} style={{marginLeft: 5}}
                      fontSize={"inherit"}>question_answer</Icon> {PredictionUtils.getCurrentScore(PredictionUtils.getFigures(props.allPredictions.filter(value => value.testSet === "new_comments_defr" || value.testSet === "new_comments_it")), props.metric)}
                <Icon title={"Supervised"} style={{marginLeft: 5}}
                      fontSize={"inherit"}>supervisor_account</Icon> {PredictionUtils.getHarmonicMean(PredictionUtils.getFigures(props.allPredictions.filter(value => value.testSet === "new_comments_defr" && value.language === "de")), PredictionUtils.getFigures(props.allPredictions.filter(value => value.testSet === "new_comments_defr" && value.language === "fr")), props.metric)}
            </Typography>
            <LinearProgress title={props.metric === "accuracy" ? "Accuracy" : "F1 Score"}
                            style={{height: 20, marginBottom: 20}} variant={"determinate"}
                            value={(props.metric === "accuracy" ? props.scores.precision : props.scores.f1Score) * 100}/>
        </Grid>
        {Reflect.ownKeys(figuresPerLang).map((value, index) => {
            return <Grid key={"fig-" + index} item={true} md={3} xs={12}>
                <Typography variant={"h2"} align={"center"}> <ReactCountryFlag style={{cursor: "pointer"}}
                                                                               onClick={() => props.onSelectLang(value.toString() as any)}
                                                                               countryCode={value.toString().toUpperCase()}
                                                                               svg
                                                                               cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                                                                               cdnSuffix="svg"
                                                                               title={value}
                />
                </Typography>
                <Typography variant={"h6"}
                            align={"center"}>{props.metric === "accuracy" ? "Accuracy" : "F1 Score"}: {PredictionUtils.getCurrentScore(figuresPerLang[value], props.metric)}</Typography>
                <Typography component={"p"} variant={"caption"}
                            align={"center"}><Icon title={"New Topics"}
                                                   fontSize={"inherit"}>tour</Icon> {PredictionUtils.getCurrentScore(PredictionUtils.getFigures(props.allPredictions.filter(pred => pred.language === value as any && (pred.testSet === "new_topics_defr" || pred.testSet === "new_topics_it"))), props.metric)}
                    <Icon title={"New Questions"} style={{marginLeft: 5}}
                          fontSize={"inherit"}>search</Icon>{PredictionUtils.getCurrentScore(PredictionUtils.getFigures(props.allPredictions.filter(pred => pred.language === value as any && (pred.testSet === "new_questions_defr" || pred.testSet === "new_questions_it"))), props.metric)}
                    <Icon title={"New Comments"} style={{marginLeft: 5}}
                          fontSize={"inherit"}>question_answer</Icon> {PredictionUtils.getCurrentScore(PredictionUtils.getFigures(props.allPredictions.filter(pred => pred.language === value as any && (pred.testSet === "new_comments_defr" || pred.testSet === "new_comments_it"))), props.metric)}
                </Typography>
                <LinearProgress title={props.metric === "accuracy" ? "Accuracy" : "F1 Score"}
                                style={{height: 20, marginBottom: 20}} variant={"determinate"}
                                value={(props.metric === "accuracy" ? figuresPerLang[value].precision : figuresPerLang[value].f1Score) * 100}/>
            </Grid>;
        })}

    </Grid>)
};
