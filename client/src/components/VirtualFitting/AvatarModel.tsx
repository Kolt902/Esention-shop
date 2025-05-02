import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useGLTF, Box } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarProps {
  modelPath: string;
  bodyType: 'athletic' | 'slim' | 'regular';
  height: number;
  weight?: number;
  gender: 'male' | 'female';
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  clothing?: {
    top?: { modelPath: string; color: string };
    bottom?: { modelPath: string; color: string };
    shoes?: { modelPath: string; color: string };
    accessory?: { modelPath: string; color: string };
  };
}

export function AvatarModel({
  modelPath,
  bodyType,
  height,
  weight = 70,
  gender,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale: userScale,
  clothing
}: AvatarProps) {
  const group = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [clothingLoaded, setClothingLoaded] = useState({
    top: false,
    bottom: false,
    shoes: false,
    accessory: false
  });
  
  // Масштабируем модель на основе роста
  const scale = userScale || (height / 170);
  
  // Используем простые геометрические формы вместо загрузки моделей
  const [hasLoadError, setHasLoadError] = useState(false);
  
  // Устанавливаем все предметы одежды как загруженные, так как используем простую геометрию
  useEffect(() => {
    setClothingLoaded({
      top: true,
      bottom: true,
      shoes: true,
      accessory: true
    });
    setModelLoaded(true);
  }, []);
  
  // Анимация вращения
  useFrame((_, delta) => {
    if (group.current && modelLoaded) {
      // Не вращаем модель автоматически, пусть пользователь сам вращает
      // group.current.rotation.y += delta * 0.3;
    }
  });
  
  // Настройка модели в зависимости от параметров тела
  useEffect(() => {
    if (group.current) {
      // Настройка модели в зависимости от типа телосложения
      switch (bodyType) {
        case 'athletic':
          // Для атлетического телосложения
          group.current.scale.set(scale * 1.05, scale, scale * 1.05);
          break;
        case 'slim':
          // Для худощавого телосложения
          group.current.scale.set(scale * 0.95, scale, scale * 0.95);
          break;
        case 'regular':
        default:
          // Для обычного телосложения
          group.current.scale.set(scale, scale, scale);
          break;
      }
      
      setModelLoaded(true);
    }
  }, [bodyType, scale, modelLoaded]);
  
  // Функция для расчета цвета в RGB формате из названия
  const getColorFromName = (colorName: string): THREE.Color => {
    const colorMap: Record<string, THREE.Color> = {
      'white': new THREE.Color(0xFFFFFF),
      'black': new THREE.Color(0x000000),
      'red': new THREE.Color(0xFF0000),
      'blue': new THREE.Color(0x0000FF),
      'green': new THREE.Color(0x00FF00),
      'yellow': new THREE.Color(0xFFFF00),
      'purple': new THREE.Color(0x800080),
      'orange': new THREE.Color(0xFFA500),
      'brown': new THREE.Color(0x8B4513),
      'gray': new THREE.Color(0x808080),
      'beige': new THREE.Color(0xF5F5DC),
      'navy': new THREE.Color(0x000080),
      'olive': new THREE.Color(0x808000),
      'burgundy': new THREE.Color(0x800020),
      'gold': new THREE.Color(0xFFD700),
      'silver': new THREE.Color(0xC0C0C0),
      'default': new THREE.Color(0xCCCCCC),
    };
    
    return colorMap[colorName] || colorMap['default'];
  };
  
  // Применение цвета к материалам модели
  const applyColorToModel = (model: THREE.Object3D, colorName: string) => {
    const color = getColorFromName(colorName);
    
    model.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material) {
        // Если у объекта есть материал
        if (Array.isArray(object.material)) {
          // Если это массив материалов
          object.material.forEach(material => {
            if (material.color) {
              material.color = color;
            }
          });
        } else if (object.material.color) {
          // Если это один материал
          object.material.color = color;
        }
      }
    });
  };
  
  // Определяем базовые цвета для разных частей аватара
  const bodyColor = gender === 'male' ? '#C2A385' : '#D8B396';
  const topColor = clothing?.top ? getColorFromName(clothing.top.color) : new THREE.Color('#3B82F6');
  const bottomColor = clothing?.bottom ? getColorFromName(clothing.bottom.color) : new THREE.Color('#1E3A8A');
  const shoesColor = clothing?.shoes ? getColorFromName(clothing.shoes.color) : new THREE.Color('#111827');
  
  // Вычисляем размеры частей тела на основе телосложения
  let torsoWidth = 0.4;
  let shoulderWidth = 0.5;
  let legsWidth = 0.35;
  
  if (bodyType === 'athletic') {
    torsoWidth = 0.45;
    shoulderWidth = 0.55;
    legsWidth = 0.4;
  } else if (bodyType === 'slim') {
    torsoWidth = 0.35;
    shoulderWidth = 0.45;
    legsWidth = 0.3;
  }

  return (
    <group 
      ref={group} 
      position={position}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      {/* Голова */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      
      {/* Тело / рубашка */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[shoulderWidth, 0.6, torsoWidth]} />
        <meshStandardMaterial color={topColor} />
      </mesh>
      
      {/* Нижняя часть тела / брюки */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[legsWidth, 0.6, legsWidth]} />
        <meshStandardMaterial color={bottomColor} />
      </mesh>
      
      {/* Ноги */}
      <group position={[0, 0, 0]}>
        {/* Левая нога */}
        <mesh position={[-0.15, 0, 0]}>
          <boxGeometry args={[0.15, 0.9, 0.15]} />
          <meshStandardMaterial color={bottomColor} />
        </mesh>
        
        {/* Правая нога */}
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.15, 0.9, 0.15]} />
          <meshStandardMaterial color={bottomColor} />
        </mesh>
      </group>
      
      {/* Обувь */}
      <group position={[0, -0.45, 0.05]}>
        {/* Левый ботинок */}
        <mesh position={[-0.15, 0, 0]}>
          <boxGeometry args={[0.18, 0.1, 0.3]} />
          <meshStandardMaterial color={shoesColor} />
        </mesh>
        
        {/* Правый ботинок */}
        <mesh position={[0.15, 0, 0]}>
          <boxGeometry args={[0.18, 0.1, 0.3]} />
          <meshStandardMaterial color={shoesColor} />
        </mesh>
      </group>
      
      {/* Руки */}
      <group position={[0, 1.1, 0]}>
        {/* Левая рука */}
        <mesh position={[-0.35, 0, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={topColor} />
        </mesh>
        
        {/* Правая рука */}
        <mesh position={[0.35, 0, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color={topColor} />
        </mesh>
      </group>
    </group>
  );
}