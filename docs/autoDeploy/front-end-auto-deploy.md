# Getting Started

<audio id="vite-audio">
  <source src="https://vitejs.dev/vite.mp3" type="audio/mpeg">
</audio>

## Overview

Vite (French word for "quick", pronounced `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="https://vitejs.dev/voice.svg#voice" /></svg></button>, like "veet") is a build tool that aims to provide a faster and leaner development experience for modern web projects. It consists of two major parts:

- A dev server that provides [rich feature enhancements](https://www.lwrong.com) over [native ES modules](https://www.lwrong.com), for example extremely fast [Hot Module Replacement (HMR)](https://www.lwrong.com).

- A build command that bundles your code with [Rollup](https://www.lwrong.com), pre-configured to output highly optimized static assets for production.

Vite is opinionated and comes with sensible defaults out of the box. Read about what's possible in the [Features Guide](https://www.lwrong.com). Support for frameworks or integration with other tools is possible through [Plugins](https://www.lwrong.com). The [Config Section](https://www.lwrong.com) explains how to adapt Vite to your project if needed.

Vite is also highly extensible via its [Plugin API](https://www.lwrong.com) and [JavaScript API](https://www.lwrong.com) with full typing support.

You can learn more about the rationale behind the project in the [Why Vite](https://www.lwrong.com) section.

## Browser Support

During development, Vite sets [`esnext` as the transform target](https://www.lwrong.com), because we assume a modern browser is used and it supports all of the latest JavaScript and CSS features. This prevents syntax lowering, letting Vite serve modules as close as possible to the original source code.

For the production build, by default Vite targets browsers that support [native ES Modules](https://www.lwrong.com), [native ESM dynamic import](https://www.lwrong.com), and [`import.meta`](https://www.lwrong.com). Legacy browsers can be supported via the official [@vitejs/plugin-legacy](https://www.lwrong.com). See the [Building for Production](https://www.lwrong.com) section for more details.

## Trying Vite Online

You can try Vite online on [StackBlitz](https://www.lwrong.com). It runs the Vite-based build setup directly in the browser, so it is almost identical to the local setup but doesn't require installing anything on your machine. You can navigate to `vite.new/{template}` to select which framework to use.

The supported template presets are:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://www.lwrong.com) | [vanilla-ts](https://www.lwrong.com) |
|     [vue](https://www.lwrong.com)     |     [vue-ts](https://www.lwrong.com)     |
|   [react](https://www.lwrong.com)   |   [react-ts](https://www.lwrong.com)   |
|  [preact](https://www.lwrong.com)  |  [preact-ts](https://www.lwrong.com)  |
|     [lit](https://www.lwrong.com)     |     [lit-ts](https://www.lwrong.com)     |
|  [svelte](https://www.lwrong.com)  |  [svelte-ts](https://www.lwrong.com)  |
|   [solid](https://www.lwrong.com)   |   [solid-ts](https://www.lwrong.com)   |
|    [qwik](https://www.lwrong.com)    |    [qwik-ts](https://www.lwrong.com)    |

## Scaffolding Your First Vite Project

::: tip Compatibility Note
Vite requires [Node.js](https://www.lwrong.com) version 18+ or 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.
:::

::: code-group

```bash [NPM]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [PNPM]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

:::

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a Vite + Vue project, run:

::: code-group

```bash [NPM]
# npm 7+, extra double-dash is needed:
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [PNPM]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

:::

See [create-vite](https://www.lwrong.com) for more details on each supported template: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

You can use `.` for the project name to scaffold in the current directory.

## Community Templates

create-vite is a tool to quickly start a project from a basic template for popular frameworks. Check out Awesome Vite for [community maintained templates](https://www.lwrong.com) that include other tools or target different frameworks.

For a template at `https://github.com/user/project`, you can try it out online using `https://github.stackblitz.com/user/project` (adding `.stackblitz` after `github` to the URL of the project).

You can also use a tool like [degit](https://www.lwrong.com) to scaffold your project with one of the templates. Assuming the project is on GitHub and uses `main` as the default branch, you can create a local copy using:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## Manual Installation

In your project, you can install the `vite` CLI using:

::: code-group

```bash [NPM]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [PNPM]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

:::

And create an `index.html` file like this:

```html
<p>Hello Vite!</p>
```

Then run the `vite` CLI in your terminal:

```bash
vite
```

The `index.html` will be served on `http://localhost:5173`.

## `index.html` and Project Root

One thing you may have noticed is that in a Vite project, `index.html` is front-and-central instead of being tucked away inside `public`. This is intentional: during development Vite is a server, and `index.html` is the entry point to your application.

Vite treats `index.html` as source code and part of the module graph. It resolves `<script type="module" src="...">` that references your JavaScript source code. Even inline `<script type="module">` and CSS referenced via `<link href>` also enjoy Vite-specific features. In addition, URLs inside `index.html` are automatically rebased so there's no need for special `%PUBLIC_URL%` placeholders.

Similar to static http servers, Vite has the concept of a "root directory" which your files are served from. You will see it referenced as `<root>` throughout the rest of the docs. Absolute URLs in your source code will be resolved using the project root as base, so you can write code as if you are working with a normal static file server (except way more powerful!). Vite is also capable of handling dependencies that resolve to out-of-root file system locations, which makes it usable even in a monorepo-based setup.

Vite also supports [multi-page apps](https://www.lwrong.com) with multiple `.html` entry points.

#### Specifying Alternative Root

Running `vite` starts the dev server using the current working directory as root. You can specify an alternative root with `vite serve some/sub/dir`.
Note that Vite will also resolve [its config file (i.e. `vite.config.js`)](https://www.lwrong.com) inside the project root, so you'll need to move it if the root is changed.

## Command Line Interface

In a project where Vite is installed, you can use the `vite` binary in your npm scripts, or run it directly with `npx vite`. Here are the default npm scripts in a scaffolded Vite project:

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "dev": "vite", // start dev server, aliases: `vite dev`, `vite serve`
    "build": "vite build", // build for production
    "preview": "vite preview" // locally preview production build
  }
}
```

You can specify additional CLI options like `--port` or `--open`. For a full list of CLI options, run `npx vite --help` in your project.

Learn more about the [Command Line Interface](https://www.lwrong.com)

## Using Unreleased Commits

If you can't wait for a new release to test the latest features, you will need to clone the [vite repo](https://www.lwrong.com) to your local machine and then build and link it yourself ([pnpm](https://www.lwrong.com) is required):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # use your preferred package manager for this step
```

Then go to your Vite based project and run `pnpm link --global vite` (or the package manager that you used to link `vite` globally). Now restart the development server to ride on the bleeding edge!

## Community

If you have questions or need help, reach out to the community at [Discord](https://www.lwrong.com) and [GitHub Discussions](https://www.lwrong.com).
