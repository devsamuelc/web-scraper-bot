import dotenv from "dotenv";
import { Scraper } from "./application/scraper/scraper";
import { scheduleScraper } from "./application/scheduler/scheduler";
import { Bot } from "./application/bot";

dotenv.config();

const scraper = new Scraper();

const bot = new Bot({
  token: process.env.TELEGRAM_TOKEN as string,
});

scheduleScraper({
  scraper, bot
});

console.log("Running...");
