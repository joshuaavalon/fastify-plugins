import { assert } from "chai";
import { Argon2PasswordHandler } from "../argon2-handler.js";

it("should hash and verify correct password", async () => {
  const password = "password";
  const handler = new Argon2PasswordHandler();
  const hash = await handler.hashPassword(password);
  assert.isTrue(await handler.verifyPassword(hash, password));
});

it("should hash and verify incorrect password", async () => {
  const password = "password";
  const handler = new Argon2PasswordHandler();
  const hash = await handler.hashPassword(password);
  assert.isFalse(await handler.verifyPassword(hash, `${password}1`));
});
