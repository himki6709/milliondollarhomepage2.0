const firebaseConfig = {
    apiKey: "AIzaSyDJbVCF0AkLkCiCwFBc1Ki5PrKxFeYt8_E",
    databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const cv = document.getElementById('mainCanvas'), ctx = cv.getContext('2d');
const tooltip = document.getElementById('tooltip');
const blockSize = 10; 
let pixels = {};

function copyText(val) {
    navigator.clipboard.writeText(val);
    alert("Copied: " + val);
}

function render() {
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1000, 1000);
    ctx.strokeStyle = "#F0F0F0"; ctx.lineWidth = 0.5;
    for(let i=0; i<=1000; i+=blockSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1000, i); ctx.stroke();
    }
    const entries = Object.values(pixels);
    document.getElementById('sold-count').innerText = entries.length;
    document.getElementById('rem-count').innerText = 10000 - entries.length;

    entries.forEach(p => {
        const id = parseInt(p.plotID) - 1;
        const x = (id % 100) * blockSize, y = Math.floor(id / 100) * blockSize;
        let img = new Image(); img.crossOrigin = "anonymous"; img.src = p.imageUrl;
        img.onload = () => ctx.drawImage(img, x, y, blockSize, blockSize);
    });
}

db.ref('pixels').on('value', s => { pixels = s.val() || {}; render(); });

cv.addEventListener('mousemove', (e) => {
    const rect = cv.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const id = Math.floor(y/blockSize)*100 + Math.floor(x/blockSize) + 1;
    let found = false;
    Object.values(pixels).forEach(p => {
        if(p.plotID == id) {
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 10) + 'px'; tooltip.style.top = (e.pageY + 10) + 'px';
            tooltip.innerHTML = `<b>${p.name}</b><br>Plot #${p.plotID}`;
            found = true;
        }
    });
    if(!found) tooltip.style.display = 'none';
});

// ক্যানভাসে ক্লিক করলে লিংক ওপেন হবে (অর্ডার পেজে যাবে না)
cv.addEventListener('click', (e) => {
    const rect = cv.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const id = Math.floor(y/blockSize)*100 + Math.floor(x/blockSize) + 1;
    Object.values(pixels).forEach(p => {
        if(p.plotID == id && p.link) window.open(p.link, '_blank');
    });
});

async function downloadHD() {
    const canvas = document.getElementById('mainCanvas');
    const link = document.createElement('a');
    link.download = 'million-dollar-canvas-4k.png';
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}
