// Supported languages
export type SupportedLanguage = 'ru' | 'en' | 'pl' | 'cs' | 'de';

// Массив поддерживаемых языков
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'en', 'pl', 'cs', 'de'];

// Define translation type
export type Translation = {
  // Common UI elements
  common: {
    cart: string;
    home: string;
    search: string;
    settings: string;
    welcome: string;
    loading: string;
    errorLoading: string;
    retry: string;
    noProducts: string;
    language: string;
    theme: string;
    lightTheme: string;
    darkTheme: string;
    referral: string;
    back: string;
    close: string;
    save: string;
    cancel: string;
    delete: string;
    deleting: string;
    edit: string;
    add: string;
  };
  
  // Profile related translations
  profile: {
    title: string;
    guest: string;
    notConnected: string;
    settings: string;
    logout: string;
    logoutSuccess: string;
    logoutSuccessMessage: string;
    logoutError: string;
    logoutErrorMessage: string;
    orders: string;
    addresses: string;
    favorites: string;
    noOrders: string;
    noOrdersDescription: string;
    startShopping: string;
    noAddresses: string;
    noAddressesDescription: string;
    addFirstAddress: string;
    addNewAddress: string;
    noFavorites: string;
    noFavoritesDescription: string;
    exploreCatalog: string;
    // Virtual fitting translations
    virtualFitting: string;
    bodyParams: string;
    bodyParamsDesc: string;
    height: string;
    weight: string;
    bodyType: string;
    gender: string;
    slim: string;
    regular: string;
    athletic: string;
    male: string;
    female: string;
    tops: string;
    bottoms: string;
    footwear: string;
    accessories: string;
    tryOn: string;
    addToWardrobe: string;
    myWardrobe: string;
    emptyWardrobe: string;
    tryItemsAndAdd: string;
    wardrobeDesc: string;
    comingSoon: string;
    selectItemsBelow: string;
    avatarSaved: string;
    avatarSavedDesc: string;
    avatarSaveError: string;
    selectColorAndSize: string;
    addedToWardrobe: string;
    errorAddingToWardrobe: string;
  };
  
  // Address related translations
  addresses: {
    default: string;
    setDefault: string;
    defaultSuccess: string;
    defaultSuccessMessage: string;
    defaultError: string;
    defaultErrorMessage: string;
    deleteConfirmTitle: string;
    deleteConfirmDescription: string;
    deleteSuccess: string;
    deleteSuccessMessage: string;
    deleteError: string;
    deleteErrorMessage: string;
  };
  
  // Order related translations
  orders: {
    orderNumber: string;
    items: string;
    orderItems: string;
    showDetails: string;
    hideDetails: string;
    statusPending: string;
    statusProcessing: string;
    statusShipped: string;
    statusDelivered: string;
    statusCancelled: string;
  };
  
  // Product related translations
  product: {
    addToCart: string;
    adding: string;
    sizes: string;
    price: string;
    description: string;
    category: string;
    outOfStock: string;
    related: string;
    details: string;
    addedToCart: string;
    removedFromCart: string;
    addedToFavorites: string;
    removedFromFavorites: string;
    selectSize: string;
  };
  
  // Cart related translations
  cart: {
    title: string;
    empty: string;
    total: string;
    checkout: string;
    remove: string;
    processing: string;
    orderSuccess: string;
    orderError: string;
    continueShopping: string;
    quantity: string;
    increaseQuantity: string;
    decreaseQuantity: string;
  };
  
  // Categories
  categories: {
    all: string;
    men: string;
    women: string;
    kids: string;
    running: string;
    lifestyle: string;
    basketball: string;
  };
  
  // Settings
  settings: {
    title: string;
    account: string;
    language: string;
    theme: string;
    notifications: string;
    about: string;
    logout: string;
    selectLanguage: string;
    selectTheme: string;
    referralProgram: string;
    shareReferralLink: string;
    referralCode: string;
    referralInfo: string;
    referralCopied: string;
  };
};

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ru';

