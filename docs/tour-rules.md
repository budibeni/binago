# ADATRACK - Aturan Global Pembuatan Tur Interaktif (Tour Rules)

Dokumen ini adalah **acuan resmi dan aturan baku (global rules)** yang **WAJIB diikuti** oleh seluruh developer dan AI setiap kali merancang, membuat, atau memodifikasi fitur **Panduan Tur Interaktif (*Interactive Tour*)** di seluruh modul ADATRACK.

---

## 1. Aturan Terminologi & Bahasa

1. **Wajib Menggunakan Istilah "Kendaraan":**
   - **WAJIB** menggunakan kata **"Kendaraan"** dalam seluruh teks popover tur, judul langkah, deskripsi, maupun label UI terkait.
   - **DILARANG KERAS** menggunakan istilah *"armada"* dalam narasi panduan tur.
2. **Dukungan Dwi-Bahasa (Bilingual):**
   - Bahasa default sistem adalah **Bahasa Indonesia**.
   - Setiap langkah tur (*step*) **wajib menyediakan teks dalam dua bahasa**: Bahasa Indonesia (`id`) dan English (`en`).
   - Jangan pernah melakukan *hardcode* teks satu bahasa tanpa percabangan locale:
     ```ts
     const isEn = locale === 'en';
     title: isEn ? 'Live Vehicle Telemetry' : 'Telemetri Langsung Kendaraan',
     description: isEn
       ? 'Displays real-time movement status and sensor data for each vehicle.'
       : 'Menampilkan status pergerakan dan sensor terkini dari masing-masing kendaraan.',
     ```
3. **Gaya Bahasa (Tone of Voice):**
   - Gunakan kalimat yang ringkas, jelas, profesional, dan berorientasi operasional.
   - Hindari deskripsi teknis internal kodingan; fokus pada manfaat dan cara pakai bagi operator/pengguna.

---

## 2. Prinsip Kontekstual & Segmentasi Tur (Bukan Monolitik)

1. **Dilarang Membuat Satu Tur Monolitik Raksasa:**
   - **DILARANG** menggabungkan seluruh fitur aplikasi ke dalam satu skrip tur panjang yang melompat antar-tab secara liar.
2. **Tur Mandiri per Tab dan per Mode:**
   - Halaman dengan hierarki tab (seperti Tab Bawah: *Peta, Tabel, Aktivitas*) atau pilihan mode (*Live, Playback, Heatmap, Parkir, Jarak Tempuh, Kecepatan*) **wajib memiliki definisi tur terpisah**.
   - Tur hanya memandu komponen-komponen yang relevan dengan tab/mode yang sedang aktif di layar pengguna.
3. **Pusat Kontrol Tur di Header Shell (`HeaderTourButton.tsx`):**
   - Tur diakses melalui tombol **"Panduan Tur"** di header aplikasi.
   - Menampilkan badge dinamis sesuai konteks halaman (misal: *"Peta Langsung"*, *"Riwayat Rute"*, *"Tabel Live"*, *"Tabel Parkir"*).
   - Menampilkan menu dropdown kontekstual yang menyediakan tur tematik sesuai tab/mode yang sedang dibuka, plus tombol untuk langsung berpindah mode jika pengguna ingin mempelajari fitur lain.

---

## 3. Standar Pemberian ID Target UI (DOM Selector)

1. **Wajib Menggunakan ID Semantik dan Unik:**
   - Setiap elemen UI yang menjadi target sorotan tur **wajib memiliki atribut `id="..."`** yang unik, konsisten, dan diawali dengan nama fitur/domain:
     ```html
     <!-- Contoh Benar -->
     <div id="table-mode-selector"> ... </div>
     <button id="playback-create-route-btn"> ... </button>
     <div id="playback-crop-timeline"> ... </div>
     ```
2. **Dilarang Menggunakan Selector Rapuh:**
   - **DILARANG** menggunakan selector class CSS generik (seperti `.btn-primary`, `.table-container`, atau `div > button:first-child`). Selector ini mudah rusak saat styling atau struktur markup berubah.
3. **Urutan Alur Logis:**
   - Urutan penyorotan elemen harus mengikuti alur kerja pengguna secara natural:
     `Input/Filter/Toolbar → Area Kerja / Konten Utama → Tombol Aksi / Ekspor`.

---

## 4. Mekanisme Event-Driven UI Bridge (`onHighlightStarted`)

1. **Otomatisasi Pembukaan Komponen Tertutup:**
   - Jika suatu elemen yang ingin disorot berada di dalam komponen yang tertutup (misal: panel samping collapse, menu dropdown belum dibuka, drawer belum muncul, atau mode edit belum aktif), **langkah tur wajib membuka komponen tersebut secara otomatis**.
2. **Pola CustomEvent Bridge:**
   - Gunakan hook lifecycle `onHighlightStarted` pada langkah tur untuk men-dispatch `CustomEvent`:
     ```ts
     {
       element: '#table-mode-option-live',
       popover: { ... },
       onHighlightStarted: () => {
         window.dispatchEvent(new CustomEvent('adatrack:open-table-dropdown'));
       },
     }
     ```
   - Di dalam komponen target, pasang event listener:
     ```tsx
     useEffect(() => {
       const handleOpen = () => setIsOpen(true);
       window.addEventListener('adatrack:open-table-dropdown', handleOpen);
       return () => window.removeEventListener('adatrack:open-table-dropdown', handleOpen);
     }, []);
     ```
