'use client';

import { Button } from 'components';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <h2 className="text-xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-4 text-center">
        There was an error loading the New Pool page.
      </p>
      <Button
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
} 