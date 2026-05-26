import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Nenhuma imagem fornecida" }, { status: 400 });
    }

    // A imagem pode ser um data URI base64 longo.
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "hooke_products",
    });

    return NextResponse.json({ 
      url: uploadResponse.secure_url, 
      public_id: uploadResponse.public_id 
    });
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Falha ao enviar imagem para o Cloudinary" }, { status: 500 });
  }
}
