import { NextResponse } from "next/server";
import { z } from "zod";
import { addContactToBrevo } from "@/lib/brevo";

// Validação estrita Zod do lead da Newsletter
const NewsletterSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  phone: z.string().trim().optional().or(z.literal(""))
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = NewsletterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: "Dados de inscrição inválidos.",
        errors: validation.error.format()
      }, { status: 400 });
    }

    const { email, phone } = validation.data;

    // Adiciona o lead ao Brevo (Lista ID 2 por padrão para Newsletter)
    const result = await addContactToBrevo(email, phone, undefined, [2]);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Cadastro realizado com sucesso."
    }, { status: 200 });

  } catch (error) {
    console.error("Erro no endpoint de newsletter:", error);
    return NextResponse.json({
      success: false,
      message: "Erro interno do servidor."
    }, { status: 500 });
  }
}
