document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const targetUser = params.get('user');

    if (!targetUser || !localStorage.getItem(targetUser)) {
        document.body.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>Halaman Kreator Tidak Ditemukan!</h2>";
        return;
    }

    let userObj = JSON.parse(localStorage.getItem(targetUser));

    document.getElementById('pubNama').innerText = userObj.nama;
    document.getElementById('pubBio').innerText = userObj.bio;

    const linksWrapper = document.getElementById('pubLinks');
    userObj.links.forEach(l => {
        linksWrapper.innerHTML += `<a href="${l.url}" target="_blank" class="pub-link-btn">${l.judul}</a>`;
    });

    const modal = document.getElementById('modalQris');
    
    document.getElementById('formDonasi').addEventListener('submit', (e) => {
        e.preventDefault();
        const jumlah = parseInt(document.getElementById('donaturJumlah').value);
        if (jumlah < 10000) { alert('Minimal Rp 10.000!'); return; }
        modal.classList.remove('hidden');
    });

    document.getElementById('closeModal').addEventListener('click', () => modal.classList.add('hidden'));

    document.getElementById('btnKonfirmasi').addEventListener('click', () => {
        const dari = document.getElementById('donaturNama').value.trim();
        const jumlah = parseInt(document.getElementById('donaturJumlah').value);
        const pesan = document.getElementById('donaturPesan').value.trim();

        userObj.saldo += jumlah;
        userObj.donasi.push({ dari, jumlah, pesan });

        localStorage.setItem(targetUser, JSON.stringify(userObj));

        alert(`Terima kasih ${dari}, nominal Rp ${jumlah.toLocaleString('id-ID')} sukses terkirim ke saldo kreator!`);
        modal.classList.add('hidden');
        document.getElementById('formDonasi').reset();
    });
});
