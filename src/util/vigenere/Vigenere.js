export function vigenereEncrypt(text, key) {
  const A = 'A'.charCodeAt(0);
  text = text.toUpperCase();
  key = key.toUpperCase();

  let output = "";
  let ki = 0;

  for (let i = 0; i < text.length; i++) {
    if (/[A-Z]/.test(text[i])) {
      const shift = key.charCodeAt(ki % key.length) - A;
      const encrypted =
        String.fromCharCode(((text.charCodeAt(i) - A + shift) % 26) + A);
      output += encrypted;
      ki++;
    } else {
      output += text[i];
    }
  }

  return output;
}

export function vigenereDecrypt(text, key) {
  const A = 'A'.charCodeAt(0);
  text = text.toUpperCase();
  key = key.toUpperCase();

  let output = "";
  let ki = 0;

  for (let i = 0; i < text.length; i++) {
    if (/[A-Z]/.test(text[i])) {
      const shift = key.charCodeAt(ki % key.length) - A;
      const decrypted =
        String.fromCharCode(((text.charCodeAt(i) - A - shift + 26) % 26) + A);
      output += decrypted;
      ki++;
    } else {
      output += text[i];
    }
  }

  return output;
}