# Neeiz App

React application built with Vite and TypeScript.

## Development

### Prerequisites
- Node.js 18+
- pnpm

### Installation
```bash
pnpm install
```

### Development Server
```bash
pnpm run dev
```

The app will be available at `http://localhost:32100`

### Build
```bash
pnpm run build
```

## Deployment

This app is configured for deployment to CapRover using GitHub Actions.

### CapRover Configuration

The app uses the following CapRover configuration:
- **Dockerfile**: `./Dockerfile` - Multi-stage build with Node.js and Nginx
- **Branch**: `main`
- **Environment Variables**: Configured in `captain-definition`

### GitHub Actions

The deployment workflow is triggered on pushes to the `main` branch and changes in the `app/` directory.

Workflow file: `.github/workflows/deploy-app.yml`

### Manual Deployment

To deploy manually to CapRover:

1. Build the application:
   ```bash
   pnpm run build
   ```

2. Deploy using CapRover CLI:
   ```bash
   caprover deploy
   ```

## Project Structure

```
app/
├── src/                    # Source code
├── public/                 # Static assets
├── dist/                   # Build output
├── Dockerfile             # Docker configuration
├── captain-definition     # CapRover configuration
├── nginx.conf            # Nginx configuration
└── package.json          # Dependencies and scripts
```

## Environment Variables

The following environment variables are configured in CapRover:

- `VITE_LINE_LIFF_ID`: LINE LIFF ID
- `LINE_CHANNEL_ID`: LINE Channel ID
- `LINE_CHANNEL_SECRET`: LINE Channel Secret
- `JWT_SECRET`: JWT Secret
- `VITE_API_URL`: API URL
- `FIREBASE_SERVICE_ACCOUNT_BASE64`: Firebase service account (base64 encoded)

## Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI
- **Authentication**: Firebase Auth, LINE Login
- **Deployment**: CapRover, Docker, Nginx
- **Package Manager**: pnpm

Updated: Fixed GitHub Actions workflow and deployment configuration
