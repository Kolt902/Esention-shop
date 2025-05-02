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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useStore } from "@/lib/StoreContext";
import { Loader2, RefreshCw, Package, Users, ArrowLeft } from "lucide-react";

export default function AdminPage() {
  const { t } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

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

  // Load data when tab changes
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "users") {
      fetchOnlineUsers();
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
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="orders" className="flex gap-2 items-center">
              <Package className="h-4 w-4" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="users" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              Онлайн пользователи
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
        </Tabs>
      </div>
    </>
  );
}