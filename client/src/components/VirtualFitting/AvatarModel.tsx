import { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Типизация для GLTF модели
type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
  animations: THREE.AnimationClip[];
};

interface AvatarModelProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  animations?: boolean;
  bodyType?: 'athletic' | 'slim' | 'regular';
  height?: number;
  gender?: 'male' | 'female';
  clothing?: {
    top?: string;
    bottom?: string;
    shoes?: string;
    accessories?: string[];
  };
}

export function AvatarModel({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animations = true,
  bodyType = 'regular',
  height = 175,
  gender = 'male',
  clothing = {}
}: AvatarModelProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations: clips } = useGLTF(modelPath) as GLTFResult;
  const { actions, mixer } = useAnimations(clips, group);

  // Адаптируем масштаб в зависимости от роста
  const scaleFactor = (height / 175) * scale;

  // Настраиваем телосложение (в реальном приложении здесь будет более сложная логика)
  useEffect(() => {
    if (group.current) {
      // Примерная логика для изменения телосложения
      // В реальности это нужно делать через морфы или через изменение геометрии
      if (bodyType === 'athletic') {
        // Увеличиваем плечи и сужаем талию
      } else if (bodyType === 'slim') {
        // Делаем модель тоньше
      }
    }
  }, [bodyType]);

  // Применяем одежду (в реальном приложении здесь будет логика замены материалов/мешей)
  useEffect(() => {
    if (group.current && Object.keys(clothing).length > 0) {
      // Логика смены одежды на аватаре
      // Например:
      // if (clothing.top && nodes['TorsoMesh']) {
      //   nodes['TorsoMesh'].material = новый материал с текстурой одежды
      // }
    }
  }, [clothing, nodes, materials]);

  // Запускаем анимацию при монтировании компонента
  useEffect(() => {
    if (animations && actions && Object.keys(actions).length > 0) {
      // Получаем первую анимацию и запускаем её
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.reset().fadeIn(0.5).play();
      }
    }
    
    return () => {
      // Останавливаем все анимации при размонтировании
      if (actions) {
        Object.values(actions).forEach(action => action?.fadeOut(0.5));
      }
    };
  }, [actions, animations]);

  // Плавное вращение модели
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        (state.mouse.x * Math.PI) / 5,
        0.05
      );
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation as any} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      {/* В реальном приложении здесь будет отрисовка мешей из загруженной модели */}
      {/* Пример: <primitive object={nodes.Body} /> */}
      
      {/* Временный плейсхолдер пока мы не загрузили реальную модель */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
        <meshStandardMaterial color="#5C6BC0" />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#7986CB" />
      </mesh>
    </group>
  );
}

// Предзагрузка модели для оптимизации
useGLTF.preload('/models/default-avatar.glb');