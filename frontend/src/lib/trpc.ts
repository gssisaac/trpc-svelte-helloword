import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '../../../backend/src/routes';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3006/trpc',
      headers() {
        if (typeof window === 'undefined') return {};
        const token = window.localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});
