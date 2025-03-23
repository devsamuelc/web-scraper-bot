import * as cron from "node-cron";
import { Bot } from "../bot";
import { Scraper } from "../scraper/scraper";

export declare namespace IScheduleScraper {
  interface IParams {
    scraper: Scraper;
    bot: Bot;
  }
}

export function scheduleScraper(params: IScheduleScraper.IParams): void {
  const { scraper, bot } = params;

  // cron.schedule("* * * * *", async () => {
  //   const users = await bot.getUsers();

  //   for (const user of users) {
  //     const { chatId } = user;

  //     // const now = new Date().toTimeString().slice(0, 5);

  //     try {
  //       const data = await scraper.scrapeSite({
  //         url: "http://books.toscrape.com",
  //       });

  //       bot.sendMessage(chatId, `📢 Latest Update: ${data}`);
  //     } catch (error) {
  //       console.error("Error scraping site:", error);

  //       bot.sendMessage(
  //         chatId,
  //         "⚠️ Error while fetching data. Please try again later.",
  //       );
  //     }
  //   }
  // });
}

console.log("Scheduler is set up.");
