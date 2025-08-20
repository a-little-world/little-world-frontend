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

### Testing Video Calls Locally

To test our in-app video calls locally you need to:
1) Add environment variables to `little-world-backend/envs/dev.env`:
```
DJ_LIVEKIT_API_KEY=REQUEST FROM TEAM
DJ_LIVEKIT_API_SECRET=REQUEST FROM TEAM
DJ_LIVEKIT_WEBHOOK_SECRET="secret"
DJ_LIVEKIT_URL="https://littleworld-development-4tq43oit.livekit.cloud"
```

2) Start the Backend server & Ngrok server

You will need to install ngrok and also create an account at https://ngrok.com/
When you have an ngrok account you can [create your own static domain](https://dashboard.ngrok.com/get-started/setup/macos). 
```
brew install ngrok // if you don't have it already
ngrok http --url=YOUR_STATIC_DOMAIN 80
```

3) Go to livekit development dashboard and enter the callback url:
https://YOUR_STATIC_DOMAIN.ngrok-free.app/api/livekit/webhook?secret=secret

Now when you run the video calls locally they should work!

// More Info needed on how to handle webhooks

## Branching Strategy

Use the following branching strategy to manage your work:

- **main**: The development branch. All merges into this branch should be through pull requests and must pass all tests.
- **prod**: The production branch. This represents what is currently deployed in production and contains the latest stable release.
- **feature/your-feature-name**: Feature-specific branches.
- **fix/the-issue**: branches for fixing bugs.
- **chore/the-chore**: branches for chores such as updating dependencies.

To create a new feature branch:

```bash
git checkout -b feature/your-feature-name main
```

## Release Process

### Why We Package This Frontend

This frontend application is packaged and published as an npm package because it's consumed as a webview within our React Native mobile application. This approach allows us to:

- **Maintain consistency**: Ensure the same UI/UX across web and mobile platforms
- **Rapid updates**: Deploy frontend changes without requiring mobile app store updates
- **Code sharing**: Reuse frontend components and logic in the mobile app
- **Independent deployment**: Update the frontend independently of the mobile app release cycle

**Related Repository**: [Little World React Native App](https://github.com/a-little-world/little-world-react-native)

### Release Workflow

Our release process is automated through GitHub Actions and follows this workflow:

1. **Development**: Work happens on feature branches and gets merged to `main`
2. **Testing**: Features are tested on the `main` branch
3. **Production Release**: When ready for production:
   - Create a Pull Request from `main` to `prod`
   - The workflow automatically analyzes version changes
   - PR comments show what will be published
   - Upon merge to `prod`:
     - Package is automatically published to npm (GitHub Package Registry)
     - GitHub release is created with changelog information
     - Mobile app can consume the updated package

### Web Deployment vs Package Release

**Important**: You can deploy changes to the web application without creating a new package release!

- **Web Deployment**: Merge any changes to `prod` to deploy to web (versions unchanged)
- **Package Release**: Only happens when you bump the version in `package.json`
- **Mobile App Updates**: Only receive updates when package versions change

This means you can:

- Deploy bug fixes, UI improvements, and features to web users immediately
- Control when mobile app users receive updates by managing package versions
- Keep web and mobile releases in sync or independent as needed

### Version Management

- **Version Bumping**: Bump the version in `package.json` before merging to `prod`
- **Automatic Publishing**: Only publishes when version numbers change
- **Release Tags**: GitHub releases are automatically tagged with date-based versioning (e.g., `v2024.01.15`)

### Using Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versioning and changelog generation:

#### Creating Changesets

When you make changes that should trigger a version bump:

```bash
npm run changeset
```

This will:

- Prompt you to select the type of change (patch, minor, major)
- Ask for a description of the changes
- Create a `.changeset/[random-name].md` file

#### Versioning the Package

When you're ready to release:

```bash
npm run version
```

This will:

- Read all the changesets
- Update the version in `package.json`
- Update the changelog
- Remove the processed changeset files

#### Change Types

- **patch**: Bug fixes and minor improvements (0.1.69 → 0.1.70)
- **minor**: New features (0.1.69 → 0.2.0)
- **major**: Breaking changes (0.1.69 → 1.0.0)

### Package Registry

Our package is published to the GitHub Package Registry under the `@a-little-world` scope:

- **Package Name**: `@a-little-world/little-world-frontend`
- **Registry**: `https://npm.pkg.github.com`
- **Access**: Requires authentication with `PACKAGE_PUBLISH_TOKEN`

### Release Checklist

Before merging a PR to `prod`:

**For Web Deployment Only (no package release):**

- [ ] All tests pass
- [ ] Code review completed
- [ ] No version changes in `package.json`

**For Package Release (mobile app update):**

- [ ] Changesets created for all changes (`npm run changeset`)
- [ ] Package versioned (`npm run version`)
- [ ] All tests pass
- [ ] Code review completed
- [ ] PR shows version change in the automated comment

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

2. For production releases, create a PR from `main` to `prod`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b release/prod-$(date +%Y%m%d)
   # Bump version in package.json
   git add package.json
   git commit -m "chore: bump version to X.X.X"
   git push origin release/prod-$(date +%Y%m%d)
   # Create PR from this branch to prod
   ```

3. Run all tests and linters:

   ```bash
   WIP
   ```

4. Push your branch to GitHub:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a pull request against the `main` branch on GitHub.

6. For production releases, open a pull request against the `prod` branch on GitHub.

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
