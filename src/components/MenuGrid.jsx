import React, { useMemo, useState } from 'react';

function MenuCard({ item, onAdd }) {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="aspect-video bg-gray-50 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No Image</div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            {item.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
            )}
          </div>
          <span className="text-pink-600 font-semibold">Rp{item.price.toLocaleString('id-ID')}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs ${item.available ? 'text-emerald-600' : 'text-rose-600'}`}>
            {item.available ? 'Tersedia' : 'Habis'}
          </span>
          <button
            disabled={!item.available}
            onClick={() => onAdd(item)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              item.available
                ? 'bg-pink-500 text-white hover:bg-pink-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuGrid({ menu, addToCart }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menu.map((m) => m.category))).filter(Boolean);
    return ['Semua', ...cats];
  }, [menu]);

  const filtered = useMemo(() => {
    return menu.filter((m) => {
      const matchQuery = m.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = category === 'Semua' || m.category === category;
      return matchQuery && matchCat;
    });
  }, [menu, query, category]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Cari menu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
        />
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                category === c ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} onAdd={addToCart} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">Tidak ada menu</div>
        )}
      </div>
    </section>
  );
}

export default MenuGrid;
