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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getCurrentUser } from "@/lib/telegram";
import { format } from "date-fns";
import { useStore } from "@/lib/StoreContext";
import { 
  Loader2, RefreshCw, Package, Users, ArrowLeft, UserPlus, Shield, Eye, Clock, 
  Activity, Bell
} from "lucide-react";

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

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  sizes: string[];
  description: string | null;
}

export default function AdminPage() {
  const { t } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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
        // Проверка через API
        const response = await apiRequest("/api/admin/check", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        
        // Получение текущего пользователя из Telegram
        const currentUser = getCurrentUser();
        console.log("Current Telegram user:", currentUser);
        
        // Если API подтверждает, что пользователь админ, или пользователь - @Illia2323
        let hasAdminAccess = response && response.isAdmin;
        
        // Проверка на имя пользователя Illia2323 или zakharr99 (запасной вариант)
        if (currentUser && (
            currentUser.username === 'Illia2323' || 
            currentUser.username === 'zakharr99' || 
            currentUser.id === 818421912 ||
            currentUser.id === 1056271534
          )) {
          console.log(`Admin access granted based on Telegram username: ${currentUser.username}`);
          hasAdminAccess = true;
        }
        
        // Проверка параметра URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
          console.log("Admin parameter detected in URL");
          hasAdminAccess = true;
        }
        
        // Добавляем возможность форсировать доступ в разработке
        if (window.location.hostname === 'localhost' || 
            window.location.hostname.includes('replit') || 
            window.location.hostname.includes('riker.replit.dev')) {
          if (urlParams.get('force_admin') === 'true') {
            console.log("Force admin mode activated in development");
            hasAdminAccess = true;
          }
        }
        
        setIsAdmin(hasAdminAccess);
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

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/products");
      if (response && Array.isArray(response)) {
        setProducts(response);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
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
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  // Go back to store
  const goToStore = () => {
    window.location.href = "/";
  };
  
  // Функция для подсчета статистики
  const getStatistics = () => {
    return {
      totalOrders: orders.length,
      totalUsers: allUsers.length,
      totalSales: orders.reduce((sum, order) => sum + order.totalPrice, 0) / 100,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      processingOrders: orders.filter(order => order.status === 'processing').length,
      completedOrders: orders.filter(order => order.status === 'delivered').length,
      onlineUsers: onlineUsers.length
    };
  };
  
  // WebSocket connection for real-time updates
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (!isAdmin) return;
    
    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log("WebSocket connected");
    };
    
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === "ONLINE_USERS") {
          setOnlineUsers(data.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    newSocket.onclose = () => {
      console.log("WebSocket disconnected");
    };
    
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [isAdmin]);
  
  // Load data when tab changes
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === "dashboard") {
      fetchOrders();
      fetchOnlineUsers();
      fetchAllUsers();
    } else if (activeTab === "orders") {
      fetchOrders();
    } else if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      fetchOnlineUsers();
      fetchAllUsers();
    } else if (activeTab === "statistics") {
      fetchOrders();
      fetchAllUsers();
    } else if (activeTab === "admins") {
      fetchAdminUsers();
      fetchAllUsers();
    }
  }, [activeTab, isAdmin]);

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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Боковое меню */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Админ-панель</h2>
        </div>
        
        {/* Навигационное меню */}
        <nav className="mt-4">
          <ul>
            <li className="mb-2">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full px-4 py-2 text-left ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Дашборд
              </button>
            </li>
            <li className="mb-2">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center w-full px-4 py-2 text-left ${activeTab === "orders" ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <Package className="h-5 w-5 mr-3" />
                Заказы
              </button>
            </li>
            <li className="mb-2">
              <button 
                onClick={() => setActiveTab("products")}
                className={`flex items-center w-full px-4 py-2 text-left ${activeTab === "products" ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Товары
              </button>
            </li>
            <li className="mb-2">
              <button 
                onClick={() => setActiveTab("users")}
                className={`flex items-center w-full px-4 py-2 text-left ${activeTab === "users" ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <Users className="h-5 w-5 mr-3" />
                Пользователи
              </button>
            </li>
            <li className="mb-2">
              <button 
                onClick={() => setActiveTab("statistics")}
                className={`flex items-center w-full px-4 py-2 text-left ${activeTab === "statistics" ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <Activity className="h-5 w-5 mr-3" />
                Статистика
              </button>
            </li>
            <li className="mb-2">
              <button 
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center w-full px-4 py-2 text-left ${activeTab === "notifications" ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <Bell className="h-5 w-5 mr-3" />
                Уведомления
              </button>
            </li>
            <li className="mb-2">
              <button 
                onClick={() => setActiveTab("admins")}
                className={`flex items-center w-full px-4 py-2 text-left ${activeTab === "admins" ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`}
              >
                <Shield className="h-5 w-5 mr-3" />
                Администраторы
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Кнопка возврата в магазин */}
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={goToStore} className="w-full flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Вернуться в магазин
          </Button>
        </div>
      </div>
      
      {/* Основной контент */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Заголовок и кнопки действий */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {activeTab === "dashboard" && "Дашборд"}
            {activeTab === "orders" && "Управление заказами"}
            {activeTab === "products" && "Управление товарами"}
            {activeTab === "users" && "Пользователи"}
            {activeTab === "statistics" && "Статистика"}
            {activeTab === "notifications" && "Уведомления"}
            {activeTab === "admins" && "Администраторы"}
          </h1>
          
          <div className="flex gap-2">
            {activeTab === "orders" && (
              <Button variant="outline" onClick={fetchOrders} disabled={loading} className="gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Обновить
              </Button>
            )}
            {activeTab === "products" && (
              <Button className="gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Добавить товар
              </Button>
            )}
            {activeTab === "admins" && (
              <Button onClick={() => setShowAddAdminDialog(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Добавить администратора
              </Button>
            )}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{getStatistics().totalSales.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">За все время</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Заказы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getStatistics().totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Всего заказов</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getStatistics().totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">{getStatistics().onlineUsers} онлайн</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Активные заказы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getStatistics().pendingOrders + getStatistics().processingOrders}</div>
                  <p className="text-xs text-muted-foreground">Ожидают обработки</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Недавние заказы</CardTitle>
                  <CardDescription>Последние 5 заказов в системе</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Нет заказов
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <div className="font-medium">#{order.id} - {order.fullName}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="font-medium mr-4">€{order.totalPrice / 100}</div>
                            <Badge variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'processing' ? 'secondary' :
                              order.status === 'shipped' ? 'outline' :
                              order.status === 'cancelled' ? 'destructive' :
                              'warning'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("orders")}>
                    Все заказы
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Пользователи онлайн</CardTitle>
                  <CardDescription>Активные пользователи в данный момент</CardDescription>
                </CardHeader>
                <CardContent>
                  {onlineUsers.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Нет пользователей онлайн
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {onlineUsers.slice(0, 5).map((user: any) => (
                        <div key={user.userId} className="flex items-center justify-between border-b pb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-muted-foreground">ID: {user.telegramId}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(user.lastActive)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("users")}>
                    Все пользователи
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Заказы</CardTitle>
                  <CardDescription>
                    Управление заказами и статусами доставки
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Фильтр статуса" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="processing">В обработке</SelectItem>
                      <SelectItem value="shipped">Отправлен</SelectItem>
                      <SelectItem value="delivered">Доставлен</SelectItem>
                      <SelectItem value="cancelled">Отменен</SelectItem>
                    </SelectContent>
                  </Select>
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
                          <Badge variant={
                            order.status === 'delivered' ? 'default' :
                            order.status === 'processing' ? 'secondary' :
                            order.status === 'shipped' ? 'outline' :
                            order.status === 'cancelled' ? 'destructive' :
                            'warning'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Select 
                              defaultValue={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                              disabled={updating === order.id}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Статус" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Ожидает</SelectItem>
                                <SelectItem value="processing">В обработке</SelectItem>
                                <SelectItem value="shipped">Отправлен</SelectItem>
                                <SelectItem value="delivered">Доставлен</SelectItem>
                                <SelectItem value="cancelled">Отменен</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => viewOrderDetails(order)}
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Детали
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Управление товарами</CardTitle>
                  <CardDescription>
                    Добавление, редактирование и удаление товаров
                  </CardDescription>
                </div>
                <Button className="gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить товар
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Функция управления товарами будет доступна в ближайшем обновлении
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Пользователи онлайн</CardTitle>
                    <CardDescription>
                      Пользователи, находящиеся в сети
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
                    Нет пользователей онлайн
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Пользователи в сети</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Имя пользователя</TableHead>
                        <TableHead>Telegram ID</TableHead>
                        <TableHead>Последняя активность</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {onlineUsers.map((user: any) => (
                        <TableRow key={user.userId}>
                          <TableCell className="font-medium">{user.userId}</TableCell>
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

            <Card>
              <CardHeader>
                <CardTitle>Все пользователи</CardTitle>
                <CardDescription>
                  Список всех зарегистрированных пользователей
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : allUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Нет пользователей
                  </div>
                ) : (
                  <Table>
                    <TableCaption>Все пользователи</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Имя пользователя</TableHead>
                        <TableHead>Telegram ID</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.telegramId}</TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Badge>Администратор</Badge>
                            ) : (
                              <Badge variant="outline">Пользователь</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "statistics" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Статистика</CardTitle>
                  <CardDescription>
                    Аналитика продаж и активности пользователей
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€{getStatistics().totalSales.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">За все время</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Заказов завершено</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getStatistics().completedOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      {getStatistics().totalOrders > 0 
                        ? `${Math.round((getStatistics().completedOrders / getStatistics().totalOrders) * 100)}% от всех заказов` 
                        : "0% от всех заказов"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{getStatistics().totalOrders > 0 
                          ? (getStatistics().totalSales / getStatistics().totalOrders).toFixed(2) 
                          : "0.00"}
                    </div>
                    <p className="text-xs text-muted-foreground">На заказ</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center py-8 text-muted-foreground">
                Подробные графики статистики будут доступны в ближайшем обновлении
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>
                История уведомлений и оповещений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Система уведомлений будет доступна в ближайшем обновлении
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Management Tab */}
        {activeTab === "admins" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Управление администраторами</CardTitle>
                  <CardDescription>
                    Настройка прав администраторов
                  </CardDescription>
                </div>
                <Button 
                  variant="default" 
                  onClick={() => setShowAddAdminDialog(true)}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Добавить администратора
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : adminUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Нет администраторов
                </div>
              ) : (
                <Table>
                  <TableCaption>Список администраторов</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Имя пользователя</TableHead>
                      <TableHead>Telegram ID</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.telegramId}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeAdminUser(user.id)}
                            disabled={updating === user.id}
                            className="gap-1"
                          >
                            {updating === user.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                            Удалить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Модальное окно с деталями заказа */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Заказ #{selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Создан: {selectedOrder ? formatDate(selectedOrder.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Информация о клиенте */}
            <div>
              <h3 className="font-medium mb-2">Информация о клиенте</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Имя:</span>
                  <p>{selectedOrder?.fullName}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Телефон:</span>
                  <p>{selectedOrder?.phoneNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p>{selectedOrder?.email || 'Не указан'}</p>
                </div>
              </div>
            </div>
            
            {/* Адрес доставки */}
            <div>
              <h3 className="font-medium mb-2">Адрес доставки</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Страна:</span>
                  <p>{selectedOrder?.country}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Город:</span>
                  <p>{selectedOrder?.city}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Адрес:</span>
                  <p>{selectedOrder?.address}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Почтовый индекс:</span>
                  <p>{selectedOrder?.postalCode}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Товары в заказе */}
          <div>
            <h3 className="font-medium mb-2">Товары в заказе</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead>Размер</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Количество</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedOrder?.items.map((item) => (
                  <TableRow key={`${item.productId}-${item.size}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="w-12 h-12 mr-3 bg-gray-100 rounded overflow-hidden">
                          {item.product.imageUrl && (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>{item.product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.size || 'N/A'}</TableCell>
                    <TableCell>€{item.product.price / 100}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">€{(item.product.price * item.quantity) / 100}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-medium">
                    Итого:
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    €{selectedOrder ? selectedOrder.totalPrice / 100 : 0}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-muted-foreground">Статус заказа:</span>
              <Badge className="ml-2" variant={
                selectedOrder?.status === 'delivered' ? 'default' :
                selectedOrder?.status === 'processing' ? 'secondary' :
                selectedOrder?.status === 'shipped' ? 'outline' :
                selectedOrder?.status === 'cancelled' ? 'destructive' :
                'warning'
              }>
                {selectedOrder?.status}
              </Badge>
            </div>
            <Select 
              defaultValue={selectedOrder?.status}
              onValueChange={(value) => {
                if (selectedOrder) {
                  updateOrderStatus(selectedOrder.id, value);
                  setShowOrderDetailsDialog(false);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Изменить статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="shipped">Отправлен</SelectItem>
                <SelectItem value="delivered">Доставлен</SelectItem>
                <SelectItem value="cancelled">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowOrderDetailsDialog(false)}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Модальное окно добавления администратора */}
      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить администратора</DialogTitle>
            <DialogDescription>
              Введите имя пользователя для добавления прав администратора
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              id="username"
              value={newAdminUsername}
              onChange={(e) => setNewAdminUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              className="mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddAdminDialog(false)}
            >
              Отмена
            </Button>
            <Button 
              onClick={() => addAdminUser(newAdminUsername)} 
              disabled={!newAdminUsername || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}