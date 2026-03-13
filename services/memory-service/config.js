import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

export const config = {
  port: process.env.PORT || 5001,
  isProduction,
  mongoUri: process.env.MONGODB_URI,

  services: {
    classifier: isProduction
      ? process.env.CLASSIFIER_ROUTE
      : "http://classifier:5001",
  },
};
