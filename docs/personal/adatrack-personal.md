# ADATRACK Personal

## Official Product & UI Guideline

**Product:** ADATRACK Personal  
**Platform:** Web App  
**Scope:** Personal GPS Tracking  
**Design Approach:** Mobile-first  
**Default Language:** Indonesia  
**Data Stage:** Dummy/Mock  
**Brand:** ADATRACK

---

# 1. Product Overview

ADATRACK Personal adalah aplikasi GPS Tracking untuk pengguna pribadi yang memiliki kendaraan sendiri, baik mobil maupun motor.

Aplikasi berfokus pada pengalaman yang sederhana, visual, ringan, dan mudah digunakan untuk kebutuhan sehari-hari.

Fokus utama:

- memantau kendaraan
- melihat posisi kendaraan
- melihat status kendaraan
- melihat detail kendaraan
- melihat riwayat perjalanan
- melakukan playback perjalanan
- melihat statistik kendaraan
- mengatur kendaraan
- mengatur perangkat GPS
- mengatur geofence
- mengatur notifikasi

ADATRACK Personal ditujukan untuk pengguna dengan jumlah kendaraan yang relatif sedikit, sehingga interface tidak boleh terasa seperti sistem fleet management enterprise.

---

# 2. Product Character

ADATRACK Personal harus memiliki karakter:

- clean
- modern
- ringan
- personal
- sederhana
- visual
- map-centric
- mudah dipahami
- tidak terlalu padat
- nyaman digunakan dengan satu tangan pada mobile
- tetap elegan pada desktop

ADATRACK Personal bukan versi kecil dari ADATRACK Business.

Perbedaan utama:

```text
ADATRACK Business
    â†“
Enterprise / Fleet Management
    â†“
Data banyak
Operasional
Monitoring fleet
Management
Reporting

ADATRACK Personal
    â†“
Individual Vehicle Tracking
    â†“
Sederhana
Personal
Visual
Map-centric
Daily usage
```

---

# 3. Visual Reference

ADATRACK Personal memiliki satu visual reference utama.

File:

```text
docs/personal/personal-overview.png
```

Gambar tersebut berisi keseluruhan referensi visual ADATRACK Personal, termasuk:

1. Login
2. Pemantauan / Live Map
3. Detail Kendaraan
4. Riwayat Perjalanan
5. Playback
6. Laporan / Statistik
7. Statistik Harian
8. Pengaturan
9. Geofence
10. Notifikasi

## 3.1 Fungsi Visual Reference

`personal-overview.png` merupakan **visual design reference** resmi ADATRACK Personal.

Gunakan gambar tersebut untuk memahami:

- layout
- visual hierarchy
- spacing
- typography hierarchy
- card treatment
- icon treatment
- button treatment
- status indicator
- map composition
- navigation
- informasi kendaraan
- statistik
- responsive composition
- overall visual character

Visual reference **bukan spesifikasi pixel-perfect**.

Implementasi tidak harus menyalin gambar secara persis.

Yang harus dipertahankan adalah:

- karakter visual
- hierarchy
- pola interaction
- prinsip layout
- identitas brand
- konsistensi antar halaman

## 3.2 Prioritas Referensi

Jika terdapat perbedaan antara visual reference dengan dokumentasi project, gunakan prioritas berikut:

```text
1. AGENTS.md
2. Architecture
3. Design System
4. UI Guidelines
5. docs/personal/adatrack-personal.md
6. PERSONAL task specification
7. personal-overview.png
```

Visual reference tidak boleh digunakan untuk membenarkan implementasi yang bertentangan dengan architecture atau design system.

---

# 4. Brand Identity

Identitas resmi ADATRACK:

```text
BINA = HITAM
GO   = MERAH
```

Penulisan brand:

```text
ADATRACK
```

dengan:

```text
BINA â†’ Hitam
GO   â†’ Merah
```

## 4.1 Brand Color

Merah merupakan primary brand accent ADATRACK.

Gunakan merah untuk:

- primary action
- active state
- selected state
- important indicator
- CTA
- brand accent
- notification emphasis jika sesuai konteks

