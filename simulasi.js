const btnSimulasi = document.getElementById('btn-simulasi');
const btnReset = document.getElementById('btn-reset');
const tombolUbah = document.querySelectorAll('.btn-ubah');

const NILAI_ASLI = {
    armada: ARMADA_ASLI,
    kapasitas: KAPASITAS_ASLI,
    trip: TRIP_ASLI
};

const ELEMEN_ANGKA = {
    armada: document.getElementById('armada-angka'),
    kapasitas: document.getElementById('kapasitas-angka'),
    trip: document.getElementById('trip-angka')
};

const NILAI_MIN = 1;
let modeSimulasi = false;

function render() {
    // Tampilkan angka dari kondisi
    Object.keys(ELEMEN_ANGKA).forEach(k => {
        ELEMEN_ANGKA[k].textContent = kondisi[k];
    });

    // Tombol ◀ ▶ hanya muncul saat mode simulasi
    tombolUbah.forEach(btn => {
        btn.style.display = modeSimulasi ? 'inline-flex' : 'none';
    });
    btnSimulasi.textContent = modeSimulasi ? 'Selesai' : 'Simulasi';

    // Tombol reset muncul kalau ada nilai yang berbeda dari aslinya
    const beda = Object.keys(NILAI_ASLI).some(k => kondisi[k] !== NILAI_ASLI[k]);
    btnReset.style.display = beda ? 'inline-block' : 'none';

    // Kartu terlayani + status, lalu garis grafik
    updateDashboard();
    updateGarisTerlayani();
}

btnSimulasi.addEventListener('click', () => {
    modeSimulasi = !modeSimulasi;
    render();
});

tombolUbah.forEach(btn => {
    btn.addEventListener('click', () => {
        const param = btn.dataset.param;       // 'armada' | 'kapasitas' | 'trip'
        const arah = Number(btn.dataset.arah); // -1 atau 1
        kondisi[param] = Math.max(NILAI_MIN, kondisi[param] + arah);
        render();
    });
});

btnReset.addEventListener('click', () => {
    Object.assign(kondisi, NILAI_ASLI);
    render();
});

render();