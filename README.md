# GoSetup

A modern Terminal UI (TUI) for scaffolding Go backend projects with a complete, production-ready structure.

## Features

✨ **Interactive CLI Experience** - Beautiful TUI built with OpenTUI and React  
📁 **Complete Project Structure** - Pre-configured directories and files for professional Go projects  
🗄️ **Database Ready** - Includes PostgreSQL migrations and schemas  
🐳 **Docker Support** - Docker and docker-compose configurations included  
🔄 **Go Modules** - Automatic `go.mod` initialization and dependency management  
📍 **Current Directory Support** - Scaffold into existing directory with `.` as project name

## Installation

### Using npm (Global)

```bash
npm install -g gosetup
gosetup
```

### Using Bun (Global)

```bash
bun add -g gosetup
gosetup
```

## Usage

Run the command in your terminal:

```bash
gosetup
```

### Interactive Setup

1. Press **Enter** at the welcome screen
2. Enter your **GitHub username**
3. Enter your **project name** (or `.` to scaffold in current directory)
4. Wait for the project to be created
5. Navigate to your project and start coding!

### Example

```bash
$ gosetup
# Follow the prompts...
# Project "my-api" created successfully in ./my-api

$ cd my-api
$ go run main.go
```

### Scaffold in Current Directory

Use `.` as the project name to scaffold into your existing directory:

```bash
$ mkdir my-go-project
$ cd my-go-project
$ gosetup
# Enter: .
# Files will be created in current directory
```

## Project Structure

The generated project includes:

```
my-go-app/
├── main.go              # Entry point
├── go.mod               # Go module file
├── README.md            # Project documentation
├── .env.local           # Environment variables
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Multi-container setup with PostgreSQL
├── cmd/
│   └── my-go-app/       # Application entry point
├── internal/            # Private application code
│   ├── api/             # HTTP handlers
│   ├── app/             # Application logic
│   ├── middleware/      # HTTP middleware
│   ├── utils/           # Utility functions
│   ├── tokens/          # Token management
│   ├── routes/          # Route definitions
│   └── stores/          # Database stores
├── migrations/          # Database migrations (Goose)
│   ├── 00001_users.sql
│   └── 00002_tokens.sql
└── pkg/                 # Public packages
```

## Requirements

- **Go** 1.22+ ([Download](https://golang.org/dl))
- **Node.js/Bun** for installation via npm

## Quick Start After Generation

```bash
cd my-go-app

# Install dependencies
go mod download
go mod tidy

# Set up database (if using PostgreSQL)
docker-compose up -d

# Run migrations
goose -dir migrations postgres "$DB_URL" up

# Start the application
go run main.go
```

## Environment Variables

Create a `.env.local` file with:

```env
PORT=8080
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
DB_URL=postgres://user:password@localhost/dbname
TEST_DB_URL=postgres://user:password@localhost/test_dbname
PRODUCTION_DB_URL=postgres://user:password@production/dbname
```

## Development

### Build from Source

```bash
git clone https://github.com/divin3circle/gosetup.git
cd gosetup
bun install
bun run dev
```

### Build Standalone Binary

```bash
bun run build
./bin/gosetup
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## Repository

[https://github.com/divin3circle/gosetup](https://github.com/divin3circle/gosetup)
