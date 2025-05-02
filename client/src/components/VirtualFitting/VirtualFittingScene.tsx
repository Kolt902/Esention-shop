import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html, Center } from '@react-three/drei';
import { AvatarModel } from './AvatarModel';
import { useTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

// Определение типов для одежды и аксессуаров
interface ClothingItem {
  id: number;
  name: string;
  type: string;
  category: string;
  productId: number;
  modelPath: string;
  thumbnailUrl: string;
  colors?: string[];
  sizes?: string[];
}

interface VirtualFittingSceneProps {
  userId?: number;
  initialBodyParams?: {
    height: number;
    weight: number;
    bodyType: 'athletic' | 'slim' | 'regular';
    gender: 'male' | 'female';
  };
  selectedItems?: {
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    accessory?: ClothingItem;
  };
  selectedColors?: Record<number, string>;
  selectedSizes?: Record<number, string>;
  onSave?: (params: any) => void;
}

const VirtualFittingScene = ({ 
  userId,
  initialBodyParams = {
    height: 175,
    weight: 70,
    bodyType: 'regular',
    gender: 'male'
  },
  selectedItems = {},
  selectedColors = {},
  selectedSizes = {},
  onSave
}: VirtualFittingSceneProps) => {
  const { t } = useTranslation();
  
  // Состояние для параметров тела
  const [bodyParams, setBodyParams] = useState(initialBodyParams);
  
  // Обновляем параметры когда изменяются входные данные
  useEffect(() => {
    setBodyParams(initialBodyParams);
  }, [initialBodyParams]);
  
  // Состояние загрузки
  const [loading, setLoading] = useState(false);
  
  // Управление камерой
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 1.5, 4]);
  const [cameraControl, setCameraControl] = useState('rotate'); // 'rotate', 'zoom', 'pan'
  
  // Подготовка данных о предметах одежды для 3D модели
  const clothingForAvatar = {
    top: selectedItems.top ? {
      modelPath: selectedItems.top.modelPath,
      color: selectedColors[selectedItems.top.id] || 'default'
    } : undefined,
    bottom: selectedItems.bottom ? {
      modelPath: selectedItems.bottom.modelPath,
      color: selectedColors[selectedItems.bottom.id] || 'default'
    } : undefined,
    shoes: selectedItems.shoes ? {
      modelPath: selectedItems.shoes.modelPath,
      color: selectedColors[selectedItems.shoes.id] || 'default'
    } : undefined,
    accessory: selectedItems.accessory ? {
      modelPath: selectedItems.accessory.modelPath,
      color: selectedColors[selectedItems.accessory.id] || 'default'
    } : undefined
  };
  
  // Функция сохранения настроек аватара
  const saveAvatarSettings = () => {
    if (onSave) {
      setLoading(true);
      
      // Формируем объект с настройками
      const settings = {
        bodyParams,
        clothing: {
          top: selectedItems.top?.id,
          bottom: selectedItems.bottom?.id,
          shoes: selectedItems.shoes?.id,
          accessory: selectedItems.accessory?.id
        },
        selectedColors,
        selectedSizes
      };
      
      onSave(settings);
      setLoading(false);
    }
  };
  
  // Функция сброса настроек просмотра
  const resetCamera = () => {
    setCameraPosition([0, 1.5, 4]);
  };
  
  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden bg-gradient-to-b from-background to-muted">
      {/* Панель инструментов просмотра */}
      <div className="absolute top-4 right-4 z-10 bg-background/80 p-2 rounded-lg shadow-md backdrop-blur-sm flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCameraControl('rotate')}
          className={cameraControl === 'rotate' ? 'bg-primary text-primary-foreground' : ''}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCameraControl('zoom')}
          className={cameraControl === 'zoom' ? 'bg-primary text-primary-foreground' : ''}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCameraControl('pan')}
          className={cameraControl === 'pan' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Move className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={resetCamera}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} className="touch-none">
        <Suspense fallback={
          <Html center>
            <div className="flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              <span>{t.common.loading}...</span>
            </div>
          </Html>
        }>
          <PerspectiveCamera makeDefault position={cameraPosition} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          
          <Center position={[0, 0, 0]}>
            <AvatarModel 
              modelPath="/models/default-avatar.glb"
              bodyType={bodyParams.bodyType}
              height={bodyParams.height}
              weight={bodyParams.weight}
              gender={bodyParams.gender}
              clothing={clothingForAvatar}
              position={[0, -1, 0]}
            />
          </Center>
          
          <Environment preset="city" />
          <OrbitControls 
            enablePan={cameraControl === 'pan'}
            enableRotate={cameraControl === 'rotate'}
            enableZoom={cameraControl === 'zoom'}
            maxPolarAngle={Math.PI - 0.1}
            minPolarAngle={0.1}
            makeDefault
          />
        </Suspense>
      </Canvas>
      
      {/* Информационное сообщение если не выбрана одежда */}
      {!selectedItems.top && !selectedItems.bottom && !selectedItems.shoes && !selectedItems.accessory && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md text-center">
          <p>{t.profile.selectItemsBelow}</p>
        </div>
      )}
    </div>
  );
};

export default VirtualFittingScene;