Hitam digunakan untuk:

- logo BINA
- heading utama
- primary text
- strong emphasis

## 4.2 Warna yang Tidak Boleh Menggantikan Brand

Orange bukan warna brand ADATRACK.

Jangan menggunakan orange sebagai primary brand color.

Jangan mengubah:

```text
BINA = Hitam
GO   = Merah
```

menjadi kombinasi warna lain.

Penggunaan warna semantic seperti green, yellow, gray, dan red tetap diperbolehkan untuk status atau feedback UI sesuai design system.

---

# 5. Design Principles

## 5.1 Mobile-first

ADATRACK Personal dikembangkan dengan pendekatan mobile-first.

Mobile adalah baseline utama.

Prioritas:

```text
Mobile
   â†“
Tablet
   â†“
Desktop
```

Namun mobile-first tidak berarti desktop hanya diperbesar dari layout mobile.

Desktop harus menggunakan ruang yang tersedia dengan baik tanpa menghilangkan kesederhanaan pengalaman mobile.

## 5.2 Simple over Dense

Jangan menampilkan terlalu banyak informasi sekaligus.

Prioritaskan:

1. informasi paling penting
2. action utama
3. status
4. detail tambahan

Informasi sekunder dapat ditempatkan pada:

- detail page
- expandable section
- secondary card
- history
- modal/drawer

## 5.3 Visual First

ADATRACK Personal adalah aplikasi tracking.

Informasi yang berhubungan dengan lokasi dan kendaraan harus mudah dipahami secara visual.

Gunakan:

- map
- marker
- status badge
- icon
- card
- summary
- visual statistics

Hindari interface yang terasa seperti admin dashboard enterprise.

## 5.4 Consistency

Semua halaman Personal harus terasa sebagai satu aplikasi.

Gunakan konsisten:

- typography
- spacing
- border radius
- card
- button
- icon
- status
- navigation
- color
- interaction

Jangan membuat setiap halaman memiliki gaya visual sendiri.

---

# 6. Primary Navigation

ADATRACK Personal memiliki tiga primary navigation:

```text
Pemantauan
Statistik
Pengaturan
```

Struktur:

```text
ADATRACK Personal
â”‚
â”œâ”€â”€ Pemantauan
â”œâ”€â”€ Statistik
â””â”€â”€ Pengaturan
```

---

# 7. Mobile Navigation

Pada mobile gunakan **Bottom Navigation**.

Struktur:

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                 â”‚
â”‚           CONTENT               â”‚
â”‚                                 â”‚
â”‚                                 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Pemantauan â”‚ Statistik â”‚ Pengaturan â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Primary navigation harus selalu mudah dijangkau.

Gunakan icon + label.

Active navigation harus memiliki visual indicator yang jelas.

---

# 8. Desktop Navigation

Pada desktop gunakan **Top Navigation**.

Contoh:

```text
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ ADATRACK Personal                                       â”‚
â”‚                                                       â”‚
â”‚ Pemantauan        Statistik        Pengaturan         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Desktop Personal **tidak menggunakan Sidebar Business sebagai primary navigation**.

Sidebar Business tidak boleh digunakan hanya untuk membuat layout Personal terlihat lebih lengkap.

---

# 9. Header

Header Personal harus sederhana.

Dapat berisi:

- logo/brand
- context/page title jika diperlukan
- notification indicator jika diperlukan
- user/account access
- theme
- language

Jangan memasukkan Global Search pada header.

---

# 10. Home / Entry Experience

Setelah login, pengguna diarahkan ke:

```text
Pemantauan
```

Pemantauan menjadi pengalaman utama ADATRACK Personal.

Aplikasi Personal tidak perlu menggunakan dashboard enterprise yang penuh dengan banyak widget.

Prioritas:

```text
User
 â†“
Pemantauan
 â†“
Kendaraan
 â†“
Lokasi
```

---

# 11. Personal Application Flow

Flow utama:

```text
Login
  â†“
Pemantauan
  â†“
