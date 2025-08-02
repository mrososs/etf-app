# Environment Configuration

This folder contains environment-specific configuration files for the ETF application.

## Files

- `environment.ts` - Development environment configuration
- `environment.prod.ts` - Production environment configuration

## Configuration

### Development Environment (`environment.ts`)

- `production: false`
- `confirmUrl: 'http://localhost:4200/confirm-register'`

### Production Environment (`environment.prod.ts`)

- `production: true`
- `confirmUrl: 'https://etf.itechpro-eg.com/confirm-register'`

## Usage

The environment files are automatically replaced during the build process:

- Development builds use `environment.ts`
- Production builds use `environment.prod.ts` (replaces `environment.ts`)

## How to Use

Import the environment configuration in your components:

```typescript
import { environment } from "../../../environments/environment";

// Use environment variables
const confirmUrl = environment.confirmUrl;
```

## Build Commands

- Development: `ng serve` (uses development environment)
- Production: `ng build --configuration=production` (uses production environment)
