import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  port: process.env.PORT || 4000,
  isProduction,

  allowedOrigin: isProduction
    ? process.env.ALLOWED_ORIGIN
    : "http://localhost:5173",

  routes: {
    // Points to Render in Prod, and Docker service names in Dev
    memory: isProduction
      ? process.env.MEMORY_ROUTE
      : "http://memory-service:4001",

    retrieval: isProduction
      ? process.env.RETRIEVAL_ROUTE
      : "http://retrieval-service:4005",

    deletion: isProduction
      ? process.env.DELETION_ROUTE
      : "http://deletion-service:4006",

    user: isProduction
     ? process.env.USER_ROUTE 
     : "http://user-service:4007",

    RAG: isProduction 
    ? process.env.RAG_ROUTE 
    : "http://rag-service:4008",
    
  },

  timeout: 120000,
};
