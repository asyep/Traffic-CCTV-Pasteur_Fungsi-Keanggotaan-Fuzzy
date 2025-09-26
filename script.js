// Data untuk grafik
const xValues = [];
const lancarValues = [];
const padatValues = [];
const macetValues = [];

// Generate data points
for (let x = 0; x <= 120; x += 2) {
    xValues.push(x);

    // Fungsi keanggotaan LANCAR (Linear Turun)
    let lancar;
    if (x <= 20) lancar = 1;
    else if (x <= 50) lancar = (50 - x) / (50 - 20);
    else lancar = 0;
    lancarValues.push(lancar);

    // Fungsi keanggotaan PADAT (Segitiga)
    let padat;
    if (x <= 30 || x >= 80) padat = 0;
    else if (x <= 55) padat = (x - 30) / (55 - 30);
    else padat = (80 - x) / (80 - 55);
    padatValues.push(padat);

    // Fungsi keanggotaan MACET (Linear Naik)
    let macet;
    if (x <= 60) macet = 0;
    else if (x <= 90) macet = (x - 60) / (90 - 60);
    else macet = 1;
    macetValues.push(macet);
}

// Konfigurasi Chart.js
const ctx = document.getElementById('membershipChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xValues,
        datasets: [
            {
                label: 'Lancar',
                data: lancarValues,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            },
            {
                label: 'Padat',
                data: padatValues,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            },
            {
                label: 'Macet',
                data: macetValues,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Fungsi Keanggotaan Fuzzy - Kepadatan Lalu Lintas CCTV Pasteur',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Jumlah Kendaraan per Menit',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                grid: {
                    color: 'rgba(0,0,0,0.1)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Derajat Keanggotaan (μ)',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                min: 0,
                max: 1,
                grid: {
                    color: 'rgba(0,0,0,0.1)'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    }
});

// Fungsi kalkulator
function calculateMembership() {
    const x = parseFloat(document.getElementById('vehicleCount').value);

    if (isNaN(x) || x < 0) {
        document.getElementById('calcResult').innerHTML = 
            '<strong>⚠️ Masukkan nilai yang valid (≥ 0)</strong>';
        return;
    }

    // Hitung derajat keanggotaan
    let lancar, padat, macet;

    // LANCAR
    if (x <= 20) lancar = 1;
    else if (x <= 50) lancar = (50 - x) / (50 - 20);
    else lancar = 0;

    // PADAT
    if (x <= 30 || x >= 80) padat = 0;
    else if (x <= 55) padat = (x - 30) / (55 - 30);
    else padat = (80 - x) / (80 - 55);

    // MACET
    if (x <= 60) macet = 0;
    else if (x <= 90) macet = (x - 60) / (90 - 60);
    else macet = 1;

    // Format hasil
    const hasil = `
        <strong>Hasil untuk ${x} kendaraan/menit:</strong><br><br>
        🟢 <strong>Lancar:</strong> μ = ${lancar.toFixed(3)} (${(lancar * 100).toFixed(1)}%)<br>
        🟡 <strong>Padat:</strong> μ = ${padat.toFixed(3)} (${(padat * 100).toFixed(1)}%)<br>
        🔴 <strong>Macet:</strong> μ = ${macet.toFixed(3)} (${(macet * 100).toFixed(1)}%)<br><br>
        <strong>Klasifikasi Dominan:</strong> 
        ${lancar >= padat && lancar >= macet ? '🟢 LANCAR' : 
          padat >= macet ? '🟡 PADAT' : '🔴 MACET'}
    `;

    document.getElementById('calcResult').innerHTML = hasil;
}

// Event listener untuk Enter key
document.getElementById('vehicleCount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateMembership();
    }
});
