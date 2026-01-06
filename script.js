// =========================
// NAVBAR RESPONSIVE & DROPDOWN
// =========================

// Ambil elemen penting
const navToggle = document.querySelector('.nav-toggle');
const navbar = document.querySelector('.navbar');

// Pastikan elemen ada dulu (biar aman kalau dipakai di halaman lain)
if (navToggle && navbar) {
  // Tombol hamburger (HP)
  navToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });

  // Dropdown klik (khusus HP)
  document.querySelectorAll('.navbar .dropdown > a').forEach(link => {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parent = this.parentElement;
        parent.classList.toggle('open');
      }
    });
  });

  // Klik di luar nav → tutup menu & dropdown (HP)
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.navbar') && !e.target.closest('.nav-toggle')) {
      navbar.classList.remove('open');
      document.querySelectorAll('.navbar .dropdown').forEach(d => d.classList.remove('open'));
    }
  });

  // Kalau layar dibesarkan (rotate HP / buka di laptop), reset nav + dropdown
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navbar.classList.remove('open');
      document.querySelectorAll('.navbar .dropdown').forEach(d => d.classList.remove('open'));
    }
  });
}

// =========================
// HERO SLIDER OTOMATIS + KALENDER
// =========================
document.addEventListener('DOMContentLoaded', function () {
  // -------------------------
  // HERO SLIDER OTOMATIS
  // -------------------------
  const slider = document.querySelector('.hero-slider');
  const dotsContainer = document.querySelector('.hero-dots');

  if (slider && dotsContainer) {
    const slides = slider.querySelectorAll('.hero-slide');
    if (slides.length) {
      let current = 0;

      // Buat titik indikator sesuai jumlah slide
      const dots = [];
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'hero-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          showSlide(index);
          resetInterval();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });

      function showSlide(index) {
        // hapus active slide & dot lama
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        // update index
        current = (index + slides.length) % slides.length;

        // aktifkan slide & dot baru
        slides[current].classList.add('active');
        dots[current].classList.add('active');
      }

      // Auto geser setiap 5 detik
      let intervalId = setInterval(() => {
        showSlide(current + 1);
      }, 5000);

      function resetInterval() {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
          showSlide(current + 1);
        }, 5000);
      }
    }
  }

  // -------------------------
  // KALENDER SIDEBAR
  // -------------------------
  const calDays = document.getElementById('cal-days');
  const calMonthYear = document.getElementById('cal-month-year');
  const btnPrev = document.getElementById('cal-prev');
  const btnNext = document.getElementById('cal-next');

  // Hanya jalan kalau elemen kalender lengkap ada (biasanya di index.html)
  if (calDays && calMonthYear && btnPrev && btnNext) {
    let currentDate = new Date();
    currentDate.setDate(1); // set ke tanggal 1 bulan ini

    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Tampilkan nama bulan & tahun
      calMonthYear.textContent = `${monthNames[month]} ${year}`;

      const today = new Date();
      const todayY = today.getFullYear();
      const todayM = today.getMonth();
      const todayD = today.getDate();

      // Hari pertama bulan ini (0 = Minggu, 1 = Senin, dst.)
      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDate = new Date(year, month + 1, 0).getDate();
      const prevLastDate = new Date(year, month, 0).getDate();

      calDays.innerHTML = '';

      // Total cell 6 minggu (6x7 = 42) supaya grid rapi
      const totalCells = 42;

      for (let i = 0; i < totalCells; i++) {
        const span = document.createElement('span');

        let dayNumber;
        // Sebelum tanggal 1 → hari di bulan sebelumnya
        if (i < firstDayIndex) {
          dayNumber = prevLastDate - firstDayIndex + 1 + i;
          span.textContent = dayNumber;
          span.className = 'other-month';
        }
        // Tanggal di bulan ini
        else if (i < firstDayIndex + lastDate) {
          dayNumber = i - firstDayIndex + 1;
          span.textContent = dayNumber;
          span.className = 'current-month';

          // Cek apakah ini hari ini
          if (year === todayY && month === todayM && dayNumber === todayD) {
            span.classList.add('today');
          }
        }
        // Setelah akhir bulan → hari di bulan berikutnya
        else {
          dayNumber = i - (firstDayIndex + lastDate) + 1;
          span.textContent = dayNumber;
          span.className = 'other-month';
        }

        calDays.appendChild(span);
      }
    }

    btnPrev.addEventListener('click', function () {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    btnNext.addEventListener('click', function () {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    // Render pertama kali
    renderCalendar();
  }
});
