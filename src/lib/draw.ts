import { createCanvas, loadImage } from "canvas";
import { map } from "./p5/map";
import { noise } from "./p5/noise";
import { random } from "./p5/random";

export async function generateImage(bgImage: Buffer, height: number, widht: number): Promise<Buffer> {
  const canvas = createCanvas(widht, height);
  const ctx = canvas.getContext("2d");

  //Setup
  let yoff = 0.1,
    xoff = 0.0,
    x1,
    y1;
  const colorPos = 0.5; //random(0.2, 0.8);
  const noiseScale = random(15, 100);
  const noiseIncrement = 0.0002;
  const crop = 0.15;
  const loopCount = 1000;
  const palette = ["#ffd700", "#0057b7"];

  const img = await loadImage(bgImage);
  ctx.drawImage(img, 0, 0);

  x1 = map(noise(xoff * noiseScale, 0), 0 + crop, 1 - crop, 0, widht);
  y1 = map(noise(yoff * noiseScale, 0), 0 + crop, 1 - crop, 0, height);

  ctx.strokeStyle = palette[0];
  for (let i = 1; i <= loopCount; i++) {
    if (i > loopCount * colorPos) {
      ctx.strokeStyle = palette[1];
    }

    xoff += noiseIncrement;
    yoff += noiseIncrement;
    let x2 = map(noise(xoff * noiseScale), 0 + crop, 1 - crop, 0, widht);
    let y2 = map(noise(yoff * noiseScale), 0 + crop, 1 - crop, 0, height);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.stroke();

    x1 = x2;
    y1 = y2;
  }

  return canvas.toBuffer("image/png");
}
