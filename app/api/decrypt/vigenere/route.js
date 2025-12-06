import { NextResponse } from "next/server";
import { vigenereDecrypt } from "@/src/util/vigenere/Vigenere";

export async function POST(req) {
  try {
    const { text, key } = await req.json();

    if (!text || !key) {
      return NextResponse.json(
        { error: "text dan key wajib diisi" },
        { status: 400 }
      );
    }

    const decrypted = vigenereDecrypt(text, key);

    return NextResponse.json({
      text: decrypted,
      key: key
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Terjadi kesalahan", details: err.message },
      { status: 500 }
    );
  }
}