3. **Pembersihan State saat Berpindah:**
   - Jika langkah tur berikutnya berpindah ke elemen di luar dropdown/drawer, pastikan komponen penutup otomatis ditutup agar tidak menutupi elemen target selanjutnya.

---

## 5. Integritas Data & Larangan `Math.random()` (Data Determinism)

1. **Dilarang Menggunakan `Math.random()` pada Data Target Tur:**
   - **DILARANG KERAS** menggunakan `Math.random()` tanpa seed di dalam perhitungan data dummy (misal durasi parkir, akumulasi kilometer, kecepatan maksimum).
   - *Masalah jika diabaikan:* Setiap kali tur menyorot elemen atau terjadi re-render, data tabel akan melompat-lompat dan berubah-ubah sendiri.
2. **Wajib Menggunakan Deterministic Seed:**
   - Gunakan fungsi hash deterministik berbasis ID kendaraan:
     ```ts
     function getSeedNumber(str: string): number {
       let hash = 0;
       for (let i = 0; i < str.length; i++) {
         hash = (hash << 5) - hash + str.charCodeAt(i);
         hash |= 0;
       }
       return Math.abs(hash);
     }
     ```
   - Data setiap baris kendaraan akan **selalu stabil, konsisten, dan realistis**, tidak pernah berubah saat sorting, filtering, atau re-render.
3. **Memoize Array Props yang Dioper ke Tabel:**
   - Hindari passing array hasil `.filter(...)` langsung di dalam JSX.
   - Selalu bungkus array dengan `useMemo` agar referensi array tidak dibuat ulang tanpa perubahan isi data.

---

## 6. Desain Visual, Ikon & Ergonomi Popover

1. **Standar Tombol Header:**
   - Tombol trigger tur di header shell menggunakan varian `ghost`, ukuran `sm`, dan font `font-normal` (bukan font-bold).
2. **Aturan Warna Ikon:**
   - Ikon dropdown tur menggunakan warna fungsional yang lembut dan terarah:
     - `text-emerald-500` untuk Data Live, Rute, & Jarak Tempuh
     - `text-blue-500` untuk Parkir & Notifikasi
     - `text-purple-500` untuk Kecepatan
     - `text-amber-500` untuk Playback & Histori
     - `text-orange-500` untuk Heatmap
   - **DILARANG** menggunakan warna merah menyala untuk ikon umum panduan tur.
3. **Penempatan Popover (`side` & `align`):**
   - Elemen di bilah bawah (Dock/Trimmer): `side: 'top'`
   - Elemen di bilah kanan (Sidebar layer): `side: 'left'`
   - Elemen di toolbar atas / dropdown: `side: 'bottom'`
   - Selalu sesuaikan `align` (`start`, `center`, `end`) agar popover tidak terpotong oleh batas tepi layar (*viewport*).

---

## 7. Arsitektur State Context & Pencegahan Infinite Loop

1. **Equality Check pada Setter Context:**
   - Pada `TrackingTourContext.tsx` (atau context tur domain lain), setter state **wajib** melakukan perbandingan nilai lama dan nilai baru sebelum memperbarui state:
     ```ts
     const setTrackingState = React.useCallback((newState: TrackingTourState) => {
       setTrackingStateInternal((prev) => {
         if (prev.view === newState.view && prev.mode === newState.mode) {
           return prev; // Jangan trigger re-render jika nilainya sama
         }
         return newState;
       });
     }, []);
     ```
2. **Gunakan `useCallback` untuk Semua Setter:**
   - Semua fungsi kontrol tur yang diekspos melalui Context wajib di-memoize dengan `useCallback`.
3. **Dependency `useEffect` yang Ramping:**
   - Jangan masukkan seluruh objek `context` ke dalam dependency array `useEffect` di komponen konsumer jika hanya memerlukan fungsi setternya.

---

## 8. Prosedur Standar Pembuatan Tur Baru (Step Checklist)

Setiap kali membuat tur baru untuk sebuah halaman atau komponen, ikuti urutan berikut:

- [ ] **Langkah 1 (Target ID):** Beri `id="[domain]-[fitur]"` yang unik pada setiap elemen UI yang akan dijelaskan.
- [ ] **Langkah 2 (Definisi Tur):** Buat fungsi `get[Feature]TourSteps(locale)` di dalam folder `tours/` dengan format bilingual ID/EN.
- [ ] **Langkah 3 (Event Automation):** Pasang `onHighlightStarted` dan custom event jika komponen target perlu dibuka/diaktifkan terlebih dahulu.
- [ ] **Langkah 4 (Stabilitas Data):** Pastikan data yang disorot tur bersifat deterministik (tidak memakai `Math.random()` bebas).
- [ ] **Langkah 5 (Registrasi Header):** Daftarkan tur ke dalam `HeaderTourButton.tsx` pada blok menu tab/mode yang sesuai.
- [ ] **Langkah 6 (Validasi Teknis):** Jalankan typecheck proyek:
  ```bash
  pnpm --filter business exec tsc --noEmit
  ```
  Pastikan kompilasi berakhir dengan status **0 error**.
