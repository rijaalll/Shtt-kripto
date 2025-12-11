// src/util/Des.js

/**
 * Fungsi internal untuk menghasilkan byte-key stream dari string kunci.
 * Kunci akan diulang sesuai panjang data.
 * @param {string} key - Kunci rahasia (string)
 * @param {number} dataLength - Panjang data yang akan dienkripsi
 * @returns {Array<number>} - Array of key bytes
 */
const generateKeyStream = (key, dataLength) => {
    // Mengubah kunci menjadi bytes (menggunakan TextEncoder untuk representasi UTF-8)
    const keyBytes = new TextEncoder().encode(key);
    const keyStream = [];
    for (let i = 0; i < dataLength; i++) {
        // Mengulang kunci (keyBytes[i % keyBytes.length])
        keyStream.push(keyBytes[i % keyBytes.length]);
    }
    return keyStream;
};

/**
 * Implementasi Stream Cipher Sederhana (Custom XOR) sebagai pengganti DES Native.
 * Karena XOR adalah operasi simetris (enkripsi = dekripsi), fungsi ini digunakan untuk keduanya.
 *
 * @param {string} dataString - Data input (Base64 DataURL saat enkripsi, Ciphertext saat dekripsi)
 * @param {string} key - Kunci rahasia
 * @returns {string} - Hasil Ciphertext atau Base64 terdekripsi
 */
export const processDES = (dataString, key) => {
    if (!key || typeof dataString !== 'string') return null;

    // 1. Konversi data input menjadi bytes (Uint8Array)
    // Menggunakan TextEncoder untuk mendapatkan representasi bytes yang stabil dari string input.
    const dataBytes = new TextEncoder().encode(dataString);
    const dataLength = dataBytes.length;

    // 2. Buat Key Stream
    const keyStream = generateKeyStream(key, dataLength);

    // 3. Lakukan XOR Byte-per-Byte
    const resultBytes = new Uint8Array(dataLength);
    for (let i = 0; i < dataLength; i++) {
        // XOR (data byte ^ key stream byte)
        resultBytes[i] = dataBytes[i] ^ keyStream[i];
    }

    // 4. Konversi hasil bytes kembali menjadi string Latin1 (Standard untuk menyimpan data biner)
    // String.fromCharCode.apply(null, resultBytes) akan gagal untuk array yang terlalu besar,
    // maka kita gunakan loop untuk build string.
    let resultString = '';
    for (let i = 0; i < dataLength; i++) {
        resultString += String.fromCharCode(resultBytes[i]);
    }
    
    return resultString;
};

// Karena bersifat simetris:
export const encryptDES = processDES;
export const decryptDES = processDES;