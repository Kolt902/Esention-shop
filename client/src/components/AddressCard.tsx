import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Edit, 
  Trash2, 
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useNavigate } from 'wouter';
import { useStore } from '@/lib/StoreContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Интерфейс для адреса доставки
interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressCardProps {
  address: Address;
}

export default function AddressCard({ address }: AddressCardProps) {
  const { t } = useStore();
  const { toast } = useToast();
  const [, navigate] = useNavigate();
  const queryClient = useQueryClient();
  
  // Состояние для диалога удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Мутация для удаления адреса
  const deleteAddressMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/user/addresses/${address.id}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      toast({
        title: t.addresses.deleteSuccess,
        description: t.addresses.deleteSuccessMessage,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/addresses'] });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast({
        title: t.addresses.deleteError,
        description: t.addresses.deleteErrorMessage,
        variant: "destructive",
      });
    }
  });
  
  // Мутация для установки адреса по умолчанию
  const setDefaultAddressMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/user/addresses/${address.id}/default`, {
        method: 'PATCH'
      });
    },
    onSuccess: () => {
      toast({
        title: t.addresses.defaultSuccess,
        description: t.addresses.defaultSuccessMessage,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/addresses'] });
    },
    onError: () => {
      toast({
        title: t.addresses.defaultError,
        description: t.addresses.defaultErrorMessage,
        variant: "destructive",
      });
    }
  });
  
  // Обработчик редактирования адреса
  const handleEdit = () => {
    navigate(`/address/edit/${address.id}`);
  };
  
  // Обработчик удаления адреса
  const handleDelete = () => {
    deleteAddressMutation.mutate();
  };
  
  // Обработчик установки адреса по умолчанию
  const handleSetDefault = () => {
    if (!address.isDefault) {
      setDefaultAddressMutation.mutate();
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mt-0.5 mr-2 text-muted-foreground" />
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{address.fullName}</p>
                  {address.isDefault && (
                    <Badge variant="outline" className="ml-2">
                      {t.addresses.default}
                    </Badge>
                  )}
                </div>
                <p className="text-sm mt-1">{address.phone}</p>
                <p className="text-sm mt-1">{address.address}</p>
                <p className="text-sm">{address.city}, {address.postalCode}</p>
                <p className="text-sm">{address.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 flex justify-between bg-muted/30">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-8"
              onClick={handleEdit}
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              {t.common.edit}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 text-destructive border-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              {t.common.delete}
            </Button>
          </div>
          
          {!address.isDefault && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8"
              onClick={handleSetDefault}
              disabled={setDefaultAddressMutation.isPending}
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              {t.addresses.setDefault}
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addresses.deleteConfirmTitle}</DialogTitle>
            <DialogDescription>
              {t.addresses.deleteConfirmDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteAddressMutation.isPending}
            >
              {deleteAddressMutation.isPending ? t.common.deleting : t.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}