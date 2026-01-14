import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  // Directly using process.env.API_KEY as per guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateJobSummary = async (description: string, lang: 'ar' | 'en') => {
  try {
    const ai = getAIClient();
    const prompt = `Summarize this job description in 2 concise sentences in ${lang === 'ar' ? 'Arabic' : 'English'}. Focused on key requirements: ${description}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Accessing response.text as a property, not a function
    return response.text || "No summary available.";
  } catch (error) {
    console.error("AI Generation failed:", error);
    return description.slice(0, 100) + "...";
  }
};

export const suggestJobMatching = async (candidateBio: string, jobs: any[]) => {
  try {
    const ai = getAIClient();
    const jobTitles = jobs.map(j => j.title).join(", ");
    const prompt = `Based on this candidate bio: "${candidateBio}", which of these jobs is the best match? Just return the job title: ${jobTitles}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Not found";
  } catch (error) {
    return "Error matching";
  }
};