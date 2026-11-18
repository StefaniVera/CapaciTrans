let chart;
let dataMentahGlobal = []; // Menyimpan data asli dari database

// Nilai prediksi hasil rumus Regresi Linear Berganda
const HASIL_PREDIKSI = {
    'Oktober': 181614,
    'November': 190656,
    'Desember': 151358
};

const WARNA = {
    2025: 'rgb(54, 162, 235)',
    2026: 'rgb(237, 177, 23)'
};

const DAERAH = {
    2025: 'rgba(54, 162, 235, 0.2)',
    2026: 'rgba(237, 177, 23, 0.2)'
};

const urutanBulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

async function ambilData() {
    const { data, error } = await db
        .from('jumlah-penumpang')
        .select('*')
        .in('tahun', [2025, 2026])
        .order('id', { ascending: true });
    if (error) console.error("Gagal mengambil data:", error);
    return data; 
}

// Fungsi mengolah data dengan parameter bulanPrediksiTerpilih ('oktober' / 'november' / 'desember')
function olahData(data, bulanPrediksiTerpilih = 'oktober') {
    const buatDataset = (tahun) => ({
        label: `Penumpang ${tahun}`,
        data: urutanBulan.map(bulan => {
            // 1. Cek dulu apakah ada data asli di database
            const baris = data.find(d => Number(d.tahun) === tahun && d.bulan === bulan);
            if (baris) return baris.jumlah;

            // 2. Jika tahun 2026 dan belum ada di database, isi sesuai pilihan dropdown
            if (tahun === 2026) {
                if (bulan === 'Oktober' && ['oktober', 'november', 'desember'].includes(bulanPrediksiTerpilih)) {
                    return HASIL_PREDIKSI['Oktober'];
                }
                if (bulan === 'November' && ['november', 'desember'].includes(bulanPrediksiTerpilih)) {
                    return HASIL_PREDIKSI['November'];
                }
                if (bulan === 'Desember' && bulanPrediksiTerpilih === 'desember') {
                    return HASIL_PREDIKSI['Desember'];
                }
            }

            return null; // Sisanya dibiarkan kosong agar garis berhenti rapi
        }),
        borderColor: WARNA[tahun],
        backgroundColor: DAERAH[tahun],
        tension: 0.2,
        spanGaps: false,
        fill: true
    });

    const hariPerBulan = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    const dataTerlayani = hariPerBulan.map(hari => 25 * 42 * 4 * hari);

    // (a) di olahData: ganti blok hariPerBulan/dataTerlayani/datasetTerlayani
    const datasetTerlayani = {
        id: 'terlayani',
        label: 'Penumpang Terlayani',
        data: hitungTerlayani(),       // pakai fungsi dari perhitungan.js
        borderColor: '#EF4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [8, 6],
        pointRadius: 3,
        pointHoverRadius: 4,
        tension: 0,
        fill: false
    };

    // #EF4444

    return {
        labels: urutanBulan,
        datasets: [buatDataset(2025), buatDataset(2026), datasetTerlayani]
    };
}

// Isi tabel rekap dengan data tahun 2026
// Isi tabel rekap 2026: data asli + baris prediksi sampai bulan dropdown
function isiTabel(data, bulanPrediksi = 'oktober') {
    const tbody = document.querySelector('#rekap-penumpang tbody');
    tbody.innerHTML = '';

    // Data asli dari database
    const data2026 = data
        .filter(d => Number(d.tahun) === 2026)
        .map(d => ({ bulan: d.bulan, jumlah: d.jumlah, prediksi: false }));

    // Tambahkan baris prediksi: Oktober (idx 9) sampai bulan yang dipilih
    const batas = { oktober: 9, november: 10, desember: 11 }[bulanPrediksi];
    for (let i = 9; i <= batas; i++) {
        const nama = urutanBulan[i];
        if (!data2026.some(d => d.bulan === nama)) {
            data2026.push({ bulan: nama, jumlah: HASIL_PREDIKSI[nama], prediksi: true });
        }
    }

    data2026.sort((a, b) => urutanBulan.indexOf(a.bulan) - urutanBulan.indexOf(b.bulan));

    data2026.forEach((baris, i) => {
        const tr = document.createElement('tr');

        // Baris prediksi diberi latar biru muda supaya beda dari data asli
        if (baris.prediksi) tr.style.backgroundColor = '#eff6ff';

        // Status: naik/turun dibanding bulan sebelumnya
        let status = '-';
        if (i > 0) {
            status = baris.jumlah - data2026[i - 1].jumlah >= 0 ? 'Naik' : 'Turun';
        }

        const namaBulan = baris.prediksi ? `${baris.bulan} (Prediksi)` : baris.bulan;

        [namaBulan, baris.jumlah.toLocaleString('id-ID'), status].forEach(teks => {
            const td = document.createElement('td');
            td.textContent = teks;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

function inisialisasiGrafik(data, bulan = "oktober") {
    const ctx = document.getElementById('grafik-penumpang');
    chart = new Chart(ctx, {
        type: 'line',
        data: olahData(data, bulan),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Jumlah Penumpang Tahun 2025 vs 2026',
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 50000 } } }
        }
    });
}

// (c) fungsi update tunggal, taruh di bawah inisialisasiGrafik
// Dipanggil saat dropdown berubah atau data realtime masuk
function perbaruiGrafik() {
    if (!chart) return;
    const bulan = document.getElementById('pilih-bulan').value;
    const baru = olahData(dataMentahGlobal, bulan);
    chart.data.labels = baru.labels;
    chart.data.datasets = baru.datasets;
    chart.update();
    isiTabel(dataMentahGlobal, bulan);
}

// Dipanggil dari simulasi.js saat armada/kapasitas/trip berubah
function updateGarisTerlayani() {
    if (!chart) return;
    const ds = chart.data.datasets.find(d => d.id === 'terlayani');
    if (!ds) return;
    ds.data = hitungTerlayani();
    chart.update();
}

document.getElementById('pilih-bulan').addEventListener('change', perbaruiGrafik);

async function muatDataAwal() {
    const data = await ambilData();
    if (!data) return;
    
    dataMentahGlobal = data; // <-- TAMBAHKAN BARIS INI
    
    // Pastikan grafik awal juga mengikuti nilai dropdown yang sedang terpilih
    const bulanAwal = document.getElementById('pilih-bulan')?.value || 'oktober';
    inisialisasiGrafik(data, bulanAwal);
    
    isiTabel(data, bulanAwal);
    aktifkanRealtime();
}

function aktifkanRealtime() {
    db.channel('perubahan-data-penumpang')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'jumlah-penumpang' },
            async () => {
                const data = await ambilData();
                if (!data) return;
                dataMentahGlobal = data;
                perbaruiGrafik();
            })
        .subscribe();
}

muatDataAwal();