import { createCanvas, loadImage } from "canvas";
import { map } from "../lib/p5/map";
import { noise } from "../lib/p5/noise";
import { random } from "../lib/p5/random";

const cc = createCanvas(0, 0);
const c = cc.getContext("2d");
type Context = typeof c;

let crop = 0;
const colorPos = 0.5;
const noiseIncrement = 0.0001;
const loopCount = 1000;
// const palette = ["#ffd700", "#0057b7"];
const palette = ["yellow", "blue"];
//misha dunduk

export async function generateImage(bgImage: Buffer, height: number, width: number): Promise<Buffer> {
  //Setup
  const noiseScale = random(70, 100);

  crop = random(0.1, 0.25);

  let yoff = 0.1;
  let xoff = 0.0;
  let x1 = generateCoordinate(xoff, width, noiseScale);
  let y1 = generateCoordinate(yoff, height, noiseScale);

  //Draw
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const img = await loadImage(bgImage);
  ctx.drawImage(img, 0, 0);

  // drawBoundaries(ctx, height, width);

  ctx.strokeStyle = palette[0];
  for (let i = 1; i <= loopCount; i++) {
    if (i > loopCount * colorPos) {
      ctx.strokeStyle = palette[1];
    }

    xoff += noiseIncrement;
    yoff += noiseIncrement;

    let x2 = generateCoordinate(xoff, width, noiseScale);
    let y2 = generateCoordinate(yoff, height, noiseScale);

    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    x1 = x2;
    y1 = y2;
  }

  return canvas.toBuffer("image/png");
}

function generateCoordinate(value: number, max: number, noiseScale: number) {
  return map(noise(value * noiseScale), 0 + crop, 1 - crop, 0, max);
}

function drawBoundaries(ctx: Context, height: number, width: number) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(width * crop, height * crop);
  ctx.lineTo(width - width * crop, height * crop);

  ctx.moveTo(width - width * crop, height * crop);
  ctx.lineTo(width - width * crop, height - height * crop);

  ctx.moveTo(width - width * crop, height - height * crop);
  ctx.lineTo(width * crop, height - height * crop);

  ctx.moveTo(width * crop, height * crop);
  ctx.lineTo(width * crop, height - height * crop);
  ctx.stroke();
}
