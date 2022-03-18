import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
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
  callback(ctx: Context<Update.CallbackQueryUpdate> | Context<Update>, next: Function): Promise<void | object>;
}
