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
    testSet: 'new_comments_it' | 'new_comments_defr' | 'new_questions_it' | 'new_questions_defr' | 'new_topics_it' | 'new_topics_defr'
}
