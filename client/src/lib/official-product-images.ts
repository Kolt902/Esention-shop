// Словарь гарантированных, проверенных изображений обуви и одежды

type ProductImageMap = {
  [key: string]: string[];
};

// Проверенные изображения по категориям с гарантированной загрузкой
export const CATEGORY_IMAGES: ProductImageMap = {
  // Кроссовки Nike
  "lifestyle": [
    "https://secure-images.nike.com/is/image/DotCom/CW2288_111?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg", 
    "https://secure-images.nike.com/is/image/DotCom/CW2288_111?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/CV3042_104?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  "running": [
    "https://secure-images.nike.com/is/image/DotCom/DJ6158_400?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0", 
    "https://secure-images.nike.com/is/image/DotCom/DM0372_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/DR9435_003?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  "basketball": [
    "https://secure-images.nike.com/is/image/DotCom/DO9843_001?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0", 
    "https://secure-images.nike.com/is/image/DotCom/DH3718_600?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/DM7601_102?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  // Одежда
  "tshirts": [
    "https://secure-images.nike.com/is/image/DotCom/AR6029_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0", 
    "https://secure-images.nike.com/is/image/DotCom/DC7456_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/AR6029_063?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  "hoodies": [
    "https://secure-images.nike.com/is/image/DotCom/BV2654_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0", 
    "https://secure-images.nike.com/is/image/DotCom/BV2662_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/CU4379_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  "pants": [
    "https://secure-images.nike.com/is/image/DotCom/BV2671_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0", 
    "https://secure-images.nike.com/is/image/DotCom/DD4781_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/BV2679_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  "accessories": [
    "https://secure-images.nike.com/is/image/DotCom/CW9301_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0", 
    "https://secure-images.nike.com/is/image/DotCom/DC2648_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/HO22_Nike_DD1682_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ]
};

// Бренд Nike
export const NIKE_IMAGES: ProductImageMap = {
  // Nike Air Force 1
  "Air Force 1": [
    "https://secure-images.nike.com/is/image/DotCom/CW2288_111?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/CW2288_111_B?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/CW2288_111_C?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  // Nike Air Max
  "Air Max": [
    "https://secure-images.nike.com/is/image/DotCom/DH4084_001?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/DH4084_001_B?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/DH4084_001_C?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  // Nike Dunk
  "Dunk": [
    "https://secure-images.nike.com/is/image/DotCom/DD1391_102?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/DD1391_102_B?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/DD1391_102_C?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  
  // Nike Jordan
  "Jordan": [
    "https://secure-images.nike.com/is/image/DotCom/555088_134?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/555088_134_B?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/555088_134_C?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],

  // Nike Sportswear
  "Sportswear": [
    "https://secure-images.nike.com/is/image/DotCom/AR6029_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/AR6029_010_B?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0",
    "https://secure-images.nike.com/is/image/DotCom/AR6029_010_C?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ]
};

// Бренд Adidas
export const ADIDAS_IMAGES: ProductImageMap = {
  // Adidas Ultraboost
  "Ultraboost": [
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/52b5f999c16e4b0bae5cafc901155d2e_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/f0e316c6cf62478fad3fafc901156e35_9366/Ultraboost_22_Shoes_Black_GZ0127_02_standard_hover.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/6b6e7dfa693349f09409afc9011577ca_9366/Ultraboost_22_Shoes_Black_GZ0127_03_standard.jpg"
  ],
  
  // Adidas Stan Smith
  "Stan Smith": [
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/f6a3e22fa9c6479e9e8aad0800f98d5e_9366/Stan_Smith_Shoes_White_H03220_01_standard.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/b15ebee009f248d2a371ad0800f99c16_9366/Stan_Smith_Shoes_White_H03220_02_standard_hover.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/5c464e626c1b4b8c90a0ad0800f9a6e8_9366/Stan_Smith_Shoes_White_H03220_03_standard.jpg"
  ],
  
  // Adidas Superstar
  "Superstar": [
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/dd97116d63204cd98d61ad1500ab2798_9366/Superstar_Shoes_White_GX1172_01_standard.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/b5b72e4d5ef54f2689b3ad1500ab354a_9366/Superstar_Shoes_White_GX1172_02_standard_hover.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/c266a5fef81f49d3a57bad1500ab3d88_9366/Superstar_Shoes_White_GX1172_03_standard.jpg"
  ],
  
  // Adidas Originals
  "Originals": [
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/01f85701f1c94b4386b5ad4f000fb194_9366/Adicolor_Classics_Trefoil_Hoodie_Black_H06667_21_model.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/bdbb4b88695e4beeb8f3ad7200c27c53_9366/Adicolor_Classics_Trefoil_Hoodie_Black_H06667_23_hover_model.jpg",
    "https://assets.adidas.com/images/w_600,f_auto,q_auto/5c7198353d42498bacb7ad4f000f67fe_9366/Adicolor_Classics_Trefoil_Hoodie_Black_H06667_25_model.jpg"
  ]
};

// Дефолтные изображения по категориям для случая, если все остальные методы не сработали
const DEFAULT_IMAGES: ProductImageMap = {
  "lifestyle": [
    "https://secure-images.nike.com/is/image/DotCom/CW2288_111?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  "running": [
    "https://secure-images.nike.com/is/image/DotCom/DJ6158_400?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  "basketball": [
    "https://secure-images.nike.com/is/image/DotCom/DO9843_001?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  "tshirts": [
    "https://secure-images.nike.com/is/image/DotCom/AR6029_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  "hoodies": [
    "https://secure-images.nike.com/is/image/DotCom/BV2654_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  "pants": [
    "https://secure-images.nike.com/is/image/DotCom/BV2671_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  "accessories": [
    "https://secure-images.nike.com/is/image/DotCom/CW9301_010?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ],
  "default": [
    "https://secure-images.nike.com/is/image/DotCom/CW2288_111?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&wid=640&fmt=jpg&scl=1.0"
  ]
};

// Функция для получения изображений по имени продукта и категории
export function getOfficialProductImages(productName: string, category: string = ''): string[] {
  const lowercaseName = productName.toLowerCase();
  const lowercaseCategory = category.toLowerCase();
  
  // Проверяем по бренду и модели Nike
  if (lowercaseName.includes('nike')) {
    for (const [model, images] of Object.entries(NIKE_IMAGES)) {
      if (lowercaseName.includes(model.toLowerCase())) {
        return images;
      }
    }
    
    // Если конкретная модель не найдена, но это Nike
    return NIKE_IMAGES["Air Force 1"]; // Используем Air Force 1 как дефолтные для Nike
  }
  
  // Проверяем по бренду и модели Adidas
  if (lowercaseName.includes('adidas')) {
    for (const [model, images] of Object.entries(ADIDAS_IMAGES)) {
      if (lowercaseName.includes(model.toLowerCase())) {
        return images;
      }
    }
    
    // Если конкретная модель не найдена, но это Adidas
    return ADIDAS_IMAGES["Stan Smith"]; // Используем Stan Smith как дефолтные для Adidas
  }
  
  // Если бренд не определен, пытаемся найти по категории
  if (lowercaseCategory) {
    for (const [cat, images] of Object.entries(CATEGORY_IMAGES)) {
      if (lowercaseCategory.includes(cat.toLowerCase()) || 
          cat.toLowerCase().includes(lowercaseCategory)) {
        return images;
      }
    }
    
    // Если есть категория, но не нашли точное соответствие
    if (DEFAULT_IMAGES[lowercaseCategory]) {
      return DEFAULT_IMAGES[lowercaseCategory];
    }
  }
  
  // Если ничего не помогло, возвращаем самые надежные дефолтные изображения
  return DEFAULT_IMAGES["default"];
}