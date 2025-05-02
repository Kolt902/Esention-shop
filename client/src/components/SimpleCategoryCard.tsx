import React from 'react';

interface SimpleCategoryCardProps {
  title: string;
  imageUrl: string;
  onClick?: () => void;
  isSelected?: boolean;
  categoryId?: string;
}

const SimpleCategoryCard: React.FC<SimpleCategoryCardProps> = ({
  title,
  imageUrl,
  onClick,
  isSelected = false,
  categoryId
}) => {
  const content = (
    <>
      {/* Изображение с соотношением сторон 1:1 */}
      <div className="w-full relative overflow-hidden rounded-lg aspect-square">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      {/* Название категории - простой лаконичный стиль в формате SNIPES */}
      <h3 className="mt-2 text-center font-semibold text-base text-black">{title}</h3>
    </>
  );
  
  // Если предоставлен categoryId, используем ссылку
  if (categoryId) {
    return (
      <a 
        href={`/category/${categoryId}`}
        className={`flex flex-col items-center cursor-pointer transition-all duration-300 hover:opacity-90 ${
          isSelected ? 'ring-2 ring-black ring-offset-1' : ''
        }`}
      >
        {content}
      </a>
    );
  }
  
  // В противном случае используем div с onClick
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center cursor-pointer transition-all duration-300 hover:opacity-90 ${
        isSelected ? 'ring-2 ring-black ring-offset-1' : ''
      }`}
    >
      {content}
    </div>
  );
};

export default SimpleCategoryCard;