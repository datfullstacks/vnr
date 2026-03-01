export type GameChoice = {
  id: string;
  label: string;
  description: string;
  score: number;
  next: string;
};

export type GameStep = {
  id: string;
  title: string;
  scenario?: string;
  context: string;
  quote: string;
  choices: GameChoice[];
};

export type GameResultBand = {
  min: number;
  max: number;
  title: string;
  text: string;
};

export type GameFlow = {
  title: string;
  overview: string;
  intro: {
    title: string;
    summary: string[];
    next: string;
  };
  steps: GameStep[];
  resultBands: GameResultBand[];
};

export type GameChoiceRecord = {
  choiceId: string;
  score: number;
};

export type GameProgress = {
  started: boolean;
  score: number;
  choices: Record<string, GameChoiceRecord>;
};
