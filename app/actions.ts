// app/actions.ts
"use server"
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// 1. Fungsi untuk membuat tabel (jika belum ada)
export async function setupDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS barang (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        harga INT NOT NULL
      );
    `;
    return { success: true };
  } catch (error) {
    console.error("Error creating table:", error);
    return { success: false };
  }
}

// 2. Fungsi untuk mengambil data barang
export async function getBarang() {
  try {
    const { rows } = await sql`SELECT * FROM barang ORDER BY id DESC`;
    return rows;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// 3. Fungsi untuk menambah barang
export async function tambahBarang(formData: FormData) {
  const nama = formData.get('nama') as string;
  const harga = formData.get('harga') as string;
  
  if (!nama || !harga) return;

  try {
    await sql`INSERT INTO barang (nama, harga) VALUES (${nama}, ${harga})`;
    // Me-refresh data di halaman utama
    revalidatePath('/');
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}