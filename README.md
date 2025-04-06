
# tsj-cli

**tsj-cli** is a lightweight CLI tool that generates TypeScript interfaces or type aliases from a JSON file.

📦 NPM: [`tsj-cli`](https://www.npmjs.com/package/tsj-cli)  
💻 GitHub: [iaseth/tsj-cli](https://github.com/iaseth/tsj-cli)

## ✨ Features

- Generates TypeScript `interface` or `type` from JSON
- Supports custom indentation: 2 spaces (default), 4 spaces, or tabs
- Simple command-line usage
- Minimal and dependency-free output

## 🚀 Installation

```bash
npm i -g tsj-cli@latest
```

## 🛠 Usage

```bash
tsj <paths/to/file.json> [--type | --interface] [--tabs | --spaces]
```

### Examples

```bash
tsj user.json                     # default: interface, 2 spaces
tsj user.json --type             # generates a type alias
tsj user.json --spaces           # uses 4 spaces for indentation
tsj user.json --tabs             # uses tabs instead
tsj user.json --type --tabs      # type alias with tab indentation
```

### Input (`user.json`)

```json
{
  "id": 1,
  "name": "Alice",
  "isAdmin": false,
  "tags": ["dev", "ts"],
  "profile": {
    "age": 30,
    "location": "Earth"
  }
}
```

### Output (`interface`)

```ts
interface User {
  id: number;
  name: string;
  isAdmin: boolean;
  tags: string[];
  profile: {
    age: number;
    location: string;
  };
}
```

## 📁 Project Structure

```bash
tsj-cli/
├── src/             # Source code (written in TypeScript)
├── dist/            # Transpiled JavaScript output
├── package.json
├── tsconfig.json
├── .gitignore
├── .npmignore
└── README.md
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test locally
ts-node src/index.ts data.json --type --tabs

# Link globally for local use
npm link
tsj data.json --interface
```

## 📝 License

MIT © [iaseth](https://github.com/iaseth)
