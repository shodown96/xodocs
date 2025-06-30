# 🧾 XoDocs

XoDocs is a developer-first tool that generates clean, human-readable OpenAPI documentation for your Express backend application using Zod and Swagger under the hood.

It simplifies the documentation process by reducing the amount of boilerplate comments required, promoting schema reusability, and keeping your API definitions tightly coupled to your code — not scattered across YAML files or verbose decorators.

---

## 🚨 The Problem

Swagger has become the de facto standard for documenting APIs, but maintaining Swagger annotations in complex projects often turns into a mess:

- Annotating every route with verbose comments or decorators
- Duplicating schema definitions across files
- Managing large Swagger configuration files manually
- Constantly syncing code and documentation

These issues lead to bloated, error-prone documentation that is painful to maintain.

---

## ✅ The Solution: XoDocs

XoDocs solves this by providing a **clean, code-first documentation experience** for Zod + Express applications.

✨ **Key features:**

- ✍️ Use minimal, structured JSDoc-style route annotations
- 🧠 Automatically detects routes and methods
- 🔗 Seamlessly integrates with `zod-openapi`
- 🔐 Simple authentication configuration
- 📚 Zero boilerplate OpenAPI generation
- 📂 Keeps your documentation and code in sync

---

## 🚀 Getting Started

### 📦 Installation

Install `xodocs` along with its peer dependency `zod-openapi`:

```bash
npm install xodocs zod-openapi
```

or with yarn:

```bash
yarn add xodocs zod-openapi
```

---

### 🧬 Entry Setup

At the **entry point** of your Express app (e.g., `index.ts` or `server.ts`):

```ts
import 'zod-openapi/extend';
```

This ensures that all Zod schemas are extended with the OpenAPI capabilities provided by zod-openapi.

### 🧬 Documentation Setup

```ts
import express from 'express';
import { generateOpenAPIDocs } from 'xodocs';
import { AuthResponse, UserParamsId } from './schemas';

const app = express();

generateOpenAPIDocs(app, {
    info: {
        title: 'XoDocs Sample',
        description: 'This is the official API of "Xodocs Sample"',
    },
    schemas: {
        AuthResponse,
        UserParamsId,
    },
    auth: {
        type: 'bearer',
        in: 'header',
        scheme: 'token',
    },
});
```

### 🧾 Config Options

### `GenerateConfig` Options

| Property   | Type                      | Description                                                    |
| ---------- | ------------------------- | -------------------------------------------------------------- |
| `info`     | `Partial<InfoObject>`     | OpenAPI info object (e.g., title, version, description)        |
| `docsPath` | `Partial<DocsPath>`       | Override default UI/JSON documentation routes                  |
| `auth`     | `AuthConfig`              | Optional global authentication configuration                   |
| `schemas`  | `Record<string, ZodType>` | Zod schemas used in route annotations (`@response`, `@params`) |

---

### `DocsPath`

| Property | Type     | Description                      | Default                |
| -------- | -------- | -------------------------------- | ---------------------- |
| `ui`     | `string` | Route where Swagger UI is served | `"/docs"`              |
| `json`   | `string` | Route for raw OpenAPI JSON       | `"/docs/openapi.json"` |

---

### `AuthConfig`

| Property      | Type                     | Description                                            | Notes                 |
| ------------- | ------------------------ | ------------------------------------------------------ | --------------------- |
| `type`        | `"bearer"` \| `"apiKey"` | Type of authentication                                 | Required              |
| `name`        | `string`                 | Name of the header/query param (for `apiKey`)          | Required for `apiKey` |
| `in`          | `"header"` \| `"query"`  | Location of the `apiKey` parameter                     | Required for `apiKey` |
| `scheme`      | `string`                 | Auth scheme (defaults to `"bearer"` for `bearer` auth) | Optional              |
| `description` | `string`                 | Description of the auth mechanism                      | Optional              |

---

## ✍️ Annotating Controllers

Here's how you define routes with clean top-of-function comments:

```ts
export class AuthController {
    // @public
    // @route POST /login
    // @summary Login a user
    // @response 200: AuthResponse
    // @tags Auth
    static login = (_: any, res: any) => {
        res.json({ token: 'abc123' });
    };

    // @route POST /user/{id}
    // @summary Get user details
    // @response 200: AuthResponse
    // @params UserParamsId
    // @tags Users
    static user = (_: any, res: any) => {
        res.json({ token: 'abc123' });
    };
}
```

🧠 XoDocs will automatically read these annotations, match the method name, and link the referenced schemas from the config.

---

## 📦 Schema Definitions (Zod + OpenAPI)

Using `zod-openapi`, your schemas should be defined like this:

```ts
import { z } from 'zod';

// Request Body Schema
export const AuthResponse = z.object({
    token: z.string().openapi({
        description: 'JWT token returned after successful login',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }),
});

// Paramter Schema
export const UserParamsId = z.object({
    id: z
        .string()
        .uuid()
        .openapi({
            param: {
                name: 'id',
                in: 'path',
            },
            description: 'The UUID of the user',
            example: 'f8b50a58-23f5-4f20-a08b-53f233e704a1',
        }),
    page: z.number().openapi({
        param: {
            name: 'page',
            in: 'query',
        },
        description: 'Page number',
        example: 25,
    }),
});
```

---

## 🌐 Output

Once configured, XoDocs generates:

- A beautiful Swagger UI at `/swagger`
- A raw OpenAPI JSON spec at `/swagger/openapi.json`

These can be easily customized with the `docsPath` config option.

---

## 🔐 Auth Support

Configure authentication globally with the `auth` option:

```ts
auth: {
  type: 'bearer',
  in: 'header',
  scheme: 'token',
  description: 'JWT token authentication',
}
```

XoDocs will automatically include this security scheme in the spec and apply it to all routes except those marked with `@public`.

---

## 🤝 Contributing

We welcome contributions!

- Found a bug?
- Have a feature idea?
- Want to help make XoDocs better?

👉 **[Contribute here](https://github.com/elijahsoladoye/xodocs)**

---

## 🧠 Why XoDocs?

Unlike traditional Swagger tools that rely on bloated decorators or out-of-sync YAML files, XoDocs embraces:

- 📌 Simplicity
- 🧩 Zod-first validation and schema linking
- 🧼 Clean function-level documentation
- ⚙️ Automated generation with no runtime overhead

It’s the Swagger generation tool your Node.js projects actually deserve.

---

## 💡 License

MIT License © Elijah Soladoye