Pilih Kendaraan
  â†“
Detail Kendaraan
  â†“
Riwayat Perjalanan
  â†“
Playback
```

Flow statistik:

```text
Pemantauan
  â†“
Statistik
  â†“
Ringkasan
  â†“
Harian
  â†“
Mingguan
  â†“
Bulanan
```

Flow pengaturan:

```text
Pengaturan
  â”œâ”€â”€ Kendaraan Saya
  â”œâ”€â”€ Perangkat GPS
  â”œâ”€â”€ Notifikasi
  â”œâ”€â”€ Geofence
  â”œâ”€â”€ Akun
  â”œâ”€â”€ Bantuan
  â””â”€â”€ Tentang Aplikasi
```

---

# 12. Feature Structure

Struktur utama Personal:

```text
ADATRACK Personal
â”‚
â”œâ”€â”€ Pemantauan
â”‚   â”œâ”€â”€ VehicleList
â”‚   â”œâ”€â”€ LiveMap
â”‚   â””â”€â”€ VehicleDetail
â”‚
â”œâ”€â”€ Statistik
â”‚   â”œâ”€â”€ Summary
â”‚   â”œâ”€â”€ Daily
â”‚   â”œâ”€â”€ Weekly
â”‚   â””â”€â”€ Monthly
â”‚
â””â”€â”€ Pengaturan
    â”œâ”€â”€ Kendaraan
    â”œâ”€â”€ Perangkat GPS
    â”œâ”€â”€ Notifikasi
    â”œâ”€â”€ Geofence
    â”œâ”€â”€ Akun
    â”œâ”€â”€ Bantuan
    â””â”€â”€ Tentang
```

---

# 13. Monitoring

Pemantauan adalah feature utama ADATRACK Personal.

Struktur utama:

```text
Pemantauan
â”œâ”€â”€ VehicleList
â””â”€â”€ LiveMap
```

VehicleList dan LiveMap merupakan component terpisah.

## 13.1 VehicleList

VehicleList bertanggung jawab untuk menampilkan kendaraan.

Dapat menampilkan:

- nomor kendaraan
- nama kendaraan jika tersedia
- tipe kendaraan
- status
- kecepatan
- driver jika relevan
- selected state

VehicleList dapat mendukung:

- search
- filter status
- select vehicle

Component tidak boleh mengambil data sendiri.

Data dikirim melalui props.

## 13.2 LiveMap

LiveMap menampilkan:

- posisi kendaraan
- marker kendaraan
- selected vehicle
- map controls
- lokasi kendaraan

LiveMap menggunakan map foundation yang tersedia.

LiveMap tidak boleh mengambil data API sendiri.

Data dikirim melalui props.

---

# 14. Playback

Playback merupakan feature terpisah dari Live Monitoring.

Playback tidak harus ditampilkan bersamaan dengan VehicleList.

Flow:

```text
Riwayat Perjalanan
       â†“
Pilih Perjalanan
       â†“
Playback
```

Playback menampilkan:

- route
- vehicle marker
- timeline
- play
- pause
- progress
- waktu
- jarak
- durasi
- kecepatan

Playback harus terasa seperti pengalaman melihat kembali perjalanan, bukan seperti halaman fleet monitoring.

---

# 15. Vehicle Detail

Detail kendaraan menampilkan informasi kendaraan yang sedang dipilih.

Minimal:

- kendaraan
- nomor kendaraan
- tipe kendaraan
- status
- kecepatan
- lokasi terakhir
- waktu update

Jika diperlukan dapat menampilkan summary:

- jarak hari ini
- waktu berkendara
- jumlah perjalanan

---

# 16. Trip History

Riwayat perjalanan menampilkan perjalanan kendaraan.

Data dapat meliputi:

- tanggal
- waktu mulai
- waktu selesai
- jarak
- durasi
- kecepatan rata-rata
- kecepatan maksimum

Contoh:

```text
07:12 - 07:48
Rumah â†’ Kantor
18,2 km
36 menit
```

Pengguna dapat memilih perjalanan untuk masuk ke Playback.

---

# 17. Statistics

Statistik merupakan primary navigation.

Struktur:

```text
Statistik
â”œâ”€â”€ Ringkasan
â”œâ”€â”€ Harian
â”œâ”€â”€ Mingguan
â””â”€â”€ Bulanan
```

Statistik dapat menampilkan:

- total jarak
- total waktu berkendara
- jumlah perjalanan
- kecepatan rata-rata
- kecepatan maksimum
- kendaraan paling aktif

## 17.1 Daily Statistics

Statistik harian dapat menampilkan:

```text
127,4 km
Total Jarak

