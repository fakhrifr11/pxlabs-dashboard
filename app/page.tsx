// app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, ShoppingCart, Package, Wallet, 
  Settings, LogOut, Search, Mail, Bell, Moon, Sun, 
  Hexagon, Apple, Plus, RefreshCw, TrendingUp, TrendingDown, Coins
} from 'lucide-react';

// --- IMPORT SEMUA FUNGSI DATABASE DARI ACTIONS.TS ---
import { 
  setupDatabase, getBarang, tambahBarang, 
  getPenjualan, tambahPenjualan, 
  getKeuangan, tambahKeuangan, 
  getDashboardStats 
} from './actions';

const PRIMARY_GREEN = "#0c6b45";

// Utility function untuk format Rupiah
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
    // Jalankan setup database satu kali saat aplikasi dimuat
    setupDatabase();
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
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fa] dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors">
      {/* SIDEBAR */}
      <motion.aside initial={{ x: -250 }} animate={{ x: 0 }} className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 flex items-center gap-2 text-2xl font-bold">
          <Hexagon size={32} fill={PRIMARY_GREEN} className="text-white" />
          <span>PXLabs</span>
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 mt-4 ml-2">MENU</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${activeTab === item.id ? 'bg-[#e8f7f0] dark:bg-green-900/30 text-[#0c6b45] dark:text-green-400 font-semibold' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              {item.icon} {item.id}
            </button>
          ))}
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 mt-8 ml-2">GENERAL</p>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Settings size={20} /> Settings
          </button>
          <button onClick={() => { setIsLoggedIn(false); setPassword(''); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative">
        <header className="h-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-between px-8 z-10 border-b border-gray-200 dark:border-gray-700">
          <div className="relative w-96">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search data..." className="w-full pl-10 pr-12 py-2.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-[#0c6b45] text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-[#0c6b45] text-white flex items-center justify-center font-bold">AP</div>
              <div className="hidden md:block">
                <p className="text-sm font-bold">Admin PXLabs</p>
                <p className="text-xs text-gray-500">admin@pxlabs.com</p>
              </div>
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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ==========================================
// VIEW DASHBOARD
// ==========================================
function ViewDashboard() {
  const [stats, setStats] = useState({ penjualan: 0, pengeluaran: 0, modalTersedia: 0, labaBersih: 0 });

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-500 text-sm">Ringkasan aktivitas keuangan dan data operasional Anda.</p>
        </div>
        <button onClick={loadStats} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <RefreshCw size={16} /> Sinkronisasi Ulang
        </button>
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
      <div className="flex items-center gap-2 text-xs">
        <span className={isPrimary ? 'text-green-100' : 'text-gray-400'}>{note}</span>
      </div>
    </motion.div>
  );
}

// ==========================================
// VIEW PENJUALAN
// ==========================================
function ViewPenjualan() {
  const [dataPenjualan, setDataPenjualan] = useState<any[]>([]);
  const [dataBarang, setDataBarang] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk kalkulasi form otomatis
  const [selectedBarangId, setSelectedBarangId] = useState("");
  const [hargaSatuan, setHargaSatuan] = useState(0);
  const [qty, setQty] = useState(1);

  const loadData = async () => {
    const p = await getPenjualan();
    const b = await getBarang();
    setDataPenjualan(p);
    setDataBarang(b);
  };

  useEffect(() => { loadData(); }, []);

  // Saat opsi barang dipilih, otomatis cari harganya
  const handleBarangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedBarangId(id);
    const barang = dataBarang.find(b => b.id.toString() === id);
    setHargaSatuan(barang ? barang.harga : 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('total', (hargaSatuan * qty).toString()); // Masukkan hasil hitungan ke form
    
    await tambahPenjualan(formData);
    e.currentTarget.reset();
    setSelectedBarangId("");
    setHargaSatuan(0);
    setQty(1);
    await loadData();
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Manajemen Penjualan</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold flex items-center gap-2 mb-6">Tambah Transaksi</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-500 mb-1">Tanggal</label>
              <input type="date" name="tanggal" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Nama Pembeli</label>
              <input type="text" name="pembeli" required placeholder="Masukkan nama" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Barang</label>
              <select name="barang_id" required value={selectedBarangId} onChange={handleBarangChange} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5">
                <option value="" disabled>Pilih Barang...</option>
                {dataBarang.map(b => (
                  <option key={b.id} value={b.id}>{b.nama}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-500 mb-1">Harga Satuan</label>
                <input type="text" value={formatRp(hargaSatuan)} className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-500" readOnly />
              </div>
              <div className="w-20">
                <label className="block text-gray-500 mb-1">Qty</label>
                <input type="number" name="qty" required min="1" value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" />
              </div>
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Total Biaya</label>
              <input type="text" value={formatRp(hargaSatuan * qty)} className="w-full bg-[#e8f7f0] dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2.5 text-green-700 dark:text-green-400 font-semibold" readOnly />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full mt-4 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${isLoading ? 'bg-gray-400' : 'bg-[#0c6b45] hover:bg-[#095536]'}`}>
              <ShoppingCart size={16} /> {isLoading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </form>
        </div>

        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">Riwayat Penjualan</h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-transparent border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="pb-3">TGL</th>
                  <th className="pb-3">PEMBELI</th>
                  <th className="pb-3">BARANG</th>
                  <th className="pb-3">QTY</th>
                  <th className="pb-3">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {dataPenjualan.length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">Belum ada data tersedia.</td></tr>
                ) : (
                  dataPenjualan.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700/50">
                      <td className="py-3">{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                      <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{item.pembeli}</td>
                      <td className="py-3">{item.nama_barang}</td>
                      <td className="py-3">{item.qty}</td>
                      <td className="py-3 text-[#0c6b45] dark:text-green-400 font-semibold">{formatRp(item.total)}</td>
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
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    const data = await getBarang();
    setDataBarang(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await tambahBarang(new FormData(e.currentTarget));
    e.currentTarget.reset();
    await loadData();
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Database Barang</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">Tambah Item</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-500 mb-1">Nama Barang</label>
              <input type="text" name="nama" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Harga (Rp)</label>
              <input type="number" name="harga" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full mt-2 text-white py-3 rounded-lg font-semibold transition ${isLoading ? 'bg-gray-400' : 'bg-[#0c6b45] hover:bg-[#095536]'}`}>
              {isLoading ? 'Menyimpan...' : 'Tambah ke Database'}
            </button>
          </form>
        </div>
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">Daftar Harga</h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                <tr><th className="pb-3">ID</th><th className="pb-3">NAMA BARANG</th><th className="pb-3">HARGA</th></tr>
              </thead>
              <tbody>
                {dataBarang.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700/50">
                    <td className="py-3">#{item.id}</td>
                    <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{item.nama}</td>
                    <td className="py-3 text-[#0c6b45] dark:text-green-400 font-semibold">{formatRp(item.harga)}</td>
                  </tr>
                ))}
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
  const [isLoading, setIsLoading] = useState(false);

  const loadData = async () => {
    const data = await getKeuangan();
    setDataKeuangan(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await tambahKeuangan(new FormData(e.currentTarget));
    e.currentTarget.reset();
    await loadData();
    setIsLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Pencatatan Keuangan</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">Catat Transaksi</h3>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-gray-500 mb-1">Tipe</label>
              <select name="tipe" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5">
                <option value="Tambah Modal">Tambah Modal</option>
                <option value="Pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Nominal (Rp)</label>
              <input type="number" name="nominal" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" />
            </div>
            <div>
              <label className="block text-gray-500 mb-1">Keterangan</label>
              <input type="text" name="keterangan" required placeholder="Contoh: Beli alat" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5" />
            </div>
            <button type="submit" disabled={isLoading} className={`w-full mt-2 text-white py-3 rounded-lg font-semibold transition ${isLoading ? 'bg-gray-400' : 'bg-[#0c6b45] hover:bg-[#095536]'}`}>
              {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </form>
        </div>
        <div className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold mb-6">Buku Kas</h3>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                <tr><th className="pb-3">ID</th><th className="pb-3">TIPE</th><th className="pb-3">KETERANGAN</th><th className="pb-3">NOMINAL</th></tr>
              </thead>
              <tbody>
                {dataKeuangan.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-gray-700/50">
                    <td className="py-3">#{item.id}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.tipe === 'Pengeluaran' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'}`}>
                        {item.tipe}
                      </span>
                    </td>
                    <td className="py-3">{item.keterangan}</td>
                    <td className="py-3 font-semibold">{formatRp(item.nominal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}