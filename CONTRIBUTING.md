# 🤝 Contributing to Xodocs

First off, thank you for taking the time to contribute to **XoDocs**!  
Your help makes this project better, more reliable, and more accessible for the developer community.

This document will guide you through how to get started, what to contribute, and how to make sure your pull request can be merged smoothly.

---

## 📚 About XoDocs

XoDocs is a developer-first tool for generating clean OpenAPI documentation using Express, Zod, and Swagger under the hood.  
It minimizes boilerplate by extracting structured annotations from your controllers and linking them to Zod schemas.

---

## 🛠️ Local Setup

To contribute, clone the repo and install dependencies:

```bash
git clone https://github.com/shodown96/xodocs.git
cd xodocs
npm install
```

Run the development server (or test script):

```bash
npm run dev   # if available
# or
npm run test
```

Make sure your changes are reflected and tests are passing.

---

## 🧩 Project Structure

```txt
xodocs/
├── example/                    # Sample Express app using XoDocs
│   └── src/
│       ├── controllers/
│       ├── schemas/
│       └── index.ts
│
├── src/                        # XoDocs core library
│   ├── generate-docs/          # Main documentation generator logic
│   ├── examples/               # Internal schema/controller examples
│   ├── types/                  # Shared type definitions
│   ├── utils/                  # Utility functions
│   └── index.ts                # Public entry point
│
│
├── test/                       # Vitest test suite
│
├── package.json
├── tsconfig.json
├── README.md
└── CONTRIBUTING.md
```

---

## ✅ How to Contribute

### 💡 1. Pick an Issue

Check the [Issues tab](https://github.com/shodown96/xodocs/issues) for things labeled `good first issue` or `help wanted`.  
If you're unsure, open a discussion or ask in an issue before starting work.

### ✨ 2. Suggested Contributions

- Bug fixes or test coverage
- Support for more Swagger/OpenAPI features
- Improved route detection and parsing
- Plugin support for other frameworks
- Documentation improvements

### 🧪 3. Add Tests

If you're adding new features or fixing bugs, please include tests using [Vitest](https://vitest.dev/).

```bash
npm run test
```

---

## 🧼 Code Style

- Use TypeScript (strict mode enabled)
- Follow existing patterns and folder structure
- Format with Prettier (`npm run format`)

---

## 📦 Commit & PR

1. Create a new branch:

```bash
git checkout -b feat/your-feature-name
```

2. Commit clearly:

```bash
git commit -m "feat(docs): support for multi-schema response handling"
```

3. Push and open a PR to `main`.

Please include:

- A clear title and description of the change
- Screenshots or examples if it affects output or UI
- A link to related issues (e.g., `Closes #12`)

---

## 🙌 Thank You!

Your contributions help developers write better, cleaner documentation with less effort.  
Whether it’s a typo fix or a big feature — every bit counts 💙

Happy hacking!
