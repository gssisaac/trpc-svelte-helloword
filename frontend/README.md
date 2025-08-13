# tRPC Svelte Hello World - Frontend

This is the frontend application for the tRPC Svelte Hello World project.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3006
```

### Environment Variables Explanation

- `VITE_API_URL`: The URL where your backend API is running

## Getting Started

1. Install dependencies:
```bash
yarn install
```

2. Create and configure your `.env` file using the example above

3. Start the development server:
```bash
yarn dev
```

## Production Deployment

For production deployment:

1. Update `VITE_API_URL` to point to your production API endpoint
2. Build the application:
```bash
yarn build
```

3. Deploy the contents of the `build` directory to your hosting service