// Russian translations
export const ru: Translation = {
  common: {
    cart: 'Корзина',
    home: 'Главная',
    search: 'Поиск',
    settings: 'Настройки',
    welcome: 'Добро пожаловать в магазин',
    loading: 'Загрузка...',
    errorLoading: 'Ошибка загрузки. Пожалуйста, попробуйте снова.',
    retry: 'Повторить',
    noProducts: 'Нет доступных товаров',
    language: 'Язык',
    theme: 'Тема',
    lightTheme: 'Светлая',
    darkTheme: 'Темная',
    referral: 'Реферальная программа',
    back: 'Назад',
    close: 'Закрыть',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    deleting: 'Удаление...',
    edit: 'Изменить',
    add: 'Добавить',
  },
  profile: {
    title: 'Профиль',
    guest: 'Гость',
    notConnected: 'Не подключен к Telegram',
    settings: 'Настройки профиля',
    logout: 'Выйти',
    logoutSuccess: 'Выход выполнен успешно',
    logoutSuccessMessage: 'Вы успешно вышли из системы',
    logoutError: 'Ошибка выхода',
    logoutErrorMessage: 'При выходе из системы произошла ошибка. Пожалуйста, попробуйте снова.',
    orders: 'Заказы',
    addresses: 'Адреса',
    favorites: 'Избранное',
    noOrders: 'Нет заказов',
    noOrdersDescription: 'Вы еще не сделали ни одного заказа',
    startShopping: 'Начать покупки',
    noAddresses: 'Нет адресов',
    noAddressesDescription: 'Вы еще не добавили ни одного адреса доставки',
    addFirstAddress: 'Добавить первый адрес',
    addNewAddress: 'Добавить новый адрес',
    noFavorites: 'Нет избранных товаров',
    noFavoritesDescription: 'Вы еще не добавили товары в избранное',
    exploreCatalog: 'Просмотреть каталог',
    // Переводы для виртуальной примерочной
    virtualFitting: 'Виртуальная примерочная',
    bodyParams: 'Параметры тела',
    bodyParamsDesc: 'Укажите ваши физические параметры для более точной примерки',
    height: 'Рост',
    weight: 'Вес',
    bodyType: 'Телосложение',
    gender: 'Пол',
    slim: 'Худощавое',
    regular: 'Среднее',
    athletic: 'Атлетическое',
    male: 'Мужской',
    female: 'Женский',
    tops: 'Верхняя одежда',
    bottoms: 'Брюки и шорты',
    footwear: 'Обувь',
    accessories: 'Аксессуары',
    tryOn: 'Примерить',
    addToWardrobe: 'В гардероб',
    myWardrobe: 'Мой гардероб',
    emptyWardrobe: 'Ваш гардероб пуст',
    tryItemsAndAdd: 'Примерьте вещи и добавьте их в гардероб',
    wardrobeDesc: 'Здесь будут храниться ваши любимые виртуальные вещи',
    comingSoon: 'Скоро',
    selectItemsBelow: 'Выберите вещи для примерки из каталога ниже',
    avatarSaved: 'Параметры сохранены',
    avatarSavedDesc: 'Ваши параметры успешно сохранены',
    avatarSaveError: 'Ошибка при сохранении параметров',
    selectColorAndSize: 'Выберите цвет и размер',
    addedToWardrobe: 'Добавлено в гардероб',
    errorAddingToWardrobe: 'Ошибка при добавлении в гардероб',
  },
  addresses: {
    default: 'По умолчанию',
    setDefault: 'Установить по умолчанию',
    defaultSuccess: 'Адрес по умолчанию обновлен',
    defaultSuccessMessage: 'Ваш адрес по умолчанию успешно обновлен',
    defaultError: 'Ошибка адреса по умолчанию',
    defaultErrorMessage: 'При обновлении адреса по умолчанию произошла ошибка. Пожалуйста, попробуйте снова.',
    deleteConfirmTitle: 'Удалить адрес',
    deleteConfirmDescription: 'Вы уверены, что хотите удалить этот адрес?',
    deleteSuccess: 'Адрес удален',
    deleteSuccessMessage: 'Адрес успешно удален',
    deleteError: 'Ошибка удаления',
    deleteErrorMessage: 'При удалении адреса произошла ошибка. Пожалуйста, попробуйте снова.',
  },
  orders: {
    orderNumber: 'Заказ №',
    items: 'товары',
    orderItems: 'Товары в заказе',
    showDetails: 'Показать детали',
    hideDetails: 'Скрыть детали',
    statusPending: 'В ожидании',
    statusProcessing: 'В обработке',
    statusShipped: 'Отправлен',
    statusDelivered: 'Доставлен',
    statusCancelled: 'Отменен',
  },
  product: {
    addToCart: 'В корзину',
    adding: 'Добавляем...',
    sizes: 'Размеры',
    price: 'Цена',
    description: 'Описание',
    category: 'Категория',
    outOfStock: 'Нет в наличии',
    related: 'Похожие товары',
    details: 'Детали товара',
    addedToCart: 'добавлен в корзину',
    removedFromCart: 'удален из корзины',
    addedToFavorites: 'добавлен в избранное',
    removedFromFavorites: 'удален из избранного',
    selectSize: 'Выберите размер',
  },
  cart: {
    title: 'Ваша корзина',
    empty: 'Корзина пуста',
    total: 'Итого',
    checkout: 'Оформить заказ',
    remove: 'Удалить',
    processing: 'Оформление заказа...',
    orderSuccess: 'Заказ успешно оформлен! Спасибо за покупку!',
    orderError: 'Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.',
    continueShopping: 'Продолжить покупки',
    quantity: 'Количество',
    increaseQuantity: 'Увеличить количество',
    decreaseQuantity: 'Уменьшить количество',
  },
  categories: {
    all: 'Все',
    men: 'Мужские',
    women: 'Женские',
    kids: 'Детские',
    running: 'Для бега',
    lifestyle: 'Повседневные',
    basketball: 'Баскетбол',
  },
  settings: {
    title: 'Настройки',
    account: 'Аккаунт',
    language: 'Язык',
    theme: 'Тема',
    notifications: 'Уведомления',
    about: 'О приложении',
    logout: 'Выйти',
    selectLanguage: 'Выберите язык',
    selectTheme: 'Выберите тему',
    referralProgram: 'Реферальная программа',
    shareReferralLink: 'Поделиться ссылкой',
    referralCode: 'Ваш реферальный код',
    referralInfo: 'Получите 5% скидку на следующий заказ, когда ваш друг совершит первую покупку по вашей ссылке',
    referralCopied: 'Реферальная ссылка скопирована!',
  },
};

