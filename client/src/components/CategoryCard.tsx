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
      className="category-card relative flex flex-col items-center justify-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
    >
      {/* Icon Container */}
      <div className="category-icon-container flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        {typeof icon === 'string' ? (
          <div className="text-3xl">{icon}</div>
        ) : (
          icon
        )}
      </div>
      
      {/* Category Name */}
      <h3 className="font-medium text-gray-800 text-center">{name}</h3>
      
      {/* New Badge */}
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Новинки ✨
        </div>
      )}
    </button>
  );
}