import sodium from "sodium-native";
import type { PasswordHandler } from "./type.js";

export class Argon2PasswordHandler implements PasswordHandler {
  public async hashPassword(password: string): Promise<Buffer> {
    const outputBuffer = Buffer.alloc(sodium.crypto_pwhash_STRBYTES);
    sodium.crypto_pwhash_str(
      outputBuffer,
      Buffer.from(password),
      sodium.crypto_pwhash_OPSLIMIT_MODERATE,
      sodium.crypto_pwhash_MEMLIMIT_MODERATE
    );
    return outputBuffer;
  }


  public async verifyPassword(hash: Buffer, password: string): Promise<boolean> {
    return sodium.crypto_pwhash_str_verify(hash, Buffer.from(password));
  }
}
