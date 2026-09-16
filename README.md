# Storyblok JSON Validator Field Plugin

A Storyblok field plugin built with **React** that validates JSON content in real time. Uses the `useFieldPlugin` hook with `validateContent` to flag invalid JSON before it's saved to the Visual Editor.

## Features

- Real-time JSON validation with color-coded feedback (✓ Valid / ✗ Invalid)
- Descriptive parser error messages
- One-click Format button for pretty-printing
- Built with React + TypeScript + Vite
- Uses `validateContent` from `@storyblok/field-plugin/react`

## Quick Start

```bash
git clone https://github.com/elmikegonzalez/storyblok-json-validator-plugin.git
cd storyblok-json-validator-plugin
npm install
```

### Local Development

The Storyblok Sandbox runs on HTTPS, so your local dev server needs HTTPS too. Generate local certs with [mkcert](https://github.com/FiloSottile/mkcert):

```bash
mkcert -install
mkdir .certs
mkcert -key-file .certs/key.pem -cert-file .certs/cert.pem localhost
```

Then start the dev server:

```bash
npm run dev
```

Then open the [Storyblok Field Plugin Sandbox](https://plugin-sandbox.storyblok.com/field-plugin/). In the **Field Plugin URL** input, replace the default value with:

```
https://localhost:8080/
```

> ⚠️ Make sure the URL starts with `https://`, not `http://`. The Sandbox runs on HTTPS and won't load an HTTP iframe.

Click the refresh icon (🔄) next to the input, and the plugin will load in the Preview panel. You can now type JSON and see the validation in real time.

### Deploy

Deploy the field plugin with the CLI. Issue a [personal access token](https://app.storyblok.com/#/me/account?tab=token) with **"Full user permission"** enabled, rename `.env.local.example` to `.env.local`, open the file, set the value of `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and run:

```bash
npm run deploy
```

> **Note:** A scoped token (even with all scopes selected) will return `403 — "This endpoint does not support this token type"`. The field plugin deploy endpoint requires the **"Full user permission (no scope/space restriction)"** toggle enabled on the PAT.

## How `validateContent` Works

The core of the plugin is the `validateContent` option passed to `useFieldPlugin`:

```tsx
const plugin = useFieldPlugin({
  validateContent: (content: unknown) => {
    if (typeof content === 'string') {
      try {
        JSON.parse(content)
        return { content }
      } catch {
        return { content, error: 'Invalid JSON' }
      }
    }
    return { content: '' }
  },
})
```

- Return `{ content }` when valid — content is sent to the Visual Editor
- Return `{ content, error }` when invalid — the error is surfaced to the editor

## Resources

- [Building a Field Plugin with React (Tutorial)](https://www.storyblok.com/tp/building-a-folder-select-field-using-the-field-plugin-cli)
- [Field Plugin SDK docs (`useFieldPlugin` + `validateContent`)](https://www.storyblok.com/docs/libraries/js/field-plugin-sdk)
- [Development & Deploy guide](https://www.storyblok.com/docs/plugins/field-plugins/development)
- [Field Plugin SDK v1 announcement](https://dev.to/storyblok/field-plugin-sdk-v1-stable-release-30jn)
