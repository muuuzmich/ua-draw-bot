import axios from "axios";
import fs from "fs";
import { Context } from "telegraf";
import { Message, PhotoSize, Update } from "telegraf/typings/core/types/typegram";
import { MessageSubType } from "telegraf/typings/telegram-types";
import { generateImage } from "../lib/draw";
import { BotCommandType, BotListener } from "../types/service/image.service.type";
import BaseService from "./base.service";

export class ImageService extends BaseService {
  private static instance: ImageService;

  static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  private async onStart(ctx: Context, next: Function) {
    const user = ctx.message?.from!;
    const userPics = await ctx.telegram.getUserProfilePhotos(user.id, 0, 1);
    const userBiggestPicData = [...userPics.photos[0]].pop();
    if (!userBiggestPicData) return;

    const userProfileLink = await ctx.telegram.getFileLink(userBiggestPicData?.file_id!);
    const image = await this.downloadImage(userProfileLink.toString());

    await this.drawOverAndSend(ctx, image, userBiggestPicData.height, userBiggestPicData.width);
    next();
  }

  private async imageRecieved(ctx: Context<Update>) {
    if (!("photo" in ctx.message!)) return;

    await ctx.reply("Image received. Processing...");

    const photoList = ctx.message.photo;
    const biggestPhoto = [...photoList].pop();
    if (!biggestPhoto) {
      return;
    }

    const link = await ctx.telegram.getFileLink(biggestPhoto.file_id);

    const image: Buffer = await this.downloadImage(link.toString());

    await this.drawOverAndSend(ctx, image, biggestPhoto.height, biggestPhoto.width);
  }

  private async drawOverAndSend(
    ctx: Context,
    image: Buffer,
    height: number,
    width: number
  ): Promise<Message.PhotoMessage> {
    const newImage = await generateImage(image, height, width);
    return ctx.replyWithPhoto({ source: newImage });
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const file = await axios({ url, responseType: "arraybuffer" });
    return file.data;
  }

  protected initListeners(): BotListener[] {
    this.bot.app.start((ctx: Context, next: Function) => this.onStart(ctx, next));
    return [
      {
        type: BotCommandType.ON,
        name: "photo" as MessageSubType,
        callback: (ctx: Context) => this.imageRecieved(ctx),
      },
    ];
  }
}
