// app/actions.ts
"use server"
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// ==========================================
// 1. SETUP DATABASE (Membuat 3 Tabel Utama)
// ==========================================
export async function setupDatabase() {
  try {
    // Tabel Barang
    await sql`
      CREATE TABLE IF NOT EXISTS barang (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        harga INT NOT NULL
      );
    `;

    // Tabel Penjualan
    await sql`
      CREATE TABLE IF NOT EXISTS penjualan (
        id SERIAL PRIMARY KEY,
        tanggal DATE NOT NULL,
        pembeli VARCHAR(255) NOT NULL,
        barang_id INT NOT NULL,
        qty INT NOT NULL,
        total INT NOT NULL
      );
    `;

    // Tabel Keuangan (Buku Kas)
    await sql`
      CREATE TABLE IF NOT EXISTS keuangan (
        id SERIAL PRIMARY KEY,
        tipe VARCHAR(50) NOT NULL,
        nominal INT NOT NULL,
        keterangan TEXT NOT NULL
      );
    `;

    return { success: true };
  } catch (error) {
    console.error("Gagal setup database:", error);
    return { success: false };
  }
}

// ==========================================
// 2. QUERY UNTUK MENU BARANG
// ==========================================
export async function getBarang() {
  try {
    const { rows } = await sql`SELECT * FROM barang ORDER BY id DESC`;
    return rows;
  } catch (error) {
    return [];
  }
}

export async function tambahBarang(formData: FormData) {
  const nama = formData.get('nama') as string;
  const harga = formData.get('harga') as string;
  if (!nama || !harga) return;

  try {
    await sql`INSERT INTO barang (nama, harga) VALUES (${nama}, ${parseInt(harga)})`;
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// 3. QUERY UNTUK MENU PENJUALAN
// ==========================================
export async function getPenjualan() {
  try {
    // Query dengan JOIN agar kita bisa mengambil nama barang dari tabel barang
    const { rows } = await sql`
      SELECT p.*, b.nama as nama_barang 
      FROM penjualan p
      LEFT JOIN barang b ON p.barang_id = b.id
      ORDER BY p.id DESC
    `;
    return rows;
  } catch (error) {
    return [];
  }
}

export async function tambahPenjualan(formData: FormData) {
  const tanggal = formData.get('tanggal') as string;
  const pembeli = formData.get('pembeli') as string;
  const barang_id = formData.get('barang_id') as string;
  const qty = formData.get('qty') as string;
  const total = formData.get('total') as string;

  if (!tanggal || !pembeli || !barang_id || !qty || !total) return;

  try {
    await sql`
      INSERT INTO penjualan (tanggal, pembeli, barang_id, qty, total) 
      VALUES (${tanggal}, ${pembeli}, ${parseInt(barang_id)}, ${parseInt(qty)}, ${parseInt(total)})
    `;
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// 4. QUERY UNTUK MENU KEUANGAN (BUKU KAS)
// ==========================================
export async function getKeuangan() {
  try {
    const { rows } = await sql`SELECT * FROM keuangan ORDER BY id DESC`;
    return rows;
  } catch (error) {
    return [];
  }
}

export async function tambahKeuangan(formData: FormData) {
  const tipe = formData.get('tipe') as string;
  const nominal = formData.get('nominal') as string;
  const keterangan = formData.get('keterangan') as string;

  if (!tipe || !nominal || !keterangan) return;

  try {
    await sql`
      INSERT INTO keuangan (tipe, nominal, keterangan) 
      VALUES (${tipe}, ${parseInt(nominal)}, ${keterangan})
    `;
    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }
}

// ==========================================
// 5. QUERY TOTALAN UNTUK DASHBOARD CARD
// ==========================================
export async function getDashboardStats() {
  try {
    const totalPenjualanResult = await sql`SELECT SUM(total) as total FROM penjualan`;
    const totalPengeluaranResult = await sql`SELECT SUM(nominal) as total FROM keuangan WHERE tipe = 'Pengeluaran'`;
    const totalModalResult = await sql`SELECT SUM(nominal) as total FROM keuangan WHERE tipe = 'Tambah Modal'`;

    const penjualan = Number(totalPenjualanResult.rows[0]?.total || 0);
    const pengeluaran = Number(totalPengeluaranResult.rows[0]?.total || 0);
    const modalAwal = Number(totalModalResult.rows[0]?.total || 0);
    
    // Hitungan matematika bisnis sederhana
    const modalTersedia = (modalAwal + penjualan) - pengeluaran;
    const labaBersih = penjualan - pengeluaran;

    return { penjualan, pengeluaran, modalTersedia, labaBersih };
  } catch (error) {
    return { penjualan: 0, pengeluaran: 0, modalTersedia: 0, labaBersih: 0 };
  }
}