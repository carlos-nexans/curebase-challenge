# ---- Build Stage ----
FROM node:20 AS builder

# Set working directory for the monorepo root
WORKDIR /app

# Copy entire monorepo
COPY . .

# Install all dependencies at root level
RUN npm install --frozen-lockfile

# Go to apps/api and run npx prisma generate
RUN npm run prisma

# Build the API project using Turborepo
RUN cd /app && npm run build --filter=api

# ---- Production Stage ----
FROM node:20-alpine3.20

# Set working directory to api folder
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app .

# Run prisma generate in apps/api
RUN npm run prisma

# Expose the API port
EXPOSE 3001

# Start the server from the api directory
CMD cd apps/api && npm start