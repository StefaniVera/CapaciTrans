<?php
session_start();

// --- TAMBAHKAN 3 BARIS INI UNTUK MEMATIKAN CACHE BROWSER ---
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Jika user SUDAH login, langsung lempar ke dashboard (jangan biarkan lihat form login lagi)
if (isset($_SESSION['is_logged_in']) && $_SESSION['is_logged_in'] === true) {
    header("Location: dashboard.php");
    exit;
}
?>

<!-- Kode HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CapaciTrans</title>
    <link rel="stylesheet" href="output.css?v=<?php echo time(); ?>">
</head>
<body>
    <section id="landing-page" class="bg-linear-to-tr from-blue-900 via-blue-700 to-blue-400 flex flex-col justify-center items-center text-white min-h-screen">
        <div>
            <h1 class="text-7xl font-bold text-center">CapaciTrans</h1>
            <p class="text-2xl font-normal mt-7">Prediksi jumlah penumpang dan kapasitas armada disini!</p>
        </div>
        <button onclick="goToLogin()" class="mt-10 bg-linear-to-r from-yellow-600 to-orange-700 rounded-4xl px-7 py-3 font-bold hover:scale-120 cursor-pointer transition-all ease-in-out active:scale-105">
            Login
        </button>
        <div id="login-page" class="hidden fixed bg-white border-2 border-blue-t00 shadow-lg shadow-blue-400 rounded-md w-70 h-85">
            <div class="flex justify-end">
                <button onclick="goToLanding()" class="text-gray-600 hover:cursor-pointer mr-2">X</button>
            </div>
            <div>
                <div class="flex flex-col items-center mt-2">
                    <p class="text-3xl font-bold text-blue-700">Welcome Back</p>
                    <p class="text-sm text-gray-700">Login to your account</p>
                </div>
            </div>
            <form action="login.php" method="post" class="p-6 mt-2">
                <div>
                    <!-- <label for="usn">Nama</label><br> -->
                    <input type="text" required placeholder="Username" name="username" class="mb-3">
                </div>
                <div>
                    <!-- <label for="pass">Password</label><br> -->
                    <input type="password" required placeholder="Password" name="password">
                </div>
                <button onclick="" name="login" class="mt-8 bg-blue-900 text-white py-1.5 rounded-md hover:cursor-pointer w-full">
                    Login
                </button>
                <a href="#" class="block mt-2 text-sm text-center text-blue-700">Forgot password?</a>
            </form>
        </div>
    </section>

    <header id="navbar" class="hidden bg-cyan-600">
       <nav class="flex justify-center">
        <a href="#home">Home</a>
        <a href="#data">Data</a>
        <a href="#prediksi">Prediksi</a>
        <a href="#simulasi">Simulasi</a>
       </nav>
    </header>

    <main id="dashboard" class="hidden flex-col">
        <section id="home" class="bg-linear-to-tr from-blue-900 to-purple-900 w-full h-screen">
            <div class="flex items-center justify-center min-h-screen">
                <div class="font-serif text-white text-center">
                    
                </div>
            </div>
        </section>

        <section id="data" class="bg-white">
            <div>
                <img src="../Ide Web.jpg" alt="">
                <h1>berdasarkan grafik di atas</h1>
            </div>

        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>