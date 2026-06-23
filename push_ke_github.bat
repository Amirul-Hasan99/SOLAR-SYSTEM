@echo off
echo ==========================================
echo    MENGIRIM KODE KE GITHUB REPOSITORY
echo ==========================================
echo.

echo Menginisialisasi Git (akan diabaikan jika sudah ada)...
git init
echo.

echo Menambahkan remote repository...
git remote add origin https://github.com/Amirul-Hasan99/SOLAR-SYSTEM.git
:: Jika remote origin sudah ada, command di atas akan error, kita abaikan saja.
echo.

echo Memasukkan semua perubahan file ke staging...
git add .
echo.

set /p pesan="Masukkan pesan commit (lalu tekan Enter): "
if "%pesan%"=="" set pesan=Update fitur dan perbaikan bug

echo Melakukan commit dengan pesan: "%pesan%"
git commit -m "%pesan%"
echo.

echo Memastikan branch saat ini bernama 'main'...
git branch -M main
echo.

echo Mendorong (push) kode ke GitHub...
git push -u origin main
echo.

echo ==========================================
echo          PROSES SELESAI
echo ==========================================
pause
