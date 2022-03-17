import Bot from "./bot";

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
