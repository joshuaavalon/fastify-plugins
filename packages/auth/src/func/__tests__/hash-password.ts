import { assert } from "chai";
import { hashPassword } from "../hash-password.js";
import { verifyPassword } from "../verify-password.js";

it("should hash and verify correct password", async () => {
  const password = "password";
  const hash = await hashPassword(password);
  assert.isTrue(await verifyPassword(hash, password));
});

it("should hash and verify incorrect password", async () => {
  const password = "password";
  const hash = await hashPassword(password);
  assert.isFalse(await verifyPassword(hash, `${password}1`));
});
