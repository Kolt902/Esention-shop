import { Product } from './productDatabase';
import { getOfficialProductImages } from './official-product-images';

// Базовые данные для генерации продуктов
type ProductTemplate = {
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  sizes?: string[];
  gender?: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
};

// Основные категории
const categories = {
  nike: ['sneakers', 'tshirts', 'hoodies', 'pants', 'shorts', 'jackets'],
  adidas: ['sneakers', 'tshirts', 'hoodies', 'pants', 'shorts', 'jackets'],
  jordan: ['sneakers', 'tshirts', 'hoodies', 'jackets'],
  stussy: ['tshirts', 'hoodies', 'jackets', 'accessories'],
  balenciaga: ['sneakers', 'tshirts', 'hoodies', 'jackets', 'accessories'],
  gucci: ['sneakers', 'tshirts', 'hoodies', 'jackets', 'accessories']
};

// Размеры обуви и одежды
const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Функция генерации рейтинга
const generateRating = (): number => {
  // От 40 до 50 (деленные на 10 позже дадут 4.0-5.0)
  return Math.floor(Math.random() * 11) + 40;
};

// Функция генерации скидки (если есть)
const generateDiscount = (): number | undefined => {
  const hasDiscount = Math.random() > 0.7; // 30% товаров со скидкой
  if (hasDiscount) {
    // 10%, 15%, 20%, 25%, 30%
    return [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)];
  }
  return undefined;
};

