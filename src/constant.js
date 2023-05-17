// export const BACKEND_URL = "https://facilbookbackend.fly.dev";

export const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://facilbookbackend.fly.dev"
    : "http://localhost:3000";
