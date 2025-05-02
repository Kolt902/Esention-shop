import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useStore } from '@/lib/StoreContext';
import { Product } from '@/types';

interface SelectSizeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSizeSelected: (size: string) => void;
}

export function SelectSizeDialog({ 
  open, 
  onOpenChange, 
  product, 
  onSizeSelected 
}: SelectSizeDialogProps) {
  const { t } = useStore();
  
  // Состояние для выбранного размера
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  // Обработчик подтверждения выбора
  const handleConfirm = () => {
    if (selectedSize) {
      onSizeSelected(selectedSize);
    }
  };
  
  // Сброс выбранного размера при открытии/закрытии диалога
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedSize("");
    }
    onOpenChange(open);
  };
  
  // Группируем размеры для более удобного отображения
  const getSizeGroups = () => {
    if (!product.sizes || product.sizes.length === 0) {
      return [];
    }
    
    // Для размеров обуви (числовые размеры)
    if (product.sizes.some(size => !isNaN(Number(size)))) {
      return [product.sizes.sort((a, b) => Number(a) - Number(b))];
    }
    
    // Для размеров одежды (S, M, L, XL и т.д.)
    const standardSizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    if (product.sizes.some(size => standardSizeOrder.includes(size))) {
      return [product.sizes.sort(
        (a, b) => standardSizeOrder.indexOf(a) - standardSizeOrder.indexOf(b)
      )];
    }
    
    // Для всех остальных случаев просто возвращаем как есть
    return [product.sizes];
  };

  const sizeGroups = getSizeGroups();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.product.selectSize}</DialogTitle>
        </DialogHeader>
        
        {sizeGroups.length > 0 && (
          <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
            <div className="grid grid-cols-3 gap-2">
              {sizeGroups[0].map((size) => (
                <div key={size} className="relative">
                  <RadioGroupItem
                    value={size}
                    id={`size-${size}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            {t.common.cancel}
          </Button>
          <Button
            type="submit"
            disabled={!selectedSize}
            onClick={handleConfirm}
          >
            {t.common.add}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}