3j 42m
Waktu Berkendara

8
Jumlah Perjalanan

35 km/jam
Kecepatan Rata-rata

96 km/jam
Kecepatan Maksimum
```

Visualisasi digunakan jika membantu pemahaman.

Jangan membuat statistik terlalu kompleks.

---

# 18. Settings

Pengaturan merupakan primary navigation.

Struktur:

```text
Pengaturan
â”œâ”€â”€ Kendaraan Saya
â”œâ”€â”€ Perangkat GPS
â”œâ”€â”€ Notifikasi
â”œâ”€â”€ Geofence
â”œâ”€â”€ Akun
â”œâ”€â”€ Bantuan
â””â”€â”€ Tentang Aplikasi
```

Gunakan list/card yang sederhana.

Jangan membuat halaman pengaturan seperti admin panel enterprise.

---

# 19. Vehicles

Kendaraan Saya menampilkan kendaraan yang dimiliki pengguna.

Informasi dapat meliputi:

- kendaraan
- nomor kendaraan
- tipe
- status GPS
- informasi perangkat

Jumlah kendaraan relatif sedikit sehingga tidak selalu membutuhkan DataTable enterprise.

Gunakan card/list yang lebih sesuai untuk Personal.

---

# 20. GPS Device

Perangkat GPS menampilkan informasi perangkat yang terhubung.

Contoh:

- nama perangkat
- status koneksi
- kendaraan terkait
- waktu update terakhir

Pada tahap frontend, seluruh data menggunakan dummy/mock data.

Tidak ada integrasi hardware production pada scope visual.

---

# 21. Geofence

Geofence merupakan feature Personal untuk menentukan area tertentu.

Contoh:

```text
Rumah
Radius 100 meter
Aktif

Kantor
Radius 200 meter
Aktif

Sekolah
Radius 150 meter
Nonaktif
```

Geofence dapat digunakan untuk:

- masuk area
- keluar area
- notification trigger

---

# 22. Notification

Notification Personal berhubungan dengan kendaraan dan geofence.

Contoh:

```text
Kendaraan mulai bergerak      ON
Kendaraan berhenti            ON
Kendaraan offline             ON
Masuk Geofence                ON
Keluar Geofence               ON
```

Gunakan component Switch/Toggle dari design system jika tersedia.

---

# 23. Data Architecture

Selama tahap frontend:

```text
Page / Feature
      â†“
Dummy Data
      â†“
Component
```

Component tidak boleh memiliki dummy data sendiri.

## 23.1 Data Ownership

Page atau feature bertanggung jawab terhadap:

- data
- selected vehicle
- filter
- search
- date range
- selected trip
- UI state
- event handling

Component bertanggung jawab terhadap:

- rendering
- interaction
- visual state
- callback

## 23.2 Component Rule

Component tidak boleh:

- fetch API sendiri
- mengakses database
- membuat dummy data sendiri
- menyimpan business logic yang seharusnya dimiliki feature
- bergantung pada halaman tertentu secara tidak perlu

Component menerima data melalui props.

Event dikirim melalui callback props.

---

# 24. Dummy Data

Dummy data harus:

- realistis
- konsisten
- memiliki relasi yang masuk akal
- cukup untuk menguji UI
- tidak menggunakan data pribadi nyata

Contoh kendaraan:

```text
B 1234 ABC
Toyota Avanza

B 5678 DEF
Honda Beat