// English translations
export const en: Translation = {
  common: {
    cart: 'Cart',
    home: 'Home',
    search: 'Search',
    settings: 'Settings',
    welcome: 'Welcome to our store',
    loading: 'Loading...',
    errorLoading: 'Error loading. Please try again.',
    retry: 'Retry',
    noProducts: 'No products available',
    language: 'Language',
    theme: 'Theme',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    referral: 'Referral Program',
    back: 'Back',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    deleting: 'Deleting...',
    edit: 'Edit',
    add: 'Add',
  },
  profile: {
    title: 'Profile',
    guest: 'Guest',
    notConnected: 'Not connected to Telegram',
    settings: 'Profile Settings',
    logout: 'Logout',
    logoutSuccess: 'Logout Successful',
    logoutSuccessMessage: 'You have been logged out successfully',
    logoutError: 'Logout Error',
    logoutErrorMessage: 'An error occurred while logging out. Please try again.',
    orders: 'Orders',
    addresses: 'Addresses',
    favorites: 'Favorites',
    noOrders: 'No Orders',
    noOrdersDescription: 'You have not placed any orders yet',
    startShopping: 'Start Shopping',
    noAddresses: 'No Addresses',
    noAddressesDescription: 'You have not added any delivery addresses yet',
    addFirstAddress: 'Add First Address',
    addNewAddress: 'Add New Address',
    noFavorites: 'No Favorites',
    noFavoritesDescription: 'You have not added any products to your favorites yet',
    exploreCatalog: 'Explore Catalog',
    // Virtual fitting translations
    virtualFitting: 'Virtual Fitting Room',
    bodyParams: 'Body Parameters',
    bodyParamsDesc: 'Enter your physical parameters for a more accurate fitting',
    height: 'Height',
    weight: 'Weight',
    bodyType: 'Body Type',
    gender: 'Gender',
    slim: 'Slim',
    regular: 'Regular',
    athletic: 'Athletic',
    male: 'Male',
    female: 'Female',
    tops: 'Tops',
    bottoms: 'Bottoms',
    footwear: 'Footwear',
    accessories: 'Accessories',
    tryOn: 'Try On',
    addToWardrobe: 'Add to Wardrobe',
    myWardrobe: 'My Wardrobe',
    emptyWardrobe: 'Your wardrobe is empty',
    tryItemsAndAdd: 'Try on items and add them to your wardrobe',
    wardrobeDesc: 'Your favorite virtual items will be stored here',
    comingSoon: 'Coming Soon',
    selectItemsBelow: 'Select items to try on from the catalog below',
    avatarSaved: 'Parameters Saved',
    avatarSavedDesc: 'Your parameters have been successfully saved',
    avatarSaveError: 'Error saving parameters',
    selectColorAndSize: 'Select Color and Size',
    addedToWardrobe: 'Added to Wardrobe',
    errorAddingToWardrobe: 'Error adding to wardrobe',
  },
  addresses: {
    default: 'Default',
    setDefault: 'Set as Default',
    defaultSuccess: 'Default Address Updated',
    defaultSuccessMessage: 'Your default address has been updated successfully',
    defaultError: 'Default Address Error',
    defaultErrorMessage: 'An error occurred while updating your default address. Please try again.',
    deleteConfirmTitle: 'Delete Address',
    deleteConfirmDescription: 'Are you sure you want to delete this address?',
    deleteSuccess: 'Address Deleted',
    deleteSuccessMessage: 'Address has been deleted successfully',
    deleteError: 'Delete Error',
    deleteErrorMessage: 'An error occurred while deleting the address. Please try again.',
  },
  orders: {
    orderNumber: 'Order #',
    items: 'items',
    orderItems: 'Order Items',
    showDetails: 'Show Details',
    hideDetails: 'Hide Details',
    statusPending: 'Pending',
    statusProcessing: 'Processing',
    statusShipped: 'Shipped',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
  },
  product: {
    addToCart: 'Add to Cart',
    adding: 'Adding...',
    sizes: 'Sizes',
    price: 'Price',
    description: 'Description',
    category: 'Category',
    outOfStock: 'Out of Stock',
    related: 'Related Products',
    details: 'Product Details',
    addedToCart: 'added to cart',
    removedFromCart: 'removed from cart',
    addedToFavorites: 'added to favorites',
    removedFromFavorites: 'removed from favorites',
    selectSize: 'Select Size',
  },
  cart: {
    title: 'Your Cart',
    empty: 'Your cart is empty',
    total: 'Total',
    checkout: 'Checkout',
    remove: 'Remove',
    processing: 'Processing order...',
    orderSuccess: 'Order successfully placed! Thank you for your purchase!',
    orderError: 'An error occurred while processing your order. Please try again.',
    continueShopping: 'Continue Shopping',
    quantity: 'Quantity',
    increaseQuantity: 'Increase quantity',
    decreaseQuantity: 'Decrease quantity',
  },
  categories: {
    all: 'All',
    men: 'Men',
    women: 'Women',
    kids: 'Kids',
    running: 'Running',
    lifestyle: 'Lifestyle',
    basketball: 'Basketball',
  },
  settings: {
    title: 'Settings',
    account: 'Account',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    about: 'About',
    logout: 'Logout',
    selectLanguage: 'Select Language',
    selectTheme: 'Select Theme',
    referralProgram: 'Referral Program',
    shareReferralLink: 'Share Referral Link',
    referralCode: 'Your Referral Code',
    referralInfo: 'Get 5% off your next order when your friend makes their first purchase using your link',
    referralCopied: 'Referral link copied!',
  },
};

