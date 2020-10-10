import {Figures} from "./Figures";

export interface Summary extends Figures {
    language: string;
    topic: string;
    question: string;
    questionId: number;
}
