// Global State & Blockchain Ledger Mock Data
let currentPortal = 'beekeeper';
let currentTheme = 'dark';
let telemetryChartInstance = null;
let qrcodeInstance = null;

let blocks = [
    {
        block: 104,
        timestamp: '2026-09-14 10:22',
        batchId: 'BATCH-2026-A8',
        flora: 'Wildflower Organic',
        moisture: '16.8%',
        hash: '0x8f3c...91a4'
    },
    {
        block: 103,
        timestamp: '2026-09-02 14:15',
        batchId: 'BATCH-2026-A7',
        flora: 'Clover & Lavender',
        moisture: '17.1%',
        hash: '0x4b2a...77e2'
    },
    {
        block: 102,
        timestamp: '2026-08-18 09:40',
        batchId: 'BATCH-2026-A6',
        flora: 'Acacia Blossom',
        moisture: '16.5%',
        hash: '0x1d9e...33c8'
    }
];

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('beechain-theme') || 'dark';
    setTheme(savedTheme);

    initTelemetryChart();
    renderBlockchainLedger();
    initQRCode('BATCH-2026-A8');
    startTelemetrySimulation();
});

// Theme Switching Logic
function toggleTheme() {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('beechain-theme', theme);
    
    const htmlEl = document.documentElement;
    const themeIcon = document.getElementById('theme-toggle-icon');

    if (theme === 'light') {
        htmlEl.classList.remove('dark');
        htmlEl.classList.add('light');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        htmlEl.classList.remove('light');
        htmlEl.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Re-render chart and QR with adaptive colors
    updateChartTheme();
    if (document.getElementById('qr-batch-label')) {
        initQRCode(document.getElementById('qr-batch-label').innerText);
    }
}

// Portal Navigation Switcher
function switchPortal(portal) {
    currentPortal = portal;
    const bkPortal = document.getElementById('portal-beekeeper');
    const custPortal = document.getElementById('portal-customer');
    const btnBk = document.getElementById('btn-beekeeper');
    const btnCust = document.getElementById('btn-customer');

    if (portal === 'beekeeper') {
        bkPortal.classList.remove('hidden');
        custPortal.classList.add('hidden');

        btnBk.className = "px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 bg-amber-500 text-slate-950 shadow-md";
        btnCust.className = "px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 theme-role-inactive hover:text-amber-500";
    } else {
        bkPortal.classList.add('hidden');
        custPortal.classList.remove('hidden');

        btnCust.className = "px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 bg-amber-500 text-slate-950 shadow-md";
        btnBk.className = "px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 theme-role-inactive hover:text-amber-500";
    }
}

// Chart.js Setup
function initTelemetryChart() {
    const ctx = document.getElementById('telemetryChart').getContext('2d');
    
    const isLight = currentTheme === 'light';
    const textColor = isLight ? '#64748b' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    telemetryChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30'],
            datasets: [
                {
                    label: 'Brood Temp (°C)',
                    data: [34.8, 35.0, 35.1, 35.2, 35.2, 35.3, 35.2],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Humidity (%)',
                    data: [60, 59, 58, 58, 57, 58, 58],
                    borderColor: '#3b82f6',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { size: 10 } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { size: 10 } }
                }
            }
        }
    });
}

function updateChartTheme() {
    if (!telemetryChartInstance) return;
    const isLight = currentTheme === 'light';
    const textColor = isLight ? '#64748b' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    telemetryChartInstance.options.scales.x.grid.color = gridColor;
    telemetryChartInstance.options.scales.x.ticks.color = textColor;
    telemetryChartInstance.options.scales.y.grid.color = gridColor;
    telemetryChartInstance.options.scales.y.ticks.color = textColor;
    telemetryChartInstance.update();
}

