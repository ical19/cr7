// ==UserScript==
// @name         Toyota Parts Master dengan Estimasi
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tambahkan fitur estimasi sparepart dengan desain elegan pada Toyota Parts Master
// @author       Your Name
// @match        https://passport.toyota.astra.co.id/n-tpos/Inquiry/PartMasterInquiry
// @grant        none
// @require      https://unpkg.com/@supabase/supabase-js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS untuk styling yang elegan
    const css = `
    /* === HEADER NOTIFIKASI BARU === */
#estimasi-sparepart-li .dropdown-menu .external {
  background: linear-gradient(135deg, #1f2b6c 0%, #3a6ea5 100%);
  color: #ffffff;
  padding: 15px 18px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.external-header {
  display: flex;
  flex-direction: column;
}

.external-header h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: #fff;
}

.external-header span {
  font-size: 12px;
  opacity: 0.9;
}

.btn-refresh-modern {
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-refresh-modern:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
}

    /* === NOTIFIKASI BARU === */

.list-notif {
  max-height: 60vh !important;
  overflow-y: auto;
  padding: 0 10px 10px;
}

/* Card notifikasi */
.notif-item {
  display: block;
  background: #ffffff;
  border: 1px solid #e1e5e9;
  border-left: 5px solid #3498db;
  border-radius: 8px;
  margin: 10px 0;
  padding: 12px 14px;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
}

.notif-item:hover {
  background-color: #f8faff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
}

/* Bagian judul (nopol + mobil) */
.notif-header {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Label badge kecil */
.badge-status {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 10px;
  padding: 2px 6px;
  margin-left: 5px;
}

/* Daftar sparepart ringkas */
.notif-body {
  color: #555;
  font-size: 12px;
  margin-bottom: 6px;
  line-height: 1.4;
}

/* Tanggal & teknisi */
.notif-footer {
  font-size: 11px;
  color: #888;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f0f0f0;
  padding-top: 4px;
}

/* --- scroll wrapper di dalam estimasi-table --- */
.estimasi-table {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 20px;
    overflow: hidden;
}

/* ✅ bagian dalam yang bisa scroll */
.estimasi-scroll {
    max-height: 400px;   /* tinggi maksimum kontainer tabel */
    overflow-y: auto;    /* aktifkan scroll vertikal */
    overflow-x: hidden;  /* hilangkan scroll horizontal */
}

/* header tabel tetap menempel di atas saat scroll */
.estimasi-scroll thead th {
    position: sticky;
    top: 0;
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
    z-index: 5;
}

        #estimasi-wrapper {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border: 1px solid #e1e5e9;
        }

        #estimasi-wrapper h4 {
            color: #2c3e50;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #3498db;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #detail-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
            border-left: 4px solid #3498db;
        }

        #detail-info table {
            width: 100%;
        }

        #detail-info td {
            vertical-align: top;
            padding: 10px;
        }

        #detail-info label {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 5px;
            display: block;
        }

        #detail-info .form-control {
            border: 1px solid #dcdfe6;
            border-radius: 6px;
            padding: 8px 12px;
            transition: all 0.3s ease;
        }

        #detail-info .form-control:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .estimasi-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 20px;
        }

        .estimasi-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .estimasi-table th {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            font-weight: 600;
            padding: 12px 8px;
            text-align: left;
            border: none;
        }

        .estimasi-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #ecf0f1;
            vertical-align: middle;
        }

        .estimasi-table tr:hover {
            background-color: #f8f9fa;
        }

        .estimasi-table .form-control {
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            padding: 6px 8px;
            font-size: 13px;
            transition: all 0.3s ease;
        }

        .estimasi-table .form-control:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .estimasi-table .col-total {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }

        #grand-total {
            font-weight: 700;
            font-size: 16px;
            color: #e74c3c;
            background-color: #fdf2f2;
            padding: 10px;
        }

        .btn-estimasi {
            border-radius: 6px;
            font-weight: 600;
            padding: 8px 16px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }

        .btn-estimasi:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .btn-primary {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
        }

        .btn-success {
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
            color: white;
        }

        .btn-danger {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
        }

        .btn-info {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
            color: white;
        }

        .btn-default {
            background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
            color: white;
        }

        .btn-del-row {
            padding: 4px 8px;
            font-size: 12px;
        }

        /* Notification Dropdown Styling */
        #estimasi-sparepart-li .dropdown-menu {
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border: 1px solid #e1e5e9;
            min-width: 350px;
        }

        #estimasi-sparepart-li .dropdown-menu .external {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 15px;
            border-radius: 8px 8px 0 0;
        }

    /* Header notifikasi */
#estimasi-sparepart-li .dropdown-menu .external {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: #fff; /* pastikan teks putih */
    padding: 15px;
    border-radius: 8px 8px 0 0;
    font-weight: 600;
}

/* Item notifikasi */
.notif-item {
    display: block;
    background: #ffffff;
    padding: 12px 15px;
    border-bottom: 1px solid #ecf0f1;
    text-decoration: none;
    color: #2c3e50;
    transition: all 0.2s ease;
    border-left: 4px solid transparent; /* highlight nanti */
}

.notif-item:hover {
    background-color: #f1f5f9;
    border-left: 4px solid #3498db;
}

/* Judul (nopol + mobil) */
.notif-item div:first-child {
    font-weight: 700;
    font-size: 14px;
    color: #2c3e50;
    margin-bottom: 4px;
}

/* Sparepart list */
.notif-item div:nth-child(2) {
    font-size: 12px;
    color: #555;
}

/* Tanggal */
.notif-item div:last-child {
    font-size: 11px;
    color: #888;
    font-style: italic;
}

        #sparepart-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            font-size: 10px;
            padding: 3px 6px;
            min-width: 18px;
        }

        /* Loading State */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }

        .loading::after {
            content: ' ';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            #detail-info td {
                display: block;
                width: 100%;
                padding: 5px 0;
            }

            .estimasi-table {
                overflow-x: auto;
            }

            .estimasi-table table {
                min-width: 800px;
            }
        }

        #estimasi-sparepart-li .notification-icon {
    position: relative;
    display: inline-block;
}

#estimasi-sparepart-li #sparepart-badge {
    position: absolute;
    top: -5px;   /* naikkan ke atas */
    right: -5px; /* geser ke kanan */
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    font-size: 10px;
    padding: 3px 6px;
    border-radius: 12px;
    min-width: 18px;
    text-align: center;
}
/* Style untuk auto-collapse notification */
.auto-collapse-notif {
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Style untuk detail info dengan transition */
#detail-info {
    transition: all 0.3s ease;
    overflow: hidden;
}

/* Loading state untuk auto-collapse */
.auto-collapse-countdown {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #3498db;
    border-radius: 50%;
    border-top: 2px solid transparent;
    animation: spin 1s linear infinite;
    margin-left: 5px;
}

    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Main script
    (async () => {
        console.debug('[EstimasiDebug] Starting script');

        // =============== CONFIG =================
        const supabaseUrl = 'https://pjawwektzazcxakgopou.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYXd3ZWt0emF6Y3hha2dvcG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjQ5MTUsImV4cCI6MjA3Mzg0MDkxNX0.dNEB80t7LcTsvAtHHqgIeJfxcwmmZNsWxPTIAlrj11c';
        const loginEmail = 'magenta.project01@gmail.com';
        const loginPassword = '123456';
        // ========================================

        const parseNumber = txt => {
            if (!txt) return 0;
            let s = String(txt).trim();

            // hapus spasi
            s = s.replace(/\s+/g, '');

            const hasComma = s.indexOf(',') !== -1;
            const hasDot = s.indexOf('.') !== -1;

            if (hasComma && hasDot) {
                // Kasus seperti "65,000.00" (comma = ribuan, dot = desimal)
                // Hapus semua koma (ribuan), lalu ambil bagian sebelum titik (abaikan desimal)
                s = s.replace(/,/g, '').split('.')[0];
            } else if (hasComma && !hasDot) {
                // Kasus seperti "65,000" atau "2,345,000" -> hapus koma
                s = s.replace(/,/g, '');
            } else if (!hasComma && hasDot) {
                // Kasus seperti "65000.00" -> ambil bagian sebelum titik
                s = s.split('.')[0];
            }
            // Sisakan hanya digit untuk berjaga-jaga
            s = s.replace(/[^\d]/g, '');

            const n = parseInt(s, 10);
            return isNaN(n) ? 0 : n;
        };



        const fmt = n => (Number(n)||0).toLocaleString('id-ID');

        const escapeHtml = str => (''+str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');

        // Cleanup existing elements
        document.querySelectorAll('#estimasi-wrapper,#estimasi-sparepart-li').forEach(n=>n.remove());

        // Initialize Supabase
        const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

        // Login function
        async function login() {
            let { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData?.session) {
                const { error: loginErr } = await supabase.auth.signInWithPassword({
                    email: loginEmail,
                    password: loginPassword
                });
                if (loginErr) {
                    console.error('Login gagal:', loginErr.message);
                    return false;
                }
            }
            return true;
        }

        // Wait for page to load completely
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }

        async function initialize() {
            const loginSuccess = await login();
            if (!loginSuccess) {
                alert('Login gagal, silahkan cek koneksi atau credential');
                return;
            }

            createNotificationDropdown();
            await loadNotifikasi();
        }

        // ---------------- NOTIFIKASI DROPDOWN ----------------
        function createNotificationDropdown() {
            const nav = document.querySelector('.top-menu .nav.navbar-nav.pull-right');
            if (!nav) {
                console.warn('Navigation menu tidak ditemukan');
                return;
            }

            const li = document.createElement('li');
            li.id = 'estimasi-sparepart-li';
            li.className = 'dropdown dropdown-extended';
            li.innerHTML = `
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-close-others="true">
        <div class="notification-icon" style="position: relative; display: inline-block;">
            <i class="fas fa-file-alt font-white" style="font-size:25px;color:#2c3e50;"></i>
            <span id="sparepart-badge" class="badge badge-danger">0</span>
        </div>
    </a>
    <ul class="dropdown-menu">
        <li class="external">
  <div class="external-header">
    <h3>📋 Estimasi Pending</h3>
    <span><span id="notif-count">0</span> data belum diproses</span>
  </div>
  <button id="btn-refresh-notif" class="btn-refresh-modern" title="Refresh">⟳</button>
