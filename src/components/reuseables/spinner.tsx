import React from 'react';

interface SpinnerProps {
  message?: string;
  size?: 'sm' | 'md';
}

const Spinner: React.FC<SpinnerProps> = ({ message, size = 'md' }) => {
  const dimension = size === 'sm' ? 'h-4 w-4 border-2' : 'h-7 w-7 border-[3px]';

  return (
    <div role="status" className='flex flex-col items-center justify-center gap-3'>
      <span className={`${dimension} animate-spin rounded-full border-current border-r-transparent opacity-80`} />
      {message ? <p className='text-sm text-muted'>{message}</p> : <span className='sr-only'>Loading</span>}
    </div>
  );
};

export default Spinner;
