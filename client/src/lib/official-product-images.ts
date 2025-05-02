// Словарь официальных изображений продуктов от Nike и Adidas

type ProductImageMap = {
  [key: string]: string[];
};

// Nike изображения по моделям
export const NIKE_IMAGES: ProductImageMap = {
  "Nike Air Force 1": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/00375837-849f-4f17-ba24-d201d27be49b/air-force-1-07-mens-shoes-5QFp5Z.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/3cc96f43-47b6-43cb-951d-d8f73bb2f912/air-force-1-07-mens-shoes-5QFp5Z.png"
  ],
  "Nike Air Max 90": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/lrht5ixshpkk3xggyc59/air-max-90-mens-shoes-6n3vKB.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5eb75965-73c8-4d26-a85c-e0db58cef3a2/air-max-90-mens-shoes-6n3vKB.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a3e7dead-1ad2-4c40-996d-93ebc9df0fca/air-max-90-mens-shoes-6n3vKB.png"
  ],
  "Nike Air Jordan": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e125b578-4173-401a-ab13-f066979c8848/air-jordan-1-mid-shoes-SQf7DM.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8d752b32-18ae-4404-8639-5a1a8cd0762c/air-jordan-1-mid-shoes-SQf7DM.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/61e4bc79-1a08-4078-bbcb-92179f5a9569/air-jordan-1-mid-shoes-SQf7DM.png"
  ],
  "Nike Dunk Low": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/64d037d0-711a-4bce-8d2d-9eb20f401fcc/dunk-low-retro-mens-shoes-87q0hf.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/71d6146e-4f30-4947-b431-9abaa4aa9766/dunk-low-retro-mens-shoes-87q0hf.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8bc7d689-de2c-4b49-986c-b42153931753/dunk-low-retro-mens-shoes-87q0hf.png"
  ],
  "Nike Blazer": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a2e78982-54c2-4fcb-b327-3e3bd4ef0de9/blazer-mid-77-vintage-mens-shoes-nw30B2.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8bc48ce8-cfdf-409a-af31-d1780c2fa5e3/blazer-mid-77-vintage-mens-shoes-nw30B2.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a9bebbfa-7332-4d76-a202-e0d65ea8c380/blazer-mid-77-vintage-mens-shoes-nw30B2.png"
  ],
  "Nike Tech Fleece": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/11786d2c-f878-4c28-a95e-f61f1a483710/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/fae59ee3-7e25-4b57-ba24-fa6c2a0d3540/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/48e1c7c1-c0b1-4a22-80b0-9c179d5cd89a/sportswear-tech-fleece-mens-full-zip-hoodie-5ZtTtk.png"
  ],
  "Nike Club Fleece": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8b36e4db-1b1e-4b26-9dfb-ff5c12a4efcf/sportswear-club-fleece-crewneck-sweatshirt-tPqXZ8.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5cef5ece-a767-491c-8dab-10bd4d975f63/sportswear-club-fleece-crewneck-sweatshirt-tPqXZ8.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/41bb2e43-c8a3-4bce-979a-4d8a8ffacf75/sportswear-club-fleece-crewneck-sweatshirt-tPqXZ8.png"
  ],
  "Nike Sportswear": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/bd4c0dac-e76f-4960-8f90-fac07954934a/sportswear-mens-t-shirt-SvmFD8.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/20c4c3fa-8e3d-470c-bc8b-6ed4d26d1d12/sportswear-mens-t-shirt-SvmFD8.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/8e3ca199-a76e-471a-b639-10be9d1c5078/sportswear-mens-t-shirt-SvmFD8.png"
  ],
  "Nike Dri-FIT": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5ab9551f-0b0b-4495-a9d5-13d131fd7501/dri-fit-mens-training-t-shirt-2tNMxV.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/80fa2724-e26a-4a5a-b4e4-df3d3a625b89/dri-fit-mens-training-t-shirt-2tNMxV.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/ec01a611-fa9a-4373-b9bf-7f33c2694642/dri-fit-mens-training-t-shirt-2tNMxV.png"
  ],
  "Nike Therma-FIT": [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/20304d3a-13de-414e-bb1b-dc8e94cc9c5b/therma-fit-mens-pullover-training-hoodie-5d7P5L.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a414b33d-77ce-4287-936d-0a166e87f644/therma-fit-mens-pullover-training-hoodie-5d7P5L.png",
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/71cd53fa-79ae-4b10-bb80-9aaeea530044/therma-fit-mens-pullover-training-hoodie-5d7P5L.png"
  ]
};