// Функция для генерации продуктов Nike
export function generateNikeProducts(startId: number): Product[] {
  const products: Product[] = [];
  
  // Nike Sneakers
  const nikeShoes = [
    {
      name: "Nike Air Force 1 '07",
      price: 89.90,
      category: "sneakers",
      description: "Классические кроссовки Nike Air Force 1 в белом цвете - легендарная модель, которая никогда не выходит из моды.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike Air Force 1", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike Air Force 1", "sneakers")
    },
    {
      name: "Nike Air Max 97",
      price: 139.90,
      category: "sneakers",
      description: "Культовые Nike Air Max 97 с полноразмерной воздушной подушкой и волнообразным дизайном.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike Air Max", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike Air Max", "sneakers")
    },
    {
      name: "Nike Dunk Low",
      price: 99.90,
      category: "sneakers",
      description: "Классические баскетбольные кроссовки Nike Dunk Low в современном исполнении.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike Dunk", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike Dunk", "sneakers")
    },
    {
      name: "Nike Air Jordan 1 Low",
      price: 109.90,
      category: "sneakers",
      description: "Легендарные Nike Air Jordan 1 в низком исполнении, созданные для повседневной носки.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike Jordan", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike Jordan", "sneakers")
    },
    {
      name: "Nike Air VaporMax Plus",
      price: 179.90,
      category: "sneakers",
      description: "Инновационные кроссовки с уникальной системой амортизации VaporMax и футуристическим дизайном.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike", "sneakers")
    },
    {
      name: "Nike Revolution 6",
      price: 59.90,
      category: "sneakers",
      description: "Легкие беговые кроссовки Nike Revolution 6 для ежедневных пробежек.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike", "sneakers")
    },
    {
      name: "Nike Air Max 270",
      price: 129.90,
      category: "sneakers",
      description: "Стильные Nike Air Max 270 с самой высокой воздушной подушкой в линейке Air Max.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike Air Max", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike Air Max", "sneakers")
    },
    {
      name: "Nike Blazer Mid '77",
      price: 94.90,
      category: "sneakers",
      description: "Культовые высокие кеды Nike Blazer с ретро-дизайном, впервые представленные в 1977 году.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike", "sneakers")
    },
    {
      name: "Nike PG 6",
      price: 109.90,
      category: "sneakers",
      description: "Баскетбольные кроссовки Paul George с превосходной амортизацией и отличным сцеплением.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike", "sneakers")
    },
    {
      name: "Nike SB Dunk High",
      price: 119.90,
      category: "sneakers",
      description: "Высокие кроссовки Nike SB Dunk, разработанные специально для скейтбординга.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Nike Dunk", "sneakers")[0],
      additionalImages: getOfficialProductImages("Nike Dunk", "sneakers")
    }
  ];
  
  // Nike T-shirts
  const nikeTshirts = [
    {
      name: "Nike Sportswear Club",
      price: 29.90,
      category: "tshirts",
      description: "Классическая футболка Nike Sportswear с логотипом Swoosh, выполненная из мягкого хлопкового материала.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "tshirts")[0],
      additionalImages: getOfficialProductImages("Nike", "tshirts")
    },
    {
      name: "Nike Dri-FIT Legend",
      price: 34.90,
      category: "tshirts",
      description: "Спортивная футболка с технологией Dri-FIT, которая отводит влагу и обеспечивает комфорт во время тренировок.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "tshirts")[0],
      additionalImages: getOfficialProductImages("Nike", "tshirts")
    },
    {
      name: "Nike Air",
      price: 32.90,
      category: "tshirts",
      description: "Стильная футболка Nike Air с крупным принтом на груди.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "tshirts")[0],
      additionalImages: getOfficialProductImages("Nike", "tshirts")
    },
    {
      name: "Nike Jordan Jumpman",
      price: 35.90,
      category: "tshirts",
      description: "Футболка с культовым силуэтом Jumpman - идеальный выбор для фанатов баскетбола и бренда Jordan.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike Jordan", "tshirts")[0],
      additionalImages: getOfficialProductImages("Nike Jordan", "tshirts")
    },
    {
      name: "Nike KD",
      price: 37.90,
      category: "tshirts",
      description: "Баскетбольная футболка из линейки Kevin Durant, выполненная из легкого дышащего материала.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "tshirts")[0],
      additionalImages: getOfficialProductImages("Nike", "tshirts")
    }
  ];
  
  // Nike Hoodies
  const nikeHoodies = [
    {
      name: "Nike Sportswear Club Fleece",
      price: 69.90,
      category: "hoodies",
      description: "Теплая толстовка с капюшоном Nike Sportswear из мягкой ткани с начесом для комфорта и тепла.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "hoodies")[0],
      additionalImages: getOfficialProductImages("Nike", "hoodies")
    },
    {
      name: "Nike Therma-FIT",
      price: 79.90,
      category: "hoodies",
      description: "Худи Nike с технологией Therma-FIT, которая сохраняет тепло тела для максимального комфорта в холодную погоду.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "hoodies")[0],
      additionalImages: getOfficialProductImages("Nike", "hoodies")
    },
    {
      name: "Nike SB Icon",
      price: 64.90,
      category: "hoodies",
      description: "Скейтерская толстовка Nike SB с карманом-кенгуру и регулируемым капюшоном.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "hoodies")[0],
      additionalImages: getOfficialProductImages("Nike", "hoodies")
    },
    {
      name: "Nike Tech Fleece",
      price: 89.90,
      category: "hoodies",
      description: "Премиальная толстовка Nike Tech Fleece из инновационного материала, который обеспечивает тепло без лишнего веса.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "hoodies")[0],
      additionalImages: getOfficialProductImages("Nike", "hoodies")
    }
  ];
  
  // Nike Pants
  const nikePants = [
    {
      name: "Nike Sportswear Club Fleece",
      price: 59.90,
      category: "pants",
      description: "Удобные флисовые брюки Nike Sportswear с эластичным поясом и карманами для повседневной носки.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "pants")[0],
      additionalImages: getOfficialProductImages("Nike", "pants")
    },
    {
      name: "Nike Dri-FIT Academy",
      price: 49.90,
      category: "pants",
      description: "Тренировочные брюки Nike Dri-FIT Academy, которые обеспечивают свободу движений во время занятий спортом.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "pants")[0],
      additionalImages: getOfficialProductImages("Nike", "pants")
    },
    {
      name: "Nike Tech Fleece",
      price: 79.90,
      category: "pants",
      description: "Джоггеры Nike Tech Fleece из легкого, но теплого материала с зауженным силуэтом и карманами на молнии.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "pants")[0],
      additionalImages: getOfficialProductImages("Nike", "pants")
    }
  ];
  
  // Nike Jackets
  const nikeJackets = [
    {
      name: "Nike Sportswear Windrunner",
      price: 84.90,
      category: "jackets",
      description: "Классическая куртка Windrunner с шевронным дизайном и капюшоном, выполненная из легкой ткани.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "jackets")[0] || getOfficialProductImages("Nike", "hoodies")[0],
      additionalImages: getOfficialProductImages("Nike", "jackets") || getOfficialProductImages("Nike", "hoodies")
    },
    {
      name: "Nike Therma-FIT Repel",
      price: 109.90,
      category: "jackets",
      description: "Зимняя куртка Nike с водоотталкивающим покрытием и технологией Therma-FIT для сохранения тепла.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "jackets")[0] || getOfficialProductImages("Nike", "hoodies")[0],
      additionalImages: getOfficialProductImages("Nike", "jackets") || getOfficialProductImages("Nike", "hoodies")
    },
    {
      name: "Nike ACG",
      price: 129.90,
      category: "jackets",
      description: "Куртка Nike ACG (All Conditions Gear), разработанная для активного отдыха на природе и экстремальных погодных условий.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Nike", "jackets")[0] || getOfficialProductImages("Nike", "hoodies")[0],
      additionalImages: getOfficialProductImages("Nike", "jackets") || getOfficialProductImages("Nike", "hoodies")
    }
  ];

  // Объединение всех продуктов Nike
  const allNikeTemplates: ProductTemplate[] = [
    ...nikeShoes,
    ...nikeTshirts,
    ...nikeHoodies,
    ...nikePants,
    ...nikeJackets
  ];
  
  let id = startId;
  
  // Создание товаров из шаблонов с добавлением дополнительных свойств
  allNikeTemplates.forEach(template => {
    const product: Product = {
      id: id++,
      brand: "Nike",
      name: template.name,
      price: template.price,
      category: template.category,
      description: template.description,
      imageUrl: template.imageUrl,
      additionalImages: template.additionalImages || [],
      sizes: template.sizes || [],
      isNew: Math.random() > 0.8, // 20% вероятность, что товар новинка
      discount: generateDiscount(),
      rating: generateRating(),
      inStock: Math.random() > 0.1, // 90% товаров в наличии
      gender: template.gender || (Math.random() > 0.5 ? "mens" : "womens")
    };
    
    products.push(product);
  });
  
  return products;
}

