[![CircleCI](https://circleci.com/gh/sbardian/github-repo-pull-request/tree/develop.svg?style=shield)](https://circleci.com/gh/sbardian/github-repo-pull-request/tree/develop)

## Github Repository Pull Requests

A Chrome extension to display pull requests for a repository.

## Workflow

### Testing:

- Build React App

```
yarn build
```

This will place copies of the built react app (dropdown interface) in public/ and build/ folders

- Run extension in test

```
web-ext run --verbose
```

### Deploy

- Bump version in manifest (build/) and package.json

- Build React App

```
yarn build
```

- Build extension: from build/ folder

```
web-ext build --overwrite-dest
```

- Upload to https://addons.mozilla.org
