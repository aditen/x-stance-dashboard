import * as React from "react";
import {useEffect, useState} from "react";
import BackendClient from "../src/http/BackendClient";
import {
    AppBar,
    Box,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Icon,
    IconButton,
    Radio,
    RadioGroup,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Line} from "react-chartjs-2";
import {PredictionUtils} from "../src/utils/PredictionUtils";
import {Figures} from "../src/models/internal/Figures";
import {Summary} from "../src/models/internal/Summary";
import {Prediction} from "../src/models/results/Prediction";
import Head from "next/head";
import ReactWordCloud from "react-wordcloud";
import {TableDataProps} from "../src/models/internal/TableDataProps";
import {XSTanceResultTable} from "../src/components/XStanceResultTable";
import {XStanceScore} from "../src/components/XStanceScores";
import {XStanceQuestion} from "../src/components/XStanceQuestion";
import {XStanceFilters} from "../src/components/XStanceFilters";
import {XStanceModelSelection} from "../src/components/XStanceModelSelection";
import {ModelType} from "../src/models/ModelType";
import {Metric} from "../src/models/Metric";
import CountUp from "react-countup";
import {ModelSummary} from "../src/models/results/ModelSummary";
import {XStanceConfusionMatrix} from "../src/components/XStanceConfusionMatrix";

type ProgressType = 'loading' | 'computing_figures' | 'building_indices' | 'finished' | 'error';

const nGramMap = new Map<ModelType, number>();
nGramMap.set("bow_bigrams", 2);
nGramMap.set("bow_trigrams", 3);
nGramMap.set("bow_fourgrams", 4);
nGramMap.set("bow_fivegrams", 5);
nGramMap.set("bow_own_tiny", 1);
nGramMap.set("bow_own_small", 1);
nGramMap.set("bow_own_medium", 1);
nGramMap.set("bow_own_large", 1);
nGramMap.set("bow_own_huge", 1);
nGramMap.set("bow_bpemb_s", 1);
nGramMap.set("bow_bpemb_m", 1);
nGramMap.set("bow_fasttext", 1);


