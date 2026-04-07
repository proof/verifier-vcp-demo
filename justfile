# list available recipes
default:
    @just --list

# builds the project
build:
    npm run build

# starts the dev server
dev:
    npm run dev

# formats the code
format:
    npm run format

# installs the dependencies
alias i := install
install:
    npm ci

# checks the code for linting errors
lint:
    npm run lint
