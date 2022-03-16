# Telegram UaDrawBot

Telegram bot written with TypeScript and Telegraf.

It draws random doodle 🇺🇦-colored images using parts of p5.js over given images.

Main idea - change your avatar photos to spread avarnes about situation and support my country Ukraine 🇺🇦

Telegram Bot live: [@ua_draw_bot](https://t.me/ua_draw_bot)

# Develop and contribute:

Clone repo:

    $ git clone https://github.com/muuuzmich/ua-draw-bot

> $ cd ua-draw-bot

> $ npm install

> Add Bot Token to .env file

To run bot

    $ npm run watch:dev

# Bot architecture:

## Basic idea

Every user action is handeled by corresponding service. Each service has list of BotListeners to handle specific action:

```
{
    type: BotCommandType.ON,
    name: "photo",
    callback: (ctx: Context) => this.imageRecieved(ctx),
}
```

## Services

Any new services should implement singleton pattern. It must extend `BaseService` and implement `initListeners` method. Also to make them work, make sure to pass them into App constructor in `index.ts`.

### Creators:

- Idea by: @dimkeaton
- Doodle generator: @bbbbbgdn
- Code: @muzmich
