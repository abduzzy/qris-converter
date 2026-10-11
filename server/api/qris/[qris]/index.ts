import type { H3Event } from "h3";
import * as v from "valibot";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeFileSync } from "node:fs";

import { createCanvas, registerFont } from "canvas";

const FONT_ASSETS = [
  { asset: "fonts/PlusJakartaSans-Bold.ttf", weight: "700" },
  { asset: "fonts/PlusJakartaSans-Regular.ttf", weight: "400" },
];

let fontsReady: Promise<void> | undefined;

function ensureFontsRegistered() {
  fontsReady ??= (async () => {
    const assets = useStorage("assets:server");

    await Promise.all(
      FONT_ASSETS.map(async ({ asset, weight }) => {
        const fontBuffer = await assets.getItemRaw<Buffer>(asset);

        if (!fontBuffer) {
          throw createError({
            statusCode: 500,
            message: `Font ${asset} tidak ditemukan pada server.`,
          });
        }

        const fontPath = join(tmpdir(), asset.replaceAll("/", "_"));
        writeFileSync(fontPath, fontBuffer);

        registerFont(fontPath, {
          family: "Plus Jakarta Sans",
          weight,
        });
      }),
    );
  })();

  return fontsReady;
}

export default defineEventHandler(async (event: H3Event) => {
  const result = await getValidatedRouterParams(event, (parameters) =>
    v.safeParse(QrisRouteParameterSchema, parameters),
  );

  if (!result.success) {
    setResponseStatus(event, 422);
    return {
      error: true,
      message: "Encoded QRIS/kode QRIS salah.",
    };
  }

  const queries = getQuery(event);
  const validatedResultQueries = v.safeParse(
    UpdateTransactionAmountServerSchema,
    queries,
  );
  if (!validatedResultQueries.success) {
    setResponseStatus(event, 400);
    return {
      error: true,
      message: "Kueri `transaction-amount` salah atau belum diisi.",
    };
  }

  await ensureFontsRegistered();

  const transactionAmount = validatedResultQueries.output["transaction-amount"];

  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const ctx = canvas.getContext("2d");

  await drawImage(ctx, result.output.qris, transactionAmount);

  setHeader(event, "Content-Type", "image/png");
  setHeader(event, "Cache-Control", "public, max-age=3600");

  return canvas.toBuffer("image/png");
});
