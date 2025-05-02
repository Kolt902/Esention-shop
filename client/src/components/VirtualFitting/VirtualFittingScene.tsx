import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html } from '@react-three/drei';
import { AvatarModel } from './AvatarModel';
import { useTranslation } from '@/lib/translations';

// Определение типов для одежды и аксессуаров
interface ClothingItem {
  id: number;
  name: string;
  type: 'top' | 'bottom' | 'shoes' | 'accessory';
  modelPath: string;
  thumbnailUrl: string;
  color: string;
  size: string;
}

interface VirtualFittingSceneProps {
  userId?: number;
  initialBodyParams?: {
    height: number;
    weight: number;
    bodyType: 'athletic' | 'slim' | 'regular';
    gender: 'male' | 'female';
  };
  availableClothing?: ClothingItem[];
  onSave?: (params: any) => void;
}

export function VirtualFittingScene({ 
  userId,
  initialBodyParams = {
    height: 175,
    weight: 70,
    bodyType: 'regular',
    gender: 'male'
  },
  availableClothing = [],
  onSave
}: VirtualFittingSceneProps) {
  const { t } = useTranslation();
  
  // Состояние для параметров тела
  const [bodyParams, setBodyParams] = useState(initialBodyParams);
  
  // Состояние для выбранной одежды
  const [selectedClothing, setSelectedClothing] = useState<{
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    accessories: ClothingItem[];
  }>({
    accessories: []
  });
  
  // Состояние загрузки
  const [loading, setLoading] = useState(false);
  
  // Флаг для отображения панели настройки
  const [showSettings, setShowSettings] = useState(false);
  
  // Обработчик изменения параметров тела
  const handleBodyParamChange = (param: string, value: number | string) => {
    setBodyParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  // Обработчик выбора одежды
  const handleClothingSelect = (item: ClothingItem) => {
    setSelectedClothing(prev => {
      if (item.type === 'accessory') {
        // Для аксессуаров добавляем в массив
        const accessories = [...prev.accessories];
        const existingIndex = accessories.findIndex(a => a.id === item.id);
        
        if (existingIndex >= 0) {
          // Если уже выбран - удаляем
          accessories.splice(existingIndex, 1);
        } else {
          // Иначе добавляем
          accessories.push(item);
        }
        
        return { ...prev, accessories };
      } else {
        // Для основных типов одежды заменяем текущий выбор
        return { ...prev, [item.type]: prev[item.type]?.id === item.id ? undefined : item };
      }
    });
  };
  
  // Функция сохранения настроек аватара
  const saveAvatarSettings = () => {
    if (onSave) {
      setLoading(true);
      
      // Формируем объект с настройками
      const settings = {
        bodyParams,
        clothing: {
          top: selectedClothing.top?.id,
          bottom: selectedClothing.bottom?.id,
          shoes: selectedClothing.shoes?.id,
          accessories: selectedClothing.accessories.map(a => a.id)
        }
      };
      
      onSave(settings);
      setLoading(false);
    }
  };
  
  // Преобразуем выбранную одежду в формат для компонента AvatarModel
  const clothingForAvatar = {
    top: selectedClothing.top?.modelPath,
    bottom: selectedClothing.bottom?.modelPath,
    shoes: selectedClothing.shoes?.modelPath,
    accessories: selectedClothing.accessories.map(a => a.modelPath)
  };
  
  return (
    <div className="w-full h-[600px] relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Панель управления */}
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-md">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {showSettings ? t.common.close : t.settings.title}
        </button>
        
        {showSettings && (
          <div className="mt-4 space-y-4">
            <h3 className="font-bold text-lg">{t.profile.bodyParams}</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.profile.height}</label>
              <input 
                type="range" 
                min="150" 
                max="200" 
                step="1"
                value={bodyParams.height}
                onChange={(e) => handleBodyParamChange('height', Number(e.target.value))}
                className="w-full"
              />
              <span>{bodyParams.height} см</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.profile.weight}</label>
              <input 
                type="range" 
                min="40" 
                max="120" 
                step="1"
                value={bodyParams.weight}
                onChange={(e) => handleBodyParamChange('weight', Number(e.target.value))}
                className="w-full"
              />
              <span>{bodyParams.weight} кг</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.profile.bodyType}</label>
              <select 
                value={bodyParams.bodyType}
                onChange={(e) => handleBodyParamChange('bodyType', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="slim">{t.profile.slim}</option>
                <option value="regular">{t.profile.regular}</option>
                <option value="athletic">{t.profile.athletic}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">{t.profile.gender}</label>
              <select 
                value={bodyParams.gender}
                onChange={(e) => handleBodyParamChange('gender', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="male">{t.profile.male}</option>
                <option value="female">{t.profile.female}</option>
              </select>
            </div>
            
            <button 
              onClick={saveAvatarSettings}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-400"
            >
              {loading ? t.common.saving : t.common.save}
            </button>
          </div>
        )}
      </div>
      
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={
          <Html center>
            <div className="text-white bg-blue-500 px-4 py-2 rounded-md">
              {t.common.loading}...
            </div>
          </Html>
        }>
          <PerspectiveCamera makeDefault position={[0, 1.5, 4]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          
          <AvatarModel 
            modelPath="/models/default-avatar.glb"
            bodyType={bodyParams.bodyType}
            height={bodyParams.height}
            gender={bodyParams.gender as 'male' | 'female'}
            clothing={clothingForAvatar}
            position={[0, -1, 0]}
          />
          
          <Environment preset="city" />
          <OrbitControls 
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 6}
            enableZoom={true}
            makeDefault
          />
        </Suspense>
      </Canvas>
      
      {/* Селектор одежды (внизу экрана) */}
      {availableClothing.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {availableClothing.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleClothingSelect(item)}
                className={`
                  cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2
                  ${(item.type === 'top' && selectedClothing.top?.id === item.id) ||
                    (item.type === 'bottom' && selectedClothing.bottom?.id === item.id) ||
                    (item.type === 'shoes' && selectedClothing.shoes?.id === item.id) ||
                    (item.type === 'accessory' && selectedClothing.accessories.some(a => a.id === item.id))
                      ? 'border-blue-500' : 'border-transparent'}
                `}
              >
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}