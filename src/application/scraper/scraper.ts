import puppeteer from "puppeteer";

export declare namespace IScraper {
  interface IScrapeParams {
    url: string;
  }
}

export class Scraper {
  async scrapeSite(params: IScraper.IScrapeParams) {
    const { url } = params;

      const browser = await puppeteer.launch({ headless: true });

      const page = await browser.newPage();

      await page.goto(url);

      const result = await page.evaluate(() => {
        return document.querySelector("h1")?.textContent || "No data found";
      });

      await browser.close();
    return result;
  }
}
