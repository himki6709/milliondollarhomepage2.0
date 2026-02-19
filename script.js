// Firebase Init
firebase.initializeApp({ databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com" });
const db = firebase.database();

const grid = document.getElementById('capture-area');
const totalPlots = 4380;
const plotsPerRow = 15;
const totalRows = Math.ceil(totalPlots / plotsPerRow);

// ক্যানভাস জেনারেশন
function generateGrid() {
    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = 'plot-' + i;

        // সারি অনুযায়ী রঙ নির্ধারণ (মসৃণ গ্রেডিয়েন্ট)
        const rowNum = Math.floor((i - 1) / plotsPerRow);
        const hue = (rowNum * 360 / totalRows); 
        const rowColor = `hsl(${hue}, 85%, 50%)`;

        // প্লটের ভেতরে তথ্য (ID এবং Price)
        plot.innerHTML = `
            <span class="id-label">#${i}</span>
            <span class="price-label">$${i}</span>
        `;

        plot.onmouseover = () => {
            plot.style.backgroundColor = rowColor;
            plot.style.color = "#000";
            plot.style.borderColor = "#fff";
        };
        plot.onmouseout = () => {
            plot.style.backgroundColor = "#111";
            plot.style.color = "#fff";
            plot.style.borderColor = "rgba(255,255,255,0.05)";
        };
        
        plot.onclick = () => toggleDrawer();
        grid.appendChild(plot);
    }
}

// সার্চ ফাংশন
function searchPlot() {
    const id = document.getElementById('plotIDSearch').value;
    const target = document.getElementById('plot-' + id);
    if(target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.querySelectorAll('.plot').forEach(p => p.style.border = "1px solid rgba(255,255,255,0.05)");
        target.style.border = "5px solid gold";
        target.style.transform = "scale(1.4)";
        confetti({ particleCount: 150, spread: 70 });
    }
}

function toggleDrawer() { document.getElementById('drawer').classList.toggle('open'); }
function copy(t) { navigator.clipboard.writeText(t); alert("Address Copied!"); }

function downloadHDMap() {
    alert("High-Resolution Map তৈরি হচ্ছে, দয়া করে অপেক্ষা করুন...");
    html2canvas(grid, { scale: 1, backgroundColor: "#000" }).then(canvas => {
        const link = document.createElement('a');
        link.download = '12_Years_Legacy_Map.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

generateGrid();
