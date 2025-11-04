import React, { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  id: '',
  name: '',
  description: '',
  category: 'Makanan',
  price: 10000,
  available: true,
  image: '',
};

function AdminPanel({ menu, setMenu }) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('Semua');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menu.map((m) => m.category))).filter(Boolean);
    return ['Semua', 'Makanan', 'Minuman', 'Lainnya', ...cats.filter((c) => !['Makanan','Minuman','Lainnya'].includes(c))];
  }, [menu]);

  const filtered = useMemo(() => {
    return menu.filter((m) => {
      const matchQuery = m.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = cat === 'Semua' || m.category === cat;
      return matchQuery && matchCat;
    });
  }, [menu, query, cat]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleImage = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveItem = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    if (editingId) {
      setMenu((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...form, id: editingId, price: Number(form.price) } : m)));
    } else {
      const id = 'm_' + Math.random().toString(36).slice(2, 9);
      setMenu((prev) => [
        ...prev,
        { ...form, id, price: Number(form.price) },
      ]);
    }
    resetForm();
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = (id) => {
    if (!confirm('Hapus menu ini?')) return;
    setMenu((prev) => prev.filter((m) => m.id !== id));
    if (editingId === id) resetForm();
  };

  useEffect(() => {
    // persist to localStorage
    localStorage.setItem('menu_data', JSON.stringify(menu));
  }, [menu]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Admin: Kelola Menu</h2>

      <form onSubmit={saveItem} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Nama Menu</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
              placeholder="Contoh: Mie Gacoan Level 2"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Kategori</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
              placeholder="Makanan / Minuman"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Harga (Rp)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Ketersediaan</label>
            <select
              value={form.available ? '1' : '0'}
              onChange={(e) => setForm({ ...form, available: e.target.value === '1' })}
              className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
            >
              <option value="1">Tersedia</option>
              <option value="0">Habis</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Deskripsi</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-md border border-gray-200 text-sm"
              placeholder="Deskripsi singkat menu"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600">Gambar</label>
            <div className="mt-1 flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e.target.files?.[0])}
                className="text-sm"
              />
              {form.image && (
                <img src={form.image} alt="preview" className="h-16 w-24 object-cover rounded border" />
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded-md bg-pink-600 text-white">
            {editingId ? 'Simpan Perubahan' : 'Tambah Menu'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-md border">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Cari menu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 rounded-md border border-gray-200 text-sm"
        />
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                cat === c ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
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
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.category}</div>
                </div>
                <div className="font-semibold text-pink-600">Rp{item.price.toLocaleString('id-ID')}</div>
              </div>
              {item.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              )}
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs ${item.available ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.available ? 'Tersedia' : 'Habis'}
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => editItem(item)}>Edit</button>
                  <button className="px-3 py-1.5 rounded-md border text-sm text-rose-600" onClick={() => deleteItem(item.id)}>Hapus</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">Tidak ada menu</div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
