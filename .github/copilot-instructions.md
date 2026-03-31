# Copilot Instructions For This Repository

## Project Snapshot

- This repository is an Angular 21 application. Treat Angular 21 as the source of truth even if older generated text appears elsewhere in the repo.
- The UI style is based on Angular Material and Angular CDK. Prefer Material components, layout patterns, dialogs, and form controls over custom non-Material UI.
- The app is a todo management UI with current and archived items. It talks to a backend on `http://localhost:8080` through `/api/todo` and `/api/metadata`.

## Angular Version Guardrails

- Use Angular 21 patterns and APIs.
- Do not drift into pre-standalone Angular patterns.
- Do not introduce `NgModule`-based feature wiring unless the user explicitly asks for it.
- This codebase is using standalone Angular with `bootstrapApplication(...)`, `ApplicationConfig`, `provideRouter(...)`, and `provideHttpClient(...)`.
- In this Angular 21 codebase, standalone components may omit `standalone: true`; do not treat that omission as an error.
- Prefer component-level `imports` arrays and route definitions in `src/app/app.routes.ts`.
- Prefer `inject(...)` for dependency injection to match the existing codebase.
- Prefer modern Angular template control flow such as `@if` and `@for` when adding new template logic, unless a specific Angular Material directive requires its own structural syntax.

## UI And Styling Expectations

- Preserve the Angular Material look and feel.
- Prefer Angular Material 21 components such as `MatDialog`, `MatFormField`, `MatInput`, `MatSelect`, `MatTable`, `MatToolbar`, `MatSidenav`, `MatCard`, `MatCheckbox`, `MatSlideToggle`, and related CDK helpers when building UI.
- The app already includes the Material prebuilt theme `@angular/material/prebuilt-themes/cyan-orange.css`; keep new UI compatible with that theme.
- Use SCSS for component styling and follow the existing `styleUrl` pattern in component decorators.
- Keep layouts practical and consistent with the current app shell instead of proposing a separate design system or a custom CSS-heavy redesign.
- Keep the typography and spacing compatible with the existing Material-based shell.

## Repository Conventions

- Main bootstrap is in `src/main.ts`.
- Global providers live in `src/app/app.config.ts`.
- Top-level routes live in `src/app/app.routes.ts`.
- Pages live under `src/app/pages`.
- Reusable UI pieces live under `src/app/components`.
- Services live under `src/app/services`.
- Shared interfaces live under `src/app/interfaces`.
- Barrel exports are used via `index.ts` files. If you add a new page, component, service, or interface that should be shared, update the relevant barrel file.
- Use the existing selector prefix `app`.

## Component And Data Patterns

- Standalone components are the norm in this repo.
- Pages typically orchestrate dialogs and data refresh behavior.
- Reusable presentation and interaction logic is pushed into shared components such as `BaseTodoItemsComponent`.
- Services use `HttpClient` plus RxJS `Observable`s for backend communication.
- Dialogs use Angular Material dialog patterns and typed reactive forms.
- Keep new code aligned with the existing simple service-driven architecture; do not introduce a state library unless explicitly requested.
- Do not assume `src/environments` exists or introduce `environment.ts` files unless the user asks for that refactor.

## Testing And Quality

- Unit tests are colocated as `*.spec.ts` files and use Angular `TestBed`.
- For standalone component tests, import the component directly in `TestBed.configureTestingModule(...)`.
- HTTP tests use `provideHttpClient()` and `provideHttpClientTesting()`.
- End-to-end coverage uses Cypress under `cypress/`.
- Before finishing substantial code changes, prefer these checks when relevant:
  - `npm run lint`
  - `npm run test:ci`
  - `npm run test:cypress`

## Formatting And Tooling

- Node and npm versions are pinned in `package.json` and `.nvmrc`; the repo expects Node 24 and npm 11.
- Prettier is configured with:
  - single quotes
  - `printWidth` 120
  - Angular template parsing for `*.component.html`
- ESLint is configured with `angular-eslint`, `typescript-eslint`, `eslint-plugin-import`, `eslint-plugin-depend`, Prettier integration, and Cypress rules.
- Keep import ordering and selector naming compliant with the existing ESLint rules.

## When Generating Code

- Favor small, targeted changes that fit the current project structure.
- Reuse Angular Material and existing shared components before creating new custom patterns.
- Match the current file organization and naming conventions.
- If adding routes, wire them through `src/app/app.routes.ts`.
- If adding reusable symbols, update the nearest `index.ts` barrel export.
- If adding forms, prefer typed reactive forms consistent with the dialog components already in the repo.
- If adding HTTP-backed behavior, put it in a service rather than directly inside templates.
