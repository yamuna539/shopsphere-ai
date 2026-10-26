const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "WARNING: GEMINI_API_KEY is not configured in server environment variables."
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

const GEMINI_MODEL = "gemini-3.8-flash";

const GEMINI_FALLBACK_MODELS = [
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
];

/**
 * ---------------------------------------------------------
 * Generate normal text response using Gemini
 * ---------------------------------------------------------
 */
const generateText = async (prompt, options = {}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }

  if (!prompt || typeof prompt !== "string") {
    throw new Error(
      "Prompt must be a non-empty string."
    );
  }

  /*
   * Create model list.
   *
   * If a custom model is supplied, try it first.
   * Set removes duplicate models.
   */
  const modelsToTry = [
    options.model || GEMINI_MODEL,
    ...GEMINI_FALLBACK_MODELS,
  ];

  const uniqueModels = [
    ...new Set(modelsToTry),
  ];

  let lastError = null;

  for (const model of uniqueModels) {
    try {
      console.log(
        `Trying Gemini model: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature:
              options.temperature ?? 0.3,

            maxOutputTokens:
              options.maxOutputTokens ?? 1000,

            systemInstruction:
              options.systemInstruction ||
              "You are an AI assistant for ShopSphere, an e-commerce platform.",
          },
        });

      console.log(
        `Gemini request successful using: ${model}`
      );

      return response.text;
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini model ${model} failed:`,
        error?.message || error
      );

      /*
       * Only move to the next model for temporary
       * service availability problems.
       */
      if (error?.status !== 503) {
        throw error;
      }

      console.log(
        `Model ${model} is temporarily unavailable. Trying next model...`
      );
    }
  }

  throw new Error(
    lastError?.message ||
      "All Gemini models are temporarily unavailable. Please try again later."
  );
};

/**
 * ---------------------------------------------------------
 * Clean Gemini JSON response
 * ---------------------------------------------------------
 *
 * Gemini normally returns valid JSON when
 * responseMimeType is application/json.
 *
 * However, sometimes a model may return:
 *
 * ```json
 * {
 *   ...
 * }
 * ```
 *
 * or additional text around the JSON.
 *
 * This helper cleans those cases before JSON.parse().
 */
const cleanGeminiJSON = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let cleanedText = text.trim();

  /*
   * Remove markdown code fences.
   *
   * Example:
   * ```json
   * {...}
   * ```
   */
  cleanedText = cleanedText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  /*
   * If Gemini added text before/after the JSON,
   * extract the JSON object.
   */
  const firstBrace =
    cleanedText.indexOf("{");

  const lastBrace =
    cleanedText.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    cleanedText = cleanedText.slice(
      firstBrace,
      lastBrace + 1
    );
  }

  return cleanedText;
};

/**
 * ---------------------------------------------------------
 * Generate structured JSON response using Gemini
 * ---------------------------------------------------------
 */
const generateJSON = async (
  prompt,
  schema,
  options = {}
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not configured."
    );
  }

  if (!prompt || typeof prompt !== "string") {
    throw new Error(
      "Prompt must be a non-empty string."
    );
  }

  if (!schema || typeof schema !== "object") {
    throw new Error(
      "A valid JSON response schema is required."
    );
  }

  /*
   * Try primary model first, followed by fallback models.
   */
  const modelsToTry = [
    options.model || GEMINI_MODEL,
    ...GEMINI_FALLBACK_MODELS,
  ];

  const uniqueModels = [
    ...new Set(modelsToTry),
  ];

  let lastError = null;

  for (const model of uniqueModels) {
    try {
      console.log(
        `Trying Gemini JSON model: ${model}`
      );

      const response =
        await ai.models.generateContent({
          model,
          contents: prompt,

          config: {
            temperature:
              options.temperature ?? 0.1,

            /*
             * Comparison responses contain:
             *
             * summary
             * keyDifferences
             * similarities
             * importantSpecifications
             * useCases
             *
             * Give Gemini enough output space.
             */
            maxOutputTokens:
              options.maxOutputTokens ?? 3000,

            /*
             * Tell Gemini that the response
             * must be JSON.
             */
            responseMimeType:
              "application/json",

            /*
             * Gemini structured output schema.
             */
            responseSchema: schema,

            systemInstruction:
              options.systemInstruction ||
              "You are an AI assistant for ShopSphere. Return only valid JSON. Do not use markdown code fences. Do not add explanations outside the JSON.",
          },
        });

      console.log(
        `Gemini JSON request successful using: ${model}`
      );

      const rawText = response.text;

      if (!rawText) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      console.log(
        "Gemini JSON raw response:"
      );

      console.log(rawText);

      /*
       * Clean the response before parsing.
       */
      const cleanedText =
        cleanGeminiJSON(rawText);

      console.log(
        "Gemini JSON cleaned response:"
      );

      console.log(cleanedText);

      /*
       * Convert string to JavaScript object.
       */
      try {
        const parsedJSON =
          JSON.parse(cleanedText);

        console.log(
          `Gemini JSON parsed successfully using: ${model}`
        );

        return parsedJSON;
      } catch (parseError) {
        console.error(
          "Gemini JSON Parse Error:",
          parseError
        );

        console.error(
          "Gemini Raw Response:",
          rawText
        );

        console.error(
          "Gemini Cleaned Response:",
          cleanedText
        );

        /*
         * Throw a special error so the next
         * Gemini model can be tried.
         */
        const jsonError = new Error(
          "Gemini returned invalid JSON."
        );

        jsonError.isGeminiJSONError = true;

        throw jsonError;
      }
    } catch (error) {
      lastError = error;

      console.error(
        `Gemini JSON model ${model} failed:`,
        error?.message || error
      );

      /*
       * Try another model when:
       *
       * 1. Gemini service is temporarily unavailable
       * 2. Gemini returned invalid JSON
       */
      if (
        error?.status === 503 ||
        error?.isGeminiJSONError === true
      ) {
        console.log(
          `Trying next Gemini JSON model after failure: ${model}`
        );

        continue;
      }

      /*
       * For other errors such as invalid API key,
       * invalid request, schema error, etc.,
       * don't hide the actual error.
       */
      throw error;
    }
  }

  /*
   * All models failed.
   */
  throw new Error(
    lastError?.message ||
      "All Gemini models failed to generate a valid JSON response."
  );
};

/**
 * ---------------------------------------------------------
 * Get primary Gemini model
 * ---------------------------------------------------------
 */
const getGeminiModel = () => {
  return GEMINI_MODEL;
};

/**
 * ---------------------------------------------------------
 * Export services
 * ---------------------------------------------------------
 */
module.exports = {
  generateText,
  generateJSON,
  getGeminiModel,
};