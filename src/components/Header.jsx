import React from 'react';

function Header({ mode, setMode, tableNumber, setTableNumber }) {
  return (
    <header className="w-full sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-pink-500 text-white grid place-items-center font-bold">MG</div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Mie Gacoan Style Ordering</h1>
            <p className="text-xs text-gray-500 leading-tight">Simple customer ordering & admin menu manager</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {mode === 'customer' && (
            <div className="flex items-center gap-2">
              <label htmlFor="table" className="text-sm text-gray-600">Nomor Meja</label>
              <input
                id="table"
                type="text"
                inputMode="numeric"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Masukkan nomor meja"
                className="w-40 px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>
          )}

          <div className="flex bg-gray-100 rounded-md p-1 text-sm">
            <button
              className={`px-3 py-1.5 rounded ${mode === 'customer' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
              onClick={() => setMode('customer')}
            >
              Customer
            </button>
            <button
              className={`px-3 py-1.5 rounded ${mode === 'admin' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'}`}
              onClick={() => setMode('admin')}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
