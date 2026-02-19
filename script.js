const grid = document.getElementById('capture-area');
const totalPlots = 1000;

// মাউস পয়েন্টার ট্র্যাকিং
const outline = document.getElementById('cursor-outline');
document.addEventListener('mousemove', (e) => {
    outline.style.left = e.clientX + 'px';
    outline.style.top = e.clientY + 'px';
});

// ১০০০ প্লট জেনারেট করা
function loadPlots() {
    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.innerHTML = `<span>$${i}</span>`;
        plot.onclick = () => toggleDrawer();
        grid.appendChild(plot);
    }
}

function toggleDrawer() { document.getElementById('drawer').classList.toggle('open'); }
function copy(t) { navigator.clipboard.writeText(t); alert("Address Copied!"); }

// বাই প্লট সাবমিশন
function submitRequest() {
    const brand = document.getElementById('brandName').value;
    const plot = document.getElementById('plotNumber').value;

    if (!brand || !plot) {
        alert("Please provide Brand Name and Plot Number.");
        return;
    }

    toggleDrawer();

    // দুই পাশ থেকে রঙিন কাগজ (Confetti) ছোড়া
    const duration = 4 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffffff', '#888888'] });
        confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ffffff', '#888888'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());

    // অভিনন্দন পপ-আপ দেখানো
    setTimeout(() => {
        document.getElementById('brandDisplay').innerHTML = `Welcome to the Archive, <b>${brand}</b>!<br>Processing Plot #${plot}`;
        document.getElementById('congratsModal').style.display = 'flex';
    }, 800);
}

function closeModal() { document.getElementById('congratsModal').style.display = 'none'; }

loadPlots();
