# Getting Started

Welcome to the getting started page! Here is all you need to know to get this repo up and running on your local machine, as well as good collaborative coding practices.

## Contents

- [Setup for All Developers](#setup-for-all-developers)
- [Helpful commands](#helpful-commands)
- [Project Structure](#project-structure)

## Setup for all Developers

1. Clone this repository `git clone https://github.com/hack4impact-calpoly/lcslo-octagon-barn.git`
2. Run `npm i` at the root of the repository
3. Create a .env file and retrieve secrets from one of the tech leads
4. Install IDE Extensions
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
5. Enable format on save in your IDE
   1. Click the settings button in the bottom left  
      <img src="./images/vs-code-settings.png" alt="VSCode Settings 1" width="500"/>
   2. Search "formatter" and set your default formatter to Prettier
   3. Search "format on save" and click the checkbox
6. Familiarize yourself with [Helpful Commands](#helpful-commands), the [Project Structure](#project-structure), and the [steps for contributing](./contributing.md).

## Helpful commands

- `npm run dev`: Start your local development environment at [http://localhost:3000](http://localhost:3000)
- `npm run build`: Builds app for production
- `npm run lint`: make sure Prettier and ESLint pass
- `npm run lint:fix`: make sure Prettier and ESLint pass and try to automatically fix all issues (some ESLint issues must be resolved manually)
- `git stash`: Temporarily remove all local changes to a branch and save them. Good when you need to hop to another branch without committing your current code.
- `git stash apply`: Reapply most recent git stash.
- `git merge orgin/master`: Pull all changes from the main branch to yours, good for resolving merge conflicts.

## Project Structure

- [**.github**](/.github) Github Actions CI/CD and Issue/PR templates
- [**docs**](/docs) Documentation - Documentation that came with the template repository
- [**public**](/public) Assets for frontend [Read More](https://nextjs.org/docs/pages/building-your-application/optimizing/static-assets)
- [**src**](/src) All application code
  - [**app**](/src/app/) Frontend and API code
    - [**api**](/src/app/api) All API routes
    - [**components**](/src/app/components) All React components
    - [**/\***](/src/app/) App router routes for pages
    - [**styles**](/src/app/styles) All CSS files
  - [**database**](/src/database) MongoDB schemas and related files

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
