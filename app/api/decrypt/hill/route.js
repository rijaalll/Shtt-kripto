import { NextResponse } from "next/server";

// {
//   "encrypted": "example",
//   "key": {
//     "key_1": 21,
//     "key_2": 0,
//     "key_3": 15,
//     "key_4": 11
//   }
// }

function sanitizeInput(text) {
    return (text || "").replace(/[^A-Za-z]/g, "").toUpperCase();
}

// Compute modular inverse
function modInverse(a, m) {
    a = (a % m + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return null;
}

// Inverse 2×2 matrix (mod 26)
function invertMatrix2x2(key) {
    const [[a, b], [c, d]] = key;

    const det = (a * d - b * c) % 26;
    const detInv = modInverse(det, 26);

    if (detInv === null) return null;

    const inv = [
        [(d * detInv) % 26, (-b * detInv) % 26],
        [(-c * detInv) % 26, (a * detInv) % 26],
    ];

    return inv.map(row => row.map(x => (x + 26) % 26));
}

function hillDecrypt2x2(cipher, keyMatrix) {
    const s = sanitizeInput(cipher);
    let out = "";

    const invKey = invertMatrix2x2(keyMatrix);
    if (!invKey) return null;

    for (let i = 0; i < s.length; i += 2) {
        const a = s.charCodeAt(i) - 65;
        const b = s.charCodeAt(i + 1) - 65;

        const p0 = (invKey[0][0] * a + invKey[0][1] * b) % 26;
        const p1 = (invKey[1][0] * a + invKey[1][1] * b) % 26;

        out += String.fromCharCode(p0 + 65) + String.fromCharCode(p1 + 65);
    }
    return out;
}

export async function POST(req) {
    try {
        const body = await req.json();

        const encrypted = body?.encrypted;
        const keyObj = body?.key;

        if (!encrypted || typeof encrypted !== "string") {
            return NextResponse.json(
                { error: "Field 'encrypted' (string) is required" },
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

        const keys = [
            parseInt(keyObj.key_1, 10),
            parseInt(keyObj.key_2, 10),
            parseInt(keyObj.key_3, 10),
            parseInt(keyObj.key_4, 10),
        ];

        if (keys.some(k => Number.isNaN(k))) {
            return NextResponse.json(
                { error: "'key' values must be numeric" },
                { status: 400 }
            );
        }

        const keyMatrix = [
            [keys[0], keys[1]],
            [keys[2], keys[3]],
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
