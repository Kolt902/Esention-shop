import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useStore } from "@/lib/StoreContext";
import { Loader2, RefreshCw, Package, Users, ArrowLeft, UserPlus, Shield, Eye, Clock } from "lucide-react";

interface AdminUser {
  id: number;
  username: string;
  telegramId: string;
  isAdmin: boolean;
}

interface OrderItem {
  productId: number;
  quantity: number;
  size?: string;
  product: {
    name: string;
    price: number;
    imageUrl: string;
  };
}

interface Order {
  id: number;
  userId: number;
  status: string;
  totalPrice: number;
  items: OrderItem[];
  fullName: string;
  email: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  createdAt: string;
}

export default function AdminPage() {
  const { t } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  
  // Состояния для диалогов и модальных окон
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState("");

  // Verify admin status
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await apiRequest("/api/admin/check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        setIsAdmin(response && response.isAdmin);
      } catch (error) {
        console.error("Admin access error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/admin/orders");
      if (response && Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить заказы",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/admin/online-users");
      if (response && Array.isArray(response)) {
        setOnlineUsers(response);
      } else {
        setOnlineUsers([]);
      }
    } catch (error) {
      console.error("Error fetching online users:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список онлайн пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin users
  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/admin/admins");
      if (response && Array.isArray(response)) {
        setAdminUsers(response);
      } else {
        setAdminUsers([]);
      }
    } catch (error) {
      console.error("Error fetching admin users:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список администраторов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/admin/users");
      if (response && Array.isArray(response)) {
        setAllUsers(response);
      } else {
        setAllUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Add admin user
  const addAdminUser = async (username: string) => {
    try {
      setLoading(true);
      await apiRequest("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      
      // Refresh admin users list
      fetchAdminUsers();
      
      // Close dialog
      setShowAddAdminDialog(false);
      setNewAdminUsername("");
      
      toast({
        title: "Успех",
        description: `Пользователь ${username} добавлен как администратор`,
      });
    } catch (error) {
      console.error("Error adding admin user:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить администратора. Проверьте имя пользователя.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Remove admin user
  const removeAdminUser = async (userId: number) => {
    try {
      setUpdating(userId);
      await apiRequest(`/api/admin/admins/${userId}`, {
        method: "DELETE",
      });
      
      // Refresh admin users list
      fetchAdminUsers();
      
      toast({
        title: "Успех",
        description: "Администратор удален",
      });
    } catch (error) {
      console.error("Error removing admin user:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить администратора",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };
  
  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };
  
  // Load data when tab changes
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "users") {
      fetchOnlineUsers();
    } else if (activeTab === "admins") {
      fetchAdminUsers();
      fetchAllUsers();
    }
  }, [activeTab, isAdmin]);

  // Update order status
  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      setUpdating(orderId);
      await apiRequest(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      // Refresh orders list
      fetchOrders();
      
      toast({
        title: "Успех",
        description: `Статус заказа #${orderId} обновлен`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус заказа",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Go back to store
  const goToStore = () => {
    window.location.href = "/";
  };

  // If still loading
  if (loading && !isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Проверка доступа...</span>
      </div>
    );
  }

  // If not admin
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
        <p className="mb-6">У вас нет прав доступа к этой странице</p>
        <Button onClick={goToStore}>Вернуться в магазин</Button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <Button variant="outline" onClick={goToStore} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Вернуться в магазин
          </Button>
        </div>

        <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="orders" className="flex gap-2 items-center">
              <Package className="h-4 w-4" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="users" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              Онлайн пользователи
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex gap-2 items-center">
              <Shield className="h-4 w-4" />
              Администраторы
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Заказы</CardTitle>
                    <CardDescription>
                      Управление заказами и статусами доставки
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={fetchOrders}
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Обновить
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет заказов
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Список всех заказов</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Клиент</TableHead>
                        <TableHead>Адрес</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <div>{order.fullName}</div>
                            <div className="text-sm text-muted-foreground">{order.phoneNumber}</div>
                          </TableCell>
                          <TableCell>
                            <div>{order.city}, {order.country}</div>
                            <div className="text-sm text-muted-foreground">{order.address}</div>
                          </TableCell>
                          <TableCell>€{order.totalPrice / 100}</TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs inline-block
                              ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                              ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                              ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {order.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select 
                              defaultValue={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                              disabled={updating === order.id}
                            >
                              <SelectTrigger className="w-[130px]">
                                {updating === order.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <SelectValue placeholder="Статус" />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">В ожидании</SelectItem>
                                <SelectItem value="processing">Обработка</SelectItem>
                                <SelectItem value="shipped">Отправлен</SelectItem>
                                <SelectItem value="delivered">Доставлен</SelectItem>
                                <SelectItem value="cancelled">Отменен</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="ml-2"
                              onClick={() => viewOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Online Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Онлайн пользователи</CardTitle>
                    <CardDescription>
                      Пользователи, активные в приложении
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={fetchOnlineUsers}
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Обновить
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : onlineUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет активных пользователей
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Список активных пользователей</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Никнейм</TableHead>
                        <TableHead>Telegram ID</TableHead>
                        <TableHead>Последняя активность</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {onlineUsers.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell className="font-medium">#{user.userId}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.telegramId}</TableCell>
                          <TableCell>{formatDate(user.lastActive)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Admins Tab */}
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Администраторы</CardTitle>
                    <CardDescription>
                      Управление правами администраторов
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={fetchAdminUsers}
                      disabled={loading}
                      className="gap-2"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Обновить
                    </Button>
                    
                    <Button 
                      onClick={() => setShowAddAdminDialog(true)}
                      className="gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Добавить админа
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : adminUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет администраторов (кроме вас)
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Список администраторов</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Никнейм</TableHead>
                        <TableHead>Telegram ID</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">#{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.telegramId}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeAdminUser(user.id)}
                              disabled={updating === user.id}
                            >
                              {updating === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Удалить"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Order Details Dialog */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали заказа #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Подробная информация о заказе от {selectedOrder?.createdAt ? formatDate(selectedOrder.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h4 className="text-sm font-medium mb-2">Информация о покупателе</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Имя</p>
                      <p className="font-medium">{selectedOrder.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-medium">{selectedOrder.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div>
                <h4 className="text-sm font-medium mb-2">Адрес доставки</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Страна</p>
                      <p className="font-medium">{selectedOrder.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Город</p>
                      <p className="font-medium">{selectedOrder.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Адрес</p>
                      <p className="font-medium">{selectedOrder.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Почтовый индекс</p>
                      <p className="font-medium">{selectedOrder.postalCode}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h4 className="text-sm font-medium mb-2">Товары в заказе</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 py-2 border-b last:border-0">
                        <div className="h-16 w-16 rounded-md overflow-hidden">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          {item.size && <p className="text-sm text-gray-500">Размер: {item.size}</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">€{(item.product.price / 100).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <p className="font-medium">Итого:</p>
                    <p className="font-bold text-lg">€{(selectedOrder.totalPrice / 100).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Status */}
              <div>
                <h4 className="text-sm font-medium mb-2">Статус заказа</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium
                      ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                      ${selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                      ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {selectedOrder.status}
                    </div>
                    
                    <Select 
                      defaultValue={selectedOrder.status}
                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Изменить статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">В ожидании</SelectItem>
                        <SelectItem value="processing">Обработка</SelectItem>
                        <SelectItem value="shipped">Отправлен</SelectItem>
                        <SelectItem value="delivered">Доставлен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDetailsDialog(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Admin Dialog */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить администратора</DialogTitle>
            <DialogDescription>
              Введите имя пользователя Telegram для предоставления прав администратора
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input 
                id="username" 
                placeholder="username"
                value={newAdminUsername}
                onChange={(e) => setNewAdminUsername(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAdminDialog(false)}>
              Отмена
            </Button>
            <Button 
              onClick={() => addAdminUser(newAdminUsername)}
              disabled={!newAdminUsername || loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}