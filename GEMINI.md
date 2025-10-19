# Project Overview

This is a [Next.js](https://nextjs.org) project for GPMecatrônica's card system. It's a web application for managing and displaying cards with rules, warnings, and links. The project uses a PostgreSQL database and [Kysely](https://kysely.dev/) for queries and migrations. The API is built with [oRPC](https://orpc.dev/).

# What is GPMecatrônica
GPMecatrônica is a research group in Instituto Federal de Educação Ciência e Tecnologia de Rondônia focused in mecatronics, development, robotics and iot devices.

## Building and Running

The project uses [Nix](https://nixos.org/) with [flakes](https://nixos.wiki/wiki/Flakes) and `direnv` for a reproducible development environment.

**Key commands:**

*   **Start development services (Next.js server and PostgreSQL):**
    ```bash
    nix run .#development
    ```
*   **Run database migrations:**
    ```bash
    npx kysely-ctl migrate:latest
    ```
*   **Create a new migration:**
    ```bash
    npx kysely-ctl migrate make <migration_name>
    ```
*   **Run the development server:**
    ```bash
    npm run dev
    ```
*   **Build the project:**
    ```bash
    npm run build
    ```
*   **Start the production server:**
    ```bash
    npm run start
    ```
*   **Lint the project:**
    ```bash
    npm run lint
    ```

## Development Conventions

*   **API:** The project uses [oRPC](https://orpc.dev/) for its API. The API routes are defined in `src/app/rpc/[[...route]]/`.
*   **Database:** Database interactions are handled by [Kysely](https://kysely.dev/). Migrations are located in `src/migrations`.
*   **Authentication:** Authentication is handled by `next-auth`. The configuration is in `src/lib/auth.ts`. The API has a `signup` route in `src/app/rpc/[[...route]]/auth.ts`.
*   **Styling:** The project uses [Tailwind CSS](https://tailwindcss.com/).
*   **Components:** Reusable components are located in `src/components/`.
*   **ShadCN/Ui:** The project uses [ShadCN](https://ui.shadcn.com/) for base components located in `src/components/ui`.
*   **Validation:** Input validation is done using [Joi](https://joi.dev/) and is defined in `src/lib/validators.ts`.
