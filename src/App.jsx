import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';

const DEFAULT_MENU = [
  {
    id: 'm1',
    name: 'Mie Gacoan Level 1',
    description: 'Mie pedas level 1, cocok untuk pemula.',
    category: 'Makanan',
    price: 12000,
    available: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'm2',
    name: 'Mie Gacoan Level 2',
    description: 'Mie pedas level 2, pedas pas!',
    category: 'Makanan',
    price: 13000,
    available: true,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'd1',
    name: 'Es Teh Manis',
    description: 'Segar dan manis.',
    category: 'Minuman',
    price: 6000,
    available: true,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'd2',
    name: 'Es Jeruk',
    description: 'Perasan jeruk alami.',
    category: 'Minuman',
    price: 8000,
    available: true,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1200&auto=format&fit=crop',
  },
];

function App() {
  const [mode, setMode] = useState('customer'); // 'customer' | 'admin'
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('menu_data');
    return saved ? JSON.parse(saved) : DEFAULT_MENU;
  });
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  useEffect(() => {
    localStorage.setItem('menu_data', JSON.stringify(menu));
  }, [menu]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const clearAll = () => setCart([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <Header mode={mode} setMode={setMode} tableNumber={tableNumber} setTableNumber={setTableNumber} />

      {mode === 'customer' ? (
        <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 py-6">
          <div>
            <div className="mb-2">
              <h2 className="text-xl font-semibold">Pilih Menu</h2>
              <p className="text-sm text-gray-600">Tambahkan ke keranjang, lalu buat bill untuk bayar di kasir.</p>
            </div>
            <MenuGrid menu={menu} addToCart={addToCart} />
          </div>
          <div className="lg:pl-2">
            <Cart cart={cart} setCart={setCart} tableNumber={tableNumber} />
            {cart.length > 0 && (
              <div className="p-4">
                <button onClick={clearAll} className="w-full px-4 py-2 rounded-md border text-sm">Kosongkan Keranjang</button>
              </div>
            )}
          </div>
        </main>
      ) : (
        <AdminPanel menu={menu} setMenu={setMenu} />
      )}

      <footer className="py-8 text-center text-sm text-gray-500">
        Dibuat untuk demo pemesanan customer dengan opsi Cash atau QRIS. Tidak ada sistem kasir, bill ditunjukkan ke kasir.
      </footer>
    </div>
  );
}

export default App;