// Функция для генерации продуктов Adidas
export function generateAdidasProducts(startId: number): Product[] {
  const products: Product[] = [];
  
  // Adidas Sneakers
  const adidasShoes = [
    {
      name: "Adidas Superstar",
      price: 89.90,
      category: "sneakers",
      description: "Культовые кроссовки Adidas Superstar с узнаваемым резиновым мыском, которые уже более 50 лет не выходят из моды.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Adidas Superstar", "sneakers")[0],
      additionalImages: getOfficialProductImages("Adidas Superstar", "sneakers")
    },
    {
      name: "Adidas Stan Smith",
      price: 84.90,
      category: "sneakers",
      description: "Легендарные кроссовки Adidas Stan Smith с минималистичным дизайном и перфорацией в виде трех полосок.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Adidas Stan Smith", "sneakers")[0],
      additionalImages: getOfficialProductImages("Adidas Stan Smith", "sneakers")
    },
    {
      name: "Adidas Ultraboost",
      price: 149.90,
      category: "sneakers",
      description: "Инновационные беговые кроссовки с технологией Boost для максимальной амортизации и возврата энергии.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Adidas Ultraboost", "sneakers")[0],
      additionalImages: getOfficialProductImages("Adidas Ultraboost", "sneakers")
    },
    {
      name: "Adidas NMD R1",
      price: 129.90,
      category: "sneakers",
      description: "Городские кроссовки Adidas NMD с технологией Boost и характерными вставками на промежуточной подошве.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Adidas NMD", "sneakers")[0],
      additionalImages: getOfficialProductImages("Adidas NMD", "sneakers")
    },
    {
      name: "Adidas Forum Low",
      price: 99.90,
      category: "sneakers",
      description: "Баскетбольные кроссовки Adidas Forum с ремешком на щиколотке, которые стали иконой уличной моды.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Adidas Forum", "sneakers")[0],
      additionalImages: getOfficialProductImages("Adidas Forum", "sneakers")
    },
    {
      name: "Adidas Ozelia",
      price: 109.90,
      category: "sneakers",
      description: "Массивные кроссовки Adidas Ozelia в духе 90-х с многослойным верхом и футуристическим дизайном.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Adidas Ozelia", "sneakers")[0],
      additionalImages: getOfficialProductImages("Adidas Ozelia", "sneakers")
    },
    {
      name: "Adidas 4DFWD",
      price: 189.90,
      category: "sneakers",
      description: "Революционные кроссовки с 3D-печатной подошвой 4D, трансформирующей вертикальное давление в горизонтальное движение вперед.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Adidas 4DFWD", "sneakers")[0],
      additionalImages: getOfficialProductImages("Adidas 4DFWD", "sneakers")
    }
  ];
  
  // Adidas T-shirts
  const adidasTshirts = [
    {
      name: "Adidas Originals Trefoil",
      price: 29.90,
      category: "tshirts",
      description: "Классическая футболка Adidas Originals с культовым логотипом Trefoil на груди.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Trefoil", "tshirts")[0],
      additionalImages: getOfficialProductImages("Adidas Trefoil", "tshirts")
    },
    {
      name: "Adidas Essentials 3-Stripes",
      price: 24.90,
      category: "tshirts",
      description: "Спортивная футболка Adidas Essentials с фирменными тремя полосками на рукавах.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Essentials", "tshirts")[0],
      additionalImages: getOfficialProductImages("Adidas Essentials", "tshirts")
    },
    {
      name: "Adidas Adicolor Classics",
      price: 34.90,
      category: "tshirts",
      description: "Яркая футболка из линейки Adicolor с контрастными цветовыми блоками в ретро-стиле.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Adicolor", "tshirts")[0],
      additionalImages: getOfficialProductImages("Adidas Adicolor", "tshirts")
    },
    {
      name: "Adidas AEROREADY",
      price: 32.90,
      category: "tshirts",
      description: "Тренировочная футболка с технологией AEROREADY, которая отводит влагу и сохраняет ощущение сухости во время интенсивных тренировок.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas AEROREADY", "tshirts")[0],
      additionalImages: getOfficialProductImages("Adidas AEROREADY", "tshirts")
    }
  ];
  
  // Adidas Hoodies
  const adidasHoodies = [
    {
      name: "Adidas Originals Trefoil Hoodie",
      price: 69.90,
      category: "hoodies",
      description: "Классическая толстовка Adidas Originals с капюшоном и большим логотипом Trefoil на груди.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Trefoil Hoodie", "hoodies")[0],
      additionalImages: getOfficialProductImages("Adidas Trefoil Hoodie", "hoodies")
    },
    {
      name: "Adidas Essentials 3-Stripes",
      price: 59.90,
      category: "hoodies",
      description: "Спортивная толстовка Adidas Essentials с тремя полосками на рукавах и карманом-кенгуру.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Essentials Hoodie", "hoodies")[0],
      additionalImages: getOfficialProductImages("Adidas Essentials Hoodie", "hoodies")
    },
    {
      name: "Adidas Z.N.E.",
      price: 89.90,
      category: "hoodies",
      description: "Премиальная толстовка Adidas Z.N.E., разработанная для атлетов, которые хотят сохранять концентрацию перед соревнованиями.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas ZNE Hoodie", "hoodies")[0],
      additionalImages: getOfficialProductImages("Adidas ZNE Hoodie", "hoodies")
    }
  ];
  
  // Adidas Pants
  const adidasPants = [
    {
      name: "Adidas Tiro",
      price: 54.90,
      category: "pants",
      description: "Футбольные тренировочные брюки Adidas Tiro с зауженным кроем и боковыми карманами на молнии.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Tiro", "pants")[0],
      additionalImages: getOfficialProductImages("Adidas Tiro", "pants")
    },
    {
      name: "Adidas Originals Adicolor",
      price: 69.90,
      category: "pants",
      description: "Спортивные брюки Adicolor из хлопкового трикотажа с тремя культовыми полосками вдоль штанин.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Adicolor Pants", "pants")[0],
      additionalImages: getOfficialProductImages("Adidas Adicolor Pants", "pants")
    },
    {
      name: "Adidas Sportswear Future Icons",
      price: 59.90,
      category: "pants",
      description: "Удобные брюки Adidas Sportswear с эластичным поясом и мягкой внутренней отделкой для повседневной носки.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Future Icons", "pants")[0],
      additionalImages: getOfficialProductImages("Adidas Future Icons", "pants")
    }
  ];
  
  // Adidas Jackets
  const adidasJackets = [
    {
      name: "Adidas Originals Superstar Track Top",
      price: 79.90,
      category: "jackets",
      description: "Культовая олимпийка Adidas Superstar с тремя полосками на рукавах и высоким воротником.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Superstar Track Top", "jackets")[0],
      additionalImages: getOfficialProductImages("Adidas Superstar Track Top", "jackets")
    },
    {
      name: "Adidas Terrex MYSHELTER",
      price: 149.90,
      category: "jackets",
      description: "Технологичная куртка Adidas Terrex, защищающая от ветра и дождя благодаря мембране RAIN.RDY.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas Terrex MYSHELTER", "jackets")[0],
      additionalImages: getOfficialProductImages("Adidas Terrex MYSHELTER", "jackets")
    },
    {
      name: "Adidas BSC 3-Stripes RAIN.RDY",
      price: 99.90,
      category: "jackets",
      description: "Водонепроницаемая куртка Adidas с капюшоном и технологией RAIN.RDY для защиты от непогоды.",
      sizes: clothingSizes,
      imageUrl: getOfficialProductImages("Adidas BSC Jacket", "jackets")[0],
      additionalImages: getOfficialProductImages("Adidas BSC Jacket", "jackets")
    }
  ];

  // Объединение всех продуктов Adidas
  const allAdidasTemplates: ProductTemplate[] = [
    ...adidasShoes,
    ...adidasTshirts,
    ...adidasHoodies,
    ...adidasPants,
    ...adidasJackets
  ];
  
  let id = startId;
  
  // Создание товаров из шаблонов с добавлением дополнительных свойств
  allAdidasTemplates.forEach(template => {
    const product: Product = {
      id: id++,
      brand: "Adidas",
      name: template.name,
      price: template.price,
      category: template.category,
      description: template.description,
      imageUrl: template.imageUrl,
      additionalImages: template.additionalImages || [],
      sizes: template.sizes || [],
      isNew: Math.random() > 0.8, // 20% вероятность, что товар новинка
      discount: generateDiscount(),
      rating: generateRating(),
      inStock: Math.random() > 0.1, // 90% товаров в наличии
      gender: template.gender || (Math.random() > 0.5 ? "mens" : "womens")
    };
    
    products.push(product);
  });
  
  return products;
}

