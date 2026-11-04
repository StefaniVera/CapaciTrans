<?php
$host = "localhost";
$user = "root";
$pass = ""; // Bawaan XAMPP biasanya kosong
$db   = "db_user";

// Perintah ini yang mencolokkan PHP ke MySQL
$conn = new mysqli($host, $user, $pass, $db);

// Cek apakah colokannya berhasil atau rusak
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>
