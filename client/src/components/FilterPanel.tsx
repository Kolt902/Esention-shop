import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  brands: string[];
  sizes: string[];
  maxPrice: number;
}

interface FilterState {
  brands: string[];
  sizes: string[];
  priceRange: [number, number];
  condition: string[];
  sortBy: string;
}

export default function FilterPanel({ onFilterChange, brands, sizes, maxPrice }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    sizes: [],
    priceRange: [0, maxPrice],
    condition: [],
    sortBy: 'popular'
  });

  const [expandedSections, setExpandedSections] = useState({
    sizes: true,
    brands: true,
    price: true,
    condition: true,
    sort: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandChange = (brand: string) => {
    setFilters(prev => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      
      const newFilters = { ...prev, brands: newBrands };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSizeChange = (size: string) => {
    setFilters(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      
      const newFilters = { ...prev, sizes: newSizes };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters(prev => {
      const newFilters = { 
        ...prev, 
        priceRange: value
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleConditionChange = (condition: string) => {
    setFilters(prev => {
      const newCondition = prev.condition.includes(condition)
        ? prev.condition.filter(c => c !== condition)
        : [...prev.condition, condition];
      
      const newFilters = { ...prev, condition: newCondition };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSortChange = (sortBy: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, sortBy };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const FilterSection = ({ 
    title, 
    isExpanded, 
    onToggle, 
    children 
  }: { 
    title: string; 
    isExpanded: boolean; 
    onToggle: () => void; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={onToggle}
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="mt-4">{children}</div>}
    </div>
  );

  return (
    <Card className="w-64 flex-shrink-0">
      <CardContent className="p-4">
        <FilterSection
          title="Размеры"
          isExpanded={expandedSections.sizes}
          onToggle={() => toggleSection('sizes')}
        >
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(size => (
              <Button
                key={size}
                variant={filters.sizes.includes(size) ? "default" : "outline"}
                className={cn(
                  "w-full text-sm",
                  filters.sizes.includes(size) && "bg-black text-white"
                )}
                onClick={() => handleSizeChange(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Бренды"
          isExpanded={expandedSections.brands}
          onToggle={() => toggleSection('brands')}
        >
          <div className="space-y-2">
            {brands.map(brand => (
              <div key={brand} className="flex items-center">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Цена"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <Slider
              defaultValue={[0, maxPrice] as [number, number]}
              max={maxPrice}
              step={100}
              value={[filters.priceRange[0], filters.priceRange[1]] as [number, number]}
              onValueChange={handlePriceChange}
              className="mt-2"
            />
            <div className="flex justify-between text-sm">
              <span>€{filters.priceRange[0]}</span>
              <span>€{filters.priceRange[1]}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Состояние"
          isExpanded={expandedSections.condition}
          onToggle={() => toggleSection('condition')}
        >
          <div className="space-y-2">
            {['Новое', 'Б/У'].map(condition => (
              <div key={condition} className="flex items-center">
                <Checkbox
                  id={`condition-${condition}`}
                  checked={filters.condition.includes(condition)}
                  onCheckedChange={() => handleConditionChange(condition)}
                />
                <label
                  htmlFor={`condition-${condition}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Сортировка"
          isExpanded={expandedSections.sort}
          onToggle={() => toggleSection('sort')}
        >
          <div className="space-y-2">
            {[
              { id: 'popular', label: 'По популярности' },
              { id: 'price_asc', label: 'По возрастанию цены' },
              { id: 'price_desc', label: 'По убыванию цены' },
              { id: 'newest', label: 'Сначала новые' }
            ].map(sort => (
              <div
                key={sort.id}
                className={cn(
                  'py-1.5 px-2 rounded cursor-pointer text-sm',
                  filters.sortBy === sort.id
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                )}
                onClick={() => handleSortChange(sort.id)}
              >
                {sort.label}
              </div>
            ))}
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  );
}