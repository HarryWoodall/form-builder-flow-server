export type SpellcheckResult = {
  start: number;
  end: number;
  misspeltWord: string;
  corrections: string[];
};

export type ItemValidationResult = {
  questionId?: string;
  type: string;
  fullString: string;
  spellCheckResult: SpellcheckResult[];
};
