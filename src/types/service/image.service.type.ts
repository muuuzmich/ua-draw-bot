import { Context } from "telegraf";
import { MessageSubType } from "telegraf/typings/telegram-types";

export enum BotCommandType {
  ON = "on",
  COMMAND = "command",
  ACTION = "action",
  HEARS = "hears",
}

export interface BotListener {
  type: BotCommandType;
  name: MessageSubType | string | RegExp;
  description?: string;
  category?: string;
  callback(ctx: Context, next: Function): Promise<void | object>;
}
