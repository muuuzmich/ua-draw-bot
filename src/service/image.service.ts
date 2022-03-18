import axios from "axios";
import { Context, Markup } from "telegraf";
import { Message, PhotoSize, User } from "telegraf/typings/core/types/typegram";
import { ExtraPhoto, MessageSubType } from "telegraf/typings/telegram-types";
import { generateImage } from "../lib/draw";
import { BotCommandType, BotListener } from "../types/core/global.type";
import { ImageAction, ImageError, ImageTypo } from "../types/service/image.service.type";
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
    await this.useProfilePicture(ctx, user);

    next();
  }

  private async useProfilePicture(ctx: Context, user: User) {
    const { photos } = await ctx.telegram.getUserProfilePhotos(user.id, 0, 1);
    if (!photos || !photos.length) {
      return ctx.reply(ImageError.no_user_photo);
    }
    const userBiggestPicData = photos[0].pop();

    this.processImage(ctx, null, userBiggestPicData!);
  }

  private async imageRecieved(ctx: Context) {
    if (!("photo" in ctx.message!)) return;

    const messageId = ctx.message.message_id;
    const photoList = ctx.message.photo;
    const photo = photoList.pop();

    if (!photo) {
      ctx.reply(ImageError.no_photo);
      return;
    }

    await this.processImage(ctx, messageId, photo);
  }

  private async processImage(ctx: Context, replyMessageId: number | null, { file_id, height, width }: PhotoSize) {
    await ctx.reply(ImageTypo.processing);

    const link = await ctx.telegram.getFileLink(file_id);
    const image = await this.downloadImage(link.toString());

    await this.drawOverAndSend(ctx, image, replyMessageId, height, width);
  }

  private async drawOverAndSend(
    ctx: Context,
    image: Buffer,
    originPhotoId: number | null,
    height: number,
    width: number
  ): Promise<Message> {
    const newImage = await generateImage(image, height, width);

    return await ctx.replyWithPhoto({ source: newImage }, this.getPhotoExtra(originPhotoId));
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const result = await axios({ url, responseType: "arraybuffer" });
    return result.data;
  }

  private async retry(ctx: Context, repeat: boolean = false) {
    if (!("callbackQuery" in ctx) || !("data" in ctx.callbackQuery!) || !("message" in ctx.callbackQuery!)) return;

    let originalMessage;
    if ("reply_to_message" in ctx.callbackQuery.message!) {
      originalMessage = ctx.callbackQuery.message.reply_to_message!;
    } else {
      originalMessage = ctx.callbackQuery.message!;
    }

    if (!("photo" in originalMessage)) return;

    const replyMessageId = originalMessage?.message_id;

    const photo = originalMessage.photo.pop();

    await this.processImage(ctx, replyMessageId, photo!);
  }

  private async retryWithProfile(ctx: Context) {
    const user = ctx.callbackQuery?.from;
    if (!user) {
      return;
    }
    await this.useProfilePicture(ctx, user);
  }

  private getPhotoExtra(originPhotoId: number | null): ExtraPhoto {
    const buttonText = originPhotoId ? ImageTypo.retry : ImageTypo.retryWithProfile;
    const buttonAction = originPhotoId ? ImageAction.retry : ImageAction.retryWithProfile;

    return {
      reply_markup: {
        inline_keyboard: [
          [Markup.button.callback(buttonText, buttonAction)],
          [Markup.button.callback(ImageTypo.repeat, ImageAction.repeat)],
        ],
      },
      caption: ImageTypo.PhotoCaption,
      reply_to_message_id: originPhotoId || undefined,
    };
  }

  protected initListeners(): BotListener[] {
    this.bot.app.start((ctx: Context, next: Function) => this.onStart(ctx, next));
    return [
      {
        type: BotCommandType.ON,
        name: "photo" as MessageSubType,
        callback: (ctx: Context) => this.imageRecieved(ctx),
      },
      {
        type: BotCommandType.ACTION,
        name: ImageAction.retry,
        callback: (ctx: Context) => this.retry(ctx),
      },
      {
        type: BotCommandType.ACTION,
        name: ImageAction.repeat,
        callback: (ctx: Context) => this.retry(ctx, true),
      },
      {
        type: BotCommandType.ACTION,
        name: ImageAction.retryWithProfile,
        callback: (ctx: Context) => this.retryWithProfile(ctx),
      },
    ];
  }
}
