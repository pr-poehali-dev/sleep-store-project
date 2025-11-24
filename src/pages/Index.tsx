import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Dream {
  id: number;
  date: string;
  title: string;
  content: string;
}

interface Order {
  id: number;
  date: string;
  items: CartItem[];
  total: number;
  status: 'completed' | 'processing' | 'shipped';
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const products: Product[] = [
  { id: 1, name: 'Ортопедическая подушка "Облако"', price: 3500, category: 'pillows', image: 'https://cdn.poehali.dev/projects/2aa033ad-f342-4dd9-85ff-13f25bfd6108/files/ed5c5392-ba37-4e9d-8b53-b126459a024d.jpg', description: 'Мягкая подушка с эффектом памяти' },
  { id: 2, name: 'Шелковая маска для сна', price: 1200, category: 'masks', image: 'https://cdn.poehali.dev/projects/2aa033ad-f342-4dd9-85ff-13f25bfd6108/files/ed5c5392-ba37-4e9d-8b53-b126459a024d.jpg', description: 'Блокирует 100% света' },
  { id: 3, name: 'Ароматическая свеча "Лаванда"', price: 890, category: 'aromatherapy', image: 'https://cdn.poehali.dev/projects/2aa033ad-f342-4dd9-85ff-13f25bfd6108/files/ed5c5392-ba37-4e9d-8b53-b126459a024d.jpg', description: 'Натуральный воск и эфирные масла' },
  { id: 4, name: 'Умный трекер сна', price: 5900, category: 'trackers', image: 'https://cdn.poehali.dev/projects/2aa033ad-f342-4dd9-85ff-13f25bfd6108/files/ed5c5392-ba37-4e9d-8b53-b126459a024d.jpg', description: 'Анализ фаз сна и пробуждение' },
  { id: 5, name: 'Успокаивающий спрей', price: 1450, category: 'aromatherapy', image: 'https://cdn.poehali.dev/projects/2aa033ad-f342-4dd9-85ff-13f25bfd6108/files/ed5c5392-ba37-4e9d-8b53-b126459a024d.jpg', description: 'С мелиссой и ромашкой' },
  { id: 6, name: 'Плед из бамбука', price: 4200, category: 'pillows', image: 'https://cdn.poehali.dev/projects/2aa033ad-f342-4dd9-85ff-13f25bfd6108/files/ed5c5392-ba37-4e9d-8b53-b126459a024d.jpg', description: 'Терморегулирующий, гипоаллергенный' },
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamContent, setDreamContent] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'Москва, ул. Примерная, д. 10, кв. 5'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({ title: 'Добавлено в корзину', description: product.name });
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const saveDream = () => {
    if (!dreamTitle.trim() || !dreamContent.trim()) {
      toast({ title: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    const newDream: Dream = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      title: dreamTitle,
      content: dreamContent
    };
    setDreams([newDream, ...dreams]);
    setDreamTitle('');
    setDreamContent('');
    toast({ title: 'Сон сохранён', description: 'Запись добавлена в дневник' });
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">
              <Icon name="Moon" className="inline-block mr-2" size={32} />
              Архив снов
            </h1>
            <nav className="flex gap-2">
              <Button 
                variant={activeTab === 'home' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('home')}
                className="transition-all"
              >
                <Icon name="Home" className="mr-2" size={18} />
                Главная
              </Button>
              <Button 
                variant={activeTab === 'catalog' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('catalog')}
                className="transition-all"
              >
                <Icon name="ShoppingBag" className="mr-2" size={18} />
                Каталог
              </Button>
              <Button 
                variant={activeTab === 'diary' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('diary')}
                className="transition-all"
              >
                <Icon name="BookOpen" className="mr-2" size={18} />
                Дневник
              </Button>
              <Button 
                variant={activeTab === 'cart' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('cart')}
                className="relative transition-all"
              >
                <Icon name="ShoppingCart" className="mr-2" size={18} />
                Корзина
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              <Button 
                variant={activeTab === 'profile' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('profile')}
                className="transition-all"
              >
                <Icon name="User" className="mr-2" size={18} />
                Профиль
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Home */}
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-12">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-100 to-blue-100 p-12 shadow-xl">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-5xl font-bold mb-4 text-primary">Добро пожаловать в мир здорового сна</h2>
                <p className="text-xl text-muted-foreground mb-6">
                  Откройте для себя товары, которые помогут улучшить качество сна и исследовать мир сновидений
                </p>
                <Button size="lg" onClick={() => setActiveTab('catalog')} className="shadow-lg hover:shadow-xl transition-shadow">
                  Перейти в каталог
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
                <img 
                  src="https://cdn.poehali.dev/projects/2aa033ad-f342-4dd9-85ff-13f25bfd6108/files/2765be3e-6977-4009-9a4b-64dd75c45b8e.jpg" 
                  alt="Dreams" 
                  className="h-full w-full object-cover"
                />
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow animate-scale-in border-2">
                <CardHeader>
                  <Icon name="Sparkles" size={40} className="text-purple-500 mb-2" />
                  <CardTitle>Качественный сон</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Товары для создания идеальных условий для отдыха</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow animate-scale-in border-2" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <Icon name="Brain" size={40} className="text-blue-500 mb-2" />
                  <CardTitle>Осознанные сновидения</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Инструменты для практики и наблюдения за снами</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow animate-scale-in border-2" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <Icon name="Heart" size={40} className="text-pink-500 mb-2" />
                  <CardTitle>Забота о себе</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Натуральные продукты для расслабления и комфорта</p>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {/* Catalog */}
        {activeTab === 'catalog' && (
          <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold">Каталог товаров</h2>
              <div className="flex gap-2">
                <Button 
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('all')}
                >
                  Все
                </Button>
                <Button 
                  variant={selectedCategory === 'pillows' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('pillows')}
                >
                  Подушки
                </Button>
                <Button 
                  variant={selectedCategory === 'masks' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('masks')}
                >
                  Маски
                </Button>
                <Button 
                  variant={selectedCategory === 'aromatherapy' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('aromatherapy')}
                >
                  Ароматерапия
                </Button>
                <Button 
                  variant={selectedCategory === 'trackers' ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory('trackers')}
                >
                  Трекеры
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                    <Button onClick={() => addToCart(product)} className="shadow-md">
                      <Icon name="Plus" className="mr-2" size={18} />
                      В корзину
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Dream Diary */}
        {activeTab === 'diary' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-4xl font-bold mb-6">Дневник сновидений</h2>
            
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Записать новый сон</CardTitle>
                <CardDescription>Сохраните воспоминания о своих снах</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dream-title">Название сна</Label>
                  <Input 
                    id="dream-title"
                    placeholder="Например: Полёт над городом"
                    value={dreamTitle}
                    onChange={(e) => setDreamTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="dream-content">Описание</Label>
                  <Textarea 
                    id="dream-content"
                    placeholder="Опишите свой сон подробно..."
                    value={dreamContent}
                    onChange={(e) => setDreamContent(e.target.value)}
                    rows={6}
                    className="mt-2"
                  />
                </div>
                <Button onClick={saveDream} className="w-full">
                  <Icon name="Save" className="mr-2" size={18} />
                  Сохранить сон
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Мои сны</h3>
              {dreams.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Icon name="BookOpen" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Здесь пока нет записей. Запишите свой первый сон!</p>
                  </CardContent>
                </Card>
              ) : (
                dreams.map((dream) => (
                  <Card key={dream.id} className="border-2 hover:shadow-lg transition-shadow animate-scale-in">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{dream.title}</CardTitle>
                          <CardDescription>{dream.date}</CardDescription>
                        </div>
                        <Badge variant="secondary">
                          <Icon name="Moon" size={14} className="mr-1" />
                          Сон
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">{dream.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Cart */}
        {activeTab === 'cart' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-4xl font-bold">Корзина</h2>
            
            {cart.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-16 text-center">
                  <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-xl text-muted-foreground mb-4">Корзина пуста</p>
                  <Button onClick={() => setActiveTab('catalog')}>
                    Перейти в каталог
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <Card key={item.id} className="border-2 animate-scale-in">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                            <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  <Icon name="Minus" size={16} />
                                </Button>
                                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Icon name="Plus" size={16} />
                                </Button>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-primary">
                                  {item.price * item.quantity} ₽
                                </span>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Icon name="Trash2" size={18} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-2 h-fit sticky top-24 shadow-xl">
                  <CardHeader>
                    <CardTitle>Итого</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                      <span className="font-semibold">{getTotalPrice()} ₽</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span>Доставка:</span>
                      <span className="font-semibold text-green-600">Бесплатно</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Всего:</span>
                        <span className="text-primary">{getTotalPrice()} ₽</span>
                      </div>
                    </div>
                    <Button size="lg" className="w-full shadow-lg" onClick={() => {
                      const newOrder: Order = {
                        id: Date.now(),
                        date: new Date().toLocaleDateString('ru-RU'),
                        items: [...cart],
                        total: getTotalPrice(),
                        status: 'processing'
                      };
                      setOrders([newOrder, ...orders]);
                      toast({ title: 'Заказ оформлен!', description: 'Проверьте статус в личном кабинете' });
                      setCart([]);
                    }}>
                      <Icon name="Check" className="mr-2" size={20} />
                      Оформить заказ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-4xl font-bold">Личный кабинет</h2>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <Card className="border-2 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Профиль</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                      >
                        <Icon name={isEditingProfile ? "X" : "Pencil"} size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!isEditingProfile ? (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                            {userProfile.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{userProfile.name}</p>
                            <Badge variant="secondary">Активный покупатель</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Icon name="Mail" size={18} className="text-muted-foreground mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium">{userProfile.email}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="Phone" size={18} className="text-muted-foreground mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Телефон</p>
                              <p className="font-medium">{userProfile.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Icon name="MapPin" size={18} className="text-muted-foreground mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Адрес</p>
                              <p className="font-medium">{userProfile.address}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="profile-name">Имя</Label>
                          <Input 
                            id="profile-name"
                            value={userProfile.name}
                            onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profile-email">Email</Label>
                          <Input 
                            id="profile-email"
                            type="email"
                            value={userProfile.email}
                            onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profile-phone">Телефон</Label>
                          <Input 
                            id="profile-phone"
                            value={userProfile.phone}
                            onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="profile-address">Адрес</Label>
                          <Textarea 
                            id="profile-address"
                            value={userProfile.address}
                            onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                        <Button className="w-full" onClick={() => {
                          setIsEditingProfile(false);
                          toast({ title: 'Профиль обновлён', description: 'Ваши данные успешно сохранены' });
                        }}>
                          <Icon name="Save" className="mr-2" size={18} />
                          Сохранить
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="border-2 mt-6 shadow-lg">
                  <CardHeader>
                    <CardTitle>Статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Всего заказов:</span>
                      <Badge variant="secondary" className="text-lg">{orders.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Записей снов:</span>
                      <Badge variant="secondary" className="text-lg">{dreams.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Потрачено:</span>
                      <Badge className="text-lg">{orders.reduce((sum, order) => sum + order.total, 0)} ₽</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders History */}
              <div className="lg:col-span-2">
                <Card className="border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle>История заказов</CardTitle>
                    <CardDescription>Все ваши покупки в одном месте</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>У вас пока нет заказов</p>
                        <Button className="mt-4" onClick={() => setActiveTab('catalog')}>
                          Перейти в каталог
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Card key={order.id} className="border animate-scale-in">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">Заказ №{order.id}</CardTitle>
                                  <CardDescription>{order.date}</CardDescription>
                                </div>
                                <Badge 
                                  variant={
                                    order.status === 'completed' ? 'default' : 
                                    order.status === 'shipped' ? 'secondary' : 
                                    'outline'
                                  }
                                >
                                  {order.status === 'completed' && <Icon name="CheckCircle2" size={14} className="mr-1" />}
                                  {order.status === 'shipped' && <Icon name="Truck" size={14} className="mr-1" />}
                                  {order.status === 'processing' && <Icon name="Clock" size={14} className="mr-1" />}
                                  {order.status === 'completed' ? 'Завершён' : 
                                   order.status === 'shipped' ? 'Доставляется' : 
                                   'Обрабатывается'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span className="font-medium">{item.price * item.quantity} ₽</span>
                                  </div>
                                ))}
                                <div className="border-t pt-2 flex justify-between items-center font-bold">
                                  <span>Итого:</span>
                                  <span className="text-primary text-lg">{order.total} ₽</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 bg-white/80 backdrop-blur-md border-t border-purple-100 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-2">© 2024 Архив снов. Все права защищены.</p>
          <p className="text-sm">Товары для здорового сна и осознанных сновидений</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;