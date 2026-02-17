import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 py-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-delay-0"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-delay-150"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-delay-300"></div>
    </div>
  );
};

export default Loader;
