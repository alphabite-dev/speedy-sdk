import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from the .env file in the repo root
config({ path: resolve(__dirname, "../../../.env") });
