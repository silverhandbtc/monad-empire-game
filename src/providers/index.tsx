'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </React.Fragment>
  );
}
