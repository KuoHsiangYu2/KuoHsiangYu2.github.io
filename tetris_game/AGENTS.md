# Repository Guidelines

## Project Structure & Module Organization

This is a static browser game built with HTML, CSS, and vanilla JavaScript. `index.html` is the entry point, `style.css` defines the layout, and `app.js` contains board initialization, movement, rotation, scoring, and game-over logic. The board uses DOM elements rather than canvas.

`images/` contains block textures and a gameplay GIF. Root-level scripts such as `check_dims.js`, `check_type.js`, and `extract_pixels.js` inspect PNG assets; `make_black.js` writes `images/black_block.png`. `test05.js` is an array exercise, not a test suite. `doc/` contains bundled FFmpeg documentation, not application documentation.

## Build, Test, and Development Commands

- Open `index.html` in a browser to play, or serve the root with a static preview server. No build step, backend, `npm start`, or `npm run dev` is configured.
- `npm ci`: install development dependencies from the lockfile.
- `node --check app.js`: check JavaScript syntax without running the game.
- `npm run lint`: run ESLint checks.
- `npm run lint:fix`: apply automatic lint fixes; review the resulting changes.
- `npm test`: currently prints a placeholder message and exits successfully; it does not validate gameplay.

## Coding Style & Naming Conventions

When creating or modifying HTML, CSS, or JavaScript files, use four ASCII spaces per indentation level. Never use Tab characters for indentation. This rule takes precedence over conflicting indentation settings in `.editorconfig` or existing files; see `AGENT.md`. Remove trailing whitespace and avoid unrelated reformatting. ESLint uses recommended JavaScript rules and requires semicolons and double-quoted strings.

Use camelCase for functions and variables, uppercase names for key constants, and descriptive names consistent with existing code, such as `currentPosition` and `displayShape`. Keep browser logic in `app.js` and Node-only asset utilities separate.

## Testing Guidelines

No automated testing framework, coverage threshold, or test-file naming convention is configured. For gameplay changes, manually check start/pause, arrow-key movement, rotation at boundaries, collisions, next-piece preview, line clearing, scoring, and game over. Run syntax and lint checks before submitting changes. Describe manual results explicitly; a successful `npm test` is not evidence of functional correctness.

## Commit & Pull Request Guidelines

This checkout has no Git repository metadata, so existing commit conventions cannot be verified. Use concise, imperative commit subjects describing the change. Keep pull requests focused, explain the behavior changed, link relevant issues when available, and report checks performed. Include screenshots or a short recording for visible gameplay or styling changes.

# 程式碼縮排規則

- 新增或修改 HTML、CSS、JavaScript（JS）檔案時，每一層縮排必須使用 4 個半形空格。
- 禁止使用 Tab 字元作為縮排。
- 若既有檔案或 `.editorconfig` 的縮排設定與此規則衝突，以本規則為準。
