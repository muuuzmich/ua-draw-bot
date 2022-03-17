import Bot from "./bot";
import Server from "./server";

export default class App {
  private static instance: App;

  public bot!: Bot;

  public constructor(public services: any[]) {}

  public start() {
    new Server();
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
