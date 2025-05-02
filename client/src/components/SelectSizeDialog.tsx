import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/StoreContext";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";

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

  if (!product.sizes || product.sizes.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.product.selectSize}</DialogTitle>
          <DialogDescription>
            {product.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3 py-4">
          {product.sizes.map((size) => (
            <Button
              key={size}
              variant="outline"
              onClick={() => onSizeSelected(size)}
              className="h-12 text-center"
            >
              {size}
            </Button>
          ))}
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            {t.common.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}