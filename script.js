const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("show");
      }
    });
  });
}

// --- Login / Access Control ---
const USERS = [
  {
    no_kkj: "10001",
    password: "kkj10001",
    nama: "Jemaat Satu",
    tanggal_lahir: "2000-01-01",
    dob: "Jakarta",
    domisili: "Tangerang",
  },
  {
    no_kkj: "10002",
    password: "kkj10002",
    nama: "Jemaat Dua",
    tanggal_lahir: "1998-05-12",
    dob: "Bandung",
    domisili: "Bekasi",
  },
];

const STORAGE_KEY = "gbi_login_user";

function getUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

function updateNavAccess() {
  const user = getUser();
  const quizLink = document.getElementById("quizLink");
  const loginLink = document.getElementById("loginLink");

  if (quizLink) {
    if (user) {
      quizLink.classList.remove("disabled");
      quizLink.style.display = "";
      quizLink.href = "quiz.html";
    } else {
      quizLink.classList.add("disabled");
      quizLink.style.display = "none";
      quizLink.href = "login.html";
    }
  }

  if (loginLink) {
    if (user) {
      loginLink.textContent = "Logout";
      loginLink.href = "#";
      loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        const ok = window.confirm("Are you sure you want to log out?");
        if (!ok) return;
        clearUser();
        updateNavAccess();
        window.location.href = "index.html";
      });
    } else {
      loginLink.textContent = "Login";
      loginLink.href = "login.html";
    }
  }
}

function protectQuizPage() {
  const user = getUser();
  if (!user && window.location.pathname.endsWith("quiz.html")) {
    window.location.href = "login.html";
  }
}

function initLoginPage() {
  const form = document.getElementById("loginForm");
  const status = document.getElementById("loginStatus");
  const info = document.getElementById("loginInfo");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const noKkj = document.getElementById("noKkj").value.trim();
    const password = document.getElementById("password").value.trim();
    const found = USERS.find((u) => u.no_kkj === noKkj && u.password === password);
    if (!found) {
      status.textContent = "No KKJ atau password salah.";
      status.classList.add("error");
      info.innerHTML = "";
      return;
    }
    setUser(found);
    status.textContent = "Login berhasil.";
    status.classList.remove("error");
    info.innerHTML = `
      <div class="info-lines">
        <p><b>Nama:</b> ${found.nama}</p>
        <p><b>Tanggal Lahir:</b> ${found.tanggal_lahir}</p>
        <p><b>DoB:</b> ${found.dob}</p>
        <p><b>Domisili:</b> ${found.domisili}</p>
      </div>
    `;
    updateNavAccess();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
}

updateNavAccess();
protectQuizPage();
initLoginPage();
