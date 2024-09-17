import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="card w-[24vw] max-sm:w-[78vw]  bg-gray-200 rounded-lg shadow-xl border border-t-gray-300 border-t-4 p-4 animate-pulse">
      <div className="relative flex items-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-300" />
        <div className="ml-4 flex-1">
          <div className="w-[10vw] h-4 bg-gray-300 mb-2" />
          <div className="w-[10vw] h-4 bg-gray-300" />
          <div className="mt-4 flex gap-3">
            <div className="w-[6vw] h-4 bg-gray-300" />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row items-center justify-end  mt-4">
        <div className="w-6 h-6 bg-gray-300 rounded-full mr-2" />
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
