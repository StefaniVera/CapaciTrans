let chart;

const WARNA = {
    2025: 'rgb(54, 162, 235)',
    2026: 'rgb(237, 177, 23)'
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

// Ubah data mentah jadi format chart: labels bulan + 1 dataset per tahun
function olahData(data) {
    const buatDataset = (tahun) => ({
        label: `Penumpang ${tahun}`,
        data: urutanBulan.map(bulan => {
            const baris = data.find(d => Number(d.tahun) === tahun && d.bulan === bulan);
            return baris ? baris.jumlah : null;
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

// Isi tabel rekap dengan data tahun 2026
function isiTabel(data) {
    const tbody = document.querySelector('#rekap-penumpang tbody');
    tbody.innerHTML = '';

    const data2026 = data
        .filter(d => Number(d.tahun) === 2026)
        .sort((a, b) => urutanBulan.indexOf(a.bulan) - urutanBulan.indexOf(b.bulan));

    data2026.forEach((baris, i) => {
        const tr = document.createElement('tr');

        // Status: naik/turun dibanding bulan sebelumnya
        let status = '-';
        if (i > 0) {
            const selisih = baris.jumlah - data2026[i - 1].jumlah;
            status = selisih >= 0 ? 'Naik' : 'Turun';
        }

        [baris.bulan, baris.jumlah.toLocaleString('id-ID'), status].forEach(teks => {
            const td = document.createElement('td');
            td.textContent = teks;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
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
    isiTabel(data);
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
                isiTabel(data);
            })
        .subscribe();
}

muatDataAwal();