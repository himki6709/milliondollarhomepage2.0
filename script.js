// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJbVCF0AkLkCiCwFBc1Ki5PrKxFeYt8_E",
    authDomain: "milliondollarhomepage2-71ba3.firebaseapp.com",
    databaseURL: "https://milliondollarhomepage2-71ba3-default-rtdb.firebaseio.com",
    projectId: "milliondollarhomepage2-71ba3",
    storageBucket: "milliondollarhomepage2-71ba3.firebasestorage.app",
    messagingSenderId: "895107568682",
    appId: "1:895107568682:web:d48003f71701005f3d5f53"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const cv = document.getElementById('mainCanvas');
const ctx = cv.getContext('2d');
const tooltip = document.getElementById('tooltip');

const blockSize = 10; // প্রতিটি ব্লকের সাইজ ১০x১০ পিক্সেল
const cols = 100;    // ১০০ কলাম (১০০ * ১০ = ১০০০ পিক্সেল চওড়া)
const rows = 100;    // ১০০ রো (১০০ * ১০ = ১০০০ পিক্সেল লম্বা)

let pixels = {};
const imgCache = {};

// ম্যাপ রেন্ডার করার ফাংশন
function render() {
    // ব্যাকগ্রাউন্ড সাদা করা
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cv.width, cv.height);

    // গ্রিড লাইন আঁকা (খুব হালকা ধূসর)
    ctx.strokeStyle = "#f0f0f0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= cv.width; i += blockSize) {
        ctx.moveTo(i, 0); ctx.lineTo(i, cv.height);
        ctx.moveTo(0, i); ctx.lineTo(cv.width, i);
    }
    ctx.stroke();

    // ডাটাবেস থেকে পাওয়া লোগোগুলো আঁকা
    Object.values(pixels).forEach(p => {
        const id = parseInt(p.plotID) - 1;
        const x = (id % cols) * blockSize;
        const y = Math.floor(id / cols) * blockSize;

        if (imgCache[p.imageUrl]) {
            ctx.drawImage(imgCache[p.imageUrl], x, y, blockSize, blockSize);
        } else {
            const img = new Image();
            img.src = p.imageUrl;
            img.onload = () => {
                imgCache[p.imageUrl] = img;
                render(); // ইমেজ লোড হলে আবার ড্র করা
            };
        }
    });
}

// ডাটাবেস থেকে পিক্সেল ডাটা রিয়েল-টাইম নেওয়া
db.ref('pixels').on('value', (snapshot) => {
    pixels = snapshot.val() || {};
    render();
});

// মাউস মুভমেন্ট এবং টুলটিপ লজিক
cv.addEventListener('mousemove', (e) => {
    const rect = cv.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    const col = Math.floor(xPos / blockSize);
    const row = Math.floor(yPos / blockSize);
    const blockID = (row * cols) + col + 1;

    let found = false;
    
    // চেক করা যে এই ব্লকে কোনো কোম্পানি আছে কিনা
    Object.values(pixels).forEach(p => {
        if (parseInt(p.plotID) === blockID) {
            tooltip.style.display = 'block';
            tooltip.style.left = (e.pageX + 15) + 'px';
            tooltip.style.top = (e.pageY + 15) + 'px';
            tooltip.innerHTML = `<strong>${p.name}</strong><br>Block #${p.plotID}`;
            cv.style.cursor = 'pointer';
            found = true;
        }
    });

    if (!found) {
        tooltip.style.display = 'none';
        cv.style.cursor = 'crosshair';
    }
});

// ক্লিক করলে লিঙ্কে নিয়ে যাওয়া বা অর্ডার প্যানেল খোলা
cv.addEventListener('click', (e) => {
    const rect = cv.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    const col = Math.floor(xPos / blockSize);
    const row = Math.floor(yPos / blockSize);
    const blockID = (row * cols) + col + 1;

    let linked = false;
    Object.values(pixels).forEach(p => {
        if (parseInt(p.plotID) === blockID) {
            window.open(p.link, '_blank');
            linked = true;
        }
    });

    // যদি খালি ব্লক হয় তবে অর্ডার উইন্ডো দেখাবে (index.html এর ফাংশন)
    if (!linked) {
        showOrderPanel(blockID);
    }
});

// কপি করার ফাংশন (পেমেন্ট এড্রেসের জন্য)
function copyVal(text) {
    navigator.clipboard.writeText(text);
    alert("Copied: " + text);
}