// Polish translations
export const pl: Translation = {
  common: {
    cart: 'Koszyk',
    home: 'Strona główna',
    search: 'Szukaj',
    settings: 'Ustawienia',
    welcome: 'Witamy w sklepie',
    loading: 'Ładowanie...',
    errorLoading: 'Błąd ładowania. Spróbuj ponownie.',
    retry: 'Ponów',
    noProducts: 'Brak dostępnych produktów',
    language: 'Język',
    theme: 'Motyw',
    lightTheme: 'Jasny',
    darkTheme: 'Ciemny',
    referral: 'Program poleceń',
    back: 'Wstecz',
    close: 'Zamknij',
    save: 'Zapisz',
    cancel: 'Anuluj',
    delete: 'Usuń',
    deleting: 'Usuwanie...',
    edit: 'Edytuj',
    add: 'Dodaj',
  },
  profile: {
    title: 'Profil',
    guest: 'Gość',
    notConnected: 'Nie połączono z Telegramem',
    settings: 'Ustawienia profilu',
    logout: 'Wyloguj',
    logoutSuccess: 'Wylogowanie udane',
    logoutSuccessMessage: 'Zostałeś pomyślnie wylogowany',
    logoutError: 'Błąd wylogowania',
    logoutErrorMessage: 'Wystąpił błąd podczas wylogowywania. Spróbuj ponownie.',
    orders: 'Zamówienia',
    addresses: 'Adresy',
    favorites: 'Ulubione',
    noOrders: 'Brak zamówień',
    noOrdersDescription: 'Nie złożyłeś jeszcze żadnych zamówień',
    startShopping: 'Rozpocznij zakupy',
    noAddresses: 'Brak adresów',
    noAddressesDescription: 'Nie dodałeś jeszcze żadnych adresów dostawy',
    addFirstAddress: 'Dodaj pierwszy adres',
    addNewAddress: 'Dodaj nowy adres',
    noFavorites: 'Brak ulubionych',
    noFavoritesDescription: 'Nie dodałeś jeszcze żadnych produktów do ulubionych',
    exploreCatalog: 'Przeglądaj katalog',
  },
  addresses: {
    default: 'Domyślny',
    setDefault: 'Ustaw jako domyślny',
    defaultSuccess: 'Zaktualizowano domyślny adres',
    defaultSuccessMessage: 'Twój domyślny adres został pomyślnie zaktualizowany',
    defaultError: 'Błąd domyślnego adresu',
    defaultErrorMessage: 'Wystąpił błąd podczas aktualizacji domyślnego adresu. Spróbuj ponownie.',
    deleteConfirmTitle: 'Usuń adres',
    deleteConfirmDescription: 'Czy na pewno chcesz usunąć ten adres?',
    deleteSuccess: 'Adres usunięty',
    deleteSuccessMessage: 'Adres został pomyślnie usunięty',
    deleteError: 'Błąd usuwania',
    deleteErrorMessage: 'Wystąpił błąd podczas usuwania adresu. Spróbuj ponownie.',
  },
  orders: {
    orderNumber: 'Zamówienie #',
    items: 'przedmioty',
    orderItems: 'Przedmioty zamówienia',
    showDetails: 'Pokaż szczegóły',
    hideDetails: 'Ukryj szczegóły',
    statusPending: 'Oczekujące',
    statusProcessing: 'Przetwarzanie',
    statusShipped: 'Wysłane',
    statusDelivered: 'Dostarczone',
    statusCancelled: 'Anulowane',
  },
  product: {
    addToCart: 'Dodaj do koszyka',
    adding: 'Dodawanie...',
    sizes: 'Rozmiary',
    price: 'Cena',
    description: 'Opis',
    category: 'Kategoria',
    outOfStock: 'Brak w magazynie',
    related: 'Podobne produkty',
    details: 'Szczegóły produktu',
    addedToCart: 'dodano do koszyka',
    removedFromCart: 'usunięto z koszyka',
    addedToFavorites: 'dodano do ulubionych',
    removedFromFavorites: 'usunięto z ulubionych',
    selectSize: 'Wybierz rozmiar',
  },
  cart: {
    title: 'Twój koszyk',
    empty: 'Twój koszyk jest pusty',
    total: 'Suma',
    checkout: 'Do kasy',
    remove: 'Usuń',
    processing: 'Przetwarzanie zamówienia...',
    orderSuccess: 'Zamówienie złożone pomyślnie! Dziękujemy za zakupy!',
    orderError: 'Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie.',
    continueShopping: 'Kontynuuj zakupy',
    quantity: 'Ilość',
    increaseQuantity: 'Zwiększ ilość',
    decreaseQuantity: 'Zmniejsz ilość',
  },
  categories: {
    all: 'Wszystkie',
    men: 'Męskie',
    women: 'Damskie',
    kids: 'Dziecięce',
    running: 'Do biegania',
    lifestyle: 'Lifestyle',
    basketball: 'Koszykówka',
  },
  settings: {
    title: 'Ustawienia',
    account: 'Konto',
    language: 'Język',
    theme: 'Motyw',
    notifications: 'Powiadomienia',
    about: 'O aplikacji',
    logout: 'Wyloguj',
    selectLanguage: 'Wybierz język',
    selectTheme: 'Wybierz motyw',
    referralProgram: 'Program poleceń',
    shareReferralLink: 'Udostępnij link',
    referralCode: 'Twój kod polecający',
    referralInfo: 'Otrzymaj 5% zniżki na następne zamówienie, gdy Twój znajomy dokona pierwszego zakupu za pomocą Twojego linku',
    referralCopied: 'Link polecający skopiowany!',
  },
};