</li>

        <li>
            <ul class="dropdown-menu-list scroller list-notif" style="height:300px;overflow:auto;padding:0;"></ul>
        </li>
    </ul>
`;



            const bell = nav.querySelector('[title="Notifications"]');
            if (bell) {
                nav.insertBefore(li, bell);
            } else {
                nav.appendChild(li);
            }

            // Add event listeners
            li.querySelector('#btn-refresh-notif').addEventListener('click', async (e) => {
                e.preventDefault();
                await loadNotifikasi();
            });

            // Auto refresh every 60 seconds
            setInterval(loadNotifikasi, 60000);
        }

        // ---------------- LOAD NOTIFIKASI ----------------
        let prevCount = 0;
        let blinkInterval = null;
        let originalTitle = document.title;

        async function loadNotifikasi() {
            const notifList = document.querySelector('.list-notif');
            const badge = document.querySelector('#sparepart-badge');
            const notifCount = document.querySelector('#notif-count');

            if (!notifList || !badge || !notifCount) return;

            try {
                const { data: rows = [], error } = await supabase
                .from('estimasi')
                .select(`
    *,
    teknisi:users(full_name)
`, { count: 'exact' })   // ✅ tambahkan count
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
                .limit(1000);            // ✅ pastikan tidak terpotong karena limit default


                if (error) {
                    console.error('Error loading notifications:', error);
                    return;
                }

                notifList.innerHTML = '';
                badge.textContent = rows.length;
                notifCount.textContent = rows.length;

                // === 🔔 BLINKING TITLE START ===
                if (rows.length > prevCount) {
                    if (!blinkInterval) {
                        let toggle = false;
                        blinkInterval = setInterval(() => {
                            document.title = toggle ? "📢 Estimasi Baru!" : originalTitle;
                            toggle = !toggle;
                        }, 1000);
                    }
                } else if (rows.length <= prevCount) {
                    if (blinkInterval) {
                        clearInterval(blinkInterval);
                        blinkInterval = null;
                        document.title = originalTitle;
                    }
                }
                prevCount = rows.length;
                // === 🔔 BLINKING TITLE END ===

                if (rows.length === 0) {
                    const emptyItem = document.createElement('li');
                    emptyItem.innerHTML = '<div class="notif-item" style="text-align:center;color:#7f8c8d;">Tidak ada estimasi pending</div>';
                    notifList.appendChild(emptyItem);
                    return;
                }

                rows.forEach((row, i) => {
                    let spare = [];
                    try {
                        if (typeof row.sparepart_data === 'string' && row.sparepart_data.trim().length > 0) {
                            spare = JSON.parse(row.sparepart_data);
                        } else if (Array.isArray(row.sparepart_data)) {
                            spare = row.sparepart_data;
                        }
                    } catch (e) {
                        console.warn(`[Notif #${i}] Gagal parse sparepart_data:`, e, row.sparepart_data);
                        spare = [];
                    }


                    const a = document.createElement('a');
                    a.href = '#';
                    a.className = 'notif-item';
                    a.innerHTML = `
  <div class="notif-header">
    <span>${escapeHtml(row.nopol || '-')} - ${escapeHtml(row.jenis_mobil || '-')}</span>
    <span class="badge-status">Pending</span>
  </div>
  <div class="notif-body">
    ${escapeHtml(spare.map(s => s.name).slice(0, 3).join(', ') || 'Tidak ada komponen')}
    ${spare.length > 3 ? '...' : ''}
  </div>
  <div class="notif-footer">
    <span>${new Date(row.created_at).toLocaleDateString('id-ID')}</span>
    <span>👨‍🔧 ${escapeHtml(row.teknisi?.full_name || '-')}</span>
  </div>
`;


                    const liRow = document.createElement('li');
                    liRow.appendChild(a);
                    notifList.appendChild(liRow);

                    a.addEventListener('click', ev => {
                        ev.preventDefault();
                        renderEstimasiWrapper(row, spare);

                        // ✅ Hentikan blinking begitu user buka detail
                        if (blinkInterval) {
                            clearInterval(blinkInterval);
                            blinkInterval = null;
                            document.title = originalTitle;
                        }
                    });
                });

                // ================== UPDATE HEADER TIMESTAMP ==================
                const headerSpan = document.querySelector('.external-header span');
                if (headerSpan) {
                    const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    headerSpan.innerHTML = `<span id="notif-count">${rows.length}</span> data belum diproses • diperbarui ${now}`;
                }


            } catch (error) {
                console.error('Error in loadNotifikasi:', error);
            }
        }


        // ---------------- TABLE ROW ELEMENT ----------------
        function createRowElement(idx, s = {}) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td class="col-idx" style="text-align:center;font-weight:600;">${idx}</td>
        <td><input class="col-name form-control" value="${escapeHtml(s.name || '')}" placeholder="Nama komponen"></td>
        <td><input class="col-number form-control" value="${escapeHtml(s.number || '')}" placeholder="Nomor part"></td>
        <td><input class="col-price form-control" value="${fmt(parseNumber(s.price || 0))}" style="text-align:right;"></td>
        <td>
            <select class="col-availability form-control">
                <option value="TAM" ${s.availability === 'TAM' ? 'selected' : ''}>TAM</option>
                <option value="BO" ${s.availability === 'BO' ? 'selected' : ''}>BO</option>
                <option value="ADA" ${s.availability === 'ADA' ? 'selected' : ''}>ADA</option>
                <option value="KOSONG" ${s.availability === 'KOSONG' ? 'selected' : ''}>KOSONG</option>
            </select>
        </td>
        <td><input type="number" min="1" class="col-qty form-control" value="${s.qty || 1}" style="text-align:center;"></td>
        <td><input class="col-total form-control" value="${fmt((parseNumber(s.price || 0) * (s.qty || 1)))}" readonly style="text-align:right;"></td>
        <td style="text-align:center;">
            <button class="btn btn-xs btn-warning btn-clear-row btn-estimasi">🧹</button>
            <button class="btn btn-xs btn-danger btn-del-row btn-estimasi">❌</button>
        </td>
    `;
            return tr;
        }


        // ---------------- ESTIMASI WRAPPER ----------------
        function renderEstimasiWrapper(row, spareparts) {
            // Remove existing wrapper
            document.getElementById('estimasi-wrapper')?.remove();

            const portlet = document.querySelector('.portlet-body') || document.body;

            let komponenArr = [];
            try {
                komponenArr = typeof row.komponen === 'string' ?
                    JSON.parse(row.komponen) :
                (row.komponen || []);
            } catch (e) {
                console.warn('Error parsing komponen:', e);
            }

            const komponenTxt = komponenArr.join(', ');

            const wrap = document.createElement('div');
            wrap.id = 'estimasi-wrapper';
            wrap.innerHTML = `
                <h4>
                    📋 Detail Estimasi (ID: ${row.id})
                    <button id="btn-toggle-detail" class="btn btn-xs btn-info btn-estimasi">⬆️ Collapse</button>
                </h4>
                <div id="detail-info">
                    <table>
                        <tr>
                            <td>
                                <div><label>🚗 Jenis Mobil:</label><input id="inp-jenis" class="form-control" value="${escapeHtml(row.jenis_mobil || '')}"></div>
                                <div style="margin-top:10px;"><label>🔖 Nomor Polisi:</label><input id="inp-nopol" class="form-control" value="${escapeHtml(row.nopol || '')}"></div>
                                <div style="margin-top:10px;"><label>🆔 Nomor Rangka:</label><input id="inp-rangka" class="form-control" value="${escapeHtml(row.nomor_rangka || '')}"></div>
                                <div><label>👨‍💼 Service Advisor:</label><div style="padding:8px 12px;background:#f8f9fa;border-radius:4px;">${escapeHtml(row.service_advisor || '-')}</div></div>
                            </td>
                            <td>
                                <div><label>📝 catatan teknisi:</label><div style="padding:8px 12px;background:#f8f9fa;border-radius:4px;">${escapeHtml(row.keterangan || '-')}</div></div>
                                <div style="margin-top:10px;"><label>👨‍🔧 Teknisi:</label><div style="padding:8px 12px;background:#f8f9fa;border-radius:4px;">${escapeHtml(row.teknisi?.full_name || '-')}</div></div>
                                <div style="margin-top:10px;"><label>📝 Komponen:</label><div style="padding:8px 12px;background:#f8f9fa;border-radius:4px;">${escapeHtml(komponenTxt || '-')}</div></div>
                                <div style="margin-top:10px;"><label>📒 Catatan Sparepart:</label><textarea id="inp-catatan" class="form-control" rows="2">${escapeHtml(row.catatan_sparepart || '')}</textarea></div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div style="margin-bottom:15px;">
                    <button id="btn-add-row" class="btn btn-sm btn-primary btn-estimasi">➕ Tambah Baris</button>
                    <span style="margin-left:10px;color:#666;font-size:12px;">Klik pada row di tabel part master untuk menambahkan item</span>
                </div>
                <div class="estimasi-table">
                <div class="estimasi-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th width="5%">#</th>
                                <th width="25%">Nama Komponen</th>
                                <th width="15%">Nomor Part</th>
                                <th width="15%">Harga</th>
                                <th width="15%">Ketersediaan</th>
                                <th width="10%">Jumlah</th>
                                <th width="10%">Total</th>
                                <th width="5%"></th>
                            </tr>
                        </thead>
                        <tbody id="sparepart-body"></tbody>
                        <tfoot>
                            <tr>
                                <td colspan="6" style="text-align:right;font-weight:bold;padding:15px 10px;">Grand Total:</td>
                                <td colspan="2" id="grand-total" style="padding:15px 10px;">0</td>
                            </tr>
                        </tfoot>
                    </table>
                    </div>
                </div>
                <div style="margin-top:20px;text-align:center;">
                    <button id="btn-save" class="btn btn-success btn-estimasi" style="padding:10px 30px;">💾 Simpan Estimasi</button>
                </div>
            `;

            portlet.appendChild(wrap);

            const tbody = wrap.querySelector('#sparepart-body');

            // --- AUTO COLLAPSE SETELAH 10 DETIK ---
            const toggleDetail = () => {
                const detailInfo = wrap.querySelector('#detail-info');
                const toggleBtn = wrap.querySelector('#btn-toggle-detail');

                if (detailInfo.style.display === 'none') {
                    // Expand
                    detailInfo.style.display = '';
                    toggleBtn.innerHTML = '⬆️ Collapse';
                } else {
                    // Collapse
                    detailInfo.style.display = 'none';
                    toggleBtn.innerHTML = '⬇️ Expand';
                }
            };

            // --- SIMPLE EVENT LISTENER ---
            wrap.querySelector('#btn-toggle-detail').addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Penting: hentikan propagasi
                toggleDetail();
            });

            // --- AUTO COLLAPSE SETELAH 10 DETIK ---
            setTimeout(() => {
                const detailInfo = wrap.querySelector('#detail-info');
                const toggleBtn = wrap.querySelector('#btn-toggle-detail');

                // Only collapse if not already collapsed
                if (detailInfo.style.display !== 'none') {
                    detailInfo.style.display = 'none';
                    toggleBtn.innerHTML = '⬇️ Expand';
                    showAutoCollapseNotification(wrap);
                }
            }, 10000);

            wrap.querySelector('#btn-toggle-detail').addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Toggle button clicked'); // Debug log

                const detailInfo = wrap.querySelector('#detail-info');
                const toggleBtn = wrap.querySelector('#btn-toggle-detail');

                console.log('Current display:', detailInfo.style.display); // Debug log

                if (detailInfo.style.display === 'none') {
                    detailInfo.style.display = '';
                    toggleBtn.innerHTML = '⬆️ Collapse';
                    console.log('Expanded'); // Debug log
                } else {
                    detailInfo.style.display = 'none';
                    toggleBtn.innerHTML = '⬇️ Expand';
                    console.log('Collapsed'); // Debug log
                }
            });

            // Populate with existing data
            (spareparts || []).forEach((s, i) => {
                tbody.appendChild(createRowElement(i + 1, s));
            });

            // Add empty row if no data
            // Tambahkan otomatis baris dari field Komponen
            if (tbody.children.length === 0) {
                tbody.appendChild(createRowElement(1, {}));
            }

            // --- PERBAIKAN: AUTO FILL DARI FIELD KOMPONEN ---
            if (komponenArr.length > 0 && spareparts.length === 0) {
                // Hanya isi otomatis jika spareparts kosong (data baru)
                tbody.innerHTML = ''; // kosongkan dulu
                komponenArr.forEach((komp, i) => {
                    const tr = createRowElement(i + 1, { name: komp });
                    tbody.appendChild(tr);
                });
            } else if (spareparts.length > 0) {
                // Jika sudah ada data spareparts dari database, gunakan data tersebut
                tbody.innerHTML = ''; // kosongkan dulu
                spareparts.forEach((s, i) => {
                    const tr = createRowElement(i + 1, s);
                    tbody.appendChild(tr);
                });

                // Tambahkan baris kosong untuk komponen yang belum ada di spareparts
                komponenArr.forEach((komp, i) => {
                    // Cek apakah komponen ini sudah ada di spareparts
                    const existingItem = spareparts.find(item => item.name === komp);
                    if (!existingItem) {
                        const tr = createRowElement(tbody.children.length + 1, { name: komp });
                        tbody.appendChild(tr);
                    }
                });
            }

            // Row update functions
            function updateRow(tr) {
                const price = parseNumber(tr.querySelector('.col-price').value);
                const qty = Math.max(1, parseNumber(tr.querySelector('.col-qty').value));
                tr.querySelector('.col-total').value = fmt(price * qty);
                updateGrandTotal();
            }

            function updateGrandTotal() {
                let sum = 0;
                tbody.querySelectorAll('tr').forEach(tr => {
                    sum += parseNumber(tr.querySelector('.col-total').value);
                });
                wrap.querySelector('#grand-total').textContent = fmt(sum);
            }

            function updateIndices() {
                [...tbody.querySelectorAll('tr')].forEach((tr, i) => {
                    tr.querySelector('.col-idx').textContent = i + 1;
                });
            }

            // Event listeners for table
            tbody.addEventListener('input', ev => {
                const tr = ev.target.closest('tr');
                if (ev.target.classList.contains('col-price') || ev.target.classList.contains('col-qty')) {
                    updateRow(tr);
                }
            });

            tbody.addEventListener('click', ev => {
                // Hapus baris
                if (ev.target.classList.contains('btn-del-row')) {
                    ev.preventDefault();
                    if (tbody.children.length > 1) {
                        ev.target.closest('tr').remove();
                        updateIndices();
                        updateGrandTotal();
                    } else {
                        alert('Minimal harus ada satu baris data');
                    }
                }

                // Kosongkan baris (reset tapi tetap simpan Nama Komponen)
                if (ev.target.classList.contains('btn-clear-row')) {
                    ev.preventDefault();
                    const tr = ev.target.closest('tr');
                    tr.querySelector('.col-number').value = '';
                    tr.querySelector('.col-price').value = '0';
                    tr.querySelector('.col-availability').value = 'TAM';
                    tr.querySelector('.col-qty').value = 1;
                    tr.querySelector('.col-total').value = '0';
                    updateGrandTotal();
                }
            });

            wrap.querySelector('#btn-add-row').addEventListener('click', ev => {
                ev.preventDefault();
                tbody.appendChild(createRowElement(tbody.children.length + 1, {}));
                updateGrandTotal();
            });

            wrap.querySelector('#btn-toggle-detail').addEventListener('click', () => {
                const detailInfo = wrap.querySelector('#detail-info');
                const isVisible = detailInfo.style.display !== 'none';
                detailInfo.style.display = isVisible ? 'none' : '';
                wrap.querySelector('#btn-toggle-detail').textContent =
                    isVisible ? '⬇️ Expand' : '⬆️ Collapse';
            });

            wrap.querySelector('#btn-save').addEventListener('click', async () => {
                const jenis = wrap.querySelector('#inp-jenis').value.trim();
                const nopol = wrap.querySelector('#inp-nopol').value.trim();
                const norangka = wrap.querySelector('#inp-rangka').value.trim();

                if (!jenis || !nopol || !norangka) {
                    alert('Harap isi Jenis Mobil, Nomor Polisi, dan Nomor Rangka');
                    return;
                }

                // --- PERBAIKAN: AMBIL DATA DARI TABEL DAN UPDATE KOMPONEN ---
                const rows = [...tbody.querySelectorAll('tr')].map(tr => ({
                    name: tr.querySelector('.col-name').value.trim(),
                    number: tr.querySelector('.col-number').value.trim(),
                    price: parseNumber(tr.querySelector('.col-price').value),
                    availability: tr.querySelector('.col-availability').value,
                    qty: parseNumber(tr.querySelector('.col-qty').value) || 1,
                    total: parseNumber(tr.querySelector('.col-total').value)
                }));

                // Filter baris yang memiliki nama komponen (tidak kosong)
                const validRows = rows.filter(row => row.name && row.name !== '');

                if (validRows.length === 0) {
                    alert('Harap isi minimal satu komponen dengan nama');
                    return;
                }

                // --- PERBAIKAN: UPDATE FIELD KOMPONEN DENGAN NAMA KOMPONEN BARU ---
                const komponenBaru = validRows.map(row => row.name);

                const total_harga = validRows.reduce((sum, r) => sum + (r.total || 0), 0);

                const payload = {
                    jenis_mobil: jenis,
                    nopol: nopol,
                    nomor_rangka: norangka,
                    catatan_sparepart: wrap.querySelector('#inp-catatan').value || '',
                    komponen: komponenBaru, // ✅ PERBAIKAN: Update field komponen
                    sparepart_data: JSON.stringify(validRows), // ✅ PERBAIKAN: Hanya simpan baris valid
                    total_harga: total_harga,
                    status: 'completed',
                    updated_at: new Date().toISOString()
                };

                try {
                    // Tampilkan loading state
                    const saveBtn = wrap.querySelector('#btn-save');
                    const originalText = saveBtn.innerHTML;
                    saveBtn.innerHTML = '⏳ Menyimpan...';
                    saveBtn.disabled = true;

                    const { error } = await supabase
                    .from('estimasi')
                    .update(payload)
                    .eq('id', row.id);

                    if (error) {
                        throw error;
                    }

                    // ✅ SUKSES: Hilangkan wrapper estimasi
                    wrap.style.opacity = '0.7';

                    // Tampilkan pesan sukses sebentar
                    alert('✅ Estimasi berhasil disimpan!\n\n📊 Komponen yang disimpan: ' + komponenBaru.join(', '));

                    // Tunggu sebentar lalu hilangkan wrapper
                    setTimeout(() => {
                        wrap.remove();

                        // Tampilkan pesan konfirmasi bahwa proses selesai
                        const successMessage = document.createElement('div');
                        successMessage.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 20px 0;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                ">
                    <h4 style="margin: 0 0 10px 0;">✅ Estimasi Selesai</h4>
                    <p style="margin: 0; opacity: 0.9;">
                        Estimasi untuk ${escapeHtml(nopol)} telah disimpan.<br>
                        <strong>${komponenBaru.length} komponen</strong> tersimpan di database.
                    </p>
                </div>
            `;

                        // Tempatkan pesan di posisi yang sama dengan wrapper sebelumnya
                        portlet.insertBefore(successMessage, portlet.firstChild);

                        // Hilangkan pesan setelah 3 detik
                        setTimeout(() => {
                            successMessage.remove();
                        }, 3000);

                    }, 500);

                    // Refresh notifikasi
                    await loadNotifikasi();

                } catch (error) {
                    console.error('Error saving estimation:', error);
                    alert('❌ Gagal menyimpan estimasi: ' + error.message);

                    // Reset button state jika error
                    const saveBtn = wrap.querySelector('#btn-save');
                    saveBtn.innerHTML = '💾 Simpan Estimasi';
                    saveBtn.disabled = false;
                }
            });

            // Initialize row values and totals
            tbody.querySelectorAll('tr').forEach(tr => updateRow(tr));

            // Attach part master grid click handler
            attachPartMasterRowClick();
        }

        // ---------------- PART MASTER GRID INTEGRATION ----------------
        function attachPartMasterRowClick() {
            const grid = document.querySelector('#PartMasterGrid .k-grid-content');
            if (!grid) {
                // Observe for grid element if not yet available
                const obs = new MutationObserver(() => {
                    const el = document.querySelector('#PartMasterGrid .k-grid-content');
                    if (el) {
                        obs.disconnect();
                        addGridClickHandler(el);
                    }
                });
                obs.observe(document.body, { childList: true, subtree: true });
                return;
            }
            addGridClickHandler(grid);
        }

        function addGridClickHandler(el) {
            // Remove existing listener to prevent duplicates
            el.removeEventListener('click', partClickHandler);
            el.addEventListener('click', partClickHandler);
        }

        // Fungsi untuk menampilkan notifikasi auto-collapse
        function showAutoCollapseNotification(wrap) {
            // Hapus notifikasi sebelumnya jika ada
            const existingNotif = wrap.querySelector('.auto-collapse-notif');
            if (existingNotif) existingNotif.remove();

            const notif = document.createElement('div');
            notif.className = 'auto-collapse-notif';
            notif.innerHTML = `
        <div style="
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 8px 12px;
            border-radius: 4px;
            margin: 10px 0;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        ">
            <span>⚠️ Detail informasi dicollapse otomatis. Klik "Expand" untuk melihat.</span>
            <button class="btn-close-notif" style="
                background: none;
                border: none;
                font-size: 14px;
                cursor: pointer;
                color: #856404;
            ">✕</button>
        </div>
    `;

            // Sisipkan notifikasi setelah header
            const header = wrap.querySelector('h4');
            header.parentNode.insertBefore(notif, header.nextSibling);

            // Event listener untuk tombol close
            notif.querySelector('.btn-close-notif').addEventListener('click', () => {
                notif.remove();
            });

            // Auto remove notifikasi setelah 5 detik
            setTimeout(() => {
                if (notif.parentNode) {
                    notif.remove();
                }
            }, 5000);
        }

        function partClickHandler(ev) {
            // cari baris terdekat
            const tr = ev.target.closest('tr');
            if (!tr) return;

            // cari sel (td) yang "mengandung" target klik dengan cara yang robust
            let td = ev.target.closest('td');
            if (!td) {
                // fallback: cari child td dari tr yang memang mengandung ev.target
                td = Array.from(tr.children).find(c => c.contains(ev.target)) || tr.children[0];
            }

            // jika tetap tidak ketemu, keluar
            if (!td) return;

            // hitung index kolom (0-based)
            const cellIndex = Array.from(tr.children).indexOf(td);
            if (cellIndex === -1) return;

            // => EXCLUDE: jika kolom ke-3 (index 2) diklik, jangan lakukan salin
            if (cellIndex > 1) {
                // optional: beri efek kecil untuk memberi tahu user klik di kolom yang di-exclude
                // td.style.transition = 'background .2s';
                // td.style.background = '#fff3cd';
                // setTimeout(()=> td.style.background = '', 300);
                return;
            }

            // sekarang ambil nilai dari sel sesuai struktur grid-mu
            const cells = tr.querySelectorAll('td');
            const partNo = (cells[0]?.innerText || '').trim();
            const partName = (cells[1]?.innerText || '').trim();
            const stockCPD = (cells[5]?.innerText || '').trim();
            const retail = (cells[6]?.innerText || '').trim();

            // pastikan wrapper estimasi terbuka
            const wrap = document.getElementById('estimasi-wrapper');
            if (!wrap) {
                alert('⚠️ Silahkan buka estimasi terlebih dahulu dari notifikasi dropdown');
                return;
            }

            const tbody = wrap.querySelector('#sparepart-body');
            let target = [...tbody.querySelectorAll('tr')].find(r => !(r.querySelector('.col-number').value || '').trim());

            if (!target) {
                tbody.appendChild(createRowElement(tbody.children.length + 1, {}));
                target = tbody.lastChild;
            }

            // isi kolom sesuai
            target.querySelector('.col-number').value = partNo;
            // gunakan parseNumber/ fmt yang sudah kamu miliki
            target.querySelector('.col-price').value = fmt(parseNumber(retail));

            // ketersediaan otomatis dari Stock CPD
            if (stockCPD.toLowerCase().includes('not available')) {
                target.querySelector('.col-availability').value = 'BO';
            } else {
                target.querySelector('.col-availability').value = 'TAM';
            }

            target.querySelector('.col-qty').value = 1;

            // trigger update total
            const inputEvent = new Event('input', { bubbles: true });
            target.querySelector('.col-price').dispatchEvent(inputEvent);

            // highlight efek sukses
            const originalBg = target.style.backgroundColor;
            target.style.backgroundColor = '#d4edda';
            setTimeout(() => {
                target.style.backgroundColor = originalBg;
            }, 1000);
        }


    })();
})();
