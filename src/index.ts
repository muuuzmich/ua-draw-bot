import App from "./core/app";
import { ImageService } from "./service/image.service";

const app = new App([ImageService]);

app.start();
