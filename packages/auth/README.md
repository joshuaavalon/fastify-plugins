# @joshuaavalon/fastify-plugin-auth

## Getting Started

> This is a ESM only module. You must be using ESM in order to use this.

```sh
npm install @joshuaavalon/fastify-plugin-auth
```

### Configuration

```ts
import type { PureAbility } from "@casl/ability";

declare module "@joshuaavalon/fastify-plugin-auth" {
  interface AuthContextConfig {
    // Define the ability of you application
    readonly ability: PureAbility<["action", "subject"]>;
  }
  interface AuthUser {
    // Customize your user object
    id: string;
  }
  interface CreateUserTokenOptions {
    // Extra options for you when creating user token
  }
}
```

### Initialize Plugin

```ts
import plugin from "@joshuaavalon/fastify-plugin-auth";

await app.register(plugin, {
  authContext: {
    async createAbility() {
      const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;
      const builder = new AbilityBuilder(createAppAbility);
      return builder.build();
    },
    // Need to store and generate a unique value
    async createUserToken() {
      return "userToken";
    },
    defaultCreateUserTokenOptions: {
      // Custom options for creating user token
    },
    // Find user by user token
    async findUser() {
      return { name: "name" };
    }
  },
  // Must init @fastify/cookie
  // Default to false which you need to initialize manually
  initCookieOpts: true,
  // Must init @fastify/secure-session with refreshSession, session
  // Default to false which you need to initialize manually
  initSessionOpts: {
    refreshSession: { salt, secret },
    session: { salt, secret }
  }
});
```
