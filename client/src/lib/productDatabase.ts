// Большая база данных товаров для брендов с официальных сайтов
// Структура: бренд -> категория -> товары

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  sizes?: string[];
  gender?: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
  inStock?: boolean;
}

// Генератор ID для продуктов
let productId = 1000;

// База данных товаров
export const productDatabase: Product[] = [
  // NIKE - Кроссовки 
  {
    id: productId++,
    name: "Nike Air Force 1 '07",
    price: 10990,
    category: "sneakers",
    brand: "Nike",
    description: "Легендарная модель Air Force 1 '07 в классическом белом цвете. Культовый силуэт, который остаётся актуальным на протяжении десятилетий.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201d27be31b/air-force-1-07-mens-shoes-5QFp5Z.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3cc96f43-47b6-43cb-951d-d8f73bb2f912/air-force-1-07-mens-shoes-5QFp5Z.png"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Air Max 270",
    price: 14990,
    category: "sneakers",
    brand: "Nike",
    description: "Кроссовки Nike Air Max 270 с первой в истории Nike воздушной подушкой Air, разработанной специально для повседневной носки.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/fg3necfcxgccw3ggsjty/air-max-270-mens-shoes-KkLcGR.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/dlw41kspgv7fxoqbsxmx/air-max-270-mens-shoes-KkLcGR.png"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Dunk Low",
    price: 11990,
    category: "sneakers",
    brand: "Nike",
    description: "Культовая модель Dunk Low, которая перешла из баскетбола в мир уличной моды и стала настоящей иконой стиля.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9559f730-2e9d-4232-9e89-e8e81ddc8cc4/dunk-low-retro-mens-shoes-76KnBL.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2c8726a5-624d-4c15-99e6-7df8c9281ee6/dunk-low-retro-mens-shoes-76KnBL.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5a7e3f65-64d7-4452-9ee3-d5faed9d787a/dunk-low-retro-mens-shoes-76KnBL.png"
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Air Max 97",
    price: 16990,
    category: "sneakers",
    brand: "Nike",
    description: "Легендарные кроссовки Air Max 97 с полноразмерной воздушной подушкой Air и волнообразным дизайном, вдохновленным японскими скоростными поездами.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-ffa7b097-ca37-4435-ba34-5dcadcde9d53/air-max-97-mens-shoes-LJmK45.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-45ffa529-3baa-442d-9d4e-0a77558dd741/air-max-97-mens-shoes-LJmK45.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-f67d405b-95b9-44e9-ac5a-429f875b5c86/air-max-97-mens-shoes-LJmK45.png"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.5,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Air Jordan 1 Mid",
    price: 13990,
    category: "sneakers",
    brand: "Nike",
    description: "Средняя версия культовых Jordan 1, которые вывели баскетбол на новый уровень стиля и производительности.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-0896e115-351a-4e1c-9c3a-b38623b27b2a/air-jordan-1-mid-mens-shoes-86f1ZW.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-f7e2e66c-ac24-4b11-9c4e-e49a753b795f/air-jordan-1-mid-mens-shoes-86f1ZW.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-e1af0f98-66fa-435e-9e88-b17f4e337c4b/air-jordan-1-mid-mens-shoes-86f1ZW.png"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Air Force 1 Shadow",
    price: 12990,
    category: "sneakers",
    brand: "Nike",
    description: "Женская интерпретация классического силуэта с многослойными элементами и накладками, которые создают эффект тени.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/09df707d-e50d-448a-9d63-cb884895a83c/air-force-1-shadow-womens-shoes-kTgn9J.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b3245e26-c6c8-4466-b2bb-01dddba2b8cd/air-force-1-shadow-womens-shoes-kTgn9J.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9c5c3472-7c7d-4927-a3ea-04fb437eddd9/air-force-1-shadow-womens-shoes-kTgn9J.png"
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    gender: "womens",
    isNew: true,
    discount: 0,
    rating: 4.8,
    inStock: true
  },

  // NIKE - Футболки
  {
    id: productId++,
    name: "Nike Sportswear Club",
    price: 2490,
    category: "tshirts",
    brand: "Nike",
    description: "Классическая хлопковая футболка Nike Sportswear с фирменным логотипом Swoosh на груди.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c3df1c5-7959-4414-a0f3-41da8bb3a137/sportswear-club-mens-t-shirt-N8Fnn0.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d0b97b2d-8696-4523-b599-18dca6007fd0/sportswear-club-mens-t-shirt-N8Fnn0.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5ded60fe-6356-4106-9f47-cc4bf7a5b44c/sportswear-club-mens-t-shirt-N8Fnn0.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.5,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Dri-FIT Run Division",
    price: 3490,
    category: "tshirts",
    brand: "Nike",
    description: "Беговая футболка из дышащей ткани Nike Dri-FIT, которая отводит влагу для комфорта во время тренировок.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9e30c616-aa19-4e37-af6e-f81d4a4e4696/dri-fit-run-division-mens-running-t-shirt-dCtwvc.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9c8fa7a0-9fcc-4622-a510-94ca3ee4b71f/dri-fit-run-division-mens-running-t-shirt-dCtwvc.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/cb42ccc0-9cb6-4331-a10d-f048ce5a9c4a/dri-fit-run-division-mens-running-t-shirt-dCtwvc.png"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Sportswear Essential",
    price: 2290,
    category: "tshirts",
    brand: "Nike",
    description: "Женская футболка из мягкого хлопка с минималистичным дизайном и небольшим логотипом Nike.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ffbc1880-15ce-4f45-aa39-1fe6d9018fcc/sportswear-womens-t-shirt-PLCZnB.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8c48a96c-f91e-4cad-9f1e-11a4d097c79f/sportswear-womens-t-shirt-PLCZnB.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a09ba34b-20bd-4389-865e-9dcfcc5d34ae/sportswear-womens-t-shirt-PLCZnB.png"
    ],
    sizes: ["XS", "S", "M", "L"],
    gender: "womens",
    isNew: false,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  
  // NIKE - Худи
  {
    id: productId++,
    name: "Nike Sportswear Club Fleece",
    price: 5990,
    category: "hoodies",
    brand: "Nike",
    description: "Теплое худи из мягкого флиса с капюшоном на утяжке и карманом-кенгуру спереди.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/gw1tzq9wrqoqhfvgjnvx/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ks0tgzwx6vfyi3gzmstl/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/spmzcptxsb1oiyp35gz1/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Therma-FIT",
    price: 6990,
    category: "hoodies",
    brand: "Nike",
    description: "Тренировочное худи с технологией Therma-FIT для сохранения тепла во время занятий на открытом воздухе.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/42c03829-9919-4728-aed6-c5bc6b5c38be/therma-fit-mens-pullover-training-hoodie-JwkclJ.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c9de7513-10d1-484f-9dbd-be58b83142de/therma-fit-mens-pullover-training-hoodie-JwkclJ.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9b3ba8a5-6fcd-4fc0-bd32-19d9ec7aa24c/therma-fit-mens-pullover-training-hoodie-JwkclJ.png"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Sportswear Essential",
    price: 5490,
    category: "hoodies",
    brand: "Nike",
    description: "Женское худи из мягкого флиса с объемным капюшоном и современным кроем oversize.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/33364eb7-c34b-425f-9744-5a5429afe707/sportswear-essential-womens-oversized-pullover-hoodie-nb54R0.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/1c5f6b8f-deb8-473d-9e7b-ea31cbf0c4e7/sportswear-essential-womens-oversized-pullover-hoodie-nb54R0.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/cfc1398f-e2b5-4da3-af9f-91be5e4fefa5/sportswear-essential-womens-oversized-pullover-hoodie-nb54R0.png"
    ],
    sizes: ["XS", "S", "M", "L"],
    gender: "womens",
    isNew: false,
    discount: 10,
    rating: 4.6,
    inStock: true
  },
  
  // NIKE - Штаны
  {
    id: productId++,
    name: "Nike Sportswear Tech Fleece",
    price: 7990,
    category: "pants",
    brand: "Nike",
    description: "Джоггеры из технологичного многослойного флиса, который обеспечивает тепло без лишнего объема.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c289c21-3f30-4ff8-9bbd-9f3045d71b55/sportswear-tech-fleece-mens-joggers-2bw5fs.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/845ed45c-ef8a-4be7-b633-54d311a818a0/sportswear-tech-fleece-mens-joggers-2bw5fs.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/4d77e937-4799-4eef-8169-22ff7a279c65/sportswear-tech-fleece-mens-joggers-2bw5fs.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Dri-FIT Challenger",
    price: 4990,
    category: "pants",
    brand: "Nike",
    description: "Беговые брюки из легкой влагоотводящей ткани с эластичным поясом и боковыми карманами на молнии.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ef1877f0-0911-467a-b6da-3de37b9fa518/dri-fit-challenger-mens-woven-running-pants-F4BH4t.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/74612a52-4f9e-4d84-a09c-4c44cce08422/dri-fit-challenger-mens-woven-running-pants-F4BH4t.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b8c0fb08-0a5d-408e-9a01-a6b697fb4a21/dri-fit-challenger-mens-woven-running-pants-F4BH4t.png"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  {
    id: productId++,
    name: "Nike Sportswear Essential",
    price: 4490,
    category: "pants",
    brand: "Nike",
    description: "Женские флисовые брюки с высокой посадкой и эластичным поясом для комфортной посадки.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/6bb0f91c-e0b2-4cc1-95cf-89b7e9d0084a/sportswear-essential-womens-mid-rise-pants-QCdJgk.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c97734ef-6c7d-43ac-8d30-02f63073c04e/sportswear-essential-womens-mid-rise-pants-QCdJgk.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c2c77bc5-c85e-4465-8e44-4d94fe311127/sportswear-essential-womens-mid-rise-pants-QCdJgk.png"
    ],
    sizes: ["XS", "S", "M", "L"],
    gender: "womens",
    isNew: false,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  
  // ADIDAS - Кроссовки
  {
    id: productId++,
    name: "Adidas Stan Smith",
    price: 8990,
    category: "sneakers",
    brand: "Adidas",
    description: "Культовые теннисные кроссовки, ставшие иконой уличной моды. Классический силуэт с перфорированными полосками и минималистичным дизайном.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/246908d6be2a400d91faac1e00f5245a_9366/Stan_Smith_Shoes_White_FX5502_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/82990534bbfc418bb9a7ac1e00f52d0e_9366/Stan_Smith_Shoes_White_FX5502_04_standard.jpg"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas Ultraboost 21",
    price: 15990,
    category: "sneakers",
    brand: "Adidas",
    description: "Беговые кроссовки Ultraboost 21 с улучшенной амортизацией Boost и адаптивной посадкой Primeknit+.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/edf9cc95cde94970829ead7800abd905_9366/Ultraboost_22_Shoes_Black_GZ0127_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0ead79681b9947c2bb8cad7800abe6a0_9366/Ultraboost_22_Shoes_Black_GZ0127_04_standard.jpg"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas Superstar",
    price: 9990,
    category: "sneakers",
    brand: "Adidas",
    description: "Легендарные кроссовки с узнаваемым резиновым мыском в форме ракушки и тремя полосками по бокам.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Superstar_Shoes_White_EG4958_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c0953ceaa871453abf6baad6009a32d6_9366/Superstar_Shoes_White_EG4958_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3d6a1ff9096147819595aad6009a3b21_9366/Superstar_Shoes_White_EG4958_04_standard.jpg"
    ],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas NMD_R1",
    price: 12990,
    category: "sneakers",
    brand: "Adidas",
    description: "Городские кроссовки NMD_R1 с технологией Boost и характерными вставками-блоками на подошве.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8c391a5f6cfc48da87c4acb6001973e7_9366/NMD_R1_Shoes_Black_FY9382_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a7c7aacd79334632a7f5acb600197eb5_9366/NMD_R1_Shoes_Black_FY9382_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/33e8aadedf3c47c7b5a3acb600198a67_9366/NMD_R1_Shoes_Black_FY9382_04_standard.jpg"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas Gazelle",
    price: 8990,
    category: "sneakers",
    brand: "Adidas",
    description: "Классические кроссовки из замши с контрастными тремя полосками и заниженным профилем.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4760e03c87774e0dba63a7fa008da69d_9366/Gazelle_Shoes_Blue_BB5478_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1d1d1a21ced34f01a28ca7fa00abd6d8_9366/Gazelle_Shoes_Blue_BB5478_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a36518227cb64756bcaba7fa00abe0b2_9366/Gazelle_Shoes_Blue_BB5478_04_standard.jpg"
    ],
    sizes: ["40", "41", "42", "43", "44"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  
  // ADIDAS - Футболки
  {
    id: productId++,
    name: "Adidas Trefoil Tee",
    price: 2290,
    category: "tshirts",
    brand: "Adidas",
    description: "Классическая футболка из мягкого хлопкового трикотажа с большим логотипом-трилистником на груди.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0f3a8487157d47d98476ac5e003d37ec_9366/Trefoil_Tee_White_GN3462_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6967df167ae44b3b240ac5e003d47b5_9366/Trefoil_Tee_White_GN3462_02_laydown.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9fbc477901424feda986ac5e003d5c2d_9366/Trefoil_Tee_White_GN3462_41_detail.jpg"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas 3-Stripes Tee",
    price: 2490,
    category: "tshirts",
    brand: "Adidas",
    description: "Спортивная футболка из технологичной ткани с тремя фирменными полосками на рукавах.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3b83506e22d842c8a52dab8d00cc9e27_9366/3-Stripes_Tee_Black_GN3495_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/15e4221c4a5c4e658e4cab8d00cca79c_9366/3-Stripes_Tee_Black_GN3495_02_laydown.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3c3188ab6da540a0a12fab8d00ccb3d4_9366/3-Stripes_Tee_Black_GN3495_41_detail.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.5,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas Essentials Logo Tee",
    price: 1990,
    category: "tshirts",
    brand: "Adidas",
    description: "Женская футболка из мягкого хлопка с фирменным логотипом и современным силуэтом.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e771391d8e4445f2b343ab8c012b0ec0_9366/Essentials_Logo_Tee_Pink_GL0827_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e8fadc12c5664efa81a3ab8c012b1a96_9366/Essentials_Logo_Tee_Pink_GL0827_02_laydown.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d347f33d9a2a479b8ff3ab8c012b2af9_9366/Essentials_Logo_Tee_Pink_GL0827_41_detail.jpg"
    ],
    sizes: ["XS", "S", "M", "L"],
    gender: "womens",
    isNew: false,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  
  // ADIDAS - Худи
  {
    id: productId++,
    name: "Adidas Trefoil Hoodie",
    price: 5990,
    category: "hoodies",
    brand: "Adidas",
    description: "Культовое худи из мягкого хлопкового флиса с большим логотипом-трилистником на груди и карманом-кенгуру.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e7958e4d4d5844298c68ac6800fc2c78_9366/Trefoil_Hoodie_Black_DT7964_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ddf7a13dde464e7ca765ac6800fc3d93_9366/Trefoil_Hoodie_Black_DT7964_02_laydown.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5ad0eb2994784b29a95eac6800fc4e52_9366/Trefoil_Hoodie_Black_DT7964_41_detail.jpg"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas Adicolor Classics 3-Stripes",
    price: 6490,
    category: "hoodies",
    brand: "Adidas",
    description: "Спортивное худи с тремя фирменными полосками на рукавах и эластичными манжетами.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ff058259bf8f4516a05aab4c0105f061_9366/Adicolor_Classics_3-Stripes_Hoodie_Blue_GN3494_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b42ae9f74c7c4c0a9d2cab4c01060211_9366/Adicolor_Classics_3-Stripes_Hoodie_Blue_GN3494_02_laydown.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/acec025c9b764566a6fdab4c01060e85_9366/Adicolor_Classics_3-Stripes_Hoodie_Blue_GN3494_41_detail.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  
  // ADIDAS - Штаны
  {
    id: productId++,
    name: "Adidas Tiro 21 Track Pants",
    price: 4990,
    category: "pants",
    brand: "Adidas",
    description: "Тренировочные брюки с зауженным кроем и молниями на щиколотках для удобного надевания.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9233dc977fc14bbcbe27acda005cb774_9366/Tiro_21_Track_Pants_Black_GH7306_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/aae4a0f2bbf24222aba6acda005cc6bb_9366/Tiro_21_Track_Pants_Black_GH7306_02_laydown.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9bdc85f1f1e0400db0e2acda005cd3e9_9366/Tiro_21_Track_Pants_Black_GH7306_41_detail.jpg"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Adidas 3-Stripes Pants",
    price: 4490,
    category: "pants",
    brand: "Adidas",
    description: "Классические спортивные брюки с тремя полосками по бокам и эластичным поясом.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/00e25e0040544fbc8f97ab9d00e4807c_9366/Adicolor_Classics_3-Stripes_Pants_Black_GN3458_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d8e291f9926c414eaa46ab9d00e48ef9_9366/Adicolor_Classics_3-Stripes_Pants_Black_GN3458_02_laydown.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3d7acdb99d8e42c48f3cab9d00e49d51_9366/Adicolor_Classics_3-Stripes_Pants_Black_GN3458_41_detail.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  
  // JORDAN - Кроссовки
  {
    id: productId++,
    name: "Jordan 1 Retro High OG",
    price: 16990,
    category: "sneakers",
    brand: "Jordan",
    description: "Легендарные баскетбольные кроссовки Air Jordan 1 с верхом из премиальной кожи и классическими цветовыми сочетаниями.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-jordan-1-retro-high-og-shoes-A7Zzxm.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201d27be31b/air-jordan-1-retro-high-og-shoes-A7Zzxm.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3cc96f43-47b6-43cb-951d-d8f73bb2f912/air-jordan-1-retro-high-og-shoes-A7Zzxm.png"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.9,
    inStock: true
  },
  {
    id: productId++,
    name: "Jordan 4 Retro",
    price: 18990,
    category: "sneakers",
    brand: "Jordan",
    description: "Культовые Jordan 4 с узнаваемым силуэтом, боковыми панелями с перфорацией и видимой воздушной подушкой.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/be5382bd-1f6e-4408-92a9-604950797241/air-jordan-4-retro-shoes-0fWJR0.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a6c35eb7-a417-4e2e-95c8-a65f88c61db5/air-jordan-4-retro-shoes-0fWJR0.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c78c0116-afab-49a5-ab0e-41d725cf73eb/air-jordan-4-retro-shoes-0fWJR0.png"
    ],
    sizes: ["41", "42", "43", "44", "45"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  
  // JORDAN - Одежда
  {
    id: productId++,
    name: "Jordan Jumpman Tee",
    price: 2990,
    category: "tshirts",
    brand: "Jordan",
    description: "Классическая футболка с культовым силуэтом Jumpman на груди из приятной к телу хлопковой ткани.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/56b01dba-9946-4408-aaad-7358706dd169/jordan-jumpman-mens-t-shirt-CxfTRk.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d7b43891-8b96-4e0f-9236-ec83bbce7021/jordan-jumpman-mens-t-shirt-CxfTRk.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5bb130dc-32c0-4095-9797-a68b2e106b40/jordan-jumpman-mens-t-shirt-CxfTRk.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Jordan Essentials Fleece Hoodie",
    price: 7990,
    category: "hoodies",
    brand: "Jordan",
    description: "Теплое флисовое худи с логотипом Jumpman, боковыми карманами и капюшоном на утяжке.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e2f9603b-c40e-4b10-aeec-5c8e19f6b900/jordan-essentials-mens-fleece-pullover-hoodie-5DvMkZ.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61f6aef7-55e5-4fc7-b18d-37fd6e9a6150/jordan-essentials-mens-fleece-pullover-hoodie-5DvMkZ.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c6be3c01-c47e-4dc0-aaef-f93fb8a5d318/jordan-essentials-mens-fleece-pullover-hoodie-5DvMkZ.png"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  
  // STUSSY - Одежда
  {
    id: productId++,
    name: "Stussy Basic Tee",
    price: 4990,
    category: "tshirts",
    brand: "Stussy",
    description: "Культовая футболка с фирменным логотипом Stussy, выполненная из высококачественного хлопка.",
    imageUrl: "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1904834WHITE_1_720x.jpg",
    additionalImages: [
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1904834WHITE_2_720x.jpg",
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1904834WHITE_3_720x.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.6,
    inStock: true
  },
  {
    id: productId++,
    name: "Stussy Stock Logo Hoodie",
    price: 9990,
    category: "hoodies",
    brand: "Stussy",
    description: "Теплое худи из высококачественного хлопкового флиса с культовым логотипом Stussy на груди.",
    imageUrl: "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1924816_BLACK_1_720x.jpg",
    additionalImages: [
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1924816_BLACK_2_720x.jpg",
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1924816_BLACK_3_720x.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: true,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Stussy Cargo Pants",
    price: 11990,
    category: "pants",
    brand: "Stussy",
    description: "Стильные брюки карго с вместительными карманами и фирменной вышивкой Stussy.",
    imageUrl: "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/116501_OLIVE_1_720x.jpg",
    additionalImages: [
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/116501_OLIVE_2_720x.jpg",
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/116501_OLIVE_3_720x.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  
  // GUCCI - Одежда и аксессуары
  {
    id: productId++,
    name: "Gucci Interlocking G Cotton T-shirt",
    price: 39000,
    category: "tshirts",
    brand: "Gucci",
    description: "Премиальная футболка из высококачественного хлопка с фирменным принтом переплетенных букв G.",
    imageUrl: "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1622731805/653334_XJDLW_9088_001_100_0000_Light-Interlocking-G-cotton-T-shirt.jpg",
    additionalImages: [
      "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1622731805/653334_XJDLW_9088_002_100_0000_Light-Interlocking-G-cotton-T-shirt.jpg",
      "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1622731805/653334_XJDLW_9088_003_100_0000_Light-Interlocking-G-cotton-T-shirt.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "mens",
    isNew: false,
    discount: 0,
    rating: 4.8,
    inStock: true
  },
  {
    id: productId++,
    name: "Gucci GG Marmont Matelassé Bag",
    price: 195000,
    category: "accessories",
    brand: "Gucci",
    description: "Культовая сумка GG Marmont из стеганой кожи с характерной пряжкой в виде двойной буквы G.",
    imageUrl: "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1613661303/443497_DTDIT_1000_001_063_0000_Light-GG-Marmont-matelass-shoulder-bag.jpg",
    additionalImages: [
      "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1613661303/443497_DTDIT_1000_002_063_0000_Light-GG-Marmont-matelass-shoulder-bag.jpg",
      "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1613661303/443497_DTDIT_1000_003_063_0000_Light-GG-Marmont-matelass-shoulder-bag.jpg"
    ],
    gender: "womens",
    isNew: false,
    discount: 0,
    rating: 4.9,
    inStock: true
  },
  
  // BALENCIAGA - Одежда и обувь
  {
    id: productId++,
    name: "Balenciaga Triple S Sneakers",
    price: 89000,
    category: "sneakers",
    brand: "Balenciaga",
    description: "Знаковые кроссовки Triple S с массивной многослойной подошвой и сложной конструкцией верха.",
    imageUrl: "https://balenciaga.dam.kering.com/m/1ba571b9a4cf76cb/Large-524036W2CA19000_F.jpg",
    additionalImages: [
      "https://balenciaga.dam.kering.com/m/5e5668daad64e01e/Large-524036W2CA19000_B.jpg",
      "https://balenciaga.dam.kering.com/m/7b3ade30c7c659dd/Large-524036W2CA19000_D.jpg"
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 4.7,
    inStock: true
  },
  {
    id: productId++,
    name: "Balenciaga Logo Hoodie",
    price: 69000,
    category: "hoodies",
    brand: "Balenciaga",
    description: "Худи оверсайз с фирменным логотипом Balenciaga на груди из высококачественного хлопкового флиса.",
    imageUrl: "https://balenciaga.dam.kering.com/m/4e5cb9b6ee0aa86e/Large-578135TIV521070_F.jpg",
    additionalImages: [
      "https://balenciaga.dam.kering.com/m/59f08d4e4dfb72a7/Large-578135TIV521070_B.jpg",
      "https://balenciaga.dam.kering.com/m/52b54b9e22d5f7be/Large-578135TIV521070_D.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "unisex",
    isNew: true,
    discount: 0,
    rating: 4.8,
    inStock: true
  }
];