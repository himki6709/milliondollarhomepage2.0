// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJbVCF0AkLkCiCwFBc1Ki5PrKxFeYt8_E",
    databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const cv = document.getElementById('mainCanvas');
const ctx = cv.getContext('2d');
const tooltip = document.getElementById('tooltip');
const blockSize = 10; 

let pixels = {};

// ম্যাপ এবং লোগো রেন্ডার করা
function render() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1000, 1000);
    
    // হালকা গ্রিড লাইন আঁকা
    ctx.strokeStyle = "#eeeeee";
    ctx.lineWidth = 0.5;
    for(let i=0; i<=1000; i+=blockSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i, 1000);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i); ctx.lineTo(1000, i);
        ctx.stroke();
    }

    // ডাটাবেস থেকে লোগো বসানো
    Object.values(pixels).forEach(p => {
        const id = parseInt(p.plotID) - 1;
        const x = (id % 100) * blockSize;
        const y = Math.floor(id / 100) * blockSize;
        
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.src = p.imageUrl;
        img.onload = () => ctx.drawImage(img, x, y, blockSize, blockSize);
    });
}

// ডাটাবেস থেকে পিক্সেল ডাটা নেওয়া
db.ref('pixels').on('value', s => {
    pixels = s.val() || {};
    render();
});

// টুলটিপ ও মাউস হোভার ইফেক্ট
cv.addEventListener('mousemove', (e) => {
    const rect = cv.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    const id = Math.floor(yPos/blockSize)*100 + Math.floor(xPos/blockSize) + 1;

    let found = false;
    Object.values(pixels).forEach(p => {
        if(p.plotID == id) {
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 12) + 'px';
            tooltip.style.top = (e.pageY + 12) + 'px';
            tooltip.innerHTML = `<b>${p.name}</b><br>Plot #${p.plotID}`;
            found = true;
        }
    });
    if(!found) tooltip.style.display = 'none';
});

// ক্লিক করলে লিঙ্কে যাওয়া অথবা অর্ডার পেজে যাওয়া
cv.addEventListener('click', (e) => {
    const rect = cv.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    const id = Math.floor(yPos/blockSize)*100 + Math.floor(xPos/blockSize) + 1;

    let linked = false;
    Object.values(pixels).forEach(p => {
        if(p.plotID == id) {
            window.open(p.link, '_blank');
            linked = true;
        }
    });
    if(!linked) window.location.href = "order.html";
});
