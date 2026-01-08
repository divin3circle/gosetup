import type { IDirectory, IFile } from "./types";

const envLocalFile: IFile = {
  name: ".env.local",
  content: `# Environment variables
    PORT=
    POSTGRES_DB=
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    DB_URL=
    TEST_DB_URL=
    PRODUCTION_DB_URL=
`,
};

const gitignoreFile: IFile = {
  name: ".gitignore",
  content: `# Add more as needed
  /database
  ./database`,
};

const readmeFile: IFile = {
  name: "README.md",
  content: `# Go Setup Project
  This is a Go project scaffolded using Go Setup.
  
  ## Setup Instructions
  1. Ensure you have Go installed on your machine.
  2. Navigate to the project directory.
  3. Run \`go mod tidy\` to install dependencies.
  
  ## Project Structure
  - \`internal/\`: Contains internal application code.
  - \`migrations/\`: Database migration files.
  
  ## Usage
  - To run the application, use \`go run main.go\`.
  
  ## License
  This project is licensed under the MIT License.
`,
};

const mainGoFile: IFile = {
  name: "main.go",
  content: `package main
  import "fmt"

    func main() {
        fmt.Println("Hello, Go Setup!")
    }
`,
};

const dockerfile: IFile = {
  name: "Dockerfile",
  content: `# Use the official Golang image as a base image
    # Build stage
    FROM golang:1.24-alpine AS builder

    WORKDIR /app

    # Copy go mod files
    COPY go.mod go.sum ./
    RUN go mod download

    # Copy source code
    COPY . .

    # Build the application
    RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

    # Production stage
    FROM alpine:latest

    RUN apk --no-cache add ca-certificates

    WORKDIR /root/

    # Copy the binary from builder
    COPY --from=builder /app/main .
    COPY --from=builder /app/migrations ./migrations

    EXPOSE 8080

    CMD ["./main"]
`,
};

const dockerComposeFile: IFile = {
  name: "docker-compose.yml",
  content: `
version: "3.8"

services:
  db:
    container_name: "db"
    image: postgres:12.4-alpine
    volumes:
      - "./database/postgres-data:/var/lib/postgresql/data:rw"
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    restart: unless-stopped
  test_db:
    container_name: "test_db"
    image: postgres:12.4-alpine
    volumes:
      - "./database/postgres-test-data:/var/lib/postgresql/data:rw"
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    restart: unless-stopped
    `,
};

const userHandlerFile: IFile = {
  name: "user_handler.go",
  content: `package api`,
};

const tokenHandlerFile: IFile = {
  name: "token_handler.go",
  content: `package api`,
};

const appFile: IFile = {
  name: "app.go",
  content: `package app`,
};

const middlewareFile: IFile = {
  name: "middleware.go",
  content: `package middleware`,
};

const utilsFile: IFile = {
  name: "utils.go",
  content: `package utils`,
};

const tokenFile: IFile = {
  name: "token.go",
  content: `package tokens`,
};

const routesFile: IFile = {
  name: "routes.go",
  content: `package routes`,
};

const storeFile: IFile = {
  name: "db.go",
  content: `package stores`,
};
const userStoreFile: IFile = {
  name: "user_store.go",
  content: `package stores`,
};
const tokenStoreFile: IFile = {
  name: "token_store.go",
  content: `package stores`,
};

const userMigrationFile: IFile = {
  name: "00001_users.sql",
  content: `
-- +goose Up
-- +goose StatementBegin

-- Enable UUID extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE  IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50),
    mobile_number VARCHAR(13),
    hashed_password VARCHAR(255),
    account_id VARCHAR(100),
    profile_image_url VARCHAR(2048),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
`,
};

const tokenMigrationFile: IFile = {
  name: "00002_tokens.sql",
  content: `
-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS tokens (
    hash BYTEA PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    scope VARCHAR(255) NOT NULL
)
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE tokens;
-- +goose StatementEnd
  `,
};

const fsMigrationFile: IFile = {
  name: "fs.go",
  content: `package migrations

import (
	"embed"
)

//go:embed *.sql
var FS embed.FS`,
};

const internalDirectories: IDirectory[] = [
  {
    name: "api",
    files: [userHandlerFile, tokenHandlerFile],
  },
  {
    name: "app",
    files: [appFile],
  },
  {
    name: "middleware",
    files: [middlewareFile],
  },
  {
    name: "utils",
    files: [utilsFile],
  },
  {
    name: "tokens",
    files: [tokenFile],
  },
  {
    name: "routes",
    files: [routesFile],
  },
  {
    name: "stores",
    files: [storeFile, userStoreFile, tokenStoreFile],
  },
];

const internalDirectory: IDirectory = {
  name: "internal",
  subdirectories: internalDirectories,
  files: [],
};

const migrationsDirectory: IDirectory = {
  name: "migrations",
  files: [fsMigrationFile, userMigrationFile, tokenMigrationFile],
};

const RootFiles: IFile[] = [
  readmeFile,
  gitignoreFile,
  mainGoFile,
  envLocalFile,
  dockerfile,
  dockerComposeFile,
];

export const RootDirectory: IDirectory = {
  name: ".",
  subdirectories: [migrationsDirectory, internalDirectory],
  files: RootFiles,
};
