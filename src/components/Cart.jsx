import React, { useMemo, useState } from 'react';

function BillModal({ open, onClose, cart, tableNumber, paymentMethod }) {
  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cart]
  );
  const service = Math.round(subtotal * 0.05);
  const total = subtotal + service;

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Bill Pembayaran</h3>
          <p className="text-sm text-gray-600">Meja: {tableNumber || '-'} • Metode: {paymentMethod.toUpperCase()}</p>
        </div>
        <div className="p-4 max-h-80 overflow-auto">
          <div className="space-y-2">
            {cart.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-gray-500">{it.qty} x Rp{it.price.toLocaleString('id-ID')}</div>
                </div>
                <div className="font-semibold">Rp{(it.qty * it.price).toLocaleString('id-ID')}</div>
              </div>
            ))}
          </div>
          <div className="my-3 border-t" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>Rp{subtotal.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between"><span className="text-gray-600">Service 5%</span><span>Rp{service.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>Rp{total.toLocaleString('id-ID')}</span></div>
          </div>
          {paymentMethod === 'qris' && (
            <div className="mt-4 p-3 rounded-lg border bg-gray-50 text-center">
              <div className="text-sm font-medium mb-2">Tunjukkan QRIS ini ke kasir</div>
              <div className="grid place-items-center">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PAY%20AT%20CASHIER" alt="QRIS" className="rounded" />
              </div>
              <p className="text-xs text-gray-500 mt-2">Pembayaran dilakukan di kasir. Simpan bill ini.</p>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border">Tutup</button>
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-pink-600 text-white">Selesai</button>
        </div>
      </div>
    </div>
  );
}

function Cart({ cart, setCart, tableNumber }) {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showBill, setShowBill] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.qty, 0),
    [cart]
  );
  const service = Math.round(subtotal * 0.05);
  const total = subtotal + service;

  const updateQty = (id, delta) => {
    setCart((prev) => {
      const next = prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        .filter((it) => it.qty > 0);
      return next;
    });
  };

  const removeItem = (id) => setCart((prev) => prev.filter((it) => it.id !== id));

  const placeOrder = () => {
    if (!tableNumber) {
      alert('Silakan isi nomor meja terlebih dahulu.');
      return;
    }
    if (cart.length === 0) {
      alert('Keranjang masih kosong.');
      return;
    }
    setShowBill(true);
  };

  return (
    <aside className="w-full lg:w-96 lg:sticky lg:top-[76px] bg-white border-l border-gray-100">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Keranjang</h3>
        <p className="text-xs text-gray-500">Meja: {tableNumber || '-'}</p>
      </div>

      <div className="p-4 space-y-3 max-h-[50vh] lg:max-h-[60vh] overflow-auto">
        {cart.length === 0 && (
          <div className="text-sm text-gray-500">Belum ada item di keranjang.</div>
        )}
        {cart.map((it) => (
          <div key={it.id} className="flex items-center gap-3">
            <div className="h-14 w-14 bg-gray-100 rounded overflow-hidden">
              {it.image ? (
                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{it.name}</div>
              <div className="text-xs text-gray-500">Rp{it.price.toLocaleString('id-ID')}</div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  className="h-7 w-7 rounded border text-gray-700"
                  onClick={() => updateQty(it.id, -1)}
                >
                  -
                </button>
                <span className="text-sm w-6 text-center">{it.qty}</span>
                <button
                  className="h-7 w-7 rounded border text-gray-700"
                  onClick={() => updateQty(it.id, 1)}
                >
                  +
                </button>
                <button className="text-xs text-rose-600 ml-2" onClick={() => removeItem(it.id)}>
                  Hapus
                </button>
              </div>
            </div>
            <div className="font-semibold">Rp{(it.qty * it.price).toLocaleString('id-ID')}</div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`px-3 py-2 rounded-md border text-sm ${
              paymentMethod === 'cash' ? 'border-pink-500 text-pink-600' : ''
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMethod('qris')}
            className={`px-3 py-2 rounded-md border text-sm ${
              paymentMethod === 'qris' ? 'border-pink-500 text-pink-600' : ''
            }`}
          >
            QRIS
          </button>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>Rp{subtotal.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Service 5%</span><span>Rp{service.toLocaleString('id-ID')}</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>Rp{total.toLocaleString('id-ID')}</span></div>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-2.5 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition disabled:opacity-50"
          disabled={cart.length === 0}
        >
          Buat Bill Pembayaran
        </button>
      </div>

      <BillModal
        open={showBill}
        onClose={() => setShowBill(false)}
        cart={cart}
        tableNumber={tableNumber}
        paymentMethod={paymentMethod}
      />
    </aside>
  );
}

export default Cart;
