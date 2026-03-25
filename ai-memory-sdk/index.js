import axios from "axios";

const GATEWAY_URL = "https://ai-memory-engine-6uby.onrender.com";

class AIMemoryClient {
  constructor(apiKey) {
    if (!apiKey)
      throw new Error(
        "API Key is required to initialize the AI Memory Engine.",
      );
    this.apiKey = apiKey;

    this.client = axios.create({
      baseURL: GATEWAY_URL,
      timeout: 120000,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
    });
  }

  async ingest(userId, content, metadata = {}) {
    try {
      const response = await this.client.post("/memory-service/memory", {
        userId,
        content,
        metadata,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `Ingestion Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async retrieve(userId, content) {
    try {
      const response = await this.client.post(
        `/retrieval-service/retrieve-memory`,
        {
          userId,
          content,
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Retrieval Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async delete(memoryId) {
    try {
      const response = await this.client.delete(
        `/deletion-service/delete-memory/${memoryId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Deletion Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}

export default AIMemoryClient;
