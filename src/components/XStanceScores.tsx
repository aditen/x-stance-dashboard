import * as React from "react";
import {Grid, LinearProgress, Typography} from "@material-ui/core";
import dynamic from "next/dist/next-server/lib/dynamic";
import {Summary} from "../models/Summary";
import {Figures} from "../models/Figures";
import {Metric} from "../models/Metric";
// @ts-ignore
const ReactCountryFlag: any = dynamic(() => import('react-country-flag'), {ssr: false});

type Props = {
    scores: Figures,
    getCurrentScore: (s: Summary) => string,
    metric: Metric,
    figuresPerLang: any,
    onSelectLang: (lang: 'all' | 'de' | 'fr' | 'it') => void
}

export const XStanceScore: React.FC<Props> = (props: Props) => {
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
                        align={"center"}>{props.metric === "accuracy" ? "Accuracy" : "F1 Score"}: {props.getCurrentScore(props.scores as any)}</Typography>
            <LinearProgress title={props.metric === "accuracy" ? "Accuracy" : "F1 Score"}
                            style={{height: 20, marginBottom: 20}} variant={"determinate"}
                            value={(props.metric === "accuracy" ? props.scores.precision : props.scores.f1Score) * 100}/>
        </Grid>
        {Reflect.ownKeys(props.figuresPerLang).map((value, index) => {
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
                            align={"center"}>{props.metric === "accuracy" ? "Accuracy" : "F1 Score"}: {props.getCurrentScore(props.figuresPerLang[value])}</Typography>
                <LinearProgress title={props.metric === "accuracy" ? "Accuracy" : "F1 Score"}
                                style={{height: 20, marginBottom: 20}} variant={"determinate"}
                                value={(props.metric === "accuracy" ? props.figuresPerLang[value].precision : props.figuresPerLang[value].f1Score) * 100}/>
            </Grid>;
        })}

    </Grid>)
};
