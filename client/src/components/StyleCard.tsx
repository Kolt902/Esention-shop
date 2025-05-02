import { useLocation } from 'wouter';

interface StyleCardProps {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
}

export default function StyleCard({ id, name, imageUrl, description }: StyleCardProps) {
  const [_, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/style/${name.toLowerCase()}`);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-40 group"
      onClick={handleClick}
    >
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white font-bold text-lg">{name}</h3>
        {description && (
          <p className="text-gray-200 text-sm mt-1 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}