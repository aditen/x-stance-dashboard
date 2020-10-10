import * as React from "react";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {TableDataProps} from "../models/TableDataProps";
import {Summary} from "../models/Summary";

type Props = {
    filters: TableDataProps,
    changeFilter: (props: TableDataProps, allSummaries?: Summary[]) => void,
    availableTopics: string[]
}

export const XStanceFilters: React.FC<Props> = (props: Props) => {
    return (<Box style={{marginBottom: 20}}>
        <FormControl fullWidth={true} variant={"filled"}>
            <InputLabel>Language</InputLabel>
            <Select
                value={props.filters.lang}
                onChange={(e) => {
                    props.changeFilter({...props.filters, lang: e.target.value as any})
                }}
            >
                <MenuItem value={'all'}>All</MenuItem>
                <MenuItem value={"de"}>Deutsch</MenuItem>
                <MenuItem value={"fr"}>Français</MenuItem>
                <MenuItem value={"it"}>Italiano</MenuItem>
            </Select>
        </FormControl>

        <FormControl fullWidth={true} variant={"filled"} style={{marginTop: 20, marginBottom: 20}}>
            <InputLabel>Topic</InputLabel>
            <Select
                value={props.filters.topic}
                onChange={(e) => {
                    props.changeFilter({...props.filters, topic: e.target.value as any})
                }}
            >
                <MenuItem value={"--none--"}>All</MenuItem>
                {props.availableTopics.map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
            </Select>
        </FormControl>
    </Box>);
};
