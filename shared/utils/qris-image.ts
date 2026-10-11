import {
  type CanvasRenderingContext2D as CanvasContextServer,
  type Image as CanvasImage,
  loadImage,
} from "canvas";
import QrCode from "qrcode";
import { Qris } from "./qris";
import { currencyFormatter } from "./currency";

export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 1024;
const SEPARATOR_HEIGHT = 32;

export async function drawImage(
  ctx: CanvasRenderingContext2D | CanvasContextServer,
  code: string,
  amount?: number,
) {
  let latestHeightComponent = SEPARATOR_HEIGHT + SEPARATOR_HEIGHT / 2;

  const qris = new Qris(code);
  if (amount) {
    qris.setTransactionAmount(amount);
  }

  const qrisImageSource = await QrCode.toDataURL(qris.serialize(), {
    width: 512,
    // errorCorrectionLevel: "high",
    margin: 4,
  });

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const qrisLogoImage = await createImage(
    "data:image/png;base64,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",
  );

  // ------------------------------------------------------------- QRIS Logo
  const qrisLogoPosX = CANVAS_WIDTH / 2 - qrisLogoImage.width / 2;
  // @ts-expect-error error because joining context from canvas api and node-canvas
  ctx.drawImage(qrisLogoImage, qrisLogoPosX, latestHeightComponent);
  latestHeightComponent +=
    qrisLogoImage.height + SEPARATOR_HEIGHT + SEPARATOR_HEIGHT / 2;

  // ------------------------------------------------------------- Merchant Name
  ctx.font = "Bold 40px Plus Jakarta Sans";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.textBaseline = "top";
  ctx.fillText(
    `${qris.getMerchantName()}`,
    CANVAS_WIDTH / 2,
    latestHeightComponent,
  );

  latestHeightComponent = latestHeightComponent + 40 * 1.2 + 8;

  // ------------------------------------------------------------- NMID
  ctx.font = "30px Plus Jakarta Sans";
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    `NMID: ${qris.getNationalMerchantId()}`,
    CANVAS_WIDTH / 2,
    latestHeightComponent,
  );

  latestHeightComponent = latestHeightComponent + SEPARATOR_HEIGHT + 30 * 1.2;

  // ------------------------------------------------------------- QRIS Image
  const qrisImage = await createImage(qrisImageSource);
  const qrisPosX = CANVAS_WIDTH / 2 - qrisImage.width / 2;
  // @ts-expect-error error because joining context from canvas api and node-canvas
  ctx.drawImage(qrisImage, qrisPosX, latestHeightComponent);

  latestHeightComponent =
    latestHeightComponent + qrisImage.height + SEPARATOR_HEIGHT;

  // ------------------------------------------------------------- Transaction Amount
  if (qris.getTransactionAmount()) {
    ctx.font = "30px Plus Jakarta Sans";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(`Nominal Transaksi:`, CANVAS_WIDTH / 2, latestHeightComponent);

    latestHeightComponent = latestHeightComponent + 30 * 1.2 + 10;

    ctx.font = "bold 32px Plus Jakarta Sans";
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      `${currencyFormatter(qris.getTransactionAmount() ?? 0)}`,
      CANVAS_WIDTH / 2,
      latestHeightComponent,
    );
  }

  // ------------------------------------------------------------- Generated timestamp
  const now = new Date();
  ctx.font = "16px Plus Jakarta Sans";
  ctx.textAlign = "left";
  ctx.fillStyle = "black";
  ctx.fillText(`Generated: ${now.toISOString()}`, 10, 1024 - 5 - 16 * 1.2);
}

export function createImage(
  imageString: string,
): Promise<HTMLImageElement | CanvasImage> {
  if (import.meta.server) {
    return loadImage(imageString);
  }

  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = imageString;
  });
}
