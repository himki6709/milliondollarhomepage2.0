// Firebase Init
firebase.initializeApp({ databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com" });
const db = firebase.database();

const grid = document.getElementById('capture-area');
const totalPlots = 2555;
const perRow = 12;
const totalRows = Math.ceil(totalPlots / perRow);

// Custom Cursor
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');
document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    outline.style.left = e.clientX + 'px'; outline.style.top = e.clientY + 'px';
});

// Load 2555 Plots
function generateGrid() {
    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.id = 'plot-' + i;
        
        const rowNum = Math.floor((i - 1) / perRow);
        const hue = (rowNum * 360 / totalRows);
        const color = `hsl(${hue}, 80%, 50%)`;

        plot.innerHTML = `<span class="p-id">#${i}</span><span class="p-price">$${i}</span>`;

        plot.onmouseover = () => {
            plot.style.borderColor = color;
            plot.style.boxShadow = `0 0 35px ${color}`;
            plot.querySelector('.p-price').style.color = "#fff";
        };
        plot.onmouseout = () => {
            plot.style.borderColor = "#1a1a1a";
            plot.style.boxShadow = "none";
            plot.querySelector('.p-price').style.color = "#777";
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
        target.style.transform = "scale(1.2)";
        confetti({ particleCount: 150 });
    }
}

function toggleDrawer() { document.getElementById('payment-drawer') ? document.getElementById('payment-drawer').classList.toggle('open') : document.getElementById('drawer').classList.toggle('open'); }
function copy(t) { navigator.clipboard.writeText(t); alert("Address Copied!"); }

function downloadHDMap() {
    html2canvas(grid, { scale: 1, backgroundColor: "#000" }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'K12_Archive_Map.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

generateGrid();
