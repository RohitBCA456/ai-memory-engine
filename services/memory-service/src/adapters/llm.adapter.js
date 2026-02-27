// services/memory-service/src/adapters/llm.adapter.js
import axios from 'axios';

export const getType = async (content) => {
  try {
    // Calling your local Python classifier
    const response = await axios.post('http://127.0.0.1:5001/predict', {
      text: content
    });

    return {
      type: response.data.label // Returns "long-term" or "short-term"
    };
  } catch (error) {
    console.error("Classifier Error, falling back to default:", error);
    return { type: "short-term" }; // Safety fallback
  }
};