import React from 'react';
import { cn } from '@/lib/utils';

interface BrandCardProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
  isSelected?: boolean;
}

const BrandCard: React.FC<BrandCardProps> = ({
  name,
  imageUrl,
  onClick,
  isSelected = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl shadow-md cursor-pointer transform transition-all duration-300 h-36 md:h-44",
        "hover:shadow-xl hover:scale-[1.02]",
        isSelected ? "ring-2 ring-black ring-offset-2 scale-[1.02]" : ""
      )}
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
      
      {/* Image */}
      <img 
        src={imageUrl} 
        alt={name} 
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
      />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 flex flex-col items-center justify-center">
        <h3 className="text-xl md:text-2xl font-bold text-white text-center">{name}</h3>
      </div>
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-20 bg-white text-black text-xs px-2 py-0.5 rounded-full font-medium">
          ✓
        </div>
      )}
    </div>
  );
};

export default BrandCard;