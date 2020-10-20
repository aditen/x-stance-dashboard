import {Figures} from "../models/internal/Figures";
import {Prediction} from "../models/results/Prediction";
import {Summary} from "../models/internal/Summary";
import {MinMaxPair} from "react-wordcloud";
import {Metric} from "../models/Metric";

// const sw = require('stopword');

export class PredictionUtils {
    static getFigures = (preds: Prediction[]) => {
        let ff = 0;
        let aa = 0;
        let fa = 0;
        let af = 0;
        preds.forEach(x => {
            if (x.label === 'FAVOR' && x.predicted === 'FAVOR') {
                ff += 1;
            } else if (x.label === 'FAVOR' && x.predicted === 'AGAINST') {
                fa += 1;
            } else if (x.label === 'AGAINST' && x.predicted === 'FAVOR') {
                af += 1;
            } else {
                aa += 1;
            }
        });
        const prcOverall = preds.filter(x => x.predicted === x.label).length / preds.length;
        const prc1 = ff / (ff + fa + 10e-32);
        const rc1 = ff / (ff + af + 10e-32);
        const f11 = 2 * prc1 * rc1 / (prc1 + rc1 + 10e-32);

        const prc2 = aa / (aa + af + 10e-32);
        const rc2 = aa / (aa + fa + 10e-32);
        const f12 = 2 * prc2 * rc2 / (prc2 + rc2 + 10e-32);

        if ((aa + fa) === 0) {
            return {
                precision: prcOverall,
                f1Score: (f11)
            } as Figures;
        } else if ((fa + ff) === 0) {
            return {
                precision: prcOverall,
                f1Score: (f12)
            } as Figures;
        } else {
            return {
                precision: prcOverall,
                f1Score: (f11 + f12) / 2
            } as Figures;
        }
    };

    static figuresByLang = (preds: Prediction[]) => {
        const languageGroups = PredictionUtils.groupBy(preds, "language");
        Reflect.ownKeys(languageGroups).forEach(value => languageGroups[value] = PredictionUtils.getFigures(languageGroups[value]));
        return languageGroups;
    };

    static getSummary = (preds: Prediction[]) => {
        const rightPerQuestion: any = {};
        const totalPerQuestion: any = {};
        const summaries: Summary[] = [];
        const questionsUsed: string[] = [];

        preds.forEach(value => {
            const key = value.language + "-" + value.question_id;
            totalPerQuestion[key] = (totalPerQuestion[key] || 0) + 1;
            rightPerQuestion[key] = (rightPerQuestion[key] || 0) + (value.label === value.predicted ? 1 : 0);
        });
        preds.forEach(p => {
            const pk = p.language + "-" + p.question_id;
            // let tokens = p.tokens;
            /*
            switch (p.language) {
                case "de":
                    tokens = sw.removeStopwords(p.tokens, sw.de);
                    break;
                case "it":
                    tokens = sw.removeStopwords(p.tokens, sw.it);
                    break;
                case "fr":
                    tokens = sw.removeStopwords(p.tokens, sw.fr);
                    break;
                default:
                    tokens = sw.removeStopwords(p.tokens);
                    break;
            }*/
            if (questionsUsed.indexOf(pk) < 0) {
                questionsUsed.push(pk);
                const figures = PredictionUtils.getFigures(preds.filter(value => value.language === p.language && value.question_id === p.question_id));
                summaries.push({
                    language: p.language,
                    question: p.question,
                    topic: p.topic,
                    precision: rightPerQuestion[pk] / totalPerQuestion[pk],
                    questionId: p.question_id,
                    f1Score: figures.f1Score
                })
            }
        });

        return summaries;
    };

    static groupBy = function (xs: any[], key: any) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    static getAllOfQuestion = (all: Prediction[], lang: string, questionId: number) => {
        return all.filter(value => value.language === lang && value.question_id === questionId);
    };

    static getWordCloudAttributes = (all: Prediction[], n_gram_size: number = 1) => {
        const options = {
            fontSizes: [15, 30] as MinMaxPair,
            fontFamily: "Raleway",
            rotations: 2,
            rotationAngles: [-90, 0] as MinMaxPair
        };
        const results: any = {};
        all.forEach(pred => {
            for (let i = 1; i < (n_gram_size + 1); i++) {
                for (let j = 0; j < (pred.tokens.length + 1 - i); j++) {
                    const key = pred.tokens.slice(j, j + i).reduce((a, b) => a + " " + b);
                    if (!results[key]) {
                        results[key] = {correct: 0, wrong: 0}
                    }
                    if (pred.label === pred.predicted) {
                        results[key].correct += 1;
                    } else {
                        results[key].wrong += 1;
                    }
                }
            }

        });
        const most_frequent = Reflect.ownKeys(results).sort((a, b) =>
            (results[b].correct + results[b].wrong) -
            (results[a].correct + results[a].wrong)).slice(0, 100).sort((a, b) => (
            results[b].correct / (results[b].correct + results[b].wrong)) -
            (results[a].correct / (results[a].correct + results[a].wrong)));

        const result = most_frequent.map(
            value => {
                return {
                    text: value as string,
                    value: results[value].correct + results[value].wrong as number,
                    quote: results[value].correct / (results[value].correct + results[value].wrong)
                };
            }
        );

        const len = result.length;
        const callbacks = {
            getWordColor: (word: any) => word.quote > result[Math.floor(len / 3)].quote ? "green" : word.quote < result[2 * Math.floor(len / 3)].quote ? "red" : "orange",
            onWordClick: console.log,
            getWordTooltip: (word: any) => `${word.text} (${word.value}) [${(word.quote * 100).toFixed(2) + "%"}]`
        };
        return {"callbacks": callbacks, "options": options, "words": result};
    };

    static getCurrentScore = (s: Figures, metric: Metric): string => {
        if (metric === "accuracy") {
            return (s.precision * 100).toFixed(2) + "%";
        } else {
            return (s.f1Score * 100).toFixed(2) + "%";
        }
    };
}