// Czech translations
export const cs: Translation = {
  common: {
    cart: 'Košík',
    home: 'Domů',
    search: 'Hledat',
    settings: 'Nastavení',
    welcome: 'Vítejte v našem obchodě',
    loading: 'Načítání...',
    errorLoading: 'Chyba při načítání. Zkuste to prosím znovu.',
    retry: 'Zkusit znovu',
    noProducts: 'Žádné produkty k dispozici',
    language: 'Jazyk',
    theme: 'Motiv',
    lightTheme: 'Světlý',
    darkTheme: 'Tmavý',
    referral: 'Doporučovací program',
    back: 'Zpět',
    close: 'Zavřít',
    save: 'Uložit',
    cancel: 'Zrušit',
    delete: 'Smazat',
    deleting: 'Mazání...',
    edit: 'Upravit',
    add: 'Přidat',
  },
  profile: {
    title: 'Profil',
    guest: 'Host',
    notConnected: 'Nepřipojeno k Telegramu',
    settings: 'Nastavení profilu',
    logout: 'Odhlásit se',
    logoutSuccess: 'Odhlášení úspěšné',
    logoutSuccessMessage: 'Byli jste úspěšně odhlášeni',
    logoutError: 'Chyba odhlášení',
    logoutErrorMessage: 'Při odhlašování došlo k chybě. Zkuste to prosím znovu.',
    orders: 'Objednávky',
    addresses: 'Adresy',
    favorites: 'Oblíbené',
    noOrders: 'Žádné objednávky',
    noOrdersDescription: 'Zatím jste nezadali žádné objednávky',
    startShopping: 'Začít nakupovat',
    noAddresses: 'Žádné adresy',
    noAddressesDescription: 'Zatím jste nepřidali žádné doručovací adresy',
    addFirstAddress: 'Přidat první adresu',
    addNewAddress: 'Přidat novou adresu',
    noFavorites: 'Žádné oblíbené',
    noFavoritesDescription: 'Zatím jste nepřidali žádné produkty do oblíbených',
    exploreCatalog: 'Prozkoumat katalog',
  },
  addresses: {
    default: 'Výchozí',
    setDefault: 'Nastavit jako výchozí',
    defaultSuccess: 'Výchozí adresa aktualizována',
    defaultSuccessMessage: 'Vaše výchozí adresa byla úspěšně aktualizována',
    defaultError: 'Chyba výchozí adresy',
    defaultErrorMessage: 'Při aktualizaci výchozí adresy došlo k chybě. Zkuste to prosím znovu.',
    deleteConfirmTitle: 'Smazat adresu',
    deleteConfirmDescription: 'Opravdu chcete smazat tuto adresu?',
    deleteSuccess: 'Adresa smazána',
    deleteSuccessMessage: 'Adresa byla úspěšně smazána',
    deleteError: 'Chyba při mazání',
    deleteErrorMessage: 'Při mazání adresy došlo k chybě. Zkuste to prosím znovu.',
  },
  orders: {
    orderNumber: 'Objednávka #',
    items: 'položky',
    orderItems: 'Položky objednávky',
    showDetails: 'Zobrazit detaily',
    hideDetails: 'Skrýt detaily',
    statusPending: 'Čeká na vyřízení',
    statusProcessing: 'Zpracovává se',
    statusShipped: 'Odesláno',
    statusDelivered: 'Doručeno',
    statusCancelled: 'Zrušeno',
  },
  product: {
    addToCart: 'Přidat do košíku',
    adding: 'Přidávání...',
    sizes: 'Velikosti',
    price: 'Cena',
    description: 'Popis',
    category: 'Kategorie',
    outOfStock: 'Vyprodáno',
    related: 'Související produkty',
    details: 'Detaily produktu',
    addedToCart: 'přidáno do košíku',
    removedFromCart: 'odebráno z košíku',
    addedToFavorites: 'přidáno do oblíbených',
    removedFromFavorites: 'odebráno z oblíbených',
    selectSize: 'Vyberte velikost',
  },
  cart: {
    title: 'Váš košík',
    empty: 'Váš košík je prázdný',
    total: 'Celkem',
    checkout: 'Pokladna',
    remove: 'Odebrat',
    processing: 'Zpracování objednávky...',
    orderSuccess: 'Objednávka úspěšně dokončena! Děkujeme za nákup!',
    orderError: 'Při zpracování objednávky došlo k chybě. Zkuste to prosím znovu.',
    continueShopping: 'Pokračovat v nákupu',
    quantity: 'Množství',
    increaseQuantity: 'Zvýšit množství',
    decreaseQuantity: 'Snížit množství',
  },
  categories: {
    all: 'Vše',
    men: 'Muži',
    women: 'Ženy',
    kids: 'Děti',
    running: 'Běh',
    lifestyle: 'Lifestyle',
    basketball: 'Basketbal',
  },
  settings: {
    title: 'Nastavení',
    account: 'Účet',
    language: 'Jazyk',
    theme: 'Motiv',
    notifications: 'Oznámení',
    about: 'O aplikaci',
    logout: 'Odhlásit se',
    selectLanguage: 'Vyberte jazyk',
    selectTheme: 'Vyberte motiv',
    referralProgram: 'Doporučovací program',
    shareReferralLink: 'Sdílet odkaz',
    referralCode: 'Váš doporučovací kód',
    referralInfo: 'Získejte 5% slevu na další objednávku, když váš přítel uskuteční první nákup pomocí vašeho odkazu',
    referralCopied: 'Doporučovací odkaz zkopírován!',
  },
};

