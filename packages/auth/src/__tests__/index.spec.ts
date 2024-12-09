import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import cookiePlugin from "@fastify/cookie";
import sessionPlugin from "@fastify/secure-session";
import { assert } from "chai";
import fastify from "fastify";
import parseSetCookie from "set-cookie-parser";
import plugin from "../index.js";
import type { CreateAbility, PureAbility } from "@casl/ability";
import type { FastifyInstance } from "fastify";

type AppAbility = PureAbility<["action", "subject"]>;
const secret = "this_is_a_secret_key_and_you_must_change_it";
const salt = "you_must_change_";

describe("Test @joshuaavalon/fastify-plugin-auth", async () => {
  let app: FastifyInstance;

  before(async () => {
    app = await fastify({ });
    await app.register(cookiePlugin);
    await app.register(sessionPlugin, [{
      cookie: {
        httpOnly: true,
        maxAge: 2592000,
        path: "/",
        sameSite: "strict",
        secure: "auto"
      },
      expiry: 2592000,
      salt,
      secret,
      sessionName: "refreshSession"
    }, {
      cookie: {
        httpOnly: true,
        maxAge: 300,
        path: "/",
        sameSite: "strict",
        secure: "auto"
      },
      expiry: 300,
      salt,
      secret,
      sessionName: "session"
    }]);
    await app.register(plugin, {
      async createAbility() {
        const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;
        const builder = new AbilityBuilder(createAppAbility);
        return builder.build();
      },
      async createUserToken() {
        return "userToken";
      },
      async findUser() {
        return { name: "name" };
      }

    });
    app.get(
      "/me",
      async (req, res) => {
        const user = await req.auth.getUser();
        res.send(user);
      }
    );
    app.post(
      "/login",
      async (req, res) => {
        const { password } = req.body as { password: string };
        if (password === "password") {
          req.auth.setUser({ name: "name" });
        }
        await req.auth.setRefreshToken({});
        await req.auth.setAccessToken();
        res.send({ success: true });
      }
    );
  });

  it("should login", async () => {
    const res = await app.inject({
      method: "post",
      path: "/login",
      payload: { password: "password" }
    });
    const { success } = res.json();
    assert.isTrue(success);
    const cookies = parseSetCookie(res.headers["set-cookie"] ?? [], { map: true });
    const res2 = await app.inject({
      cookies: Object.assign({}, ...Object.entries(cookies).map(([key, value]) => ({ [key]: value.value }))),
      method: "get",
      path: "/me"
    });
    const { name } = res2.json();
    assert.equal(name, "name");
  });

  await import("#func/tests");
});


declare module "@joshuaavalon/fastify-plugin-auth" {
  interface AuthContextConfig {
    readonly ability: PureAbility<["action", "subject"]>;
  }
}
