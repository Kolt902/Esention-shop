import React from 'react';

interface CategoryCardProps {
  name: string;
  icon: React.ReactNode | string;
  onClick: () => void;
  isNew?: boolean;
}

export default function CategoryCard({ name, icon, onClick, isNew = false }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center bg-white border border-gray-200 transform transition-all duration-300 hover:border-black w-full aspect-[1/1]"
    >
      {/* Icon Container */}
      <div className="flex items-center justify-center mb-4">
        {typeof icon === 'string' ? (
          <div className="text-4xl">{icon}</div>
        ) : (
          icon
        )}
      </div>
      
      {/* Category Name */}
      <h3 className="font-normal text-sm text-black uppercase">{name}</h3>
      
      {/* New Badge */}
      {isNew && (
        <div className="absolute top-0 left-0 bg-black text-white text-xs uppercase px-2 py-1">
          New
        </div>
      )}
    </button>
  );
}