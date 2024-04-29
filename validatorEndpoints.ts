import { FastifyInstance } from "fastify";
import { spellcheckString } from "./validators/spellcheck";
import { SpellcheckPageRequest } from "./types/requests";
import { ItemValidationResult, SpellcheckResult } from "./types/validation";

async function validators(fastify: FastifyInstance) {
  fastify.post("/spellcheckPage", async (request: SpellcheckPageRequest, reply) => {
    const reqBody = request.body;
    const resultList: Promise<ItemValidationResult>[] = [];

    if (reqBody.Title) resultList.push(spellcheckString(reqBody.Title, "Title"));
    if (reqBody.BannerTitle) resultList.push(spellcheckString(reqBody.BannerTitle, "BannerTitle"));
    if (reqBody.LeadingParagraph) resultList.push(spellcheckString(reqBody.LeadingParagraph, "LeadingParagraph"));

    if (reqBody.Elements != undefined && reqBody.Elements.length > 0) {
      for (let element of reqBody.Elements) {
        if (element.Text) resultList.push(spellcheckString(element.Text, "Text", element.QuestionId));
        if (element.Label) resultList.push(spellcheckString(element.Label, "Label", element.QuestionId));
        if (element.Hint) resultList.push(spellcheckString(element.Hint, "Hint", element.QuestionId));
        if (element.IAG) resultList.push(spellcheckString(element.IAG, "IAG", element.QuestionId));
        if (element.CustomValidationMessage) resultList.push(spellcheckString(element.CustomValidationMessage, "CustomValidationMessage", element.QuestionId));
        if (element.SummaryLabel) resultList.push(spellcheckString(element.SummaryLabel, "SummaryLabel", element.QuestionId));

        if (element.Options != undefined && element.Options.length > 0) {
          for (let option of element.Options) {
            if (option.Text) resultList.push(spellcheckString(option.Text, "OptionText", element.QuestionId));
          }
        }
      }
    }

    const spellCheckResult = await Promise.all(resultList);
    reply.send(spellCheckResult.filter((result) => result.spellCheckResult.length > 0));
  });
}

export default validators;