B 9012 GHI
Suzuki Carry
```

Data hanya digunakan sebagai contoh.

Jangan menggunakan data pribadi nyata.

---

# 25. Internationalization

Semua UI yang terlihat pengguna harus mendukung:

```text
Indonesia
English
```

Default:

```text
Indonesia
```

Termasuk:

- navigation
- button
- label
- status
- empty state
- validation
- filter
- statistic
- settings
- notification
- geofence

Jangan hardcode teks UI jika teks tersebut membutuhkan translasi.

---

# 26. Responsive Design

Minimal validasi:

```text
Mobile
Tablet
Desktop
```

## 26.1 Mobile

Prioritas:

- readable
- one-hand usage
- touch-friendly
- bottom navigation
- map visibility
- simple card
- minimal information density

## 26.2 Tablet

Gunakan ruang tambahan untuk:

- map
- vehicle list
- detail
- statistics

Tetap pertahankan hierarchy mobile.

## 26.3 Desktop

Desktop dapat menggunakan:

- layout dua kolom
- larger map
- wider content
- top navigation

Namun jangan mengubah Personal menjadi enterprise dashboard.

---

# 27. Accessibility

Perhatikan:

- semantic HTML
- keyboard navigation
- focus state
- accessible labels
- button state
- navigation state
- form label
- contrast
- touch target
- dialog accessibility
- map control accessibility

Interactive element harus dapat digunakan melalui keyboard jika memungkinkan.

---

# 28. UI Component Rules

Gunakan component dari:

```text
@adatrack/ui
@adatrack/design-system
@adatrack/types
@adatrack/utils
```

jika sesuai.

Jangan membuat duplicate generic component.

Jika membutuhkan component khusus Personal:

```text
apps/personal/src/features/
```

atau:

```text
apps/personal/src/components/
```

sesuai tanggung jawab component.

---

# 29. Shared vs Feature Component

Gunakan prinsip:

```text
Generic
   â†“
packages/ui

Business-specific
   â†“
apps/business

Personal-specific
   â†“
apps/personal
```

Jangan memasukkan component ke `packages/ui` hanya karena component digunakan oleh dua halaman dalam Personal.

Component harus benar-benar generic sebelum dipindahkan ke shared package.

---

# 30. Theme

ADATRACK Personal mengikuti design system ADATRACK.

Theme harus mendukung:

- Light
- Dark

Jika dark mode tersedia di design system, implementasi harus menjaga:

- contrast
- readability
- status color
- map readability
- card hierarchy

Jangan membuat warna baru yang bertentangan dengan design token.

---

# 31. Icons

Gunakan icon library yang sudah digunakan project.

Icon harus:

- konsisten
- sederhana
- mudah dipahami
- tidak terlalu dekoratif

Jangan menggunakan emoji sebagai pengganti icon UI production.

---

# 32. Card

Card digunakan untuk:

- vehicle
- summary
- statistic
- setting item
- trip
- status

Card harus:

- clean
- ringan
- tidak terlalu banyak shadow
- memiliki hierarchy yang jelas

---

# 33. Status

Gunakan semantic status.

Contoh:

```text
Driving
Idle
Parking
Offline
```

Status dapat menggunakan semantic color:

```text
Driving  â†’ success
Idle     â†’ warning
Parking  â†’ neutral
Offline  â†’ danger
```

Warna semantic tidak menggantikan brand color.

Brand tetap:

```text
BINA = Hitam
GO   = Merah
```

---

# 34. Empty State

Empty state harus menjelaskan:

- kondisi
- apa yang harus dilakukan pengguna jika ada action

Contoh:

```text
Belum ada kendaraan

Tambahkan kendaraan untuk mulai menggunakan
ADATRACK Personal.
```

Jangan menampilkan halaman kosong tanpa penjelasan.

---

# 35. Loading State

Gunakan loading state yang konsisten dengan design system.

Jangan membuat loading animation berbeda pada setiap halaman.

---

# 36. Error State

Error harus:

- jelas
- singkat
- tidak terlalu teknis
- memberikan action jika memungkinkan

Contoh:

```text
Data kendaraan belum dapat dimuat.

