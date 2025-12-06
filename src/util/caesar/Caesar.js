/**
 * Fungsi untuk melakukan Caesar Cipher
 * @param {string} text - Teks input
 * @param {number} shift - Jumlah pergeseran (key)
 * @param {string} mode - 'encrypt' atau 'decrypt'
 * @returns {string} - Hasil teks
 */
export const processCaesar = (text, shift, mode = 'encrypt') => {
  if (!text) return "";

  // Pastikan shift adalah integer
  const s = parseInt(shift) || 0;

  // Jika decrypt, kita geser ke arah berlawanan (negatif)
  const effectiveShift = mode === 'decrypt' ? -s : s;

  return text.replace(/[a-zA-Z]/g, (char) => {
    // Tentukan base ASCII: 65 untuk 'A' (Upper), 97 untuk 'a' (Lower)
    const base = char <= 'Z' ? 65 : 97;
    
    // Rumus Matematika:
    // 1. Ubah char ke angka 0-25 (char.charCodeAt(0) - base)
    // 2. Tambah shift (effectiveShift)
    // 3. Modulo 26 agar berputar (tapi JS modulo bisa negatif)
    // 4. ((n % m) + m) % m adalah trik agar hasil modulo selalu positif di JS
    // 5. Kembalikan ke kode ASCII (+ base)
    return String.fromCharCode(
      ((char.charCodeAt(0) - base + effectiveShift) % 26 + 26) % 26 + base
    );
  });
};