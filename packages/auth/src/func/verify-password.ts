import sodium from "sodium-native";

export async function verifyPassword(hash: Buffer, password: string): Promise<boolean> {
  return sodium.crypto_pwhash_str_verify(hash, Buffer.from(password));
}
