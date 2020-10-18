import * as React from "react";
import {
    Hidden,
    Icon,
    IconButton,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from "@material-ui/core";
import {TableDataProps} from "../models/TableDataProps";
import {Summary} from "../models/Summary";
import {Metric} from "../models/Metric";
import {PredictionUtils} from "../utils/PredictionUtils";

type Props = {
    metric: Metric,
    filters: TableDataProps,
    changeFilter: (props: TableDataProps, allSummaries?: Summary[]) => void,
    filteredEntries: Summary[],
    entriesToDisplay: Summary[],
    setEntriesToDisplay: (entries: Summary[]) => void,
    page: number,
    setPage: (newPage: number) => void
    setOpenQuestion: (row: Summary) => void
}
export const XSTanceResultTable: React.FC<Props> = (props: Props) => {

    return (<TableContainer component={"table"}>
        <TableHead>
            <TableRow>
                <TableCell align={"center"}>Details</TableCell>
                <Hidden smDown={true} implementation={"js"}>
                    <TableCell align={"center"}>Language</TableCell>
                    <TableCell align={"center"}>Topic</TableCell>
                </Hidden>
                <TableCell align={"center"}>Question</TableCell>
                <TableCell align={"center"} onClick={() => props.changeFilter({
                    ...props.filters,
                    order: props.filters.order === "asc" ? "desc" : "asc"
                })} style={{whiteSpace: "nowrap", cursor: "pointer"}}>
                    <div>{props.metric === "accuracy" ? "Accuracy" : "F1 Score"}<Icon
                        fontSize={"inherit"}>{props.filters.order === "asc" ? "arrow_drop_up" : "arrow_drop_down"}</Icon>
                    </div>
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.entriesToDisplay.map((row, i) => (
                <TableRow key={"row-" + i}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small"
                                    onClick={() => props.setOpenQuestion(row)}>
                            <Icon>info</Icon>
                        </IconButton>
                    </TableCell>
                    <Hidden smDown={true} implementation={"js"}>
                        <TableCell component="th" scope="row">
                            {row.language}
                        </TableCell>
                        <TableCell align="right">{row.topic}</TableCell>
                    </Hidden>
                    <TableCell align="right">{row.question}</TableCell>
                    <TableCell
                        align="right">{PredictionUtils.getCurrentScore(row, props.metric)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
        <TableFooter>
            <TableRow>
                <TablePagination
                    rowsPerPageOptions={[20]}
                    colSpan={3}
                    count={props.filteredEntries.length}
                    rowsPerPage={20}
                    page={props.page}
                    SelectProps={{
                        inputProps: {'aria-label': 'rows per page'},
                        native: false
                    }}
                    onChangePage={(e, newPage) => {
                        props.setEntriesToDisplay(props.filteredEntries.slice(newPage * 20, (newPage + 1) * 20));
                        props.setPage(newPage);
                        window.scrollTo(0, 0);
                    }}
                    onChangeRowsPerPage={() => {
                    }}
                />
            </TableRow>
        </TableFooter>
    </TableContainer>)
};
