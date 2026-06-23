# Astro Quest

**Astro Quest** adalah aplikasi edukasi interaktif berbasis web (PWA) yang mensimulasikan tata surya dalam 3D. Proyek ini merupakan pengembangan dari proyek *3D Solar System in THREE.js*, yang kini telah dirombak dengan UI/UX modern bertema luar angkasa futuristik, fitur gamifikasi (kuis, pencapaian, dan koleksi planet), serta dukungan perangkat mobile.

## Fitur Utama

- **Eksplorasi 3D**: Simulasi tata surya lengkap dengan orbit, rotasi, cahaya, asteroid, dan bulan.
- **Kuis Edukatif**: Uji pengetahuanmu tentang planet-planet dan buka kunci planet baru sebagai *reward* koleksimu.
- **Koleksi Planet**: Lihat detail planet yang telah kamu buka dalam ensiklopedia mini berbahasa Indonesia.
- **Sistem Pencapaian (Achievements)**: Kumpulkan berbagai pencapaian berdasarkan interaksimu dalam aplikasi.
- **Progress Tersimpan**: Seluruh progres (koleksi, pencapaian, skor kuis, profil) otomatis tersimpan secara lokal.
- **Kamera AR**: Dukungan mode AR dasar menggunakan WebRTC (jika didukung perangkat/browser).
- **Audio Interaktif**: Dilengkapi dengan *backsound* luar angkasa (ambient drone) dan *sound effect* sintesis berbasis Web Audio API.

## Teknologi

- **Core Engine**: HTML, CSS, JavaScript (Vanilla ES6 modules)
- **3D Graphics**: THREE.js, Postprocessing (Bloom & Outline Passes)
- **Bundler & Build Tool**: Vite
- **PWA**: Dukungan manifest & service worker untuk instalasi desktop/mobile.

## Instalasi & Cara Menjalankan

1. Pastikan Anda telah menginstal Node.js di komputer Anda.
2. Clone/download repositori ini.
3. Buka terminal di folder proyek, lalu jalankan:
   ```sh
   npm install
   ```
4. Setelah instalasi selesai, jalankan development server:
   ```sh
   npm run dev
   ```
   Atau, klik ganda file `start.bat` jika Anda menggunakan Windows.

## Lisensi

Proyek ini menggunakan Lisensi MIT. Silakan kembangkan dan jadikan inspirasi untuk proyek eksplorasi ruang angkasamu sendiri!
