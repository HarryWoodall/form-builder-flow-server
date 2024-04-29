import SpellChecker from "spellchecker";
import { ItemValidationResult } from "../types/validation";

export async function spellcheckString(string: string, type: string, questionId?: string | undefined): Promise<ItemValidationResult> {
  const result = await SpellChecker.checkSpellingAsync(string);

  const checkResult = result.map((result) => {
    const word = string.substring(result.start, result.end);
    return {
      start: result.start,
      end: result.end,
      misspeltWord: word,
      corrections: SpellChecker.getCorrectionsForMisspelling(word),
    };
  });

  const validationResult: ItemValidationResult = {
    questionId: questionId,
    type: type,
    fullString: string,
    spellCheckResult: checkResult,
  };

  return validationResult;
}