// Функция для генерации продуктов Jordan
export function generateJordanProducts(startId: number): Product[] {
  const products: Product[] = [];
  
  // Jordan Sneakers
  const jordanShoes = [
    {
      name: "Air Jordan 1 Retro High OG",
      price: 159.90,
      category: "sneakers",
      description: "Легендарные баскетбольные кроссовки Air Jordan 1, впервые выпущенные в 1985 году, с высоким силуэтом и классическими цветовыми решениями.",
      sizes: shoeSizes,
      imageUrl: getOfficialProductImages("Air Jordan 1", "sneakers")[0],
      additionalImages: getOfficialProductImages("Air Jordan 1", "sneakers")
    },
    {
      name: "Air Jordan 4 Retro",
      price: 16990,
      category: "sneakers",
      description: "Культовые кроссовки Air Jordan 4 с характерным дизайном, включающим видимую воздушную подушку и элементы поддержки на шнуровке.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesJordan[3],
      additionalImages: officialProductImagesJordan.slice(3, 6)
    },
    {
      name: "Air Jordan 11 Retro",
      price: 18990,
      category: "sneakers",
      description: "Легендарные баскетбольные кроссовки с лакированной кожей, которые Michael Jordan носил во время своего триумфального возвращения в NBA.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesJordan[6],
      additionalImages: officialProductImagesJordan.slice(6, 9)
    },
    {
      name: "Air Jordan 3 Retro",
      price: 16990,
      category: "sneakers",
      description: "Первые кроссовки Air Jordan, разработанные Tinker Hatfield, с характерным принтом 'слоновья кожа' и видимой воздушной подушкой.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesJordan[9],
      additionalImages: officialProductImagesJordan.slice(9, 12)
    },
    {
      name: "Jordan Why Not Zer0.5",
      price: 12990,
      category: "sneakers",
      description: "Баскетбольные кроссовки от Russell Westbrook, разработанные для взрывных и атлетичных игроков.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesJordan[12],
      additionalImages: officialProductImagesJordan.slice(12, 15)
    },
    {
      name: "Jordan Delta 2",
      price: 10990,
      category: "sneakers",
      description: "Современные кроссовки Jordan с технологичной подошвой React и футуристическим дизайном для повседневной носки.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesJordan[15],
      additionalImages: officialProductImagesJordan.slice(15, 18)
    }
  ];
  
  // Jordan T-shirts
  const jordanTshirts = [
    {
      name: "Jordan Jumpman",
      price: 3490,
      category: "tshirts",
      description: "Классическая футболка с культовым силуэтом Jumpman, ставшим символом бренда Jordan.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[18],
      additionalImages: officialProductImagesJordan.slice(18, 21)
    },
    {
      name: "Jordan 23 Engineered",
      price: 4990,
      category: "tshirts",
      description: "Современная футболка из линейки 23 Engineered с техническими деталями и инновационным кроем.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[21],
      additionalImages: officialProductImagesJordan.slice(21, 24)
    },
    {
      name: "Jordan Air",
      price: 3990,
      category: "tshirts",
      description: "Стильная футболка с графикой, вдохновленной наследием Michael Jordan и классической линейкой Air Jordan.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[24],
      additionalImages: officialProductImagesJordan.slice(24, 27)
    }
  ];
  
  // Jordan Hoodies
  const jordanHoodies = [
    {
      name: "Jordan Jumpman Fleece",
      price: 7990,
      category: "hoodies",
      description: "Классическая толстовка Jordan с капюшоном, большим логотипом Jumpman и карманом-кенгуру.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[27],
      additionalImages: officialProductImagesJordan.slice(27, 30)
    },
    {
      name: "Jordan Flight",
      price: 8990,
      category: "hoodies",
      description: "Стильная толстовка с принтом, вдохновленным наследием Air Jordan и баскетбольной культурой.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[30],
      additionalImages: officialProductImagesJordan.slice(30, 33)
    },
    {
      name: "Jordan 23 Engineered",
      price: 9990,
      category: "hoodies",
      description: "Премиальная толстовка из линейки 23 Engineered с техническими деталями и современным силуэтом.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[33],
      additionalImages: officialProductImagesJordan.slice(33, 36)
    }
  ];
  
  // Jordan Jackets
  const jordanJackets = [
    {
      name: "Jordan Jumpman Woven",
      price: 9990,
      category: "jackets",
      description: "Легкая куртка Jordan с тканым верхом, эластичными манжетами и регулируемым капюшоном.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[36],
      additionalImages: officialProductImagesJordan.slice(36, 39)
    },
    {
      name: "Jordan Essentials",
      price: 11990,
      category: "jackets",
      description: "Базовая куртка Jordan с классическим дизайном и логотипом Jumpman, подходящая для любого случая.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[39],
      additionalImages: officialProductImagesJordan.slice(39, 42)
    },
    {
      name: "Jordan 23 Engineered",
      price: 14990,
      category: "jackets",
      description: "Инновационная куртка из линейки 23 Engineered с водоотталкивающим покрытием и техническими деталями.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesJordan[42],
      additionalImages: officialProductImagesJordan.slice(42, 45)
    }
  ];

  // Объединение всех продуктов Jordan
  const allJordanTemplates: ProductTemplate[] = [
    ...jordanShoes,
    ...jordanTshirts,
    ...jordanHoodies,
    ...jordanJackets
  ];
  
  let id = startId;
  
  // Создание товаров из шаблонов с добавлением дополнительных свойств
  allJordanTemplates.forEach(template => {
    const product: Product = {
      id: id++,
      brand: "Jordan",
      name: template.name,
      price: template.price,
      category: template.category,
      description: template.description,
      imageUrl: template.imageUrl,
      additionalImages: template.additionalImages || [],
      sizes: template.sizes || [],
      isNew: Math.random() > 0.8, // 20% вероятность, что товар новинка
      discount: generateDiscount(),
      rating: generateRating(),
      inStock: Math.random() > 0.1, // 90% товаров в наличии
      gender: "mens" // Бренд Jordan в основном мужской
    };
    
    products.push(product);
  });
  
  return products;
}

