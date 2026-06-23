# Amharic DBpedia Website

Frontend workspace for the Amharic DBpedia chapter website.

This folder contains the browser-facing project only:

- `apps/web/`: Vite-powered vanilla TypeScript website.
- `packages/core/`: typed RDF, IRI, SPARQL, and graph helpers.
- `packages/content/`: multilingual chapter content and query examples.

Backend automation, extraction scripts, runtime data folders, and backend
documentation now live in the sibling `../agentic-dbpedia/` folder.

## Prerequisites

- Node.js 22+
- pnpm 10+

## Run Locally

Install frontend dependencies:

```bash
just setup
```

Run the website:

```bash
just dev
```

Open: <http://127.0.0.1:5174>

The frontend can call a separately running backend by setting
`VITE_AMDB_API_BASE`.

## Verification

```bash
just check
```

Use `just --list` for individual frontend commands.

## Git Hooks And CI

`pnpm install` configures Husky hooks:

- `pre-commit` runs frontend formatting and lint checks.
- `pre-push` runs frontend typechecking, tests, and build.

GitHub Actions in this folder run frontend CI, PR metadata validation, and
GitHub Pages deployment.
