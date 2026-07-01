# Kipu Frontend - Open Source Construction Management Platform

**[Kipu](https://github.com/kipu-os) is a collaborative, open-source Construction Management Platform designed to streamline project planning, execution, and monitoring.**

This repository contains the complete frontend web application for Kipu, built with Angular. It is designed to connect to the Kipu REST API and features a mock server for local development.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20.x or higher
- **npm** 11.x or higher

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/kipu-os/frontend-kipu.git
    cd frontend-kipu/kipu-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run with Mock API (Local Development)**
    To run the frontend locally without needing a live backend, you can run the mock API alongside the Angular dev server.
    
    Open two terminals inside the `kipu-frontend` directory:
    
    *   **Terminal 1 (Mock API Server):**
        ```bash
        npm run mock
        ```
        *Starts a json-server on `http://localhost:3000` with mock endpoints.*

    *   **Terminal 2 (Angular Dev Server):**
        ```bash
        npm start
        ```
        *Starts Angular at `http://localhost:4200` and proxies API requests to the mock server.*

4.  **Connect to a Live Deployed Backend**
    To test or run locally against a live backend (like `https://kipu-api-os.duckdns.org`), you can update the API hosts in [environment.development.ts](file:///e:/Git%20projects/Open%20Source/frontend-kipu/kipu-frontend/src/environments/environment.development.ts).

---

## 🛠️ Commands

| Command | Description |
|---------|-------------|
| `npm start` | Starts the local dev server on `http://localhost:4200` |
| `npm run mock` | Starts the `json-server` mock database on `http://localhost:3000` |
| `npm run build` | Compiles the production build into the `dist/` directory |
| `npm test` | Runs unit tests using Vitest |
| `npm run deploy` | Builds the project for production and deploys to Firebase Hosting |

---

## 📁 Environment Configuration

The application uses Angular environment files for configuration:

-   **Development:** [environment.development.ts](file:///e:/Git%20projects/Open%20Source/frontend-kipu/kipu-frontend/src/environments/environment.development.ts)
    -   Configured to use `/api/v1` base path which proxies requests to the local mock/Spring Boot server.
-   **Production:** [environment.ts](file:///e:/Git%20projects/Open%20Source/frontend-kipu/kipu-frontend/src/environments/environment.ts)
    -   Configured to point to the production backend deployment: `https://kipu-api-os.duckdns.org/api/v1`.

---

## 🏗️ Architecture & Tech Stack

### Technology Stack
-   **Framework**: Angular 21 (with Standalone Components)
-   **Styling**: TailwindCSS & PostCSS
-   **UI Libraries**: PrimeNG & Angular Material
-   **Testing**: Vitest & JSDOM

### Folder Structure
```text
kipu-frontend/
├── mock/                  # json-server configurations and mock database
├── public/                # Static assets and i18n translation bundles
├── src/
│   ├── app/
│   │   ├── budget/        # Budgeting and financial management modules
│   │   ├── identity/      # Authentication, registration, and user profiles
│   │   ├── iot-monitoring/# Sensor metrics telemetry and alerts
│   │   ├── logistics/     # Material catalogs, inventory, and supplier offers
│   │   ├── progress/      # Project progress tracking and Gantt charts
│   │   ├── projects/      # Core project administration and configuration
│   │   ├── signatures/    # Document handling and electronic sign-offs
│   │   └── shared/        # Reusable pipes, directives, and components
│   └── environments/      # Environment variables (dev / prod)
├── proxy.conf.json        # Decouples local API requests during development
└── firebase.json          # Deployment configuration for Firebase Hosting
```

---

## 🚀 Deployment to Firebase Hosting

To deploy updates to the production hosting domain (`https://kipu-frontend-42d0d.web.app`):

1.  Make sure you are logged in to the Firebase CLI:
    ```bash
    npx firebase login
    ```
2.  Deploy using the unified deployment script:
    ```bash
    npm run deploy
    ```
    *This will compile the production bundle utilizing the production endpoints and push the build to Firebase Hosting.*

---

## 👥 Contributing

Contributions are welcome! Please follow standard Angular style guidelines and ensure all tests pass before proposing a pull request.

## 📝 License

This project is open-source software licensed under the [MIT License](LICENSE).
