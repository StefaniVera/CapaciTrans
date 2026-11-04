<?php
session_start(); // Memulai sistem kartu akses (Session)
include 'koneksi.php'; // ALUR: Menarik kabel colokan database

// Memastikan halaman ini diakses karena tombol "Masuk" diklik
if (isset($_POST['login'])) {
    
    // ALUR: Menangkap apa yang diketik user di HTML pop-up
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];

    // ALUR: Perintah mencari nama user ke gudang MySQL
    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($query);

    // KEPUTUSAN 1: Apakah username terdaftar?
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc(); // Mengambil baris data user dari database
        
        // KEPUTUSAN 2: Mencocokkan password polos dengan kode hash di database
        if (password_verify($password, $row['password'])) {
            
            // HASH COCOK: Berikan kartu akses dan antar ke dashboard.php
            $_SESSION['username'] = $row['username'];
            $_SESSION['is_logged_in'] = true;
            header("Location: dashboard.php");
            exit;
            
        } else {
            // HASH SALAH: Tolak dan kembalikan ke index.php
            echo "Password salah!";
        }
    } else {
        // USERNAME TIDAK ADA: Tolak dan kembalikan ke index.php
        echo "Username tidak ada";
    }
} else {
    // Jika coba-coba buka file ini langsung tanpa form, tendang ke index.php
    header("Location: index.php");
}
exit;
?>