// Live IoT Telemetry Simulation Engine
function startTelemetrySimulation() {
    setInterval(() => {
        // Temperature slight flux (34.9 - 35.5)
        const tempDelta = (Math.random() * 0.4 - 0.2).toFixed(1);
        const newTemp = (35.2 + parseFloat(tempDelta)).toFixed(1);
        document.getElementById('metric-temp').innerText = newTemp;

        // Acoustic Frequency simulation
        const freq = Math.floor(180 + Math.random() * 15);
        document.getElementById('metric-freq').innerText = freq;

        // Push new point to chart
        if (telemetryChartInstance) {
            const labels = telemetryChartInstance.data.labels;
            labels.shift();
            const now = new Date();
            labels.push(`${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`);

            telemetryChartInstance.data.datasets[0].data.shift();
            telemetryChartInstance.data.datasets[0].data.push(parseFloat(newTemp));
            telemetryChartInstance.update('quiet');
        }
    }, 3000);
}

// ML Yield Prediction Handler
function updateMLPrediction() {
    const flora = parseFloat(document.getElementById('input-flora').value);
    const sun = parseFloat(document.getElementById('input-sun').value);
    const pop = parseFloat(document.getElementById('input-pop').value);

    document.getElementById('val-flora').innerText = flora;
    document.getElementById('val-sun').innerText = sun;
    document.getElementById('val-pop').innerText = pop.toLocaleString();

    // Simplified ML Formula Output Simulation
    const predicted = ((flora * 0.15) + (sun * 1.2) + (pop / 5000)).toFixed(1);
    document.getElementById('predicted-yield').innerText = predicted;
}

// Blockchain Table Render
function renderBlockchainLedger() {
    const tbody = document.getElementById('blockchain-ledger-body');
    tbody.innerHTML = '';

    blocks.forEach(b => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-amber-500/5 transition";
        tr.innerHTML = `
            <td class="py-3 px-2 font-bold text-amber-500">#${b.block}</td>
            <td class="py-3 px-2 theme-subtext">${b.timestamp}</td>
            <td class="py-3 px-2 font-bold">${b.batchId}</td>
            <td class="py-3 px-2">${b.flora}</td>
            <td class="py-3 px-2">${b.moisture}</td>
            <td class="py-3 px-2 theme-subtext">${b.hash}</td>
            <td class="py-3 px-2 text-right">
                <button onclick="inspectBatch('${b.batchId}')" class="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-lg text-[11px] transition">
                    Inspect
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// QR Code Authentication Generator
function initQRCode(text) {
    const container = document.getElementById('qrcode-container');
    container.innerHTML = '';
    
    qrcodeInstance = new QRCode(container, {
        text: text,
        width: 120,
        height: 120,
        colorDark : "#0f172a",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

function simulateScan() {
    alert("🔍 QR Code scanned successfully! Pulling verified block telemetry from decentralized ledger...");
    switchPortal('customer');
}

function inspectBatch(batchId) {
    switchPortal('customer');
    document.getElementById('batch-title').innerText = `${batchId} (Verified Origin)`;
    document.getElementById('qr-batch-label').innerText = batchId;
    initQRCode(batchId);
}

// Mint Modal Handler
function triggerBlockMintModal() {
    document.getElementById('mint-modal').classList.remove('hidden');
}

function closeMintModal() {
    document.getElementById('mint-modal').classList.add('hidden');
}

function handleMintSubmit(e) {
    e.preventDefault();
    const flora = document.getElementById('mint-flora').value;
    const moisture = document.getElementById('mint-moisture').value + '%';

    const newBlock = {
        block: blocks[0].block + 1,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        batchId: `BATCH-2026-A${blocks.length + 6}`,
        flora: flora,
        moisture: moisture,
        hash: '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6)
    };

    blocks.unshift(newBlock);
    renderBlockchainLedger();
    closeMintModal();
    alert(`🎉 Success! Block #${newBlock.block} minted to the blockchain ledger.`);
}

function handleVisitBooking(e) {
    e.preventDefault();
    alert("🎟️ Eco-Farm Pass Issued! Check your email for booking confirmation and directions.");
}

function changeHive(hiveId) {
    console.log("Switched to hive: " + hiveId);
}