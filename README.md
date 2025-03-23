# Web Scraper Bot

A Node.js web scraper bot that fetches data from websites and sends updates to subscribers via Telegram. The bot allows users to subscribe to receive updates at specific times.

## Features

- **Scraping**: Scrapes data from websites (currently set to scrape an example website).
- **Telegram Bot**: Sends updates to Telegram users.
- **Subscriber Management**: Users can subscribe to receive updates at specific times.
- **Database**: Stores subscriber information, including their subscription time and preferences in PostgreSQL.

## Requirements

- **Node.js** (v16.x or above)
- **PostgreSQL** (for storing user data)
- **Telegram Bot Token** (see below on how to get one)

## Getting Started

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/yourusername/web-scraper-bot.git
cd web-scraper-bot
