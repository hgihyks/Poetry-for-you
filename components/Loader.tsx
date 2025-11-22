import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-10">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] animate-pulse bg-neu-base"></div>
        <div className="absolute top-2 left-2 right-2 bottom-2 rounded-full shadow-[inset_2px_2px_4px_#a3b1c6,inset_-2px_-2px_4px_#ffffff]"></div>
      </div>
    </div>
  );
};
