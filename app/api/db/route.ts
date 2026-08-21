// app/api/db/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Fungsi untuk MENGAMBIL data (GET)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    if (type === 'setup') {
      await sql`CREATE TABLE IF NOT EXISTS barang (id SERIAL PRIMARY KEY, nama VARCHAR(255) NOT NULL, harga INT NOT NULL);`;
      await sql`CREATE TABLE IF NOT EXISTS penjualan (id SERIAL PRIMARY KEY, tanggal DATE NOT NULL, pembeli VARCHAR(255) NOT NULL, barang_id INT NOT NULL, qty INT NOT NULL, total INT NOT NULL);`;
      await sql`CREATE TABLE IF NOT EXISTS keuangan (id SERIAL PRIMARY KEY, tipe VARCHAR(50) NOT NULL, nominal INT NOT NULL, keterangan TEXT NOT NULL);`;
      return NextResponse.json({ success: true });
    }
    
    if (type === 'dashboard') {
      const tPenjualan = await sql`SELECT SUM(total) as total FROM penjualan`;
      const tPengeluaran = await sql`SELECT SUM(nominal) as total FROM keuangan WHERE tipe = 'Pengeluaran'`;
      const tModal = await sql`SELECT SUM(nominal) as total FROM keuangan WHERE tipe = 'Tambah Modal'`;

      const penjualan = Number(tPenjualan.rows[0]?.total || 0);
      const pengeluaran = Number(tPengeluaran.rows[0]?.total || 0);
      const modalAwal = Number(tModal.rows[0]?.total || 0);
      
      return NextResponse.json({
        penjualan, pengeluaran,
        modalTersedia: (modalAwal + penjualan) - pengeluaran,
        labaBersih: penjualan - pengeluaran
      });
    }

    if (type === 'barang') {
      const { rows } = await sql`SELECT * FROM barang ORDER BY id DESC`;
      return NextResponse.json(rows);
    }

    if (type === 'penjualan') {
      const { rows } = await sql`SELECT p.*, b.nama as nama_barang FROM penjualan p LEFT JOIN barang b ON p.barang_id = b.id ORDER BY p.id DESC`;
      return NextResponse.json(rows);
    }

    if (type === 'keuangan') {
      const { rows } = await sql`SELECT * FROM keuangan ORDER BY id DESC`;
      return NextResponse.json(rows);
    }

    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// Fungsi untuk MENAMBAH data (POST)
export async function POST(req: Request) {
  const body = await req.json();
  
  try {
    if (body.type === 'barang') {
      await sql`INSERT INTO barang (nama, harga) VALUES (${body.nama}, ${body.harga})`;
    }
    if (body.type === 'penjualan') {
      await sql`INSERT INTO penjualan (tanggal, pembeli, barang_id, qty, total) VALUES (${body.tanggal}, ${body.pembeli}, ${body.barang_id}, ${body.qty}, ${body.total})`;
    }
    if (body.type === 'keuangan') {
      await sql`INSERT INTO keuangan (tipe, nominal, keterangan) VALUES (${body.tipe}, ${body.nominal}, ${body.keterangan})`;
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}