# ---- Build Stage ----
FROM node:20 AS builder

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
FROM node:20-alpine3.20

# Set working directory to web folder
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app .

# Expose the web port
EXPOSE 3000

# Start the server from the web directory
CMD cd apps/web && npm start