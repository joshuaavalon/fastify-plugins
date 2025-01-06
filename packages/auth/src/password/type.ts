export interface PasswordHandler {
  hashPassword(password: string): Promise<Buffer>;
  verifyPassword(hash: Buffer, password: string): Promise<boolean>;
}
