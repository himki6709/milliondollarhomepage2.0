const grid = document.getElementById('capture-area');
const totalPlots = 1000;

// মাউস পয়েন্টার মুভমেন্ট
const outline = document.getElementById('cursor-outline');
document.addEventListener('mousemove', (e) => {
    outline.style.left = e.clientX + 'px';
    outline.style.top = e.clientY + 'px';
});

// ১০০০ প্লট তৈরি
function loadPlots() {
    for (let i = 1; i <= totalPlots; i++) {
        const plot = document.createElement('div');
        plot.className = 'plot';
        plot.innerHTML = `<span>$${i}</span>`;
        
        plot.onmouseover = () => {
            plot.style.borderColor = "#fff";
            plot.style.boxShadow = "0 0 20px rgba(255,255,255,0.2)";
        };
        plot.onmouseout = () => {
            plot.style.borderColor = "#1a1a1a";
            plot.style.boxShadow = "none";
        };
        
        plot.onclick = () => toggleDrawer();
        grid.appendChild(plot);
    }
}

function toggleDrawer() { document.getElementById('drawer').classList.toggle('open'); }

function copy(t) { navigator.clipboard.writeText(t); alert("Copied!"); }

// সাবমিট বাটন লজিক
function submitRequest() {
    const brand = document.getElementById('brandName').value;
    const plot = document.getElementById('plotNumber').value;

    if (!brand || !plot) {
        alert("Please enter both Brand Name and Plot Number.");
        return;
    }

    // ড্রয়ার বন্ধ করা
    toggleDrawer();

    // কনফেটি (কাগজ ছেটানো) অ্যানিমেশন
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FCD535', '#ffffff', '#9E7E45']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FCD535', '#ffffff', '#9E7E45']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // পপ-আপ দেখানো
    setTimeout(() => {
        const modal = document.getElementById('congratsModal');
        document.getElementById('brandDisplay').innerText = `Your Brand "${brand}" is being processed for Plot #${plot}`;
        modal.style.display = 'flex';
    }, 500);
}

function closeModal() {
    document.getElementById('congratsModal').style.display = 'none';
}

loadPlots();
