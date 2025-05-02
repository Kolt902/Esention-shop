import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange: (filters: {
    categories: string[];
    brands: string[];
    styles: string[];
    priceRange: [number, number];
    genders: string[];
  }) => void;
  initialFilters?: {
    categories?: string[];
    brands?: string[];
    styles?: string[];
    priceRange?: [number, number];
    genders?: string[];
  };
}

export default function FilterPanel({ 
  isOpen, 
  onClose, 
  onFilterChange,
  initialFilters = {} 
}: FilterPanelProps) {
  // Состояние для всех фильтров
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters.categories || []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters.brands || []);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(initialFilters.styles || []);
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters.priceRange || [0, 50000]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(initialFilters.genders || []);

  // Загрузка данных для фильтров с сервера
  const { data } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60000, // 1 минута кэширования
  });

  const categories = data?.categories || [];
  const brands = data?.brands || [];
  const styles = data?.styleDetails || [];

  // Применение фильтров при изменении
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      styles: selectedStyles,
      priceRange,
      genders: selectedGenders,
    });
  }, [selectedCategories, selectedBrands, selectedStyles, priceRange, selectedGenders]);

  // Обработчики изменения фильтров
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    if (checked) {
      setSelectedStyles([...selectedStyles, style]);
    } else {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    }
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleGenderChange = (gender: string, checked: boolean) => {
    if (checked) {
      setSelectedGenders([...selectedGenders, gender]);
    } else {
      setSelectedGenders(selectedGenders.filter(g => g !== gender));
    }
  };

  // Сброс всех фильтров
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedStyles([]);
    setPriceRange([0, 50000]);
    setSelectedGenders([]);
  };

  // Если панель не открыта, не рендерим содержимое
  if (!isOpen) return null;

  // Форматирование цены для отображения
  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(0)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white overflow-y-auto p-4 animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Фильтры</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            aria-label="Закрыть"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Категории */}
          <Accordion type="single" collapsible defaultValue="categories">
            <AccordionItem value="categories">
              <AccordionTrigger>Категории</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {categories.map((category: string) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category, checked as boolean)
                        }
                      />
                      <Label htmlFor={`category-${category}`} className="capitalize">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Бренды */}
          <Accordion type="single" collapsible defaultValue="brands">
            <AccordionItem value="brands">
              <AccordionTrigger>Бренды</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand: string) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => 
                          handleBrandChange(brand, checked as boolean)
                        }
                      />
                      <Label htmlFor={`brand-${brand}`}>
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Стили */}
          <Accordion type="single" collapsible defaultValue="styles">
            <AccordionItem value="styles">
              <AccordionTrigger>Стили</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {styles.map((style: any) => (
                    <div key={style.name} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`style-${style.name}`}
                        checked={selectedStyles.includes(style.name)}
                        onCheckedChange={(checked) => 
                          handleStyleChange(style.name, checked as boolean)
                        }
                      />
                      <Label htmlFor={`style-${style.name}`}>
                        {style.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Диапазон цен */}
          <Accordion type="single" collapsible defaultValue="price">
            <AccordionItem value="price">
              <AccordionTrigger>Цена</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceChange}
                    className="my-4"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Пол */}
          <Accordion type="single" collapsible defaultValue="gender">
            <AccordionItem value="gender">
              <AccordionTrigger>Пол</AccordionTrigger>
              <AccordionContent>
                <RadioGroup className="flex flex-col space-y-2">
                  {["men", "women", "unisex"].map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`gender-${gender}`}
                        checked={selectedGenders.includes(gender)}
                        onCheckedChange={(checked) => 
                          handleGenderChange(gender, checked as boolean)
                        }
                      />
                      <Label htmlFor={`gender-${gender}`} className="capitalize">
                        {gender === "men" ? "Мужской" : 
                         gender === "women" ? "Женский" : "Унисекс"}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Кнопки действий */}
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              className="w-1/2 mr-2"
            >
              Сбросить
            </Button>
            <Button 
              onClick={onClose}
              className="w-1/2 ml-2"
            >
              Применить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}