// German translations
export const de: Translation = {
  common: {
    cart: 'Warenkorb',
    home: 'Startseite',
    search: 'Suchen',
    settings: 'Einstellungen',
    welcome: 'Willkommen in unserem Shop',
    loading: 'Laden...',
    errorLoading: 'Fehler beim Laden. Bitte versuchen Sie es erneut.',
    retry: 'Wiederholen',
    noProducts: 'Keine Produkte verfügbar',
    language: 'Sprache',
    theme: 'Theme',
    lightTheme: 'Hell',
    darkTheme: 'Dunkel',
    referral: 'Empfehlungsprogramm',
    back: 'Zurück',
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    deleting: 'Löschen...',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
  },
  profile: {
    title: 'Profil',
    guest: 'Gast',
    notConnected: 'Nicht mit Telegram verbunden',
    settings: 'Profileinstellungen',
    logout: 'Abmelden',
    logoutSuccess: 'Abmeldung erfolgreich',
    logoutSuccessMessage: 'Sie wurden erfolgreich abgemeldet',
    logoutError: 'Abmeldefehler',
    logoutErrorMessage: 'Bei der Abmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    orders: 'Bestellungen',
    addresses: 'Adressen',
    favorites: 'Favoriten',
    noOrders: 'Keine Bestellungen',
    noOrdersDescription: 'Sie haben noch keine Bestellungen aufgegeben',
    startShopping: 'Einkauf beginnen',
    noAddresses: 'Keine Adressen',
    noAddressesDescription: 'Sie haben noch keine Lieferadressen hinzugefügt',
    addFirstAddress: 'Erste Adresse hinzufügen',
    addNewAddress: 'Neue Adresse hinzufügen',
    noFavorites: 'Keine Favoriten',
    noFavoritesDescription: 'Sie haben noch keine Produkte zu Ihren Favoriten hinzugefügt',
    exploreCatalog: 'Katalog erkunden',
  },
  addresses: {
    default: 'Standard',
    setDefault: 'Als Standard festlegen',
    defaultSuccess: 'Standardadresse aktualisiert',
    defaultSuccessMessage: 'Ihre Standardadresse wurde erfolgreich aktualisiert',
    defaultError: 'Standardadressenfehler',
    defaultErrorMessage: 'Bei der Aktualisierung Ihrer Standardadresse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    deleteConfirmTitle: 'Adresse löschen',
    deleteConfirmDescription: 'Sind Sie sicher, dass Sie diese Adresse löschen möchten?',
    deleteSuccess: 'Adresse gelöscht',
    deleteSuccessMessage: 'Adresse wurde erfolgreich gelöscht',
    deleteError: 'Löschfehler',
    deleteErrorMessage: 'Beim Löschen der Adresse ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
  },
  orders: {
    orderNumber: 'Bestellung #',
    items: 'Artikel',
    orderItems: 'Bestellartikel',
    showDetails: 'Details anzeigen',
    hideDetails: 'Details ausblenden',
    statusPending: 'Ausstehend',
    statusProcessing: 'In Bearbeitung',
    statusShipped: 'Versendet',
    statusDelivered: 'Geliefert',
    statusCancelled: 'Storniert',
  },
  product: {
    addToCart: 'In den Warenkorb',
    adding: 'Hinzufügen...',
    sizes: 'Größen',
    price: 'Preis',
    description: 'Beschreibung',
    category: 'Kategorie',
    outOfStock: 'Nicht auf Lager',
    related: 'Ähnliche Produkte',
    details: 'Produktdetails',
    addedToCart: 'zum Warenkorb hinzugefügt',
    removedFromCart: 'aus dem Warenkorb entfernt',
    addedToFavorites: 'zu Favoriten hinzugefügt',
    removedFromFavorites: 'aus Favoriten entfernt',
    selectSize: 'Größe wählen',
  },
  cart: {
    title: 'Ihr Warenkorb',
    empty: 'Ihr Warenkorb ist leer',
    total: 'Gesamtsumme',
    checkout: 'Zur Kasse',
    remove: 'Entfernen',
    processing: 'Bearbeitung der Bestellung...',
    orderSuccess: 'Bestellung erfolgreich aufgegeben! Vielen Dank für Ihren Einkauf!',
    orderError: 'Bei der Bearbeitung Ihrer Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
    continueShopping: 'Einkauf fortsetzen',
    quantity: 'Menge',
    increaseQuantity: 'Menge erhöhen',
    decreaseQuantity: 'Menge verringern',
  },
  categories: {
    all: 'Alle',
    men: 'Herren',
    women: 'Damen',
    kids: 'Kinder',
    running: 'Laufen',
    lifestyle: 'Lifestyle',
    basketball: 'Basketball',
  },
  settings: {
    title: 'Einstellungen',
    account: 'Konto',
    language: 'Sprache',
    theme: 'Theme',
    notifications: 'Benachrichtigungen',
    about: 'Über uns',
    logout: 'Abmelden',
    selectLanguage: 'Sprache auswählen',
    selectTheme: 'Theme auswählen',
    referralProgram: 'Empfehlungsprogramm',
    shareReferralLink: 'Link teilen',
    referralCode: 'Ihr Empfehlungscode',
    referralInfo: 'Erhalten Sie 5% Rabatt auf Ihre nächste Bestellung, wenn Ihr Freund seinen ersten Kauf über Ihren Link tätigt',
    referralCopied: 'Empfehlungslink kopiert!',
  },
};

// Languages mapping
export const translations = {
  ru,
  en,
  pl,
  cs,
  de,
};

// Language display names
export const languageNames = {
  ru: 'Русский',
  en: 'English',
  pl: 'Polski',
  cs: 'Čeština',
  de: 'Deutsch',
};

// Custom hook для использования переводов
import { useState, useEffect } from 'react';

export function useTranslation() {
  const [language, setLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  
  useEffect(() => {
    // Восстановление выбранного языка из localStorage
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Автоопределение языка из браузера
      const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
      if (SUPPORTED_LANGUAGES.includes(browserLang)) {
        setLanguage(browserLang);
      }
    }
  }, []);
  
  // Функция для изменения языка
  const changeLanguage = (newLanguage: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };
  
  // Возвращаем текущий язык, переводы и функцию изменения языка
  return { 
    language, 
    t: translations[language] || translations[DEFAULT_LANGUAGE], 
    changeLanguage 
  };
}