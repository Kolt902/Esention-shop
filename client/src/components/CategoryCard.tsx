import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
  isSelected?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  imageUrl,
  onClick,
  isSelected = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 h-80 md:h-96",
        "hover:shadow-xl",
        isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800 scale-[1.02]" : ""
      )}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black to-transparent z-10"></div>
      
      {/* Image */}
      <img 
        src={imageUrl} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
      />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col items-start">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm md:text-base text-gray-200 mb-4">{description}</p>
        <button 
          className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
        >
          Смотреть коллекцию
        </button>
      </div>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-20 bg-white text-black text-xs px-3 py-1 rounded-full font-medium">
          Выбрано
        </div>
      )}
    </div>
  );
};

export default CategoryCard;