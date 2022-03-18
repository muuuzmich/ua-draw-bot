import { Context, Telegraf } from "telegraf";
import { MessageSubType } from "telegraf/typings/telegram-types";
import { BotListener } from "../types/core/global.type";

export default class Bot {
  private static instance: Bot;

  public app!: Telegraf;

  public listeners: Array<BotListener> = [];

  private constructor() {
    this.initMain();
    this.startPooling();
  }

  public static getInstance(): Bot {
    if (!Bot.instance) {
      Bot.instance = new Bot();
    }
    return Bot.instance;
  }

  private initMain() {
    this.app = new Telegraf(process.env.BOT_TOKEN!);
  }

  private async startPooling(): Promise<void> {
    await this.app.launch();
    console.log("Bot is up");
  }

  public addListeners(list: BotListener[]) {
    this.listeners = [...this.listeners, ...list];
  }

  public applyListeners() {
    this.listeners.forEach((listener) => {
      this.app[listener.type](listener.name as MessageSubType, listener.callback);
    });
  }
}
