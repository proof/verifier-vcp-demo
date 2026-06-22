# list available recipes
default:
    @just --list

# builds the project
build:
    yarn run build

# starts the dev server
dev:
    yarn run dev

# formats the code
format:
    yarn run format

# installs the dependencies
alias i := install
install:
    yarn install

# checks the code for linting errors
lint:
    yarn run lint