// Функция для генерации продуктов Balenciaga
export function generateBalenciagaProducts(startId: number): Product[] {
  const products: Product[] = [];
  
  // Balenciaga Sneakers
  const balenciagaShoes = [
    {
      name: "Balenciaga Triple S",
      price: 79990,
      category: "sneakers",
      description: "Культовые массивные кроссовки Balenciaga Triple S с многослойной подошвой и сложной конструкцией верха.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesBalenciaga[0],
      additionalImages: officialProductImagesBalenciaga.slice(0, 3)
    },
    {
      name: "Balenciaga Speed Trainer",
      price: 59990,
      category: "sneakers",
      description: "Инновационные кроссовки Balenciaga Speed со сверхлегким трикотажным верхом, напоминающим носок, и ультрамягкой подошвой.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesBalenciaga[3],
      additionalImages: officialProductImagesBalenciaga.slice(3, 6)
    },
    {
      name: "Balenciaga Track",
      price: 85990,
      category: "sneakers",
      description: "Технологичные кроссовки Balenciaga Track, вдохновленные беговой обувью, с многослойной конструкцией и сложной шнуровкой.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesBalenciaga[6],
      additionalImages: officialProductImagesBalenciaga.slice(6, 9)
    },
    {
      name: "Balenciaga Defender",
      price: 89990,
      category: "sneakers",
      description: "Массивные кроссовки Balenciaga Defender с агрессивным протектором подошвы и смелым футуристическим дизайном.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesBalenciaga[9],
      additionalImages: officialProductImagesBalenciaga.slice(9, 12)
    }
  ];
  
  // Balenciaga T-shirts
  const balenciagaTshirts = [
    {
      name: "Balenciaga Logo T-Shirt",
      price: 35990,
      category: "tshirts",
      description: "Классическая футболка Balenciaga с контрастным логотипом бренда на груди из высококачественного хлопка.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[12],
      additionalImages: officialProductImagesBalenciaga.slice(12, 15)
    },
    {
      name: "Balenciaga Oversized T-Shirt",
      price: 49990,
      category: "tshirts",
      description: "Футболка свободного кроя с графическим принтом и характерным для Balenciaga oversize силуэтом.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[15],
      additionalImages: officialProductImagesBalenciaga.slice(15, 18)
    },
    {
      name: "Balenciaga Political Campaign T-Shirt",
      price: 45990,
      category: "tshirts",
      description: "Футболка с принтом в стиле политической кампании из коллекции, вдохновленной современной поп-культурой.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[18],
      additionalImages: officialProductImagesBalenciaga.slice(18, 21)
    }
  ];
  
  // Balenciaga Hoodies
  const balenciagaHoodies = [
    {
      name: "Balenciaga Logo Hoodie",
      price: 69990,
      category: "hoodies",
      description: "Оверсайз-худи Balenciaga с вышитым логотипом и объемным капюшоном из плотного хлопкового флиса.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[21],
      additionalImages: officialProductImagesBalenciaga.slice(21, 24)
    },
    {
      name: "Balenciaga Political Campaign Hoodie",
      price: 79990,
      category: "hoodies",
      description: "Толстовка с капюшоном и принтом в стиле политической кампании из знаковой коллекции Balenciaga.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[24],
      additionalImages: officialProductImagesBalenciaga.slice(24, 27)
    }
  ];
  
  // Balenciaga Jackets
  const balenciagaJackets = [
    {
      name: "Balenciaga Denim Jacket",
      price: 110990,
      category: "jackets",
      description: "Культовая джинсовая куртка Balenciaga свободного кроя с потертостями и логотипом на спине.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[27],
      additionalImages: officialProductImagesBalenciaga.slice(27, 30)
    },
    {
      name: "Balenciaga Track Jacket",
      price: 129990,
      category: "jackets",
      description: "Спортивная куртка Balenciaga из технологичного материала с контрастными вставками и логотипом на груди.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[30],
      additionalImages: officialProductImagesBalenciaga.slice(30, 33)
    },
    {
      name: "Balenciaga Puffer Jacket",
      price: 198990,
      category: "jackets",
      description: "Объемная утепленная куртка Balenciaga с высоким воротником и минималистичным дизайном.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesBalenciaga[33],
      additionalImages: officialProductImagesBalenciaga.slice(33, 36)
    }
  ];
  
  // Balenciaga Accessories
  const balenciagaAccessories = [
    {
      name: "Balenciaga Cap",
      price: 35990,
      category: "accessories",
      description: "Классическая бейсболка Balenciaga с вышитым логотипом и регулируемой застежкой.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesBalenciaga[36],
      additionalImages: officialProductImagesBalenciaga.slice(36, 39)
    },
    {
      name: "Balenciaga Explorer Belt Bag",
      price: 69990,
      category: "accessories",
      description: "Поясная сумка Balenciaga Explorer с логотипом и несколькими отделениями для хранения.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesBalenciaga[39],
      additionalImages: officialProductImagesBalenciaga.slice(39, 42)
    },
    {
      name: "Balenciaga Scarf",
      price: 44990,
      category: "accessories",
      description: "Шерстяной шарф Balenciaga с логотипом и интарсией, обеспечивающий тепло и стиль.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesBalenciaga[42],
      additionalImages: officialProductImagesBalenciaga.slice(42, 45)
    }
  ];

  // Объединение всех продуктов Balenciaga
  const allBalenciagaTemplates: ProductTemplate[] = [
    ...balenciagaShoes,
    ...balenciagaTshirts,
    ...balenciagaHoodies,
    ...balenciagaJackets,
    ...balenciagaAccessories
  ];
  
  let id = startId;
  
  // Создание товаров из шаблонов с добавлением дополнительных свойств
  allBalenciagaTemplates.forEach(template => {
    const product: Product = {
      id: id++,
      brand: "Balenciaga",
      name: template.name,
      price: template.price,
      category: template.category,
      description: template.description,
      imageUrl: template.imageUrl,
      additionalImages: template.additionalImages || [],
      sizes: template.sizes || [],
      isNew: Math.random() > 0.8, // 20% вероятность, что товар новинка
      discount: generateDiscount(),
      rating: generateRating(),
      inStock: Math.random() > 0.1, // 90% товаров в наличии
      gender: template.gender || (Math.random() > 0.5 ? "mens" : "womens")
    };
    
    products.push(product);
  });
  
  return products;
}

