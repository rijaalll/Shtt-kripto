import { NextResponse } from "next/server";
import { hillDecrypt2x2 } from "@/src/util/hill/Hill";

export async function POST(req) {
    try {
        const body = await req.json();

        const encrypted = body?.encrypted;
        const keyObj = body?.key;

        if (!encrypted || typeof encrypted !== "string") {
            return NextResponse.json(
                { error: "Field 'encrypted' is required" },
                { status: 400 }
            );
        }

        if (
            !keyObj ||
            typeof keyObj.key_1 === "undefined" ||
            typeof keyObj.key_2 === "undefined" ||
            typeof keyObj.key_3 === "undefined" ||
            typeof keyObj.key_4 === "undefined"
        ) {
            return NextResponse.json(
                { error: "Field 'key' must contain key_1, key_2, key_3, key_4" },
                { status: 400 }
            );
        }

        const keyMatrix = [
            [parseInt(keyObj.key_1), parseInt(keyObj.key_2)],
            [parseInt(keyObj.key_3), parseInt(keyObj.key_4)],
        ];

        const decrypted = hillDecrypt2x2(encrypted, keyMatrix);

        if (!decrypted) {
            return NextResponse.json(
                { error: "Matrix is not invertible mod 26 (invalid key)" },
                { status: 400 }
            );
        }

        return NextResponse.json({ decrypted });

    } catch (err) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
