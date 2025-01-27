# ---- Build Stage ----
FROM node:22 AS builder

# Add build argument
ARG NEXT_PUBLIC_GRAPHQL_URL

# Set environment variable during build
ENV NEXT_PUBLIC_GRAPHQL_URL=$NEXT_PUBLIC_GRAPHQL_URL

# Set working directory for the monorepo root
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install all dependencies at root level
RUN npm install --frozen-lockfile

# Run prisma generate in apps/api
RUN npm run prisma

# Build the web project using Turborepo
RUN npm run build --filter=web

# ---- Production Stage ----
FROM node:22-alpine3.20

# Make sure to pass the env variable to the production stage as well
ARG NEXT_PUBLIC_GRAPHQL_URL
ENV NEXT_PUBLIC_GRAPHQL_URL=$NEXT_PUBLIC_GRAPHQL_URL

# Set working directory to web folder
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app .

# Expose the web port
EXPOSE 3000

# Start the server from the web directory
CMD cd apps/web && npm start