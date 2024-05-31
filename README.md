# Little World Frontend

Thank you for your interest in contributing to our project! We value your effort and want to make the contribution process as smooth as possible. This guide will help you understand our workflow, coding standards, and best practices to ensure that your contributions are aligned with our project's goals and maintain high code quality.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed (v14.x or higher)

### Fork and Clone the Repository

1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine:
   ```bash
   gh repo clone a-little-world/little-world-frontend
   cd little-world-frontend
   ```

### Installing Dependencies

Install the necessary dependencies using Yarn:
```bash
npm install
```

### Starting the local server
#### Local dev with remote API server

```bash
npm run dev
./schrodingers-nginx.sh
```

## Branching Strategy

Use the following branching strategy to manage your work:

- **main**: The stable branch. All merges into this branch should be through pull requests and must pass all tests.
- **feature/your-feature-name**: Feature-specific branches.
- **fix/the-issue**: branches for fixing bugs.
- **chore/the-chore**: branches for chores such as updating dependencies.

To create a new feature branch:
```bash
git checkout -b feature/your-feature-name develop
```

## Coding Standards

### General Guidelines

- **TypeScript**: All new files must be written in TypeScript.
- **Code Style**: Follow the [Airbnb JavaScript/React style guide](https://github.com/airbnb/javascript/tree/master/react) with ESLint for linting.
- **Prettier**: Use Prettier for code formatting. Ensure your code is formatted before committing:
  ```
  npm format
  ```

### React and TypeScript

- Use function components and React hooks.
- Define PropTypes using TypeScript interfaces.
- Avoid using `any` type. Use specific types or generics.

### Styled Components

We use Styled Components for styling. Benefits of Styled Components include:

- **Scoped Styling**: CSS is scoped to the component, avoiding global namespace pollution.
- **Dynamic Styling**: Use props to dynamically style components.
- **Enhanced CSS**: Utilize the full power of CSS in JS, including nesting and autoprefixing.

For more details, refer to the [Styled Components documentation](https://styled-components.com/docs).

### Design System

Our project utilizes a custom Design System library that includes reusable components and design tokens. Adhere to the following:

- **Reusable Components**: Use components from our Design System library wherever possible.
- **Design Tokens**: Follow the design tokens defined in the Design System for consistent theming and styling.

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages. This helps in understanding the history and allows for better automation.

Example of a commit message:
```
feat(Button): add primary variant

Added a primary variant to the Button component in the Design System.
```

## Pull Request Process

1. Ensure your feature branch is up to date with `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-feature-name
   git rebase main
   ```

2. Run all tests and linters:
   ```bash
   WIP
   ```

3. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a pull request against the `main` branch on GitHub.

### Pull Request Checklist

- Ensure your code passes all tests and lint checks.
- Add or update tests as necessary.
- Update documentation if applicable.
- Include screenshots or GIFs if your changes include UI modifications.
- Request a review from at least one team member.

## Running Tests

We use Jest for testing. To run tests:
```bash
npm test
```

## Code Review

All contributions are reviewed by a team member. Feedback may be provided, and changes might be requested. Ensure you address the feedback promptly and update your pull request accordingly.

## Conclusion

Thank you for taking the time to read our contributing guide. As a charitable organisation we really appreciate your effort and your contributions are extremely valuable to us. If you have any questions or need further assistance, feel free to open an issue or contact a team member.

Happy coding!

---

By following this guide, we can maintain a high standard of code quality and ensure a consistent and efficient development process. Thank you for contributing!
