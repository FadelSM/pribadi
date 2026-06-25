const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const btnKeLogin = document.getElementById('btnKeLogin');
const btnKeRegister = document.getElementById('btnKeRegister');
const modalOtp = document.getElementById('modalOtp');
const txtKodeAcak = document.getElementById('txtKodeAcak');

let dataSementara = null; 
let kodeVerifikasiSah = "";

btnKeLogin.addEventListener('click', () => { registerForm.classList.add('hidden'); loginForm.classList.remove('hidden'); });
btnKeRegister.addEventListener('click', () => { loginForm.classList.add('hidden'); registerForm.classList.remove('hidden'); });

// 1. PROSES SUBMIT DAFTAR (MEMBUAT KODE ACAK / OTP)
document.getElementById('formRegistrasi').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const nama = document.getElementById('regNama').value.trim();
    const bio = document.getElementById('regBio').value.trim();

    if (localStorage.getItem(username)) {
        alert('Username sudah terpakai!');
        return;
    }

    dataSementara = { username, nama, bio, saldo: 0, links: [], donasi: [] };
    kodeVerifikasiSah = Math.floor(1000 + Math.random() * 9000).toString();
    txtKodeAcak.innerText = kodeVerifikasiSah;
    modalOtp.classList.remove('hidden');
});

// 2. PROSES VALIDASI KODE OTP YANG DIINPUT USER
document.getElementById('formOtp').addEventListener('submit', (e) => {
    e.preventDefault();
    const inputOtp = document.getElementById('inputOtp').value.trim();

    if (inputOtp === kodeVerifikasiSah) {
        localStorage.setItem(dataSementara.username, JSON.stringify(dataSementara));
        localStorage.setItem('user_sedang_login', dataSementara.username);
        
        alert('Verifikasi Berhasil! Akun Anda telah aktif.');
        modalOtp.classList.add('hidden');
        window.location.href = 'src/dashboard/dashboard.html';
    } else {
        alert('Kode salah! Periksa kembali angka yang tertera di layar.');
    }
});

// 3. PROSES MASUK MANUAL (LOGIN USERNAME)
document.getElementById('formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim().toLowerCase();

    if (localStorage.getItem(username)) {
        localStorage.setItem('user_sedang_login', username);
        window.location.href = 'src/dashboard/dashboard.html';
    } else {
        alert('Username tidak ditemukan!');
    }
});

// =======================================================
// INTEGRASI LOGIN ACCOUNTS GOOGLE (CLIENT ID KAMU)
// =======================================================

function bongkarTokenGoogle(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
    const profilUser = bongkarTokenGoogle(response.credential);
    const usernameOtomatis = profilUser.email.split('@')[0]; 
    const namaOtomatis = profilUser.name;

    if (!localStorage.getItem(usernameOtomatis)) {
        const dataBaru = {
            username: usernameOtomatis,
            nama: namaOtomatis,
            bio: "Kreator SociaBuzz resmi terverifikasi Google.",
            saldo: 0,
            links: [],
            donasi: []
        };
        localStorage.setItem(usernameOtomatis, JSON.stringify(dataBaru));
    }

    localStorage.setItem('user_sedang_login', usernameOtomatis);
    alert(`Login Berhasil! Selamat datang, ${namaOtomatis} 👋`);
    window.location.href = 'src/dashboard/dashboard.html';
}

window.onload = function () {
    google.accounts.id.initialize({
        client_id: "273440191781-jscn54obk52opa6t3iobjvrtjop84u8o.apps.googleusercontent.com", 
        callback: handleCredentialResponse
    });
    
    google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", width: "280", text: "signin_with" } 
    );
};
