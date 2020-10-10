export interface Prediction {
    question_id: number;
    language: 'de' | 'fr' | 'it' | 'en';
    id: number;
    topic: string;
    question: string;
    comment: string;
    encoded: string;
    label: 'AGAINST' | 'FAVOR';
    tokens: string[];
    predicted: 'AGAINST' | 'FAVOR';
    fasttext: 'AGAINST' | 'FAVOR';
    mbert: 'AGAINST' | 'FAVOR';
    attentionMatrix: number[][][]
    // TODO: define correct inline enum
    testSet: string
}
