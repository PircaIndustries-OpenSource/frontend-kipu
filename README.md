# Kipu Frontend - Open Source Construction Management Platform

**[Kipu](https://github.com/kipu-os) is a collaborative, open-source Construction Management Platform designed to streamline project planning, execution, and monitoring.**

This repository contains the complete frontend application for Kipu, built with Angular and integrated with .NET backend services for real-time data management.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **Angular CLI** 18.x or higher
- **.NET 8 SDK** (for backend API)
- **MySQL** or **MariaDB** (for database)

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

3.  **Configure Environment Variables**
    Copy `.env.example` to `.env` and update with your backend API URL:
    ```bash
    cp .env.example .env
    ```
    
    In `.env` set:
    ```env
    API_URL=http://localhost:5000/api
    ```

4.  **Run the Application**
    ```bash
    ng serve
    ```

    Open [http://localhost:4200](http://localhost:4200) in your browser.

## 🛠️ Development

### Development Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Start development server with hot reload |
| `ng build` | Build for production |
| `ng test` | Run unit tests |
| `ng e2e` | Run end-to-end tests |

### Running the Backend
Ensure the .NET backend is running:

```bash
cd "E:\Git projects\Open Source\backend-kipu\backend"
.\mvnw spring-boot:run
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Angular 20
- **UI Components**: Angular Material
- **State Management**: NgRx
- **i18n**: ngx-translate
- **Charts**: ngx-charts, Chart.js
- **Testing**: Jasmine, Karma, Cypress

### Folder Structure
```
kipu-frontend/
├── src/
│   ├── app/
│   │   ├── core/          # Core services, guards, interceptors
│   │   ├── shared/        # Reusable components and pipes
│   │   ├── identity/      # Authentication and user management
│   │   ├── projects/      # Project management module
│   │   ├── construction/  # Construction monitoring modules
│   │   └── iot-monitoring/ # IoT device management
│   └── environments/      # Environment-specific configurations
├── public/              # Static assets and translations
└── translations/        # Additional i18n files
```

## 👥 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) (if available) for detailed guidelines.

## 📝 License

This project is open source software licensed under the [MIT License](LICENSE).

---

**Built with ❤️ for the Construction Community**
