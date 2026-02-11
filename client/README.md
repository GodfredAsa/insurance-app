# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.19.

**Tailwind CSS** is configured. Global styles and Tailwind directives are in `src/styles.css`. Use Tailwind utility classes in your components (e.g. `class="text-xl font-bold"`).

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Troubleshooting `npm install`

### ENOTEMPTY / cleanup failures

If you see `ENOTEMPTY` or "Failed to remove some directories" during install, do a clean install:

```bash
rm -rf node_modules package-lock.json
npm install
```

### esbuild "Unknown system error -88" (macOS)

On macOS, the esbuild binary can be blocked by quarantine. If install fails at `esbuild/install.js` with error `-88`:

1. Let the failed install finish (so `node_modules` exists).
2. Clear quarantine on `node_modules`, then reinstall:

```bash
xattr -cr node_modules
npm install
```

Or run the one-liner fix script (see below).

### One-command fix (clean install + macOS quarantine fix)

From the `client` folder:

```bash
rm -rf node_modules package-lock.json && npm install && ([[ "$(uname)" == Darwin ]] && xattr -cr node_modules && npm install || true)
```

This does a clean install; on macOS it then clears quarantine and runs `npm install` again so esbuild’s postinstall can succeed.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