Coba lagi.
```

---

# 37. Performance

Karena aplikasi bersifat map-centric:

- jangan render component yang tidak diperlukan
- hindari re-render berlebihan
- gunakan memoization jika memang diperlukan
- jangan memuat data besar jika tidak diperlukan
- gunakan lazy loading untuk feature berat jika sesuai

Jangan melakukan optimasi prematur tanpa alasan.

---

# 38. Mobile-first Interaction

Interaction utama harus nyaman disentuh.

Gunakan:

- button yang cukup besar
- spacing yang cukup
- list item yang mudah dipilih
- bottom navigation yang mudah dijangkau
- form yang mudah diisi

Jangan membuat target klik terlalu kecil.

---

# 39. Desktop Interaction

Desktop dapat menggunakan:

- hover state
- larger map
- keyboard interaction
- wider layout

Namun jangan membuat interaction desktop berbeda secara fundamental dengan mobile tanpa alasan UX.

---

# 40. File Organization

Feature Personal menggunakan pendekatan feature-based.

Contoh:

```text
apps/personal/src/
â”‚
â”œâ”€â”€ app/
â”‚
â”œâ”€â”€ components/
â”‚
â”œâ”€â”€ features/
â”‚   â”œâ”€â”€ monitoring/
â”‚   â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ data/
â”‚   â”‚   â”œâ”€â”€ types/
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚
â”‚   â”œâ”€â”€ vehicle-detail/
â”‚   â”œâ”€â”€ playback/
â”‚   â”œâ”€â”€ statistics/
â”‚   â”œâ”€â”€ settings/
â”‚   â”œâ”€â”€ geofence/
â”‚   â””â”€â”€ notifications/
â”‚
â””â”€â”€ i18n/
```

Jangan memasukkan business logic feature ke `app/` jika dapat ditempatkan dengan lebih tepat di `features/`.

---

# 41. Task Structure

Implementasi ADATRACK Personal menggunakan task terpisah:

```text
docs/personal/tasks/

PERSONAL-01-personal-shell.md
PERSONAL-02-monitoring.md
PERSONAL-03-vehicle-detail.md
PERSONAL-04-playback.md
PERSONAL-05-statistics.md
PERSONAL-06-settings.md
PERSONAL-07-geofence-notification.md
```

Setiap task memiliki scope sendiri.

AI/developer tidak boleh mengerjakan task berikutnya secara otomatis.

---

# 42. Task Boundary

Jika sedang mengerjakan:

```text
PERSONAL-02
```

maka jangan mengerjakan:

```text
PERSONAL-03
PERSONAL-04
PERSONAL-05
...
```

meskipun component atau code terlihat membutuhkan perubahan tersebut.

Jika dependency benar-benar diperlukan, lakukan perubahan minimum yang masih berada dalam scope task.

---

# 43. Visual Consistency

Setiap implementasi Personal harus dibandingkan dengan:

```text
docs/personal/personal-overview.png
```

Periksa:

- hierarchy
- spacing
- typography
- card
- button
- status
- icon
- navigation
- map
- responsive behavior

Tujuannya bukan pixel-perfect copy.

Tujuannya adalah menjaga konsistensi produk.

---

# 44. What ADATRACK Personal Is Not

ADATRACK Personal bukan:

- fleet management enterprise
- ERP
- admin dashboard
- data management system yang kompleks
- aplikasi dengan sidebar penuh menu
- dashboard dengan terlalu banyak widget
- interface yang penuh tabel
- interface dengan terlalu banyak filter

Jika suatu feature dapat dibuat lebih sederhana tanpa kehilangan fungsi, pilih pendekatan yang lebih sederhana.

---

# 45. Development Rules

Sebelum mengerjakan feature:

1. Baca `AGENTS.md`.
2. Baca dokumentasi project yang relevan.
3. Baca `docs/personal/adatrack-personal.md`.
4. Baca task yang sedang dikerjakan.
5. Periksa source code yang sudah tersedia.
6. Gunakan component yang sudah tersedia.
7. Periksa visual reference.
8. Jangan membuat ulang component yang sudah ada.
9. Jangan memperluas scope.

---

# 46. AI Instructions

Ketika AI mengerjakan ADATRACK Personal:

```text
Baca terlebih dahulu:

