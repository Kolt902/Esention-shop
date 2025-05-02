import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Product } from "@/types";
import { useStore } from "@/lib/StoreContext";

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
  onSizeSelected,
}: SelectSizeDialogProps) {
  const { t } = useStore();
  const [size, setSize] = useState<string>("");

  const handleSubmit = () => {
    if (size) {
      onSizeSelected(size);
    }
  };

  // Reset size when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSize("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>
            {t.product.selectSize}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t.product.selectSize} />
            </SelectTrigger>
            <SelectContent>
              {product.sizes?.map((sizeOption) => (
                <SelectItem key={sizeOption} value={sizeOption}>
                  {sizeOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
          >
            {t.common.cancel}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!size}
          >
            {t.product.addToCart}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}