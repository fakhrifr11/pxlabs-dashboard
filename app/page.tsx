// app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import * as XLSX from 'xlsx'; // <-- IMPORT SHEETJS EXCEL
import { 
  LayoutDashboard, ShoppingCart, Package, Wallet, 
  Settings, LogOut, Search, Mail, Bell, Moon, Sun, 
  Hexagon, Apple, Plus, RefreshCw, TrendingUp, TrendingDown, Coins,
  Edit, Trash2, Send, FileText, Download, FileSpreadsheet // <-- Tambah icon FileSpreadsheet
} from 'lucide-react';

const PRIMARY_GREEN = "#0c6b45";

const formatRp = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    fetch('/api/db?type=setup');
  }, []);

  if (!mounted) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'lunatic7') {
      setIsLoggedIn(true);
      setIsError(false);
    } else {
      setIsError(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96 text-center">
          <div className="flex items-center justify-center gap-2 mb-8 text-2xl font-bold text-gray-800 dark:text-white">
            <Hexagon size={36} fill={PRIMARY_GREEN} className="text-white" />
            PXLabs
          </div>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Masukkan Password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setIsError(false); }}
              className={`w-full bg-gray-50 dark:bg-gray-700 border ${isError ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg px-4 py-3 focus:outline-none focus:border-green-600 dark:text-white`}
            />
            <div className="h-6 text-left mt-1">{isError && <span className="text-sm text-red-500">Password salah!</span>}</div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full text-white font-medium py-3 rounded-lg mt-2" style={{ backgroundColor: PRIMARY_GREEN }}>
              Masuk
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { id: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'Penjualan', icon: <ShoppingCart size={20} /> },
    { id: 'Barang', icon: <Package size={20} /> },
    { id: 'Keuangan', icon: <Wallet size={20} /> },
    { id: 'Invoice', icon: <FileText size={20} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors">
      <motion.aside initial={{ x: -250 }} animate={{ x: 0 }} className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 flex items-center gap-2 text-2xl font-bold">
          <Hexagon size={32} fill={PRIMARY_GREEN} className="text-white" />
          <span>PXLabs</span>
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 mt-4 ml-2">MENU</p>
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${activeTab === item.id ? 'bg-[#e8f7f0] dark:bg-green-900/30 text-[#0c6b45] dark:text-green-400 font-semibold' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {item.icon} {item.id}
            </button>
          ))}
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 mt-8 ml-2">GENERAL</p>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"><Settings size={20} /> Settings</button>
          <button onClick={() => { setIsLoggedIn(false); setPassword(''); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><LogOut size={20} /> Logout</button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col relative">
        <header className="h-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-8 z-10 border-b border-gray-200 dark:border-gray-700">
          <div className="relative w-96">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search data global..." className="w-full pl-10 pr-12 py-2.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-[#0c6b45] text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-[#0c6b45] text-white flex items-center justify-center font-bold">AP</div>
              <div className="hidden md:block"><p className="text-sm font-bold">Admin PXLabs</p><p className="text-xs text-gray-500">admin@pxlabs.com</p></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === 'Dashboard' && <ViewDashboard />}
              {activeTab === 'Penjualan' && <ViewPenjualan />}
              {activeTab === 'Barang' && <ViewBarang />}
              {activeTab === 'Keuangan' && <ViewKeuangan />}
              {activeTab === 'Invoice' && <ViewInvoice />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Komponen Tombol Aksi Universal
function ActionButtons({ id, onEdit, onDelete }: { id: any, onEdit: () => void, onDelete: () => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button onClick={onEdit} className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition" title="Edit">
        <Edit size={16} />
      </button>
      <button onClick={onDelete} className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition" title="Hapus">
        <Trash2 size={16} />
      </button>
      <button onClick={() => alert(`Data Terkirim!`)} className="p-1.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md transition" title="Kirim">
        <Send size={16} />
      </button>
    </div>
  );
}

// ==========================================
// VIEW DASHBOARD (DENGAN EXCEL DOWNLOAD)
// ==========================================
function ViewDashboard() {
  const [stats, setStats] = useState({ penjualan: 0, pengeluaran: 0, modalTersedia: 0, labaBersih: 0 });
  const [isDownloading, setIsDownloading] = useState(false);

  const loadStats = async () => {
    const res = await fetch('/api/db?type=dashboard');
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => { loadStats(); }, []);

  // --- LOGIC BACKEND DOWNLOAD ALL TO EXCEL ---
  const handleDownloadExcel = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/db?type=excel');
      const data = await res.json();

      // Membuat Workbook Baru
      const workbook = XLSX.utils.book_new();

      // Konversi Array Data Menjadi Sheet Excel
      const sheetDashboard = XLSX.utils.json_to_sheet(data.ringkasan);
      const sheetPenjualan = XLSX.utils.json_to_sheet(data.penjualan);
      const sheetBarang = XLSX.utils.json_to_sheet(data.barang);
      const sheetKeuangan = XLSX.utils.json_to_sheet(data.keuangan);

      // Memasukkan Lembar Kerja (Sheets) ke Workbook
      XLSX.utils.book_append_sheet(workbook, sheetDashboard, "Ringkasan Dashboard");
      XLSX.utils.book_append_sheet(workbook, sheetPenjualan, "Data Penjualan");
      XLSX.utils.book_append_sheet(workbook, sheetBarang, "Database Barang");
      XLSX.utils.book_append_sheet(workbook, sheetKeuangan, "Laporan Keuangan");

      // Generate File Excel & Unduh otomatis ke PC/HP
      XLSX.writeFile(workbook, `Laporan_PXLabs_Lengkap.xlsx`);
    } catch (error) {
      alert("Gagal mendownload data excel");
    }
    setIsDownloading(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-500 text-sm">Ringkasan aktivitas keuangan dan data operasional Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* TOMBOL DOWNLOAD EXCEL BARU */}
          <button 
            onClick={handleDownloadExcel} 
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-green-800 transition disabled:bg-gray-400"
          >
            <FileSpreadsheet size={16} /> {isDownloading ? 'Memproses...' : 'Export Semua ke Excel'}
          </button>
          <button onClick={loadStats} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <RefreshCw size={16} /> Sinkronisasi
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard title="Total Penjualan" amount={formatRp(stats.penjualan)} icon={<TrendingUp size={16}/>} note="Terkalkulasi otomatis" isPrimary />
        <DashboardCard title="Total Pengeluaran" amount={formatRp(stats.pengeluaran)} icon={<TrendingDown size={16} className="text-gray-400"/>} note="Dari data keuangan" />
        <DashboardCard title="Modal Tersedia" amount={formatRp(stats.modalTersedia)} icon={<Coins size={16} className="text-yellow-500"/>} note="Saldo awal + Laba" />
        <DashboardCard title="Laba Bersih" amount={formatRp(stats.labaBersih)} icon={<TrendingUp size={16} className="text-gray-400"/>} note="Penjualan - Pengeluaran" />
      </div>
    </div>
  );
}

function DashboardCard({ title, amount, icon, note, isPrimary = false }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-2xl shadow-sm border ${isPrimary ? 'bg-[#0c6b45] text-white border-transparent' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
      <div className="flex justify-between items-start mb-4">
        <h4 className={`text-sm font-semibold ${isPrimary ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>{title}</h4>
        <div className={`p-1.5 rounded-full ${isPrimary ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-700'}`}>{icon}</div>
      </div>
      <h2 className="text-2xl font-bold mb-4">{amount}</h2>
      <div className="flex items-center gap-2 text-xs"><span className={isPrimary ? 'text-green-100' : 'text-gray-400'}>{note}</span></div>
    </motion.div>
  );
}

// ==========================================
// VIEW PENJUALAN
// ==========================================
function ViewPenjualan() {
  const [dataPenjualan, setDataPenjualan] = useState<any[]>([]);
  const [dataBarang, setDataBarang] = useState<any[]>([]);
  const [selectedBarangId, setSelectedBarangId] = useState("");
  const [hargaSatuan, setHargaSatuan] = useState(0);
  const [qty, setQty] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setIsFetching(true);
    const resP = await fetch('/api/db?type=penjualan');
    const resB = await fetch('/api/db?type=barang');
    setDataPenjualan(await resP.json());
    setDataBarang(await resB.json());
    setIsFetching(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleBarangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedBarangId(id);
    const barang = dataBarang.find(b => b.id.toString() === id);
    setHargaSatuan(barang ? barang.harga : 0);
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Hapus data penjualan ini?")) return;
    setDataPenjualan(dataPenjualan.filter(item => item.id !== id));
    await fetch(`/api/db?type=penjualan&id=${id}`, { method: 'DELETE' });
  };

  const handleEditClick = (item: any) => {
    setEditId(item.id);
    setSelectedBarangId(item.barang_id.toString());
    setHargaSatuan(item.total / item.qty);
    setQty(item.qty);
    const form = document.getElementById('form-penjualan') as HTMLFormElement;
    if(form) {
      (form.elements.namedItem('tanggal') as HTMLInputElement).value = item.tanggal.split('T')[0];
      (form.elements.namedItem('pembeli') as HTMLInputElement).value = item.pembeli;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const totalBiaya = hargaSatuan * qty;
    const barangTerpilih = dataBarang.find(b => b.id.toString() === selectedBarangId);

    const payload: any = {
      tanggal: formData.get('tanggal'),
      pembeli: formData.get('pembeli'),
      barang_id: Number(formData.get('barang_id')),
      qty: qty,
      total: totalBiaya
    };

    if (editId) {
      setDataPenjualan(dataPenjualan.map(item => item.id === editId ? { ...item, ...payload, nama_barang: barangTerpilih?.nama } : item));
      await fetch('/api/db', { method: 'PUT', body: JSON.stringify({ type: 'penjualan', id: editId, ...payload }) });
      setEditId(null);
    } else {
      const newData = { id: '...', ...payload, nama_barang: barangTerpilih ? barangTerpilih.nama : 'Unknown' };
      setDataPenjualan([newData, ...dataPenjualan]);
      await fetch('/api/db', { method: 'POST', body: JSON.stringify({ type: 'penjualan', ...payload }) });
      await loadData();
    }
    
    e.currentTarget.reset();
    setSelectedBarangId(""); setHargaSatuan(0); setQty(1);
  };

  const filteredPenjualan = dataPenjualan.filter(item => 
    item.pembeli?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    new Date(item.tanggal).toLocaleDateString('id-ID').includes(searchQuery)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Manajemen Penjualan</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">{editId ? '⚙️ Edit Transaksi' : 'Tambah Transaksi'}</h3>
          <form id="form-penjualan" onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div><label className="block text-gray-500 mb-1">Tanggal</label><input type="date" name="tanggal" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-gray-500 mb-1">Nama Pembeli</label><input type="text" name="pembeli" required placeholder="Masukkan nama" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" /></div>
            <div>
              <label className="block text-gray-500 mb-1">Barang</label>
              <select name="barang_id" required value={selectedBarangId} onChange={handleBarangChange} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5">
                <option value="" disabled>Pilih Barang...</option>
                {dataBarang.map(b => (<option key={b.id} value={b.id}>{b.nama}</option>))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1"><label className="block text-gray-500 mb-1">Harga Satuan</label><input type="text" value={formatRp(hargaSatuan)} className="w-full bg-gray-200 dark:bg-gray-700 rounded-lg px-4 py-2.5 text-gray-500" readOnly /></div>
              <div className="w-20"><label className="block text-gray-500 mb-1">Qty</label><input type="number" name="qty" required min="1" value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" /></div>
            </div>
            <div><label className="block text-gray-500 mb-1">Total Biaya</label><input type="text" value={formatRp(hargaSatuan * qty)} className="w-full bg-[#e8f7f0] dark:bg-green-900/20 rounded-lg px-4 py-2.5 text-green-700 dark:text-green-400 font-semibold" readOnly /></div>
            <button type="submit" className="w-full mt-4 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 bg-[#0c6b45] hover:bg-[#095536]">
              <ShoppingCart size={16} /> {editId ? 'Simpan Perubahan' : 'Simpan Data'}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); (document.getElementById('form-penjualan') as HTMLFormElement).reset(); setSelectedBarangId(""); setHargaSatuan(0); setQty(1); }} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium text-xs">Batal</button>}
          </form>
        </div>
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-bold">Riwayat Penjualan</h3>
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari transaksi..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[#0c6b45]" />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                <tr><th className="pb-3">TGL</th><th className="pb-3">PEMBELI</th><th className="pb-3">BARANG</th><th className="pb-3">QTY</th><th className="pb-3">TOTAL</th><th className="pb-3 text-right">AKSI</th></tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-400 animate-pulse">Sedang memuat data...</td></tr>
                ) : filteredPenjualan.length === 0 ? (
                   <tr><td colSpan={6} className="py-8 text-center text-gray-400">Pencarian tidak ditemukan.</td></tr>
                ) : (
                  filteredPenjualan.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="py-3">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{item.pembeli}</td>
                      <td className="py-3">{item.nama_barang}</td><td className="py-3">{item.qty}</td>
                      <td className="py-3 text-[#0c6b45] dark:text-green-400 font-semibold">{formatRp(item.total)}</td>
                      <td className="py-3"><ActionButtons id={item.id} onEdit={() => handleEditClick(item)} onDelete={() => handleDelete(item.id)} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VIEW BARANG
// ==========================================
function ViewBarang() {
  const [dataBarang, setDataBarang] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setIsFetching(true);
    const res = await fetch('/api/db?type=barang');
    setDataBarang(await res.json());
    setIsFetching(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: number) => {
    if(!confirm("Hapus item barang ini?")) return;
    setDataBarang(dataBarang.filter(b => b.id !== id));
    await fetch(`/api/db?type=barang&id=${id}`, { method: 'DELETE' });
  };

  const handleEditClick = (item: any) => {
    setEditId(item.id);
    const form = document.getElementById('form-barang') as HTMLFormElement;
    if(form) {
      (form.elements.namedItem('nama') as HTMLInputElement).value = item.nama;
      (form.elements.namedItem('harga') as HTMLInputElement).value = item.harga;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = { nama: formData.get('nama') as string, harga: Number(formData.get('harga')) };

    if(editId) {
      setDataBarang(dataBarang.map(b => b.id === editId ? { ...b, ...payload } : b));
      await fetch('/api/db', { method: 'PUT', body: JSON.stringify({ type: 'barang', id: editId, ...payload }) });
      setEditId(null);
    } else {
      setDataBarang([{ id: '...', ...payload }, ...dataBarang]);
      await fetch('/api/db', { method: 'POST', body: JSON.stringify({ type: 'barang', ...payload }) });
      await loadData();
    }
    e.currentTarget.reset();
  };

  const filteredBarang = dataBarang.filter(item => item.nama?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Database Barang</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">{editId ? '⚙️ Edit Item' : 'Tambah Item'}</h3>
          <form id="form-barang" onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div><label className="block text-gray-500 mb-1">Nama Barang</label><input type="text" name="nama" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-gray-500 mb-1">Harga (Rp)</label><input type="number" name="harga" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" /></div>
            <button type="submit" className="w-full mt-2 text-white py-3 rounded-lg font-semibold bg-[#0c6b45] hover:bg-[#095536]">
              {editId ? 'Simpan Perubahan' : 'Tambah ke Database'}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); (document.getElementById('form-barang') as HTMLFormElement).reset(); }} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium text-xs">Batal</button>}
          </form>
        </div>
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-bold">Daftar Harga</h3>
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari nama barang..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[#0c6b45]" />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                <tr><th className="pb-3">ID</th><th className="pb-3">NAMA BARANG</th><th className="pb-3">HARGA</th><th className="pb-3 text-right">AKSI</th></tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400 animate-pulse">Sedang memuat data...</td></tr>
                ) : filteredBarang.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-gray-400">Pencarian tidak ditemukan.</td></tr>
                ) : (
                  filteredBarang.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="py-3">{item.id === '...' ? '...' : `#${item.id}`}</td>
                      <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{item.nama}</td>
                      <td className="py-3 text-[#0c6b45] dark:text-green-400 font-semibold">{formatRp(item.harga)}</td>
                      <td className="py-3"><ActionButtons id={item.id} onEdit={() => handleEditClick(item)} onDelete={() => handleDelete(item.id)} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VIEW KEUANGAN
// ==========================================
function ViewKeuangan() {
  const [dataKeuangan, setDataKeuangan] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setIsFetching(true);
    const res = await fetch('/api/db?type=keuangan');
    setDataKeuangan(await res.json());
    setIsFetching(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: number) => {
    if(!confirm("Hapus catatan transaksi ini?")) return;
    setDataKeuangan(dataKeuangan.filter(k => k.id !== id));
    await fetch(`/api/db?type=keuangan&id=${id}`, { method: 'DELETE' });
  };

  const handleEditClick = (item: any) => {
    setEditId(item.id);
    const form = document.getElementById('form-keuangan') as HTMLFormElement;
    if(form) {
      (form.elements.namedItem('tipe') as HTMLSelectElement).value = item.tipe;
      (form.elements.namedItem('nominal') as HTMLInputElement).value = item.nominal;
      (form.elements.namedItem('keterangan') as HTMLInputElement).value = item.keterangan;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = { tipe: formData.get('tipe') as string, nominal: Number(formData.get('nominal')), keterangan: formData.get('keterangan') as string };

    if(editId) {
      setDataKeuangan(dataKeuangan.map(k => k.id === editId ? { ...k, ...payload } : k));
      await fetch('/api/db', { method: 'PUT', body: JSON.stringify({ type: 'keuangan', id: editId, ...payload }) });
      setEditId(null);
    } else {
      setDataKeuangan([{ id: '...', ...payload }, ...dataKeuangan]);
      await fetch('/api/db', { method: 'POST', body: JSON.stringify({ type: 'keuangan', ...payload }) });
      await loadData();
    }
    e.currentTarget.reset();
  };

  const filteredKeuangan = dataKeuangan.filter(item => 
    item.keterangan?.toLowerCase().includes(searchQuery.toLowerCase()) || item.tipe?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Pencatatan Keuangan</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">{editId ? '⚙️ Edit Transaksi' : 'Catat Transaksi'}</h3>
          <form id="form-keuangan" onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-500 mb-1">Tipe</label>
              <select name="tipe" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5">
                <option value="Tambah Modal">Tambah Modal</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div><label className="block text-gray-500 mb-1">Nominal (Rp)</label><input type="number" name="nominal" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" /></div>
            <div><label className="block text-gray-500 mb-1">Keterangan</label><input type="text" name="keterangan" required placeholder="Contoh: Beli alat" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" /></div>
            <button type="submit" className="w-full mt-2 text-white py-3 rounded-lg font-semibold bg-[#0c6b45] hover:bg-[#095536]">
              {editId ? 'Simpan Perubahan' : 'Simpan Transaksi'}
            </button>
            {editId && <button type="button" onClick={() => { setEditId(null); (document.getElementById('form-keuangan') as HTMLFormElement).reset(); }} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium text-xs">Batal</button>}
          </form>
        </div>
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="font-bold">Buku Kas</h3>
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari keterangan / tipe..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-[#0c6b45]" />
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                <tr><th className="pb-3">ID</th><th className="pb-3">TIPE</th><th className="pb-3">KETERANGAN</th><th className="pb-3">NOMINAL</th><th className="pb-3 text-right">AKSI</th></tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400 animate-pulse">Sedang memuat data...</td></tr>
                ) : filteredKeuangan.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">Pencarian tidak ditemukan.</td></tr>
                ) : (
                  filteredKeuangan.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="py-3">{item.id === '...' ? '...' : `#${item.id}`}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${item.tipe === 'Pengeluaran' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>{item.tipe}</span></td>
                      <td className="py-3">{item.keterangan}</td><td className="py-3 font-semibold">{formatRp(item.nominal)}</td>
                      <td className="py-3"><ActionButtons id={item.id} onEdit={() => handleEditClick(item)} onDelete={() => handleDelete(item.id)} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// VIEW INVOICE 
// ==========================================
function ViewInvoice() {
  const [dataPenjualan, setDataPenjualan] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsFetching(true);
      const res = await fetch('/api/db?type=penjualan');
      setDataPenjualan(await res.json());
      setIsFetching(false);
    };
    loadData();
  }, []);

  const handlePrintPDF = (item: any) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return alert("Pop-up diblokir oleh browser.");
    const hargaSatuan = item.total / item.qty;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${item.pembeli}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0c6b45; padding-bottom: 20px; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #0c6b45; }
            table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            th, td { border-bottom: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
            .total-row td { font-weight: bold; font-size: 18px; color: #0c6b45; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">INVOICE</div>
              <div style="font-weight: bold; font-size: 18px;">PXLabs Official</div>
            </div>
            <div style="text-align: right;">
              <div>Tanggal: ${new Date(item.tanggal).toLocaleDateString('id-ID')}</div>
              <div style="font-weight: bold;">#INV-${item.id}</div>
            </div>
          </div>
          <p><strong>Kepada:</strong> ${item.pembeli}</p>
          <table>
            <thead><tr><th>Barang</th><th>Qty</th><th>Harga</th><th>Total</th></tr></thead>
            <tbody>
              <tr><td>${item.nama_barang}</td><td>${item.qty}</td><td>${formatRp(hargaSatuan)}</td><td>${formatRp(item.total)}</td></tr>
              <tr class="total-row"><td colspan="3" style="text-align: right;">Total Tagihan</td><td>${formatRp(item.total)}</td></tr>
            </tbody>
          </table>
          <script>window.onload = () => { window.print(); setTimeout(() => { window.close(); }, 500); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredData = dataPenjualan.filter(item => item.pembeli?.toLowerCase().includes(searchQuery.toLowerCase()) || item.nama_barang?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Pembuatan Invoice</h1>
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div><h3 className="font-bold">Daftar Transaksi Selesai</h3><p className="text-sm text-gray-500">Unduh riwayat penjualan sebagai PDF Invoice.</p></div>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari pembeli..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" />
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
              <tr><th>ID INV</th><th>TGL ORDER</th><th>PEMBELI</th><th>BARANG</th><th>TOTAL</th><th className="text-right">CETAK</th></tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50">
                  <td className="py-3 font-semibold">#INV-{item.id}</td><td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                  <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{item.pembeli}</td><td>{item.nama_barang} (x{item.qty})</td>
                  <td className="py-3 text-[#0c6b45] dark:text-green-400 font-semibold">{formatRp(item.total)}</td>
                  <td className="py-3 text-right"><button onClick={() => handlePrintPDF(item)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e8f7f0] dark:bg-green-900/30 text-[#0c6b45] rounded-lg text-xs font-semibold"><Download size={14} /> PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}