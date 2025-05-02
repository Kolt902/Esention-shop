// Библиотека для получения официальных изображений продуктов
// по названию и категории

// Функция для получения официальных изображений продуктов
export function getOfficialProductImages(productName: string, category: string): string[] {
  // Преобразуем название продукта и категорию в нижний регистр для сравнения
  const nameLower = productName.toLowerCase();
  const categoryLower = category.toLowerCase();

  // Проверяем на Nike
  if (nameLower.includes('nike') || nameLower.includes('air force') || nameLower.includes('air max') || nameLower.includes('jordan')) {
    // Кроссовки Nike
    if (categoryLower.includes('sneakers') || categoryLower.includes('shoes')) {
      if (nameLower.includes('air force')) {
        return [
          "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png",
          "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201d27be31b/air-force-1-07-mens-shoes-5QFp5Z.png"
        ];
      } else if (nameLower.includes('air max')) {
        return [
          "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png",
          "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/fg3necfcxgccw3ggsjty/air-max-270-mens-shoes-KkLcGR.png"
        ];
      } else if (nameLower.includes('dunk')) {
        return [
          "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/9559f730-2e9d-4232-9e89-e8e81ddc8cc4/dunk-low-retro-mens-shoes-76KnBL.png",
          "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2c8726a5-624d-4c15-99e6-7df8c9281ee6/dunk-low-retro-mens-shoes-76KnBL.png"
        ];
      }
      // Дефолтные Nike кроссовки
      return [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-0896e115-351a-4e1c-9c3a-b38623b27b2a/air-jordan-1-mid-mens-shoes-86f1ZW.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-f7e2e66c-ac24-4b11-9c4e-e49a753b795f/air-jordan-1-mid-mens-shoes-86f1ZW.png"
      ];
    }
    // Футболки Nike
    else if (categoryLower.includes('tshirts') || categoryLower.includes('t-shirt')) {
      return [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c3df1c5-7959-4414-a0f3-41da8bb3a137/sportswear-club-mens-t-shirt-N8Fnn0.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d0b97b2d-8696-4523-b599-18dca6007fd0/sportswear-club-mens-t-shirt-N8Fnn0.png"
      ];
    }
    // Худи Nike
    else if (categoryLower.includes('hoodies') || categoryLower.includes('hoodie')) {
      return [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/gw1tzq9wrqoqhfvgjnvx/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ks0tgzwx6vfyi3gzmstl/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png"
      ];
    }
    // Штаны Nike
    else if (categoryLower.includes('pants')) {
      return [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c289c21-3f30-4ff8-9bbd-9f3045d71b55/sportswear-tech-fleece-mens-joggers-2bw5fs.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/845ed45c-ef8a-4be7-b633-54d311a818a0/sportswear-tech-fleece-mens-joggers-2bw5fs.png"
      ];
    }
  }
  
  // Проверяем на Adidas
  if (nameLower.includes('adidas') || nameLower.includes('stan smith') || nameLower.includes('superstar') || nameLower.includes('ultraboost')) {
    // Кроссовки Adidas
    if (categoryLower.includes('sneakers') || categoryLower.includes('shoes')) {
      if (nameLower.includes('stan smith')) {
        return [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/246908d6be2a400d91faac1e00f5245a_9366/Stan_Smith_Shoes_White_FX5502_02_standard.jpg"
        ];
      } else if (nameLower.includes('superstar')) {
        return [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7ed0855435194229a525aad6009a0497_9366/Superstar_Shoes_White_EG4958_01_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c0953ceaa871453abf6baad6009a32d6_9366/Superstar_Shoes_White_EG4958_02_standard.jpg"
        ];
      } else if (nameLower.includes('ultraboost')) {
        return [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/edf9cc95cde94970829ead7800abd905_9366/Ultraboost_22_Shoes_Black_GZ0127_02_standard.jpg"
        ];
      }
      // Дефолтные Adidas кроссовки
      return [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/4760e03c87774e0dba63a7fa008da69d_9366/Gazelle_Shoes_Blue_BB5478_01_standard.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1d1d1a21ced34f01a28ca7fa00abd6d8_9366/Gazelle_Shoes_Blue_BB5478_02_standard.jpg"
      ];
    }
    // Футболки Adidas
    else if (categoryLower.includes('tshirts') || categoryLower.includes('t-shirt')) {
      return [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0f3a8487157d47d98476ac5e003d37ec_9366/Trefoil_Tee_White_GN3462_01_laydown.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f6967df167ae44b3b240ac5e003d47b5_9366/Trefoil_Tee_White_GN3462_02_laydown.jpg"
      ];
    }
    // Худи Adidas
    else if (categoryLower.includes('hoodies') || categoryLower.includes('hoodie')) {
      return [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e7958e4d4d5844298c68ac6800fc2c78_9366/Trefoil_Hoodie_Black_DT7964_01_laydown.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ddf7a13dde464e7ca765ac6800fc3d93_9366/Trefoil_Hoodie_Black_DT7964_02_laydown.jpg"
      ];
    }
    // Штаны Adidas
    else if (categoryLower.includes('pants')) {
      return [
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9233dc977fc14bbcbe27acda005cb774_9366/Tiro_21_Track_Pants_Black_GH7306_01_laydown.jpg",
        "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/aae4a0f2bbf24222aba6acda005cc6bb_9366/Tiro_21_Track_Pants_Black_GH7306_02_laydown.jpg"
      ];
    }
  }
  
  // Jordan
  if (nameLower.includes('jordan')) {
    // Кроссовки Jordan
    if (categoryLower.includes('sneakers') || categoryLower.includes('shoes')) {
      return [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-0896e115-351a-4e1c-9c3a-b38623b27b2a/air-jordan-1-mid-mens-shoes-86f1ZW.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-f7e2e66c-ac24-4b11-9c4e-e49a753b795f/air-jordan-1-mid-mens-shoes-86f1ZW.png"
      ];
    }
    // Одежда Jordan
    else {
      return [
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/56b01dba-9946-4408-aaad-7358706dd169/jordan-jumpman-mens-t-shirt-CxfTRk.png",
        "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d7b43891-8b96-4e0f-9236-ec83bbce7021/jordan-jumpman-mens-t-shirt-CxfTRk.png"
      ];
    }
  }
  
  // Balenciaga
  if (nameLower.includes('balenciaga')) {
    // Кроссовки Balenciaga
    if (categoryLower.includes('sneakers') || categoryLower.includes('shoes')) {
      return [
        "https://balenciaga.dam.kering.com/m/1ba571b9a4cf76cb/Large-524036W2CA19000_F.jpg",
        "https://balenciaga.dam.kering.com/m/5e5668daad64e01e/Large-524036W2CA19000_B.jpg"
      ];
    }
    // Худи Balenciaga
    else if (categoryLower.includes('hoodies') || categoryLower.includes('hoodie')) {
      return [
        "https://balenciaga.dam.kering.com/m/4e5cb9b6ee0aa86e/Large-578135TIV521070_F.jpg",
        "https://balenciaga.dam.kering.com/m/59f08d4e4dfb72a7/Large-578135TIV521070_B.jpg"
      ];
    }
  }
  
  // Gucci
  if (nameLower.includes('gucci')) {
    // Футболки Gucci
    if (categoryLower.includes('tshirts') || categoryLower.includes('t-shirt')) {
      return [
        "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1622731805/653334_XJDLW_9088_001_100_0000_Light-Interlocking-G-cotton-T-shirt.jpg",
        "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1622731805/653334_XJDLW_9088_002_100_0000_Light-Interlocking-G-cotton-T-shirt.jpg"
      ];
    }
    // Аксессуары Gucci
    else if (categoryLower.includes('accessories')) {
      return [
        "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1613661303/443497_DTDIT_1000_001_063_0000_Light-GG-Marmont-matelass-shoulder-bag.jpg",
        "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1613661303/443497_DTDIT_1000_002_063_0000_Light-GG-Marmont-matelass-shoulder-bag.jpg"
      ];
    }
  }
  
  // Stussy
  if (nameLower.includes('stussy')) {
    // Футболки Stussy
    if (categoryLower.includes('tshirts') || categoryLower.includes('t-shirt')) {
      return [
        "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1904834WHITE_1_720x.jpg",
        "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1904834WHITE_2_720x.jpg"
      ];
    }
    // Худи Stussy
    else if (categoryLower.includes('hoodies') || categoryLower.includes('hoodie')) {
      return [
        "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1924816_BLACK_1_720x.jpg",
        "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/1924816_BLACK_2_720x.jpg"
      ];
    }
    // Штаны Stussy
    else if (categoryLower.includes('pants')) {
      return [
        "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/116501_OLIVE_1_720x.jpg",
        "https://cdn.shopify.com/s/files/1/0087/6193/3920/products/116501_OLIVE_2_720x.jpg"
      ];
    }
  }
  
  // Дефолтное изображение для категории кроссовки, если ничего не найдено
  if (categoryLower.includes('sneakers') || categoryLower.includes('shoes')) {
    return [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png"
    ];
  }
  
  // Дефолтное изображение для категории футболки, если ничего не найдено
  if (categoryLower.includes('tshirts') || categoryLower.includes('t-shirt')) {
    return [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c3df1c5-7959-4414-a0f3-41da8bb3a137/sportswear-club-mens-t-shirt-N8Fnn0.png"
    ];
  }
  
  // Дефолтное изображение для категории худи, если ничего не найдено
  if (categoryLower.includes('hoodies') || categoryLower.includes('hoodie')) {
    return [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/gw1tzq9wrqoqhfvgjnvx/sportswear-club-fleece-mens-pullover-hoodie-p3MkK9.png"
    ];
  }
  
  // Дефолтное изображение для категории штаны, если ничего не найдено
  if (categoryLower.includes('pants')) {
    return [
      "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c289c21-3f30-4ff8-9bbd-9f3045d71b55/sportswear-tech-fleece-mens-joggers-2bw5fs.png"
    ];
  }
  
  // Универсальное дефолтное изображение
  return [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png"
  ];
}