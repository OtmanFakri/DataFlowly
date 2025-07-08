import {useState, useCallback} from 'react';
import {GoogleGenAI, Type} from '@google/genai';
import {responseSchema} from "../utils/schemaResponse.ts";

// IMPORTANT: Store your Gemini API key in an environment variable for security.
// For Vite, use VITE_GEMINI_API_KEY in your .env file.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in your environment variables.');
}

const ai = new GoogleGenAI({apiKey: apiKey as string});

export interface GeminiAIOptions {
    model?: string;
    responseSchema?: any;
    responseMimeType?: string;
}

export function useGeminiAI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<any>(null);

    const sendMessage = useCallback(
        async (
            prompt: string,
            history?: any = {},
            options: GeminiAIOptions = {}
        ) => {
            setLoading(true);
            setError(null);
            setResponse(null);
            const fullPrompt = history && Object.keys(history).length > 0
                ? `${JSON.stringify(history)}\n${prompt}`
                : prompt;
            try {
                const res = await ai.models.generateContent({
                    model: options.model || 'gemini-2.5-flash',
                    contents: fullPrompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: responseSchema,
                    },
                });
                let json;
                try {
                    json = JSON.parse(res.text ?? '');
                } catch (e) {
                    json = res.text;
                }
                setResponse(json);
                return json;
            } catch (err: any) {
                setError(err.message || 'Unknown error');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {sendMessage, loading, error, response};
}

/*
USAGE EXAMPLE:

import { useGeminiAI } from './useGeminiAI';
import { Type } from '@google/genai';

const { sendMessage, loading, error, response } = useGeminiAI();

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: { type: Type.STRING },
      ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    propertyOrdering: ['recipeName', 'ingredients'],
  },
};

// To call:
// await sendMessage(
//   'List a few popular cookie recipes, and include the amounts of ingredients.',
//   { responseSchema: schema }
// );
*/
