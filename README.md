# OurYard Demo

## Introduction

Build more houses!

## Tech Stack Overview

- **Node.js**: A JavaScript runtime that allows us to run JavaScript on the server.
- **Express**: A web application framework for Node.js, used to build our backend API.
- **React**: A JavaScript library for building user interfaces, used for our frontend.
- **Vite**: A build tool that provides a faster and leaner development experience for web projects.
- **Ant Design (antd)**: A design system for enterprise-level products, providing a set of high-quality React components.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript, used throughout our project for better code quality and developer experience.
- **Yarn**: A package manager that helps manage our project dependencies.

## Setup

### Prerequisites

1. **Node Version Manager (nvm)**:
   NVM allows you to install and switch between different versions of Node.js.

   - For macOS and Linux:
     ```
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
     ```
   - For Windows:
     Download and install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases

2. **Node.js**:
   After installing nvm, install and use the correct Node.js version:
   ```
   nvm install 20.18.0
   nvm use 20.18.0
   ```

3. **Yarn**:
   Install Yarn globally:
   ```
   npm install -g yarn
   ```

### Project Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ouryard-demo.git
   cd ouryard-demo
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Development

### Running the Application

To start both the frontend and backend in development mode:

```
yarn dev
```

This command will:
- Start the Vite development server for the frontend (usually at http://localhost:5173)
- Start the Express backend server (at http://localhost:3001)

### Frontend Development

The frontend uses hot reloading, which means most changes you make to the frontend code will be immediately reflected in the browser without needing to refresh the page.

To work solely on the frontend:

```
yarn dev:frontend
```

Key frontend files:
- `src/client/main.tsx`: The entry point of the React application
- `src/client/App.tsx`: The main React component

### Backend Development

To work solely on the backend:

```
yarn dev:backend
```

Key backend files:
- `src/server.ts`: The Express server setup and API routes

The backend also uses hot reloading, so changes to the server code will automatically restart the server.

## Building for Production

To create a production build:

```
yarn build
```

This will create optimized frontend assets in the `dist` folder and compile the backend TypeScript code.

To run the production build:

```
yarn start
```

## Docker

A Dockerfile is provided to containerize the application. To build and run the Docker image:

```
docker build -t ouryard-demo .
docker run -p 3001:3001 ouryard-demo
```

## Conclusion

This project provides a solid foundation for full-stack web development. As you become more comfortable with these technologies, you can expand the application by adding more features to both the frontend and backend.

Happy coding!
