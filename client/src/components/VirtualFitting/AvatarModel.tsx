import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
  
  // Используем заглушку, пока настоящие модели не загружены
  const { scene: defaultModel } = useGLTF('/models/default-avatar.glb');
  
  // Масштабируем модель на основе роста
  const scale = userScale || (height / 170);
  
  // Загрузка предметов одежды
  const topModel = clothing?.top ? useLoader(GLTFLoader, clothing.top.modelPath) : null;
  const bottomModel = clothing?.bottom ? useLoader(GLTFLoader, clothing.bottom.modelPath) : null;
  const shoesModel = clothing?.shoes ? useLoader(GLTFLoader, clothing.shoes.modelPath) : null;
  const accessoryModel = clothing?.accessory ? useLoader(GLTFLoader, clothing.accessory.modelPath) : null;
  
  useEffect(() => {
    if (topModel) {
      setClothingLoaded(prev => ({ ...prev, top: true }));
    }
    if (bottomModel) {
      setClothingLoaded(prev => ({ ...prev, bottom: true }));
    }
    if (shoesModel) {
      setClothingLoaded(prev => ({ ...prev, shoes: true }));
    }
    if (accessoryModel) {
      setClothingLoaded(prev => ({ ...prev, accessory: true }));
    }
  }, [topModel, bottomModel, shoesModel, accessoryModel]);
  
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
  
  return (
    <group 
      ref={group} 
      position={position}
      rotation={[rotation[0], rotation[1], rotation[2]]}
    >
      {/* Используем временную базовую модель, пока не будет настоящей */}
      <primitive object={defaultModel.clone()} />
      
      {/* Отображаем загруженные модели одежды */}
      {clothing?.top && clothingLoaded.top && (
        <primitive 
          object={topModel.scene.clone()} 
          position={[0, 0, 0]}
          onAfterRender={() => {
            if (topModel && clothing.top) {
              applyColorToModel(topModel.scene, clothing.top.color);
            }
          }}
        />
      )}
      
      {clothing?.bottom && clothingLoaded.bottom && (
        <primitive 
          object={bottomModel.scene.clone()} 
          position={[0, 0, 0]}
          onAfterRender={() => {
            if (bottomModel && clothing.bottom) {
              applyColorToModel(bottomModel.scene, clothing.bottom.color);
            }
          }}
        />
      )}
      
      {clothing?.shoes && clothingLoaded.shoes && (
        <primitive 
          object={shoesModel.scene.clone()} 
          position={[0, 0, 0]}
          onAfterRender={() => {
            if (shoesModel && clothing.shoes) {
              applyColorToModel(shoesModel.scene, clothing.shoes.color);
            }
          }}
        />
      )}
      
      {clothing?.accessory && clothingLoaded.accessory && (
        <primitive 
          object={accessoryModel.scene.clone()} 
          position={[0, 0, 0]}
          onAfterRender={() => {
            if (accessoryModel && clothing.accessory) {
              applyColorToModel(accessoryModel.scene, clothing.accessory.color);
            }
          }}
        />
      )}
    </group>
  );
}