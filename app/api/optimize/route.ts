import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const width = parseInt(formData.get("width") as string) || 1920;
    const quality = parseInt(formData.get("quality") as string) || 80;
    const format = (formData.get("format") as string) || "webp";
    const preserveAspectRatio = formData.get("preserveAspectRatio") === "true";
    const preventUpscaling = formData.get("preventUpscaling") === "true";
    const removeMetadata = formData.get("removeMetadata") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let sharpInstance = sharp(buffer);

    if (removeMetadata) {
      sharpInstance = sharpInstance.withMetadata({});
    }

    const metadata = await sharpInstance.metadata();
    const originalWidth = metadata.width || width;
    const targetWidth = preventUpscaling
      ? Math.min(width, originalWidth)
      : width;

    if (preserveAspectRatio) {
      sharpInstance = sharpInstance.resize(targetWidth, null, {
        withoutEnlargement: preventUpscaling,
        fit: "inside",
      });
    } else {
      sharpInstance = sharpInstance.resize(targetWidth, null, {
        withoutEnlargement: preventUpscaling,
      });
    }

    let optimizedBuffer: Buffer;
    let mimeType: string;

    switch (format.toLowerCase()) {
      case "jpeg":
      case "jpg":
        optimizedBuffer = await sharpInstance
          .jpeg({ quality, mozjpeg: true })
          .toBuffer();
        mimeType = "image/jpeg";
        break;
      case "png":
        optimizedBuffer = await sharpInstance
          .png({ quality, compressionLevel: 9 })
          .toBuffer();
        mimeType = "image/png";
        break;
      case "avif":
        optimizedBuffer = await sharpInstance
          .avif({ quality, effort: 4 })
          .toBuffer();
        mimeType = "image/avif";
        break;
      case "gif":
        optimizedBuffer = await sharpInstance.gif({ effort: 6 }).toBuffer();
        mimeType = "image/gif";
        break;
      case "tiff":
      case "tif":
        optimizedBuffer = await sharpInstance
          .tiff({ quality, compression: "lzw" })
          .toBuffer();
        mimeType = "image/tiff";
        break;
      case "webp":
      default:
        optimizedBuffer = await sharpInstance
          .webp({ quality, effort: 6 })
          .toBuffer();
        mimeType = "image/webp";
        break;
    }

    const optimizedSize = optimizedBuffer.length;
    const base64 = optimizedBuffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      dataUrl,
      optimizedSize,
      format: mimeType,
      width: targetWidth,
    });
  } catch (error) {
    console.error("Optimization error:", error);
    return NextResponse.json(
      { error: "Failed to optimize image", details: String(error) },
      { status: 500 }
    );
  }
}
