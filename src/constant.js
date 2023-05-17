// export const BACKEND_URL = "http://localhost:8000";

export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://facilbookbackend.fly.dev"
    : "http://localhost:3000";
