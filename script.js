// Firebase Setup
const firebaseConfig = { databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const grid = document.getElementById('capture-area');
const totalPlots = 4380;
const perRow = 12;
const totalRows = Math.ceil(totalPlots / perRow);

// Smooth Custom Cursor logic
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');
document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    outline.style.left = e.clientX + 'px'; outline.style.top = e.clientY + 'px';
});

// Generate Plots
function loadPlots() {
    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = 'plot-' + i;
        
        // Row based color logic (Smooth spectrum)
        const rowNum = Math.floor((i - 1) / perRow);
        const hue = (rowNum * 360 / totalRows);
        const color = `hsl(${hue}, 70%, 50%)`;

        plot.innerHTML = `<span class="p-id">#${i}</span><span class="p-price">$${i}</span>`;

        // Interactive hover effect
        plot.onmouseover = () => {
            plot.style.boxShadow = `0 0 40px ${color}`;
            plot.style.borderColor = color;
            plot.querySelector('.p-price').style.color = "#fff";
        };
        plot.onmouseout = () => {
            plot.style.boxShadow = "none";
            plot.style.borderColor = "#1a1a1a";
            plot.querySelector('.p-price').style.color = "#888";
        };
        
        plot.onclick = () => toggleDrawer();
        grid.appendChild(plot);
    }
}

function searchPlot() {
    const id = document.getElementById('plotIDSearch').value;
    const target = document.getElementById('plot-' + id);
    if(target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.borderColor = "#fff";
        target.style.transform = "scale(1.3)";
        confetti({ particleCount: 150 });
    }
}

function toggleDrawer() { document.getElementById('drawer').classList.toggle('open'); }
function copy(t) { navigator.clipboard.writeText(t); alert("Copied to clipboard"); }

function downloadHDMap() {
    html2canvas(grid, { scale: 1, backgroundColor: "#000" }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'K12_Archive_HD.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

loadPlots();
