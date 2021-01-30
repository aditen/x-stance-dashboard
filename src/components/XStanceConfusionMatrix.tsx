import * as React from "react";
import {Prediction} from "../models/results/Prediction";
import {Typography} from "@material-ui/core";
import CountUp from "react-countup";

type Props = {
    entriesToDisplay: Prediction[]
}
export const XStanceConfusionMatrix: React.FC<Props> = (props: Props) => {
    return (<>
        <div style={{whiteSpace: "nowrap"}}>
            <div style={{
                display: "inline-block",
                backgroundColor: "green",
                width: "125px",
                height: "125px",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "125px"
            }}><Typography component={"span"}
                           variant={"h5"}>TP: <CountUp start={0}
                                                       end={props.entriesToDisplay.filter(value => value.predicted === "FAVOR" && value.label === "FAVOR").length}
                                                       duration={2}/></Typography>
            </div>
            <div style={{
                display: "inline-block",
                backgroundColor: "red",
                width: "125px",
                height: "125px",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "125px"
            }}><Typography component={"span"}
                           variant={"h5"}>FN: <CountUp start={0}
                                                       delay={2}
                                                       end={props.entriesToDisplay.filter(value => value.predicted === "AGAINST" && value.label === "FAVOR").length}
                                                       duration={2}/></Typography>
            </div>
        </div>
        <div style={{whiteSpace: "nowrap"}}>
            <div style={{
                display: "inline-block",
                backgroundColor: "red",
                width: "125px",
                height: "125px",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "125px"
            }}><Typography component={"span"}
                           variant={"h5"}>FP: <CountUp start={0}
                                                       delay={4}
                                                       end={props.entriesToDisplay.filter(value => value.predicted === "FAVOR" && value.label === "AGAINST").length}
                                                       duration={2}/></Typography>
            </div>
            <div style={{
                display: "inline-block",
                backgroundColor: "green",
                width: "125px",
                height: "125px",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "125px"
            }}><Typography component={"span"}
                           variant={"h5"}>TN: <CountUp start={0}
                                                       delay={6}
                                                       end={props.entriesToDisplay.filter(value => value.predicted === "AGAINST" && value.label === "AGAINST").length}
                                                       duration={2}/></Typography>
            </div>
        </div>
    </>)
};
