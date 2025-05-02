import React from 'react';

interface SimpleCategoryCardProps {
  title: string;
  imageUrl: string;
  onClick: () => void;
  isSelected?: boolean;
}

const SimpleCategoryCard: React.FC<SimpleCategoryCardProps> = ({
  title,
  imageUrl,
  onClick,
  isSelected = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center cursor-pointer transition-all duration-300 hover:opacity-90 ${
        isSelected ? 'ring-2 ring-black ring-offset-1' : ''
      }`}
    >
      {/* Изображение с соотношением сторон 1:1 */}
      <div className="w-full relative overflow-hidden rounded-lg aspect-square">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Название категории - простой лаконичный стиль */}
      <h3 className="mt-2 text-center font-medium text-sm">{title}</h3>
    </div>
  );
};

export default SimpleCategoryCard;