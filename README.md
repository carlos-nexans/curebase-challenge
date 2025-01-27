# Curebase Technical Assessment - Sr. Engineer

[![PR Checks](https://github.com/cdgn-coding/curebase-challenge/actions/workflows/pr_checks.yml/badge.svg?branch=main)](https://github.com/cdgn-coding/curebase-challenge/actions/workflows/pr_checks.yml)

## Table of Contents

- [Introduction](#introduction)
- [Architectural Decisions](#architectural-decisions)
  - [Re-scaffolding with Turborepo](#re-scaffolding-with-turborepo)
  - [Frontend: Migrated to Next.js](#frontend-migrated-to-nextjs)
  - [Styled Components](#styled-components)
  - [Key Implementation Details](#key-implementation-details)
- [Running Instructions](#running-instructions)
  - [Using Docker](#using-docker)
  - [Development](#development)

## Scaffolding

```
.
├── apps
│   ├── api                 # NestJS backend application
│   └── web                 # Next.js frontend application
└── packages
    ├── ui                  # Shared UI components
    └── eslint-config       # Common ESLint configuration
```

## Architectural Decisions

### Re-scaffolding with Turborepo

I re-scaffolded the application using Turborepo for the following benefits:

- Organized Monorepo: Turborepo allows a clean separation of frontend, backend, and shared packages, fostering better modularity and scalability.

- Efficient Builds: It supports incremental builds and caching, resulting in faster development iterations and optimized CI/CD pipelines.

- Ease of Dependency Management: With clearly defined workspaces, managing shared dependencies is straightforward, reducing potential conflicts.

This decision improves maintainability and long-term scalability of the project.

### Frontend: Migrated to Next.js

I chose Next.js over Create React App (CRA) due to its extensibility, community support, and alignment with modern web development standards:

Key Advantages:

- Full-Stack Support: Next.js enables seamless server-side functionality within the same codebase, enhancing developer experience and productivity.

- Enhanced Security: Server-side Middleware can be used to handle CSRF protection, login flows, and session validation. In general, direct integration between frontend and backend ensures better control over sensitive operations.

- Performance Enhancements: Server Components improves percieved performance to the user. Streaming and Code Splitting allows for optimal performance and user experience.

- Adoption and Community: As noted in the State of JS survey, most of the React community has moved to metaframeworks. Next.js is the most widely adopted metaframework, ensuring better support, tooling, and resources. This migration ensures the application is built on a future-proof, flexible, and robust foundation.

### Backend: NestJS and GraphQL

I retained NestJS for the backend and GraphQL for API communication due to their alignment with modern backend requirements:

- NestJS provides a modular and scalable architecture, ideal for implementing complex business logic.

- GraphQL is well-suited for the application's needs, offering:

  - Flexible querying capabilities.

  - A strongly-typed schema, ensuring robust data validation and type safety.

This combination ensures a clean separation of business logic, better maintainability, and extensibility.

### Styled Components

I continued using Styled Components for styling the frontend, even though they do not currently support React Server Components. My rationale:

- Future-Proofing: Styled Components are likely to adopt server components support in the future, aligning with the React team's direction.

- Developer Experience: Styled Components offer a clean, intuitive syntax for creating scoped, dynamic styles.

By making this choice, the codebase remains consistent.

### Key Implementation Details

Frontend:

- Framework: Next.js for responsive and performant frontend development.

- Styling: Styled Components for modular and dynamic styling.

- Validation: Client-side form validations to ensure data integrity before API calls.

- Modular: Components are modular and reusable, ensuring a clean and maintainable codebase.

Backend:

- Framework: NestJS for building a scalable backend.

- GraphQL: Implemented resolvers for participants and trials.

- Validation: GraphQL schemas enforce type-safe API communication.

- Dockerization: Packaged the entire application in Docker for consistent and easy deployment.

## Running Instructions

### Using Docker

```bash
docker-compose up
```

Navigate to http://localhost:3000 to view the application.

Navigate to http://localhost:3001/graphql to view the GraphQL playground.

### Development


Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Navigate to http://localhost:3000 to view the application.

Navigate to http://localhost:3001/graphql to view the GraphQL playground.

## Testing

```bash
npm run test
```

## Linting

```bash
npm run lint
```
