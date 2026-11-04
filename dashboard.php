<?php
// 1. Memulai session (wajib diletakkan di paling atas)
session_start();

// 2. Mengecek apakah session login TIDAK ADA atau TIDAK BENAR
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    
    // 3. Jika belum login, lempar (redirect) kembali ke halaman login
    header("Location: index.php");
    
    // 4. Menghentikan eksekusi script selanjutnya demi keamanan
    exit;
}
?>

<!-- Setelah kode di atas, baru tulis kode HTML/CSS dashboard kamu seperti biasa -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CapaciTrans</title>
    <link rel="stylesheet" href="output.css">
</head>
<body>
    
</body>
</html>