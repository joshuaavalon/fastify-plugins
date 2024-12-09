import sodium from "sodium-native";

export async function hashPassword(password: string): Promise<Buffer> {
  const outputBuffer = Buffer.alloc(sodium.crypto_pwhash_STRBYTES);
  sodium.crypto_pwhash_str(
    outputBuffer,
    Buffer.from(password),
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE
  );
  return outputBuffer;
}
