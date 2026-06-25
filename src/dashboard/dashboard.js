document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('user_sedang_login');
    if (!username) { window.location.href = 'src/login/login.html'; return; }

    let userObj = JSON.parse(localStorage.getItem(username));

    document.getElementById('haloNama').innerText = `Halo, ${userObj.nama}! 👋`;
    document.getElementById('txtSaldo').innerText = `Rp ${userObj.saldo.toLocaleString('id-ID')}`;

    document.getElementById('btnLihatProfil').addEventListener('click', () => {
        window.open(`src/profile/profile.html?user=${username}`, '_blank');
    });

    document.getElementById('btnKeluar').addEventListener('click', () => {
        localStorage.removeItem('user_sedang_login');
        window.location.href = './home.html';
    });

    const renderLinks = () => {
        const wrapper = document.getElementById('listLink');
        wrapper.innerHTML = "";
        userObj.links.forEach((l, index) => {
            wrapper.innerHTML += `
                <div class="item-card">
                    <div><p style="font-weight:600">${l.judul}</p><small style="color:#64748b">${l.url}</small></div>
                    <button class="btn-del" onclick="hapusLink(${index})">Hapus</button>
                </div>`;
        });
    };

    const renderDonasi = () => {
        const wrapper = document.getElementById('listDonasi');
        wrapper.innerHTML = userObj.donasi.length ? "" : "<p style='color:#94a3b8;font-size:0.85rem;'>Belum ada dukungan masuk.</p>";
        [...userObj.donasi].reverse().forEach(d => {
            wrapper.innerHTML += `
                <div class="item-card">
                    <div><p><strong>${d.dari}</strong></p><small style="color:#475569">"${d.pesan}"</small></div>
                    <span style="color:#16a34a; font-weight:700; font-size:0.85rem">+Rp ${d.jumlah.toLocaleString('id-ID')}</span>
                </div>`;
        });
    };

    document.getElementById('formTambahLink').addEventListener('submit', (e) => {
        e.preventDefault();
        const judul = document.getElementById('linkJudul').value.trim();
        const url = document.getElementById('linkUrl').value.trim();
        userObj.links.push({ judul, url });
        localStorage.setItem(username, JSON.stringify(userObj));
        document.getElementById('formTambahLink').reset();
        renderLinks();
    });

    window.hapusLink = (index) => {
        userObj.links.splice(index, 1);
        localStorage.setItem(username, JSON.stringify(userObj));
        renderLinks();
    };

    renderLinks();
    renderDonasi();
});
