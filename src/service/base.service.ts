import Bot from "../core/bot";
import { BotListener } from "../types/core/global.type";

export default abstract class BaseService {
  public title?: string;

  protected readonly bot: Bot;

  protected serviceList: BaseService[] = [];

  protected constructor() {
    this.bot = Bot.getInstance();
    this.initProps();
    this.applyListeners(this.initListeners());
  }

  protected initProps(): void {}

  private applyListeners(commands: BotListener[]): void {
    this.bot.addListeners(
      commands.map((listener) => ({
        ...listener,
      }))
    );
  }

  protected abstract initListeners(): BotListener[];
}
