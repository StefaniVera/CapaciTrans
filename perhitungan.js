// 1. Koefisien Regresi Linear Berganda dari hasil OLS di laporan
const beta0 = -68884.28;
const beta1 = 8651.70;
const beta2 = 77854.67;

// 2. Nilai asli dan kondisi yang sedang dipakai (berubah saat simulasi)
const ARMADA_ASLI = 25;
const KAPASITAS_ASLI = 42;
const TRIP_ASLI = 4;
const TAHUN_PREDIKSI = 2026;

const kondisi = {
  armada: ARMADA_ASLI,
  kapasitas: KAPASITAS_ASLI,
  trip: TRIP_ASLI
};

// Kapasitas layanan satu bulan (0 = Januari, 11 = Desember)
function hitungTerlayaniBulan(indeksBulan, k = kondisi) {
  const hari = new Date(TAHUN_PREDIKSI, indeksBulan + 1, 0).getDate();
  return k.armada * k.kapasitas * k.trip * hari;
}

// Kapasitas layanan 12 bulan (dipakai grafik)
function hitungTerlayani(k = kondisi) {
  return Array.from({ length: 12 }, (_, i) => hitungTerlayaniBulan(i, k));
}

// 3. Data parameter kalender akademik per bulan
const dataBulan = {
  oktober:  { hariKalender: 31, hariEfektif: 22, indeksAkademik: 17 / 22 },
  november: { hariKalender: 30, hariEfektif: 21, indeksAkademik: 21 / 21 },
  desember: { hariKalender: 31, hariEfektif: 21, indeksAkademik: 10.4 / 21 }
};

// Elemen DOM
const dropdownBulan = document.getElementById('pilih-bulan');
const elPrediksi = document.getElementById('card-prediksi');
const elTerlayani = document.getElementById('card-terlayani');
const elStatus = document.getElementById('card-status');

function updateDashboard() {
  const param = dataBulan[dropdownBulan.value];

  // A. Prediksi penumpang (regresi)
  const hasilPrediksi = Math.round(
    beta0 + (beta1 * param.hariEfektif) + (beta2 * param.indeksAkademik)
  );

  // B. Penumpang terlayani, memakai kondisi simulasi
  const hasilTerlayani =
    kondisi.armada * kondisi.kapasitas * kondisi.trip * param.hariKalender;

  // C. Rasio kecukupan dan status
  const rasio = (hasilPrediksi / hasilTerlayani) * 100;
  let teksStatus, warnaStatus;

  if (rasio > 100) {
    teksStatus = 'Tidak Cukup';
    warnaStatus = 'text-red-600';
  } else if (rasio >= 70) {
    teksStatus = 'Cukup';
    warnaStatus = 'text-green-600';
  } else {
    teksStatus = 'Over-capacity';
    warnaStatus = 'text-yellow-600';
  }

  // D. Tampilkan
  elPrediksi.textContent = hasilPrediksi.toLocaleString('id-ID') + ' Orang';
  elTerlayani.textContent = hasilTerlayani.toLocaleString('id-ID') + ' Orang';
  elStatus.textContent = teksStatus;
  elStatus.className = `text-xl font-medium ${warnaStatus}`;
}

updateDashboard();
dropdownBulan.addEventListener('change', updateDashboard);