// ==============================
// Utility FUNGSI HILL CIPHER
// ==============================

// Bersihkan input menjadi huruf A–Z
export function sanitizeInput(text) {
    return (text || "").replace(/[^A-Za-z]/g, "").toUpperCase();
}

// Tambah padding X jika ganjil
export function padPair(chars) {
    return chars.length % 2 === 1 ? chars + "X" : chars;
}

// GCD
export function gcd(a, b) {
    a = Math.abs(a); 
    b = Math.abs(b);

    while (b) {
        const t = a % b;
        a = b;
        b = t;
    }
    return a;
}

// Modular inverse
export function modInverse(a, m) {
    a = (a % m + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return null;
}

// Invers matriks 2×2 mod 26
export function invertMatrix2x2(key) {
    const [[a, b], [c, d]] = key;

    const det = (a * d - b * c) % 26;
    const detInv = modInverse(det, 26);
    if (detInv === null) return null;

    const inv = [
        [(d * detInv) % 26, (-b * detInv) % 26],
        [(-c * detInv) % 26, (a * detInv) % 26]
    ];

    return inv.map(row => row.map(x => (x + 26) % 26));
}

// Generate matriks kunci 2×2 yang invertible mod 26
export function generateValidKey() {
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
                [k3, k4],
            ];
        }
    }
}

// ==============================
// ENCRYPT
// ==============================
export function hillEncrypt2x2(plain, keyMatrix) {
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

// ==============================
// DECRYPT
// ==============================
export function hillDecrypt2x2(cipher, keyMatrix) {
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
