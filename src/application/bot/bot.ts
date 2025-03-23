import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import * as dotenv from 'dotenv'
import { UserService } from '../user/services/user-services';
import { UserRepository } from '../../infra/database/repositories/user-repository';

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
}

export class Bot {
  private bot: TelegramBot;
  private userService: UserService;

  constructor(props: IBot.IConstructor) {
    const { token } = props;

    this.bot = new TelegramBot(token, { polling: true });

    const userRepository = new UserRepository();

    this.userService = new UserService(userRepository);

    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.bot.onText(/\/start/, (msg) => {
      console.log(msg);

      this.handleStart({
        chatId: msg.chat.id,
      });
    });

    this.bot.onText(/\/subscribe (\d{2}:\d{2})/, (msg, match) =>
      this.handleSubscribe(msg.chat.id, match?.[1] as string),
    );
  }

  private handleStart(params: IBot.IHandleStartParams): void {
    const { chatId } = params;

    this.bot.sendMessage(
      chatId,
      "Welcome! I'll send you updates at scheduled times. Use /subscribe HH:MM to set a time.",
    );
  }

  public sendMessage(chatId: number, message: string): void {
    this.bot.sendMessage(chatId, message);
  }

  private async handleSubscribe(chatId: number, time: string) {
    const message = await this.userService.subscribeUser(chatId, time);

    this.bot.sendMessage(chatId, message);

    this.bot.sendMessage(
      chatId,
      `✅ Subscribed! You'll receive updates at ${time}`,
    );
  }

  private async handleUnsubscribe(chatId: number) {
    const message = await this.userService.unsubscribeUser(chatId);

    this.bot.sendMessage(chatId, message);
  }

  public async getUsers() {
    return await this.userService.getAllUsers();
  }
};