// Adidas изображения по моделям
export const ADIDAS_IMAGES: ProductImageMap = {
  "Adidas Ultraboost": [
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ce8a6f3aa6294de988d7aee901127106_9366/Ultraboost_Light_Shoes_Black_HQ6351_01_standard.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/270e30d32e0a4a0d8554aee901127d09_9366/Ultraboost_Light_Shoes_Black_HQ6351_02_standard_hover.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/33f1775a6a85406f9c16aee90112863b_9366/Ultraboost_Light_Shoes_Black_HQ6351_03_standard.jpg"
  ],
  "Adidas Stan Smith": [
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/68ae7ea7849b43eca70aac1e00f5146d_9366/Stan_Smith_Shoes_White_FX5502_01_standard.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d02dad63187a4606b1cdac1e00f51e08_9366/Stan_Smith_Shoes_White_FX5502_02_standard_hover.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c0b98a79bcc34a38a325ac1e00f527c8_9366/Stan_Smith_Shoes_White_FX5502_03_standard.jpg"
  ],
  "Adidas Gazelle": [
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e1e758328b2b4037a989aad801113112_9366/Gazelle_Shoes_Black_BB5476_01_standard.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/1a8da3c9126b41fe8e31aad8011170be_9366/Gazelle_Shoes_Black_BB5476_02_standard_hover.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/ba7adb7f81b649c88f71aad801121167_9366/Gazelle_Shoes_Black_BB5476_04_standard.jpg"
  ],
  "Adidas Samba": [
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3bbecbdf584e40398446a8bf0117cf62_9366/Samba_OG_Shoes_White_B75806_01_standard.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/47a0e6c9c95d4751bd10a8bf0117e2e2_9366/Samba_OG_Shoes_White_B75806_02_standard_hover.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a1fa8be142f4434293fea8bf0117f0a4_9366/Samba_OG_Shoes_White_B75806_03_standard.jpg"
  ],
  "Adidas Superstar": [
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8c5d1994dfd343e28615ae9a010c0542_9366/Superstar_Shoes_White_EG4958_01_standard.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c462319d8c5d4a528c02ae9a010c0d4a_9366/Superstar_Shoes_White_EG4958_02_standard_hover.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/8a358bcd5e3d4be18fdaae9a010c1580_9366/Superstar_Shoes_White_EG4958_03_standard.jpg"
  ],
  "Adidas NMD": [
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e2eb242e88db4551bc04ae2101651f9f_9366/NMD_R1_Shoes_White_GZ9261_01_standard.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d1031f9d540542ed97a8ae2101652735_9366/NMD_R1_Shoes_White_GZ9261_02_standard_hover.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d9be310a876845b0a3e0ae2101652e84_9366/NMD_R1_Shoes_White_GZ9261_03_standard.jpg"
  ],
  "Adidas Essentials": [
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/f0994a53b3374676ad32ae47011d1e2c_9366/Essentials_Fleece_Hoodie_Grey_HD9073_21_model.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/c5b8b1556c28449c9133ae47011d4afd_9366/Essentials_Fleece_Hoodie_Grey_HD9073_23_hover_model.jpg",
    "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/9c8347cc83ca4b329ca8ae47011d1326_9366/Essentials_Fleece_Hoodie_Grey_HD9073_25_model.jpg"
  ]
};

// Функция для получения изображений по имени продукта
export function getOfficialProductImages(productName: string): string[] {
  // Проверка названия на совпадение с Nike моделями
  for (const [nikeModel, images] of Object.entries(NIKE_IMAGES)) {
    if (productName.toLowerCase().includes(nikeModel.toLowerCase())) {
      return images;
    }
  }
  
  // Проверка названия на совпадение с Adidas моделями
  for (const [adidasModel, images] of Object.entries(ADIDAS_IMAGES)) {
    if (productName.toLowerCase().includes(adidasModel.toLowerCase())) {
      return images;
    }
  }
  
  // Если не найдено конкретное совпадение, проверяем бренд
  if (productName.toLowerCase().includes('nike')) {
    // Возвращаем Air Force 1 как дефолтный Nike продукт
    return NIKE_IMAGES["Nike Air Force 1"];
  }
  
  if (productName.toLowerCase().includes('adidas')) {
    // Возвращаем Stan Smith как дефолтный Adidas продукт
    return ADIDAS_IMAGES["Adidas Stan Smith"];
  }
  
  // Дефолтные изображения (если не найдено соответствие)
  return [
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-5QFp5Z.png"
  ];
}