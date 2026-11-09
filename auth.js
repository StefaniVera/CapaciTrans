const SUPABASE_URL = "https://pwjktjrslfgbijtivzok.supabase.co";
const SUPABASE_KEY = "sb_publishable_bqvEclRXF1bwPw8xG7ccDg_QrshZTeF";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function proteksiHalaman() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
        alert("Akses ditolak! Anda harus login terlebih dahulu.");
        window.location.href = "index.html";
        return;
    }
    const target = document.getElementById('user-email');
    if (target) target.innerText = session.user.email.split('@')[0];
}

async function tesLogin(e) {
    e.preventDefault(); 

    const emailValue = document.getElementById('emailInput').value;
    const passValue = document.getElementById('passwordInput').value;
    const boxStatus = document.getElementById('statusMendunia');

    // Menyembunyikan status sebelumnya jika ada
    boxStatus.style.display = 'none';
    boxStatus.className = 'status-box';

    // Proses autentikasi menggunakan client yang benar
    const { data, error } = await db.auth.signInWithPassword({
        email: emailValue,
        password: passValue
    });

    if (error) {
        // Jika login gagal
        boxStatus.innerText = "Email/password salah!";
        boxStatus.classList.add('gagal');
        boxStatus.style.display = 'block';
    } else {
        // Langsung arahkan ke halaman dashboard.html tanpa menunda lama
        window.location.replace("dashboard.html");
    }
}

if (window.location.pathname.includes('dashboard')) {
    proteksiHalaman();
}