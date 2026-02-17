const firebaseConfig = {
    apiKey: "AIzaSyCAdnfu2R82xbC7H85n_9mvQBE58X3TjbA",
    databaseURL: "https://the-5k-elite-legacy-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const cv = document.getElementById('mainCanvas'), ctx = cv.getContext('2d');
const tooltip = document.getElementById('legacy-tooltip');
const blockSize = 10; 

let pixels = {};

function render() {
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 1000, 1000);
    ctx.strokeStyle = "#EEE"; ctx.lineWidth = 0.5;
    for(let i=0; i<=1000; i+=blockSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1000, i); ctx.stroke();
    }

    Object.values(pixels).forEach(p => {
        const id = parseInt(p.plotID) - 1;
        const x = (id % 100) * blockSize;
        const y = Math.floor(id / 100) * blockSize;
        let img = new Image();
        img.src = p.imageUrl;
        img.onload = () => ctx.drawImage(img, x, y, blockSize, blockSize);
    });
}

db.ref('pixels').on('value', s => { pixels = s.val() || {}; render(); });

cv.addEventListener('mousemove', (e) => {
    const rect = cv.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Math.floor(y/blockSize)*100 + Math.floor(x/blockSize) + 1;

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

cv.addEventListener('click', () => window.location.href = "order.html");