// Функция для генерации продуктов Stussy
export function generateStussyProducts(startId: number): Product[] {
  const products: Product[] = [];
  
  // Stussy T-shirts
  const stussyTshirts = [
    {
      name: "Stussy Basic Logo Tee",
      price: 5990,
      category: "tshirts",
      description: "Классическая футболка Stussy с культовым логотипом бренда на груди, выполненная из мягкого хлопка.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[0],
      additionalImages: officialProductImagesStussy.slice(0, 3)
    },
    {
      name: "Stussy World Tour T-Shirt",
      price: 6990,
      category: "tshirts",
      description: "Знаковая футболка Stussy World Tour с графикой мирового тура на спине и маленьким логотипом на груди.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[3],
      additionalImages: officialProductImagesStussy.slice(3, 6)
    },
    {
      name: "Stussy 8 Ball T-Shirt",
      price: 6490,
      category: "tshirts",
      description: "Культовая футболка Stussy с графикой бильярдного шара 8 - один из самых узнаваемых дизайнов бренда.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[6],
      additionalImages: officialProductImagesStussy.slice(6, 9)
    },
    {
      name: "Stussy Peace & Love Tee",
      price: 5990,
      category: "tshirts",
      description: "Футболка Stussy с принтом Peace & Love, отражающим позитивную философию бренда.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[9],
      additionalImages: officialProductImagesStussy.slice(9, 12)
    }
  ];
  
  // Stussy Hoodies
  const stussyHoodies = [
    {
      name: "Stussy Basic Logo Hoodie",
      price: 11990,
      category: "hoodies",
      description: "Классический худи Stussy с вышитым фирменным логотипом на груди, карманом-кенгуру и капюшоном.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[12],
      additionalImages: officialProductImagesStussy.slice(12, 15)
    },
    {
      name: "Stussy World Tour Hoodie",
      price: 12990,
      category: "hoodies",
      description: "Толстовка Stussy с принтом World Tour на спине и маленьким логотипом на груди из плотного хлопкового флиса.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[15],
      additionalImages: officialProductImagesStussy.slice(15, 18)
    },
    {
      name: "Stussy 8 Ball Hoodie",
      price: 12490,
      category: "hoodies",
      description: "Культовая толстовка Stussy с графикой бильярдного шара 8 - классический дизайн из истории бренда.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[18],
      additionalImages: officialProductImagesStussy.slice(18, 21)
    }
  ];
  
  // Stussy Jackets
  const stussyJackets = [
    {
      name: "Stussy Work Jacket",
      price: 15990,
      category: "jackets",
      description: "Стильная рабочая куртка Stussy из прочного хлопка с несколькими карманами и фирменной вышивкой.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[21],
      additionalImages: officialProductImagesStussy.slice(21, 24)
    },
    {
      name: "Stussy Coach Jacket",
      price: 13990,
      category: "jackets",
      description: "Классическая куртка-тренч Stussy с логотипом на груди, выполненная из водоотталкивающего материала.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[24],
      additionalImages: officialProductImagesStussy.slice(24, 27)
    },
    {
      name: "Stussy Denim Trucker Jacket",
      price: 17990,
      category: "jackets",
      description: "Джинсовая куртка Stussy в стиле trucker с классическим фирменным логотипом и пуговицами.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesStussy[27],
      additionalImages: officialProductImagesStussy.slice(27, 30)
    }
  ];
  
  // Stussy Accessories
  const stussyAccessories = [
    {
      name: "Stussy Stock Low Pro Cap",
      price: 4990,
      category: "accessories",
      description: "Классическая кепка Stussy с вышитым логотипом спереди и регулируемой застежкой сзади.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesStussy[30],
      additionalImages: officialProductImagesStussy.slice(30, 33)
    },
    {
      name: "Stussy Stock Beanie",
      price: 3990,
      category: "accessories",
      description: "Вязаная шапка Stussy с вышитым логотипом, выполненная из мягкой акриловой пряжи.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesStussy[33],
      additionalImages: officialProductImagesStussy.slice(33, 36)
    },
    {
      name: "Stussy Tote Bag",
      price: 5990,
      category: "accessories",
      description: "Практичная сумка-тоут Stussy с фирменным логотипом, выполненная из прочного хлопка.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesStussy[36],
      additionalImages: officialProductImagesStussy.slice(36, 39)
    }
  ];

  // Объединение всех продуктов Stussy
  const allStussyTemplates: ProductTemplate[] = [
    ...stussyTshirts,
    ...stussyHoodies,
    ...stussyJackets,
    ...stussyAccessories
  ];
  
  let id = startId;
  
  // Создание товаров из шаблонов с добавлением дополнительных свойств
  allStussyTemplates.forEach(template => {
    const product: Product = {
      id: id++,
      brand: "Stussy",
      name: template.name,
      price: template.price,
      category: template.category,
      description: template.description,
      imageUrl: template.imageUrl,
      additionalImages: template.additionalImages || [],
      sizes: template.sizes || [],
      isNew: Math.random() > 0.8, // 20% вероятность, что товар новинка
      discount: generateDiscount(),
      rating: generateRating(),
      inStock: Math.random() > 0.1, // 90% товаров в наличии
      gender: template.gender || "mens" // Stussy в основном мужской бренд
    };
    
    products.push(product);
  });
  
  return products;
}

