import { NextResponse } from "next/server";
import { generateValidKey, hillEncrypt2x2 } from "@/src/util/hill/Hill";

export async function POST(req) {
    try {
        const { text } = await req.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Field 'text' is required" },
                { status: 400 }
            );
        }

        const keyMatrix = generateValidKey();
        const encrypted = hillEncrypt2x2(text, keyMatrix);

        return NextResponse.json({
            encrypted,
            key: {
                key_1: keyMatrix[0][0],
                key_2: keyMatrix[0][1],
                key_3: keyMatrix[1][0],
                key_4: keyMatrix[1][1],
            },
        });

    } catch (err) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}