
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Challenge, ActivityCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateNewChallenges = async (user: UserProfile): Promise<Challenge[]> => {
  const currentTime = new Date().toLocaleTimeString();
  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const prompt = `
    Generate 3 unique, highly personalized challenges for a user with the following profile:
    - Current Level: ${user.level}
    - Total XP: ${user.totalXp}
    - Personal Goals: ${user.goals.map(g => g.label).join(', ')}
    - Preferences: ${user.preferences.join(', ')}
    - Recent History: ${user.history.slice(-5).map(h => h.title).join(', ')}
    - Current Time: ${currentTime}
    - Current Day: ${dayOfWeek}
    - Unlocked Difficulty Tiers: ${user.unlockedTiers.join(', ')}

    Guidelines:
    1. Adjust difficulty based on unlocked tiers.
    2. Respect the time of day: If it's morning, suggest high-energy tasks. Night, suggest calming tasks.
    3. Include a 'gemReward' (currency) alongside 'xpReward'. Gems should be roughly 10-20% of the XP amount.
    4. Ensure challenges are actionable and "real-world" compatible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              taskDetails: { type: Type.STRING },
              timeRequired: { type: Type.STRING },
              xpReward: { type: Type.NUMBER },
              gemReward: { type: Type.NUMBER },
              category: { 
                type: Type.STRING,
                description: 'Must be one of: Fitness, Productivity, Personal Growth, Wellness, Creativity'
              },
              difficulty: { 
                type: Type.STRING,
                description: 'Must be one of: Beginner, Intermediate, Advanced, Legendary'
              }
            },
            required: ['title', 'description', 'taskDetails', 'timeRequired', 'xpReward', 'gemReward', 'category', 'difficulty']
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((item: any) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: Date.now()
    }));
  } catch (error) {
    console.error("Error generating challenges:", error);
    return [];
  }
};
