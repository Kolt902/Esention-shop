// Типы и данные для продуктов в магазине

// Интерфейс продукта
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

// База данных продуктов
export const productDatabase: Product[] = [
  // Nike Sneakers
  {
    id: 1,
    name: "Nike Air Force 1 '07",
    price: 8990,
    category: "sneakers",
    brand: "Nike",
    description: "Классические кроссовки Nike Air Force 1 в белом цвете - легендарная модель, которая никогда не выходит из моды.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201d27be31b/air-force-1-07-mens-shoes-5QFp5Z.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/43d10327-3286-4324-9b1e-0fc89810d08c/air-force-1-07-mens-shoes-5QFp5Z.png"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 48,
    inStock: true
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    price: 12990,
    category: "sneakers",
    brand: "Nike",
    description: "Кроссовки Nike Air Max 270 с массивной воздушной подушкой для максимального комфорта и стиля.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/fg3necfcxgccw3ggsjty/air-max-270-mens-shoes-KkLcGR.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/bupxzujeocextn0xr8d7/air-max-270-mens-shoes-KkLcGR.png"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "men",
    isNew: false,
    discount: 10,
    rating: 46,
    inStock: true
  },
  {
    id: 3,
    name: "Nike Dunk Low Retro",
    price: 10990,
    category: "sneakers",
    brand: "Nike",
    description: "Низкие кроссовки Nike Dunk с подошвой, обеспечивающей отличное сцепление и комфорт на весь день.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9559f730-2e9d-4232-9e89-e8e81ddc8cc4/dunk-low-retro-mens-shoes-76KnBL.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2c8726a5-624d-4c15-99e6-7df8c9281ee6/dunk-low-retro-mens-shoes-76KnBL.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/53c32a0e-a5de-4e3b-9ca1-d3a96aa4d7c2/dunk-low-retro-mens-shoes-76KnBL.png"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    gender: "men",
    isNew: true,
    discount: 0,
    rating: 45,
    inStock: true
  },
  
  // Nike T-Shirts
  {
    id: 4,
    name: "Nike Sportswear Club",
    price: 2490,
    category: "tshirts",
    brand: "Nike",
    description: "Классическая футболка Nike Sportswear Club из мягкого хлопка с логотипом на груди.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c3df1c5-7959-4414-a0f3-41da8bb3a137/sportswear-club-mens-t-shirt-N8Fnn0.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d0b97b2d-8696-4523-b599-18dca6007fd0/sportswear-club-mens-t-shirt-N8Fnn0.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/4ea23a3c-76a6-4536-9de9-aa493b427970/sportswear-club-mens-t-shirt-N8Fnn0.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 43,
    inStock: true
  },
  {
    id: 5,
    name: "Nike Dri-FIT Run Division",
    price: 3990,
    category: "tshirts",
    brand: "Nike",
    description: "Беговая футболка Nike Dri-FIT с технологией отвода влаги для комфорта во время тренировок.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/57d21492-0c48-456c-bdfa-cc152a88cf63/dri-fit-run-division-running-t-shirt-TRgJ4V.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/c2c6c6b6-c543-458b-88c8-9cc747ec9fc3/dri-fit-run-division-running-t-shirt-TRgJ4V.png"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    isNew: true,
    discount: 0,
    rating: 41,
    inStock: true
  },
  
  // Nike Hoodies
  {
    id: 6,
    name: "Nike Sportswear Club Fleece",
    price: 5490,
    category: "hoodies",
    brand: "Nike",
    description: "Теплая худи Nike Sportswear Club Fleece из мягкого флиса с начесом для комфорта в прохладную погоду.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/gw1tzq9wrqoqhfvgjnvx/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ks0tgzwx6vfyi3gzmstl/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ojgskojjxgdsb54ywdn7/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "men",
    isNew: false,
    discount: 15,
    rating: 47,
    inStock: true
  },
  {
    id: 7,
    name: "Nike Therma-FIT",
    price: 6990,
    category: "hoodies",
    brand: "Nike",
    description: "Худи Nike Therma-FIT с технологией сохранения тепла для тренировок в холодную погоду.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7c1a0d99-a00a-449b-aa1b-dafcf6f8a94c/therma-fit-mens-training-hoodie-M5VbHc.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e4df5ce9-e5e6-429a-bfb6-24734c243130/therma-fit-mens-training-hoodie-M5VbHc.png"
    ],
    sizes: ["M", "L", "XL", "XXL"],
    gender: "men",
    isNew: true,
    discount: 0,
    rating: 44,
    inStock: true
  },
  
  // Nike Pants
  {
    id: 8,
    name: "Nike Sportswear Tech Fleece",
    price: 7990,
    category: "pants",
    brand: "Nike",
    description: "Джоггеры Nike Sportswear Tech Fleece с инновационной тканью для тепла без утяжеления.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c289c21-3f30-4ff8-9bbd-9f3045d71b55/sportswear-tech-fleece-mens-joggers-2bw5fs.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/845ed45c-ef8a-4be7-b633-54d311a818a0/sportswear-tech-fleece-mens-joggers-2bw5fs.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7ec78f49-9c99-4e20-9e0f-10c4b1c7d258/sportswear-tech-fleece-mens-joggers-2bw5fs.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 48,
    inStock: true
  },
  {
    id: 9,
    name: "Nike Dri-FIT Challenger",
    price: 4990,
    category: "pants",
    brand: "Nike",
    description: "Беговые брюки Nike Dri-FIT Challenger с легкой эластичной тканью для тренировок.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f66a8b3b-8987-4c6c-b798-3b96e0b46453/dri-fit-challenger-mens-woven-running-pants-0hStJX.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9bef7f5e-37a8-4989-9970-ba4a9cd34015/dri-fit-challenger-mens-woven-running-pants-0hStJX.png"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    isNew: false,
    discount: 10,
    rating: 42,
    inStock: true
  },
  
  // Adidas Sneakers
  {
    id: 10,
    name: "Adidas Stan Smith",
    price: 8490,
    category: "sneakers",
    brand: "Adidas",
    description: "Культовые кроссовки Adidas Stan Smith из премиальной кожи с перфорированными полосками.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/246908d6be2a400d91faac1e00f5245a_9366/Stan_Smith_Shoes_White_FX5502_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a36518227f26419abf04ac1e00f52b06_9366/Stan_Smith_Shoes_White_FX5502_04_standard.jpg"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 47,
    inStock: true
  },
  {
    id: 11,
    name: "Adidas Superstar",
    price: 8990,
    category: "sneakers",
    brand: "Adidas",
    description: "Легендарные кроссовки Adidas Superstar с культовым резиновым носком в форме ракушки.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Superstar_Shoes_White_EG4958_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c0953ceaa871453abf6baad6009a32d6_9366/Superstar_Shoes_White_EG4958_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e4e151934ee845289c22aad6009a3a12_9366/Superstar_Shoes_White_EG4958_04_standard.jpg"
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    gender: "unisex",
    isNew: false,
    discount: 15,
    rating: 48,
    inStock: true
  },
  {
    id: 12,
    name: "Adidas Ultraboost 22",
    price: 14990,
    category: "sneakers",
    brand: "Adidas",
    description: "Беговые кроссовки Adidas Ultraboost 22 с отзывчивой амортизацией для бега на любые дистанции.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/edf9cc95cde94970829ead7800abd905_9366/Ultraboost_22_Shoes_Black_GZ0127_02_standard.jpg",
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ff3f7336d4d74d0caeb3ad7800abe91b_9366/Ultraboost_22_Shoes_Black_GZ0127_04_standard.jpg"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "men",
    isNew: true,
    discount: 0,
    rating: 46,
    inStock: true
  },
  
  // Adidas T-Shirts
  {
    id: 13,
    name: "Adidas Trefoil Tee",
    price: 2290,
    category: "tshirts",
    brand: "Adidas",
    description: "Классическая футболка Adidas с культовым логотипом Trefoil на груди.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0f3a8487157d47d98476ac5e003d37ec_9366/Trefoil_Tee_White_GN3462_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6967df167ae44b3b240ac5e003d47b5_9366/Trefoil_Tee_White_GN3462_02_laydown.jpg"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 44,
    inStock: true
  },
  {
    id: 14,
    name: "Adidas Originals 3-Stripes",
    price: 2490,
    category: "tshirts",
    brand: "Adidas",
    description: "Футболка Adidas Originals с культовыми тремя полосками на рукавах.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/df020db6aa2e440cb0fcae1f00a4ff68_9366/3-Stripes_Tee_Black_GN3494_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f5b97d84a49c4a2ca96bae1f00a510c4_9366/3-Stripes_Tee_Black_GN3494_02_laydown.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    isNew: false,
    discount: 10,
    rating: 43,
    inStock: true
  },
  
  // Adidas Hoodies
  {
    id: 15,
    name: "Adidas Trefoil Hoodie",
    price: 5490,
    category: "hoodies",
    brand: "Adidas",
    description: "Худи Adidas Trefoil из мягкого хлопкового флиса с культовым логотипом на груди.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e7958e4d4d5844298c68ac6800fc2c78_9366/Trefoil_Hoodie_Black_DT7964_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ddf7a13dde464e7ca765ac6800fc3d93_9366/Trefoil_Hoodie_Black_DT7964_02_laydown.jpg"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 46,
    inStock: true
  },
  {
    id: 16,
    name: "Adidas 3-Stripes Hoodie",
    price: 5990,
    category: "hoodies",
    brand: "Adidas",
    description: "Худи Adidas с культовыми тремя полосками на рукавах и логотипом на груди.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2f631319ea644852b9edac7d00fd6740_9366/Adicolor_Classics_3-Stripes_Hoodie_Blue_H06676_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8b68f55844c541268734ac7d00fd7752_9366/Adicolor_Classics_3-Stripes_Hoodie_Blue_H06676_02_laydown.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    isNew: true,
    discount: 0,
    rating: 45,
    inStock: true
  },
  
  // Adidas Pants
  {
    id: 17,
    name: "Adidas Tiro 21 Track Pants",
    price: 4490,
    category: "pants",
    brand: "Adidas",
    description: "Спортивные брюки Adidas Tiro 21 с технологией отвода влаги для комфорта во время тренировок.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9233dc977fc14bbcbe27acda005cb774_9366/Tiro_21_Track_Pants_Black_GH7306_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/aae4a0f2bbf24222aba6acda005cc6bb_9366/Tiro_21_Track_Pants_Black_GH7306_02_laydown.jpg"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "men",
    isNew: false,
    discount: 15,
    rating: 44,
    inStock: true
  },
  {
    id: 18,
    name: "Adidas Essentials 3-Stripes",
    price: 3990,
    category: "pants",
    brand: "Adidas",
    description: "Спортивные брюки Adidas Essentials с тремя полосками по бокам и комфортным поясом на шнурке.",
    imageUrl: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/206b590f6f1b497f8a39ac770124cb2f_9366/Essentials_3-Stripes_Pants_Black_GK8831_01_laydown.jpg",
    additionalImages: [
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5dda9ed1b2174ee08e2eac770124d6f0_9366/Essentials_3-Stripes_Pants_Black_GK8831_02_laydown.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 43,
    inStock: true
  },
  
  // Jordan Sneakers
  {
    id: 19,
    name: "Air Jordan 1 Mid",
    price: 11990,
    category: "sneakers",
    brand: "Jordan",
    description: "Культовые кроссовки Air Jordan 1 Mid в среднем исполнении с мягкой амортизацией и комфортной посадкой.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-0896e115-351a-4e1c-9c3a-b38623b27b2a/air-jordan-1-mid-mens-shoes-86f1ZW.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-f7e2e66c-ac24-4b11-9c4e-e49a753b795f/air-jordan-1-mid-mens-shoes-86f1ZW.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-5c99e5a5-77e1-4a36-aaab-82b305252911/air-jordan-1-mid-mens-shoes-86f1ZW.png"
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 47,
    inStock: true
  },
  {
    id: 20,
    name: "Air Jordan 4 Retro",
    price: 16990,
    category: "sneakers",
    brand: "Jordan",
    description: "Легендарные кроссовки Air Jordan 4 Retro с видимой системой амортизации Air и культовым дизайном.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8b8c0154-d012-4d52-8301-e51fed6e6622/air-jordan-4-retro-se-womens-shoes-5ZJ4Pq.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d567b57a-2320-44b6-a3a3-fef0a9e04581/air-jordan-4-retro-se-womens-shoes-5ZJ4Pq.png",
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a3f4e778-4f31-4cfe-9360-5a4f4ff50b47/air-jordan-4-retro-se-womens-shoes-5ZJ4Pq.png"
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    gender: "unisex",
    isNew: true,
    discount: 0,
    rating: 49,
    inStock: true
  },
  
  // Jordan Clothes
  {
    id: 21,
    name: "Jordan Jumpman T-Shirt",
    price: 2990,
    category: "tshirts",
    brand: "Jordan",
    description: "Футболка Jordan Jumpman из мягкого хлопка с культовым логотипом баскетболиста на груди.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/56b01dba-9946-4408-aaad-7358706dd169/jordan-jumpman-mens-t-shirt-CxfTRk.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d7b43891-8b96-4e0f-9236-ec83bbce7021/jordan-jumpman-mens-t-shirt-CxfTRk.png"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 45,
    inStock: true
  },
  {
    id: 22,
    name: "Jordan Flight Fleece Hoodie",
    price: 6990,
    category: "hoodies",
    brand: "Jordan",
    description: "Худи Jordan Flight Fleece из премиального флиса для комфорта в холодную погоду.",
    imageUrl: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/52d56ba6-9a12-4512-81d2-e56dca102703/jordan-flight-fleece-mens-pullover-hoodie-kxcbHK.png",
    additionalImages: [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d7b43891-8b96-4e0f-9236-ec83bbce7021/jordan-flight-fleece-mens-pullover-hoodie-kxcbHK.png"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    isNew: false,
    discount: 10,
    rating: 46,
    inStock: true
  },
  
  // Stussy Products
  {
    id: 23,
    name: "Stussy Basic Logo Tee",
    price: 5990,
    category: "tshirts",
    brand: "Stussy",
    description: "Классическая футболка Stussy из премиального хлопка с культовым логотипом на груди.",
    imageUrl: "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1904834WHITE_1_720x.jpg",
    additionalImages: [
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1904834WHITE_2_720x.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 46,
    inStock: true
  },
  {
    id: 24,
    name: "Stussy Stock Logo Hoodie",
    price: 12990,
    category: "hoodies",
    brand: "Stussy",
    description: "Худи Stussy Stock Logo из плотного хлопка с культовым логотипом на груди.",
    imageUrl: "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1924816_BLACK_1_720x.jpg",
    additionalImages: [
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1924816_BLACK_2_720x.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "unisex",
    isNew: true,
    discount: 0,
    rating: 47,
    inStock: true
  },
  {
    id: 25,
    name: "Stussy Uniform Cargo Pants",
    price: 14990,
    category: "pants",
    brand: "Stussy",
    description: "Карго-брюки Stussy Uniform из прочного хлопка с множеством карманов.",
    imageUrl: "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/116501_OLIVE_1_720x.jpg",
    additionalImages: [
      "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/116501_OLIVE_2_720x.jpg"
    ],
    sizes: ["30", "32", "34", "36"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 45,
    inStock: true
  },
  
  // Gucci Products
  {
    id: 26,
    name: "Gucci Interlocking G Cotton T-shirt",
    price: 39000,
    category: "tshirts",
    brand: "Gucci",
    description: "Футболка Gucci из премиального хлопка с узнаваемым логотипом G на груди.",
    imageUrl: "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1622731805/653334_XJDLW_9088_001_100_0000_Light-Interlocking-G-cotton-T-shirt.jpg",
    additionalImages: [
      "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1622731805/653334_XJDLW_9088_002_100_0000_Light-Interlocking-G-cotton-T-shirt.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    isNew: false,
    discount: 0,
    rating: 48,
    inStock: true
  },
  {
    id: 27,
    name: "Gucci GG Marmont Shoulder Bag",
    price: 159000,
    category: "accessories",
    brand: "Gucci",
    description: "Культовая сумка Gucci GG Marmont из мягкой премиальной кожи с фирменной застежкой GG.",
    imageUrl: "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1613661303/443497_DTDIT_1000_001_063_0000_Light-GG-Marmont-matelass-shoulder-bag.jpg",
    additionalImages: [
      "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1613661303/443497_DTDIT_1000_002_063_0000_Light-GG-Marmont-matelass-shoulder-bag.jpg"
    ],
    gender: "women",
    isNew: true,
    discount: 0,
    rating: 49,
    inStock: true
  },
  
  // Balenciaga Products
  {
    id: 28,
    name: "Balenciaga Triple S Sneakers",
    price: 89900,
    category: "sneakers",
    brand: "Balenciaga",
    description: "Культовые массивные кроссовки Balenciaga Triple S с многослойной подошвой.",
    imageUrl: "https://balenciaga.dam.kering.com/m/1ba571b9a4cf76cb/Large-524036W2CA19000_F.jpg",
    additionalImages: [
      "https://balenciaga.dam.kering.com/m/5e5668daad64e01e/Large-524036W2CA19000_B.jpg"
    ],
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    gender: "unisex",
    isNew: false,
    discount: 0,
    rating: 47,
    inStock: true
  },
  {
    id: 29,
    name: "Balenciaga Logo Hoodie",
    price: 79900,
    category: "hoodies",
    brand: "Balenciaga",
    description: "Худи Balenciaga из премиального хлопка с контрастным логотипом на груди.",
    imageUrl: "https://balenciaga.dam.kering.com/m/4e5cb9b6ee0aa86e/Large-578135TIV521070_F.jpg",
    additionalImages: [
      "https://balenciaga.dam.kering.com/m/59f08d4e4dfb72a7/Large-578135TIV521070_B.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    gender: "unisex",
    isNew: true,
    discount: 0,
    rating: 46,
    inStock: true
  }
];