const StancePage: React.FC = () => {

    const [modelType, setModelType] = useState<ModelType>("bow_own_tiny");
    const [progress, setProgress] = useState<ProgressType>('loading');
    const [scores, setScores] = useState<Figures>();
    const [allEntries, setAllEntries] = useState<Summary[]>([]);
    const [allPredictions, setAllPredictions] = useState<Prediction[]>([]);
    const [filteredEntries, setFilteredEntries] = useState<Summary[]>([]);
    const [filteredPredictions, setFilteredPredictions] = useState<Prediction[]>([]);
    const [entriesToDisplay, setEntriesToDisplay] = useState<Summary[]>([]);
    const [openQuestion, setOpenQuestion] = useState<Summary | undefined>();
    const [page, setPage] = useState<number>(0);
    const [filters, setFilters] = useState<TableDataProps>({
        order: "desc",
        lang: 'all',
        topic: "--none--",
        metric: "f1"
    });
    const [availableTopics, setAvailableTopics] = useState<string[]>([]);
    const [showLearningCurve, setShowLearningCurve] = useState<boolean>(false);
    const [showWordCloud, setShowWordCloud] = useState<boolean>(false);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showConfusionMatrix, setShowConfusionMatrix] = useState<boolean>(false);
    const [wordCloudAttributes, setWordCloudAttributes] = useState<any>(undefined);
    const [modelSummary, setModelSummary] = useState<ModelSummary>({
        modelId: "test",
        predictions: [],
        trainingTime: -1,
        trainingAccuracyHistory: [],
        trainingLossHistory: [],
        validationAccuracyHistory: [],
        validationLossHistory: []
    });

    const fetchContent = async () => {
        try {
            setProgress("loading");
            setShowSettings(false);
            const summary = (await BackendClient.fetchBachiContent(modelType)).data;
            setProgress("computing_figures");
            setAllPredictions(summary.predictions);
            setWordCloudAttributes(PredictionUtils.getWordCloudAttributes(summary.predictions, nGramMap.has(modelType) ? nGramMap.get(modelType) : 1));
            const summaries = PredictionUtils.getSummary(summary.predictions);
            setAllEntries(summaries);
            const figures = PredictionUtils.getFigures(summary.predictions);
            setScores(figures);
            setProgress("building_indices");
            setModelSummary(summary);
            changeFilter(filters, summaries);
            setProgress("finished");
        } catch (e) {
            console.error(e);
            alert("Error! Please reload page! If you see this again, contact the admin.");
            setProgress("error");
        }
    };
    useEffect(() => {
        fetchContent().catch(console.error);
    }, [modelType]);

    const changeFilter = (newProps: TableDataProps, allSummaries?: Summary[]) => {
        const all = !!allSummaries ? allSummaries : allEntries;
        const isLangSet = newProps.lang !== "all";
        let newEntries = all;
        const topics: string[] = [];
        newEntries.forEach(value => {
            if (isLangSet && value.language !== newProps.lang) {
                return;
            }
            if (topics.indexOf(value.topic) < 0) {
                topics.push(value.topic)
            }
        });
        if (isLangSet) {
            newEntries = newEntries.filter(value => value.language === newProps.lang);
        }
        if (newProps.topic !== '--none--') {
            newEntries = newEntries.filter(value => value.topic === newProps.topic);
        }
        if (newProps.order === 'desc') {
            if (newProps.metric === "accuracy") {
                newEntries = newEntries.sort((a, b) => b.precision - a.precision);
            } else {
                newEntries = newEntries.sort((a, b) => b.f1Score - a.f1Score);
            }
        } else {
            if (newProps.metric === "accuracy") {
                newEntries = newEntries.sort((a, b) => a.precision - b.precision);
            } else {
                newEntries = newEntries.sort((a, b) => a.f1Score - b.f1Score);
            }
        }
        setAvailableTopics(topics);
        setPage(0);
        setFilteredEntries(newEntries);
        const isTopicSet = !!newProps.topic && newProps.topic !== '--none--';
        setFilteredPredictions(allPredictions.filter(value => ((!isLangSet || value.language === newProps.lang) && (!isTopicSet || value.topic === newProps.topic))));
        setEntriesToDisplay(newEntries.slice(0, 20));
        setFilters(newProps);
    };

    return (
        <>
            <Head>
                <title>X-Stance Dashboard - Adrian Iten</title>
                <meta key="description" name="description"
                      content="GUI for my bachelor thesis"/>
                <meta key="og:description" name="og:description"
                      content="GUI for my bachelor thesis"/>
                <meta key="og:title" name="og:title" content="X-Stance Dashboard - Adrian Iten"/>
            </Head>
            <AppBar position="fixed">
                <Toolbar>
                    <img src={"/uzh_logo_tp.png"} style={{height: 25, width: "auto", margin: 5}}
                         alt={"UZH logo"}/>
                    <Typography variant="body1" style={{flexGrow: 1}}>
                        X-Stance Dashboard
                    </Typography>
                    {progress === 'finished' && <>
                        <IconButton onClick={() => setShowSettings(true)}>
                            <Icon>settings</Icon>
                        </IconButton>
                        <IconButton onClick={() => setShowConfusionMatrix(true)}>
                            <Icon>dashboard</Icon>
                        </IconButton>
                        {modelType.startsWith("bow") && <IconButton onClick={() => setShowWordCloud(true)}>
                            <Icon>cloud</Icon>
                        </IconButton>}
                        {(modelType !== "fasttext_library" && modelType !== "mbert") &&
                        <IconButton onClick={() => setShowLearningCurve(true)}>
                            <Icon>show_chart</Icon>
                        </IconButton>}</>}
                </Toolbar>
            </AppBar>
            <Container style={{paddingTop: 80}}>
                {progress !== "finished" &&
                <Box width={"100%"} textAlign={"center"} margin={2}><CircularProgress/></Box>}
                {(progress === 'finished' && !!scores) &&
                <XStanceScore allPredictions={allPredictions} metric={filters.metric}
                              onSelectLang={(lang) => changeFilter({...filters, lang: lang})}
                              scores={scores}/>}
                {progress === "finished" &&
                <XStanceFilters filters={filters} changeFilter={changeFilter} availableTopics={availableTopics}/>}
                {progress === 'finished' &&
                <XSTanceResultTable metric={filters.metric} filters={filters} changeFilter={changeFilter}
                                    filteredEntries={filteredEntries} entriesToDisplay={entriesToDisplay}
                                    setEntriesToDisplay={setEntriesToDisplay} page={page} setPage={setPage}
                                    setOpenQuestion={setOpenQuestion}/>}
            </Container>
            {!!openQuestion &&
            <Dialog fullWidth={true} maxWidth={"lg"} open={!!openQuestion} onClose={() => setOpenQuestion(undefined)}>
                <XStanceQuestion modelType={modelType} allPredictions={allPredictions} openQuestion={openQuestion}/>
            </Dialog>}

            {showLearningCurve &&
            <Dialog maxWidth={"md"} fullWidth={true} open={showLearningCurve}
                    onClose={() => setShowLearningCurve(false)}>
                <DialogTitle>Learning Curve through Epochs</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Total training time: {(!!modelSummary.trainingTime && <CountUp suffix={"s"} start={0}
                                                                                       end={modelSummary.trainingTime}
                                                                                       duration={2}/>) || "n/A"}
                    </DialogContentText>
                    <div>
                        <Line data={{
                            labels: modelSummary.trainingLossHistory.map((value, index) => "" + (index + 1)),
                            datasets: [
                                {
                                    label: 'Training Loss',
                                    backgroundColor: 'rgba(0,99,132,0.2)',
                                    borderColor: 'rgba(0,99,132,1)',
                                    borderWidth: 1,
                                    data: modelSummary.trainingLossHistory
                                }, {
                                    label: 'Validation Loss',
                                    backgroundColor: 'rgba(255,99,132,0.2)',
                                    borderColor: 'rgba(255,99,132,1)',
                                    borderWidth: 1,
                                    data: modelSummary.validationLossHistory
                                }
                            ]
                        }}/>
                    </div>
                </DialogContent>
            </Dialog>}

            {showConfusionMatrix &&
            <Dialog maxWidth={"md"} open={showConfusionMatrix}
                    onClose={() => setShowConfusionMatrix(false)}>
                <DialogTitle>Confusion Matrix</DialogTitle>
                <DialogContent>
                    <XStanceConfusionMatrix entriesToDisplay={filteredPredictions}/>
                </DialogContent>
            </Dialog>}

            {showWordCloud &&
            <Dialog maxWidth={"md"} open={showWordCloud}
                    onClose={() => setShowWordCloud(false)}>
                <DialogTitle>N-Gram Cloud</DialogTitle>
                <DialogContent>
                    <ReactWordCloud {...wordCloudAttributes}/>
                </DialogContent>
            </Dialog>}

            {showSettings && <Dialog maxWidth={"sm"} fullWidth={true} open={showSettings}
                                     onClose={() => setShowSettings(false)}>
                <DialogTitle>Settings/About</DialogTitle>
                <DialogContent>
                    <Box width={"100%"} marginBottom={3}>
                        <XStanceModelSelection current={modelType}
                                               change={setModelType}/>
                    </Box>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Choose the metric to display:</FormLabel>
                        <RadioGroup value={filters.metric} onChange={(event, value) => {
                            changeFilter({...filters, metric: value as Metric})
                        }}>
                            <FormControlLabel value="f1" control={<Radio/>} label="F1 Score"/>
                            <FormControlLabel value="accuracy" control={<Radio/>} label="Accuracy"/>
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
            </Dialog>}

        </>
    )
};

export default StancePage;
