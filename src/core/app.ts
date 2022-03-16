import axios from "axios";
import { Context, Telegraf } from "telegraf";
import fs from "fs";
import { Update } from "telegraf/typings/core/types/typegram";
import Bot from "./bot";

// const bot = new Telegraf(process.env.BOT_TOKEN!);

// bot.start(async (ctx: Context) => {
//   const user = ctx.from!;
//   const profilePic = (await bot.telegram.getUserProfilePhotos(user.id, 0, 1)).photos[0];
//   const biggestPic = profilePic.pop();

//   const profilePicLink = await bot.telegram.getFileLink(biggestPic?.file_id!);
//   axios({ url: profilePicLink.toString(), responseType: "stream" }).then((response) => {
//     return new Promise((resolve, reject) => {
//       response.data
//         .pipe(fs.createWriteStream(`./${user.id}.jpg`))
//         .on("finish", () => {
//           ctx.reply("done");
//         })
//         .on("error", (e: any) => {
//           ctx.reply("something went wrong: " + e.message);
//         });
//     });
//   });

//   ctx.reply("hey");
// });

// bot.launch();

export default class App {
  private static instance: App;

  public bot!: Bot;

  public constructor(public services: any[]) {}

  public start() {
    this.startServices();
    this.startPostHandlers();
  }

  private startPostHandlers() {
    Bot.getInstance().applyListeners();
  }

  private startServices() {
    this.services.forEach((service) => {
      service.getInstance();
    });
  }
}
