import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import * as dotenv from "dotenv";
import { UserService } from "../user/services/user-services";
import { UserPostgresRepository } from "../../infra/postgresql/user-postgres-repository";

dotenv.config();

export declare namespace IBot {
  interface IConstructor {
    token: string;
  }

  interface IHandleStartParams {
    chatId: number;
  }

  interface IHandleSubscribeParams {
    chatId: number;
    time?: string;
  }

  interface IHandleCaptureNameParams {
    chatId: number;
    name: string;
  }

  interface IHandleCapturePhoneParams {
    chatId: number;
    phone: string;
  }
}

export class Bot {
  private bot: TelegramBot;
  private userService: UserService;

  constructor(props: IBot.IConstructor) {
    const { token } = props;

    this.bot = new TelegramBot(token, { polling: true });

    const userRepository = new UserPostgresRepository();

    this.userService = new UserService({
      userRepository
    });

    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.bot.onText(/\/start/, (msg) => {
      console.log(msg);
      this.handleStart({ chatId: msg.chat.id });
    });

    this.bot.onText(/\/subscribe (\d{2}:\d{2})/, (msg, match) =>
      this.handleSubscribe(msg.chat.id),
    );

    this.bot.onText(/\/unsubscribe/, (msg) =>
      this.handleUnsubscribe(msg.chat.id),
    );

    this.bot.onText(/\/setname/, (msg) => {
      this.handleSetName(msg.chat.id);
    });

    this.bot.onText(/\/setphone/, (msg) => {
      this.handleSetPhone(msg.chat.id);
    });
  }

  private handleStart(params: IBot.IHandleStartParams): void {
    const { chatId } = params;

    this.bot.sendMessage(
      chatId,
      "Welcome! I'll send you updates at scheduled times. Use /subscribe HH:MM to set a time. You can also set your name and phone using /setname and /setphone.",
    );
  }

  public sendMessage(chatId: number, message: string): void {
    this.bot.sendMessage(chatId, message);
  }

  private async handleSubscribe(chatId: number) {
    const message = await this.userService.subscribe({
      chatId
    });

    this.bot.sendMessage(chatId, message);
  }

  private async handleUnsubscribe(chatId: number) {
    const message = await this.userService.unsubscribe({
      chatId,
    });

    this.bot.sendMessage(chatId, message);
  }

  private async handleSetName(chatId: number): Promise<void> {
    this.bot.sendMessage(chatId, "Please provide your name:");
    this.bot.once("message", async (msg) => {
      const name = msg.text?.trim();
      if (name) {
        const user = await this.userService.getByChatId({ chatId })

        await this.userService.update({
          id: user.id,
          name,
        });

        this.bot.sendMessage(chatId, `Your name has been set to ${name}`);
      } else {
        this.bot.sendMessage(chatId, "I didn't get that. Please try again.");
      }
    });
  }

  private async handleSetPhone(chatId: number): Promise<void> {
    this.bot.sendMessage(chatId, "Please provide your phone number:");
    this.bot.once("message", async (msg) => {
      const phone = msg.text?.trim();
      if (phone && this.validatePhone(phone)) {
        const user = await this.userService.getByChatId({ chatId });

        await this.userService.update({
          id: user.id,
          phone
        })

        this.bot.sendMessage(
          chatId,
          `Your phone number has been set to ${phone}`,
        );
      } else {
        this.bot.sendMessage(
          chatId,
          "I didn't get a valid phone number. Please try again.",
        );
      }
    });
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  }

  public async getUsers() {
    return await this.userService.getAllUsers({ limit: 30, page: 0
    });
  }
}
