import axios from "axios";

class AIMemoryClient {
  constructor(apiKey, serviceUrls = {}) {
    if (!apiKey) throw new Error("API Key is required to initialize the AI Memory Engine.");
    this.apiKey = apiKey;

    this.urls = {
      ingest: serviceUrls.ingest || "http://localhost:4000/memory-service",
      retrieve: serviceUrls.retrieve || "http://localhost:4000/retrieval-service",
      delete: serviceUrls.delete || "http://localhost:4000/deletion-service",
    };
  }

  async ingest(userId, content, metadata = {}) {
    try {
      const response = await axios.post(
        `${this.urls.ingest}/memory`,
        { userId, content, metadata },
        { headers: { "x-api-key": this.apiKey } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Ingestion Failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async retrieve(memoryId) {
    try {
      const response = await axios.get(
        `${this.urls.retrieve}/retrieve-memory/${memoryId}`,
        { headers: { "x-api-key": this.apiKey } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Retrieval Failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async delete(memoryId) {
    try {
      const response = await axios.delete(
        `${this.urls.delete}/delete-memory/${memoryId}`,
        { headers: { "x-api-key": this.apiKey } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Deletion Failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

export default AIMemoryClient;