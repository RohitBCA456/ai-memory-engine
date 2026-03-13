import axios from "axios";
import { config } from "../../config.js";

const classifierClient = axios.create({
  baseURL: config.services.classifier,
  timeout: 120000,
  headers: { "Content-Type": "application/json" },
});

export const getType = async (content) => {
  try {
    const response = await classifierClient.post("/predict", {
      text: content,
    });

    if (
      typeof response.data === "string" &&
      response.data.includes("<!DOCTYPE html>")
    ) {
      throw new Error("Classifier is still waking up...");
    }

    return {
      type: response.data.label || "short-term",
    };
  } catch (error) {
    console.error(
      "Classifier Error:",
      error.code === "ECONNABORTED" ? "Timeout" : error.message,
    );

    return { type: "short-term" };
  }
};
