import { NextResponse } from "next/server";

// {
//     "text": "example"
// }

// Utility
function sanitizeInput(text) {
    return (text || "").replace(/[^A-Za-z]/g, "").toUpperCase();
}

function padPair(chars) {
    return chars.length % 2 === 1 ? chars + "X" : chars;
}

function hillEncrypt2x2(plain, keyMatrix) {
    const s = padPair(sanitizeInput(plain));
    let out = "";

    for (let i = 0; i < s.length; i += 2) {
        const a = s.charCodeAt(i) - 65;
        const b = s.charCodeAt(i + 1) - 65;

        const c0 = (keyMatrix[0][0] * a + keyMatrix[0][1] * b) % 26;
        const c1 = (keyMatrix[1][0] * a + keyMatrix[1][1] * b) % 26;

        out += String.fromCharCode(c0 + 65) + String.fromCharCode(c1 + 65);
    }

    return out;
}

// gcd
function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) {
        const t = a % b;
        a = b;
        b = t;
    }
    return a;
}

// Generate a valid invertible 2×2 matrix mod 26
function generateValidKey() {
    while (true) {
        const k1 = Math.floor(Math.random() * 26);
        const k2 = Math.floor(Math.random() * 26);
        const k3 = Math.floor(Math.random() * 26);
        const k4 = Math.floor(Math.random() * 26);

        const det = (k1 * k4 - k2 * k3) % 26;
        const detNorm = (det + 26) % 26;

        if (gcd(detNorm, 26) === 1) {
            return [
                [k1, k2],
                [k3, k4]
            ];
        }
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { text } = body || {};

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "Field 'text' is required" },
                { status: 400 }
            );
        }

        // Auto generate valid key
        const keyMatrix = generateValidKey();

        const encrypted = hillEncrypt2x2(text, keyMatrix);

        return NextResponse.json({
            encrypted,
            key: {
                key_1: keyMatrix[0][0],
                key_2: keyMatrix[0][1],
                key_3: keyMatrix[1][0],
                key_4: keyMatrix[1][1]
            }
        });

    } catch (err) {
        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    }
}
