// Supported languages
export type SupportedLanguage = 'ru' | 'en' | 'pl' | 'cs' | 'de';

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