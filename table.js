let chart;

const WARNA = {
    2025: 'rgb(194, 197, 200)',
    2026: 'rgb(237, 177, 23)'
};

async function ambilData() {
    const { data, error } = await db
        .from('jumlah-penumpang')
        .select('*')
        .in('tahun', [2025, 2026])
        .order('id', { ascending: true });
    if (error) console.error("Gagal mengambil data:", error);
    return data;
}

// Ubah data mentah jadi format chart: labels bulan + 1 dataset per tahun
function olahData(data) {
    // Urutan bulan (sesuaikan kalau kolom bulan kamu pakai format lain, misal angka 1-12)
    const urutanBulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const buatDataset = (tahun) => ({
        label: `Penumpang ${tahun}`,
        data: urutanBulan.map(bulan => {
            const baris = data.find(d => d.tahun === tahun && d.bulan === bulan);
            return baris ? baris.jumlah : null; // null = titik kosong (garis putus)
        }),
        borderColor: WARNA[tahun],
        backgroundColor: WARNA[tahun],
        tension: 0.2,
        spanGaps: false
    });

    return {
        labels: urutanBulan,
        datasets: [buatDataset(2025), buatDataset(2026)]
    };
}

function inisialisasiGrafik(data) {
    const ctx = document.getElementById('grafik-penumpang');
    chart = new Chart(ctx, {
        type: 'line',
        data: olahData(data),
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
            scales: { y: { beginAtZero: true, ticks: { stepSize: 15000 } } }
        }
    });
}

async function muatDataAwal() {
    const data = await ambilData();
    if (!data) return;
    inisialisasiGrafik(data);
    aktifkanRealtime();
}

function aktifkanRealtime() {
    db.channel('perubahan-data-penumpang')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'jumlah-penumpang' },
            async () => {
                const data = await ambilData();
                if (!data) return;
                const baru = olahData(data);
                chart.data.labels = baru.labels;
                chart.data.datasets = baru.datasets;
                chart.update();
            })
        .subscribe();
}

muatDataAwal();