1. AGENTS.md
2. docs/personal/adatrack-personal.md
3. task yang sedang dikerjakan
4. dokumentasi dependency yang relevan
5. source code terkait
6. docs/personal/personal-overview.png
```

AI harus memahami bahwa:

- ADATRACK Personal berbeda dari ADATRACK Business.
- Personal menggunakan mobile-first.
- Mobile menggunakan Bottom Navigation.
- Desktop menggunakan Top Navigation.
- Tidak menggunakan Sidebar Business sebagai primary navigation.
- Brand ADATRACK adalah BINA hitam + GO merah.
- Visual reference adalah acuan desain, bukan pixel-perfect specification.
- Component tidak boleh fetch data sendiri.
- Dummy data dikelola feature/page.
- UI harus menggunakan i18n.
- Default language adalah Indonesia.
- Jangan mengerjakan task berikutnya.
- Jangan membuat backend/API production selama scope frontend.

---

# 47. Source Code Language

Source code menggunakan:

```text
English
```

Contoh:

```text
VehicleList
LiveMap
VehicleDetail
TripHistory
Playback
Statistics
Settings
Geofence
Notification
```

UI menggunakan:

```text
Indonesia / English
```

---

# 48. Production Boundary

Dokumentasi ini tidak berarti backend production harus dibuat.

Selama tahap frontend:

```text
UI
â†“
Mock Data
â†“
Component
```

Backend/API/database production hanya dikerjakan jika secara eksplisit masuk dalam task.

Jangan membuat:

- API production
- database schema baru
- authentication backend
- GPS hardware integration
- realtime socket
- external map service integration

kecuali secara eksplisit diperintahkan oleh task.

---

# 49. Validation

Setiap task Personal harus divalidasi minimal:

```text
Typecheck
ESLint
Build
Functional validation
```

Jika tersedia, validasi juga:

```text
Mobile
Tablet
Desktop
```

Periksa:

- layout
- navigation
- interaction
- i18n
- accessibility
- theme
- responsive
- visual consistency

---

# 50. Definition of Done

Sebuah task Personal dianggap selesai jika:

- seluruh scope task selesai
- tidak ada requirement utama tertinggal
- reusable component digunakan
- tidak ada duplicate generic component
- dummy data berfungsi
- responsive diperiksa
- i18n diperiksa
- accessibility dasar diperiksa
- visual dibandingkan dengan reference
- typecheck PASS jika tersedia
- ESLint PASS
- build PASS
- tidak ada perubahan di luar scope
- completion report dibuat

---

# 51. Completion Report

Setiap task harus membuat laporan:

```text
# Laporan Penyelesaian PERSONAL-XX

## Status

## Implementasi

## File Dibuat

## File Diubah

## Component

## Dummy Data

## Validation

## Masalah

## Catatan

## Task Berikutnya
```

`Task Berikutnya` hanya informasi.

Jangan mengerjakan task berikutnya secara otomatis.

---

# 52. STOP Rule

Setelah Definition of Done terpenuhi dan Completion Report dibuat:

> BERHENTI.

Jangan mengerjakan task berikutnya tanpa instruksi baru dari user.

---

# 53. Final Product Direction

ADATRACK Personal harus terasa seperti:

```text
Personal
Simple
Modern
Clean
Visual
Fast
Easy to understand
Map-centric
```

Bukan:

```text
Enterprise
Complex
Dense
Administrative
Table-heavy
Menu-heavy
```

Pengalaman utama pengguna harus selalu kembali kepada tujuan utama:

```text
"Di mana kendaraan saya?"
        â†“
"Apa statusnya?"
        â†“
"Apa yang terjadi hari ini?"
        â†“
"Bagaimana riwayat perjalanannya?"
```

Semua keputusan UI dan UX ADATRACK Personal harus mendukung tujuan tersebut.
