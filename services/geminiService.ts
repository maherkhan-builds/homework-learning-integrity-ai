import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION, GEMINI_MODEL_NAME } from '../constants';

let chatSession: Chat | null = null;

const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is not set. Please ensure it's configured.");
    throw new Error("API_KEY is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getOrCreateChatSession = async () => {
  if (!chatSession) {
    const ai = getGeminiClient();
    chatSession = ai.chats.create({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (
  message: string,
  onChunk: (chunk: string) => void,
  onError: (error: Error) => void,
) => {
  try {
    const chat = await getOrCreateChatSession();
    const streamResponse = await chat.sendMessageStream({ message: message });
    for await (const chunk of streamResponse) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    onError(error as Error);
  }
};