// Функция для генерации продуктов Gucci
export function generateGucciProducts(startId: number): Product[] {
  const products: Product[] = [];
  
  // Gucci Sneakers
  const gucciShoes = [
    {
      name: "Gucci Ace Sneakers",
      price: 59990,
      category: "sneakers",
      description: "Культовые кроссовки Gucci Ace с фирменной полосой Web и вышивкой. Изготовлены из высококачественной кожи в Италии.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesGucci[0],
      additionalImages: officialProductImagesGucci.slice(0, 3)
    },
    {
      name: "Gucci Rhyton Sneakers",
      price: 75990,
      category: "sneakers",
      description: "Массивные кроссовки Gucci Rhyton из состаренной кожи с фирменным принтом на боковой части.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesGucci[3],
      additionalImages: officialProductImagesGucci.slice(3, 6)
    },
    {
      name: "Gucci Tennis 1977 Sneakers",
      price: 55990,
      category: "sneakers",
      description: "Стильные кроссовки Gucci в ретро-стиле с монограммой GG Supreme Canvas и эластичным зеленым-красным шнурком.",
      sizes: shoeSizes,
      imageUrl: officialProductImagesGucci[6],
      additionalImages: officialProductImagesGucci.slice(6, 9)
    }
  ];
  
  // Gucci T-shirts
  const gucciTshirts = [
    {
      name: "Gucci Logo T-Shirt",
      price: 45990,
      category: "tshirts",
      description: "Классическая футболка Gucci с винтажным логотипом, выполненная из мягкого хлопка высокого качества.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[9],
      additionalImages: officialProductImagesGucci.slice(9, 12)
    },
    {
      name: "Gucci GG Embroidered T-Shirt",
      price: 52990,
      category: "tshirts",
      description: "Футболка Gucci с вышитым мотивом переплетающихся букв GG и фирменной полосой Web.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[12],
      additionalImages: officialProductImagesGucci.slice(12, 15)
    },
    {
      name: "Gucci Mickey Mouse T-Shirt",
      price: 59990,
      category: "tshirts",
      description: "Лимитированная футболка Gucci x Disney с изображением Микки Мауса из коллаборации двух знаковых брендов.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[15],
      additionalImages: officialProductImagesGucci.slice(15, 18)
    }
  ];
  
  // Gucci Hoodies
  const gucciHoodies = [
    {
      name: "Gucci Logo Hoodie",
      price: 89990,
      category: "hoodies",
      description: "Толстовка Gucci с вышитым логотипом, выполненная из высококачественного хлопкового джерси с начесом.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[18],
      additionalImages: officialProductImagesGucci.slice(18, 21)
    },
    {
      name: "Gucci GG Supreme Hoodie",
      price: 95990,
      category: "hoodies",
      description: "Роскошная толстовка Gucci с узором GG Supreme, фирменной полосой Web и капюшоном.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[21],
      additionalImages: officialProductImagesGucci.slice(21, 24)
    }
  ];
  
  // Gucci Jackets
  const gucciJackets = [
    {
      name: "Gucci GG Canvas Jacket",
      price: 159990,
      category: "jackets",
      description: "Куртка Gucci из культового материала GG Supreme Canvas с кожаными вставками и фирменными деталями.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[24],
      additionalImages: officialProductImagesGucci.slice(24, 27)
    },
    {
      name: "Gucci Technical Jersey Jacket",
      price: 129990,
      category: "jackets",
      description: "Спортивная куртка Gucci из технического джерси с фирменной полосой Web и логотипом на груди.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[27],
      additionalImages: officialProductImagesGucci.slice(27, 30)
    },
    {
      name: "Gucci Reversible Bomber Jacket",
      price: 198990,
      category: "jackets",
      description: "Двусторонняя куртка-бомбер Gucci с вышивкой и принтами, которые можно носить с обеих сторон.",
      sizes: clothingSizes,
      imageUrl: officialProductImagesGucci[30],
      additionalImages: officialProductImagesGucci.slice(30, 33)
    }
  ];
  
  // Gucci Accessories
  const gucciAccessories = [
    {
      name: "Gucci GG Baseball Cap",
      price: 35990,
      category: "accessories",
      description: "Бейсболка Gucci с монограммой GG Supreme и регулируемой застежкой для идеальной посадки.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesGucci[33],
      additionalImages: officialProductImagesGucci.slice(33, 36)
    },
    {
      name: "Gucci Web Belt",
      price: 42990,
      category: "accessories",
      description: "Знаковый ремень Gucci с пряжкой GG и фирменной полосой Web из высококачественной кожи.",
      sizes: ["80cm", "85cm", "90cm", "95cm", "100cm", "105cm", "110cm"],
      imageUrl: officialProductImagesGucci[36],
      additionalImages: officialProductImagesGucci.slice(36, 39)
    },
    {
      name: "Gucci GG Scarf",
      price: 39990,
      category: "accessories",
      description: "Элегантный шарф Gucci с монограммой GG из смеси шерсти и шелка, с фирменными краями.",
      sizes: ["One Size"],
      imageUrl: officialProductImagesGucci[39],
      additionalImages: officialProductImagesGucci.slice(39, 42)
    }
  ];

  // Объединение всех продуктов Gucci
  const allGucciTemplates: ProductTemplate[] = [
    ...gucciShoes,
    ...gucciTshirts,
    ...gucciHoodies,
    ...gucciJackets,
    ...gucciAccessories
  ];
  
  let id = startId;
  
  // Создание товаров из шаблонов с добавлением дополнительных свойств
  allGucciTemplates.forEach(template => {
    const product: Product = {
      id: id++,
      brand: "Gucci",
      name: template.name,
      price: template.price,
      category: template.category,
      description: template.description,
      imageUrl: template.imageUrl,
      additionalImages: template.additionalImages || [],
      sizes: template.sizes || [],
      isNew: Math.random() > 0.8, // 20% вероятность, что товар новинка
      discount: generateDiscount(),
      rating: generateRating(),
      inStock: Math.random() > 0.1, // 90% товаров в наличии
      gender: template.gender || (Math.random() > 0.5 ? "mens" : "womens")
    };
    
    products.push(product);
  });
  
  return products;
}

// Функция для генерации всех продуктов
export function generateAllProducts(): Product[] {
  let nextId = 1;
  const nikeProducts = generateNikeProducts(nextId);
  nextId += nikeProducts.length;
  
  const adidasProducts = generateAdidasProducts(nextId);
  nextId += adidasProducts.length;
  
  const jordanProducts = generateJordanProducts(nextId);
  nextId += jordanProducts.length;
  
  const balenciagaProducts = generateBalenciagaProducts(nextId);
  nextId += balenciagaProducts.length;
  
  const stussyProducts = generateStussyProducts(nextId);
  nextId += stussyProducts.length;
  
  const gucciProducts = generateGucciProducts(nextId);
  
  // Объединение всех продуктов
  return [
    ...nikeProducts,
    ...adidasProducts,
    ...jordanProducts,
    ...balenciagaProducts,
    ...stussyProducts,
    ...gucciProducts
  ];
}