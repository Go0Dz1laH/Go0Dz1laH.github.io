/* ============================================================
   script.js — SPA Navigation, Dynamic Data & Interactivity
   ============================================================ */

// ── Personal Data (EDIT THIS SECTION) ──────────────────────
const PROFILE = {
  name: "Ramin Maghami",
  title: "Cloud & Full-Stack Architect",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=Ramin&backgroundColor=0a0c15",
  currentFocus: {
    project: "Building Future",
    description: "Architecting tomorrow's web today",
    progress: 88,
    tasks: { resources: 15, edits: 24 }
  },
  weeklyCommits: [40, 65, 50, 95, 80, 140, 110],
  commitDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

const SKILLS = [
  { name: "Google Cloud", sub: "Monitor & Manage", pct: 100, color: "#4285F4", icon: "☁️" },
  { name: "Python", sub: "Automation / ML", pct: 95, color: "#FFD43B", icon: "🐍" },
  { name: "Linux Unhatched", sub: "OS Administration", pct: 90, color: "#FCC624", icon: "🐧" },
  { name: "Networking", sub: "Cisco Basics", pct: 85, color: "#1BA0D7", icon: "🌐" },
  { name: "ISC2 Candidate", sub: "Cybersecurity", pct: 85, color: "#D11F36", icon: "🔒" },
  { name: "Premiere Pro", sub: "Video Editing", pct: 100, color: "#9999FF", icon: "🎬" },
  { name: "After Effects", sub: "Motion Graphics", pct: 95, color: "#D8A4FF", icon: "✨" },
  { name: "Vibe Coding", sub: "AI Assisted Dev", pct: 100, color: "#A78BFA", icon: "⚡" },
];

const PIPELINE = [
  { id: "01", title: "AWS Solutions Architect", status: "In Progress", pct: 65, desc: "Advanced cloud architecture certification track." },
  { id: "02", title: "Open Source Leadership", status: "Planning", pct: 25, desc: "Contributing to Kubernetes and CNCF." },
  { id: "03", title: "System Design Mentorship", status: "Development", pct: 40, desc: "Guiding developers through complex scaling." },
  { id: "04", title: "Tech Blog Publication", status: "Concept", pct: 10, desc: "Writing deep dives into DevSecOps." },
  { id: "05", title: "Public Speaking", status: "Testing", pct: 50, desc: "Preparing talks for cloud-native conferences." },
];

const PROJECTS = [
  { id: "01", title: "Project Alpha", status: "Coming Soon", pct: 15, desc: "Stealth startup AI MVP." },
  { id: "02", title: "Project Beta", status: "Coming Soon", pct: 5, desc: "Next-gen developer tooling environment." },
  { id: "03", title: "Project Gamma", status: "Coming Soon", pct: 0, desc: "Global distributed edge database." },
  { id: "04", title: "Project Delta", status: "Coming Soon", pct: 0, desc: "Full 3D WebGL interactive experience." },
  { id: "05", title: "Project Epsilon", status: "Coming Soon", pct: 0, desc: "Zero-Trust Mesh Network router." },
];

const ACTIVITY = [
  { text: "Merged PR on Project Alpha", sub: "feature/ui", color: "#34d399", time: "2h ago" },
  { text: "Wrote React component library", sub: "standardise modules", color: "#38bdf8", time: "5h ago" },
  { text: "Learned new library — Zod + tRPC", sub: "Zod / tRPC Record", color: "#fbbf24", time: "1d ago" },
  { text: "Reviewed Firebase integration", sub: "configure auth + hosting", color: "#f87171", time: "2d ago" },
];

const CERTIFICATES_PLACEHOLDER_COUNT = 6;

const CONTACT = {
  email: "go0dz1lah@dev.io",
  github: "github.com/go0dz1lah",
  linkedin: "linkedin.com/in/raminmaghami",
  twitter: "x.com/go0dz1lah",
};

// ── SPA Navigation ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = document.querySelectorAll(".view-section");

  function navigate(target) {
    sections.forEach(s => s.classList.remove("active"));
    navLinks.forEach(l => l.classList.remove("active"));
    const section = document.getElementById(target);
    if (section) section.classList.add("active");
    navLinks.forEach(l => { if (l.dataset.nav === target) l.classList.add("active"); });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navigate(link.dataset.nav);
    });
  });

  // Default view
  navigate("dashboard");

  // ── Render Dynamic Content ───────────────────────────────
  renderProfile();
  renderCircularProgress();
  renderSkills();
  renderPipeline();
  renderProjectsPage();
  renderSkillsPage();
  renderCertificates();
  renderContact();
  animateOnScroll();

  // Async initializations
  fetchGitHubActivity();
  initGitHubStatsFallback();
  initMatrixBackground();
});

// ── Profile ────────────────────────────────────────────────
function renderProfile() {
  const el = document.getElementById("profile-area");
  if (!el) return;
  el.innerHTML = `
    <img src="${PROFILE.avatar}" alt="${PROFILE.name}, ${PROFILE.title}" class="w-20 h-20 rounded-full border-2 border-white/10 mx-auto mb-3 bg-white/5" width="80" height="80" loading="eager" />
    <h1 class="text-white font-semibold text-sm">${PROFILE.name}</h1>
    <p class="text-xs text-gray-500 mt-0.5">${PROFILE.title}</p>
  `;
}

// ── GitHub Statistics fallback (when Vercel image fails) ───
function initGitHubStatsFallback() {
  const img = document.getElementById("github-stats-img");
  const fallbackEl = document.getElementById("github-stats-fallback");
  if (!img || !fallbackEl) return;
  img.addEventListener("error", function onError() {
    img.remove();
    fallbackEl.classList.remove("hidden");
    loadGitHubStatsCard("go0dz1lah", fallbackEl);
  });
}

async function loadGitHubStatsCard(username, container) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    container.innerHTML = `
      <div class="github-stats-card rounded-xl p-4 w-full text-left space-y-3">
        <div class="flex items-center gap-3 mb-3">
          <img src="${data.avatar_url}" alt="" class="w-12 h-12 rounded-full border border-white/10 flex-shrink-0" width="48" height="48" loading="lazy" />
          <div class="min-w-0">
            <p class="text-white font-semibold text-sm truncate">${data.login}</p>
            <p class="text-gray-500 text-xs truncate">${data.name || ""}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="bg-white/5 rounded-lg py-2">
            <p class="text-white font-bold text-sm">${data.public_repos ?? 0}</p>
            <p class="text-gray-500 text-[10px]">Repos</p>
          </div>
          <div class="bg-white/5 rounded-lg py-2">
            <p class="text-white font-bold text-sm">${data.followers ?? 0}</p>
            <p class="text-gray-500 text-[10px]">Followers</p>
          </div>
          <div class="bg-white/5 rounded-lg py-2">
            <p class="text-white font-bold text-sm">${data.following ?? 0}</p>
            <p class="text-gray-500 text-[10px]">Following</p>
          </div>
        </div>
        <a href="${data.html_url}" target="_blank" rel="noopener noreferrer" class="text-violet-400 text-xs font-medium hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 rounded">View on GitHub →</a>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="github-stats-card text-gray-500 text-xs p-4">
        <p class="text-white font-medium mb-1">GitHub Statistics</p>
        <p>Stats temporarily unavailable.</p>
        <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" class="text-violet-400 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400 rounded mt-2 inline-block">View Profile</a>
      </div>
    `;
  }
}

// ── Circular Progress ──────────────────────────────────────
function renderCircularProgress() {
  const el = document.getElementById("circular-progress");
  if (!el) return;
  const pct = PROFILE.currentFocus.progress;
  const offset = 226 - (226 * pct / 100);
  el.innerHTML = `
    <div class="circular-progress">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle class="track" cx="40" cy="40" r="36"/>
        <circle class="fill" cx="40" cy="40" r="36"
          stroke="url(#grad)" style="stroke-dashoffset:${offset}"/>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#a78bfa"/>
            <stop offset="100%" stop-color="#38bdf8"/>
          </linearGradient>
        </defs>
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">${pct}%</span>
    </div>
  `;

  // Focus card info
  const info = document.getElementById("focus-info");
  if (!info) return;
  info.innerHTML = `
    <div class="flex items-center gap-2 mb-3">
      <span class="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
        <i data-lucide="cpu" class="w-4 h-4 text-violet-400 font-bold pulse-icon"></i>
      </span>
      <div>
        <p class="text-white text-sm font-bold tracking-wide">${PROFILE.currentFocus.project}</p>
        <p class="text-[11px] text-gray-500">${PROFILE.currentFocus.description}</p>
      </div>
    </div>
    <div class="progress-bar mb-3 relative overflow-hidden bg-white/5">
      <div class="progress-bar-fill bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 absolute top-0 left-0 h-full" style="width:${pct}%"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full transform -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
    <p class="text-fuchsia-400 text-xs font-semibold mb-3 tracking-widest">${pct}%</p>
    <div class="flex gap-6 text-[11px] text-gray-500">
      <span>Resources <b class="text-white ml-1">${PROFILE.currentFocus.tasks.resources}</b></span>
      <span>Edits <b class="text-white ml-1">${PROFILE.currentFocus.tasks.edits}</b></span>
    </div>
  `;
  lucide.createIcons();
}

// removed renderCommitChart block from JS logic

// ── Skills Grid ────────────────────────────────────────────
function renderSkills() {
  const el = document.getElementById("skills-grid");
  if (!el) return;
  el.innerHTML = SKILLS.map(s => `
    <div class="glass-sm p-3 flex items-center gap-3">
      <div class="skill-icon-box" style="background:${s.color}20;color:${s.color}">${s.icon}</div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between items-center">
          <span class="text-white text-xs font-semibold">${s.name}</span>
          <span class="text-[10px] text-gray-500">${s.pct}%</span>
        </div>
        <p class="text-[10px] text-gray-600 truncate">${s.sub}</p>
        <div class="progress-bar mt-1.5">
          <div class="progress-bar-fill" style="width:${s.pct}%;background:${s.color}"></div>
        </div>
      </div>
    </div>
  `).join("");
}

// ── Development Pipeline (Dashboard) ─────────────────────────────
function renderPipeline() {
  const el = document.getElementById("projects-list");
  if (!el) return;
  el.innerHTML = PIPELINE.map((p, i) => `
    <div class="glass-sm p-4 animate-on-scroll border border-white/5 hover:border-violet-500/30 transition-all duration-300" style="animation-delay: ${i * 100}ms;">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-mono text-gray-500 w-6">${p.id}</span>
        <span class="text-[10px] text-violet-400 tracking-widest uppercase">${p.status}</span>
      </div>
      <h4 class="text-white text-sm font-semibold mb-3 truncate leading-tight">${p.title}</h4>
      <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-1000" style="width: 0%" data-target-width="${p.pct}%"></div>
      </div>
    </div>
  `).join("");

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll("#projects-list .bg-gradient-to-r").forEach(bar => {
      bar.style.width = bar.dataset.targetWidth;
    });
  }, 300);
}

// ── Projects Page (Full Grid) ──────────────────────────────
function renderProjectsPage() {
  const pg = document.getElementById("projects-full-grid");
  if (!pg) return;
  pg.innerHTML = PROJECTS.map((p, i) => `
    <div class="glass-sm p-6 animate-on-scroll border border-white/5 hover:border-violet-500/30 transition-all duration-300" style="animation-delay: ${i * 100}ms;">
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-mono text-gray-500 w-8">${p.id}</span>
        <span class="text-xs font-bold text-violet-400 tracking-widest uppercase px-3 py-1 bg-violet-500/10 rounded-full border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">${p.status}</span>
      </div>
      <h4 class="text-white text-lg font-semibold mb-2">${p.title}</h4>
      <p class="text-sm text-gray-400 mb-6 h-10">${p.desc}</p>
      
      <div class="flex justify-between text-xs text-gray-500 mb-2">
        <span>Progress Tracker</span>
        <span class="text-fuchsia-400 font-mono">${p.pct}%</span>
      </div>
      <div class="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
        <div class="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 transition-all duration-1000 absolute left-0" style="width: 0%" data-target-width="${p.pct}%"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full transform -translate-x-full animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  `).join("");

  setTimeout(() => {
    document.querySelectorAll("#projects-full-grid .bg-gradient-to-r").forEach(bar => {
      bar.style.width = bar.dataset.targetWidth;
    });
  }, 300);
}

// ── Skills Page (Full Grid) ────────────────────────────────
function renderSkillsPage() {
  const sg = document.getElementById("skills-full-grid");
  if (!sg) return;
  sg.innerHTML = SKILLS.map(s => `
    <div class="glass p-5 flex items-start gap-4 animate-on-scroll">
      <div class="skill-icon-box text-lg" style="background:${s.color}20;color:${s.color}">${s.icon}</div>
      <div class="flex-1">
        <div class="flex justify-between items-center mb-1">
          <span class="text-white text-sm font-semibold">${s.name}</span>
          <span class="text-xs text-gray-500">${s.pct}%</span>
        </div>
        <p class="text-xs text-gray-600 mb-2">${s.sub}</p>
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${s.pct}%;background:${s.color}"></div>
        </div>
      </div>
    </div>
  `).join("");
}

// ── Live GitHub API Data ──────────────────────────────────────
async function fetchGitHubActivity() {
  const activityEl = document.getElementById("activity-list");
  const username = "go0dz1lah";

  try {
    const res = await fetch(`https://api.github.com/users/${username}/events/public`);
    if (!res.ok) throw new Error("API Limit or Error");
    const events = await res.json();

    // Parse recent valid events (Push, Issues, PRs)
    let processed = 0;
    let html = "";

    // Also track commits per day for the chart
    const commitCounts = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date().getDay(); // 0 is Sunday

    for (const ev of events) {
      if (processed >= 4) break;

      let title = "";
      let sub = ev.repo.name;
      let color = "#38bdf8";

      if (ev.type === "PushEvent") {
        title = `Pushed code to repository`;
        const commitsCount = (ev.payload.commits && ev.payload.commits.length) ? ev.payload.commits.length : 0;
        const branchName = ev.payload.ref ? ev.payload.ref.split('/').pop() : 'main';
        sub = `branch: ${branchName} • ${commitsCount} commits`;
        color = "#a78bfa";
        processed++;
      } else if (ev.type === "PullRequestEvent") {
        title = `${ev.payload.action} Pull Request`;
        color = "#34d399";
        processed++;
      } else if (ev.type === "IssuesEvent") {
        title = `${ev.payload.action} Issue`;
        color = "#f87171";
        processed++;
      } else if (ev.type === "WatchEvent") {
        title = `Starred repository`;
        color = "#fbbf24";
        processed++;
      }

      // Attempt to map commits to days backwards
      if (ev.type === "PushEvent") {
        const evDate = new Date(ev.created_at);
        const dayIdx = evDate.getDay(); // 0-6
        // Map 0=Sun to standard Mon-Sun array (0=Mon, 6=Sun)
        const mappedIdx = dayIdx === 0 ? 6 : dayIdx - 1;
        const commitsCount = (ev.payload.commits && ev.payload.commits.length) ? ev.payload.commits.length : 0;
        commitCounts[mappedIdx] += commitsCount;
      }

      if (title) {
        const dateStr = new Date(ev.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' });
        html += `
          <div class="flex gap-3 mb-4 last:mb-0 animate-on-scroll">
            <div class="flex flex-col items-center">
              <div class="timeline-dot" style="background:${color};box-shadow:0 0 6px ${color}"></div>
              <div class="w-px flex-1 bg-white/5 mt-1"></div>
            </div>
            <div>
              <p class="text-white text-xs font-medium leading-snug">${title}</p>
              <p class="text-[10px] text-gray-500 mt-0.5 truncate w-48">${sub}</p>
              <p class="text-[10px] text-gray-700 mt-0.5">${dateStr}</p>
            </div>
          </div>
        `;
      }
    }

    if (html !== "") {
      activityEl.innerHTML = html;
    }

  } catch (err) {
    console.error("GitHub API fell back to static data", err);
    renderActivityFallback();
  }
}

function renderActivityFallback() {
  const el = document.getElementById("activity-list");
  if (!el) return;
  el.innerHTML = ACTIVITY.map(a => `
    <div class="flex gap-3 mb-4 last:mb-0">
      <div class="flex flex-col items-center">
        <div class="timeline-dot" style="background:${a.color};box-shadow:0 0 6px ${a.color}"></div>
        <div class="w-px flex-1 bg-white/5 mt-1"></div>
      </div>
      <div>
        <p class="text-white text-xs font-medium leading-snug">${a.text}</p>
        <p class="text-[10px] text-gray-600 mt-0.5">${a.sub}</p>
        <p class="text-[10px] text-gray-700 mt-1">${a.time}</p>
      </div>
    </div>
  `).join("");
}

// ── Certificates (Credly Embeds) ─────────────────────
function renderCertificates() {
  const el = document.getElementById("cert-grid");
  if (!el) return;
  const badgeIds = [
    "89de1370-36a1-4739-a685-c4e183c01f71",
    "ea1d9bac-f9a1-4675-b3d8-9b4a0b2510ae",
    "52c8a52e-5f7b-432e-b55d-2889c1459a03",
    "4025f4f6-41ac-46b9-b9eb-e6f0ff6ac2bd",
    "544ef690-fc2d-4d18-98a7-85548e8e7c34"
  ];

  let html = "";
  badgeIds.forEach((id, index) => {
    html += `
      <div class="credly-slot animate-on-scroll" style="animation-delay: ${index * 100}ms;">
        <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="${id}" data-share-badge-host="https://www.credly.com"></div>
      </div>
    `;
  });
  el.innerHTML = html;

  // Need to reload the credibility embed script if we inject HTML
  const existingScript = document.getElementById("credly-embed-script");
  if (existingScript) existingScript.remove();
  const script = document.createElement("script");
  script.id = "credly-embed-script";
  script.type = "text/javascript";
  script.async = true;
  script.src = "//cdn.credly.com/assets/utilities/embed.js";
  document.body.appendChild(script);

  lucide.createIcons();
}

// ── Contact Terminal ───────────────────────────────────────
function renderContact() {
  const el = document.getElementById("terminal-body");
  if (!el) return;
  el.innerHTML = `
    <p><span class="prompt">~/contact</span> <span class="text-gray-600">$</span> cat info.json</p>
    <br/>
    <p>{</p>
    <p class="ml-4"><span class="key">"name"</span>:    <span class="str">"${PROFILE.name}"</span>,</p>
    <p class="ml-4"><span class="key">"role"</span>:    <span class="str">"${PROFILE.title}"</span>,</p>
    <p class="ml-4"><span class="key">"email"</span>:   <a href="mailto:${CONTACT.email}" class="str hover:!text-cyan-400">"${CONTACT.email}"</a>,</p>
    <p class="ml-4"><span class="key">"github"</span>:  <a href="https://${CONTACT.github}" target="_blank" class="str hover:!text-cyan-400">"${CONTACT.github}"</a>,</p>
    <p class="ml-4"><span class="key">"linkedin"</span>: <a href="https://${CONTACT.linkedin}" target="_blank" class="str hover:!text-cyan-400">"${CONTACT.linkedin}"</a>,</p>
    <p class="ml-4"><span class="key">"twitter"</span>:  <a href="https://${CONTACT.twitter}" target="_blank" class="str hover:!text-cyan-400">"${CONTACT.twitter}"</a></p>
    <p>}</p>
    <br/>
    <p><span class="prompt">~/contact</span> <span class="text-gray-600">$</span> <span class="caret"></span></p>
  `;
}

// ── Scroll-triggered animations ────────────────────────────
function animateOnScroll() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = 1;
        e.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".glass, .glass-sm, .animate-on-scroll").forEach(el => {
    // Avoid double overriding classes that already have specific animations defined in CSS
    if (!el.classList.contains("credly-slot")) {
      el.style.opacity = 0;
      el.style.transform = "translateY(12px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    }
    observer.observe(el);
  });
}

// ── Matrix / Tech Background (low-GPU: capped particles, limited links, 60fps) ───
function initMatrixBackground() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener('resize', resize);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.baseY = y;
      this.density = (Math.random() * 30) + 1;
      this.size = Math.random() * 1.5 + 0.5;
    }
    draw() {
      ctx.fillStyle = 'rgba(167, 139, 250, 0.8)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  function initParticles() {
    particles = [];
    var numParticles = Math.min(55, Math.floor((width * height) / 16000));
    for (var i = 0; i < numParticles; i++) {
      particles.push(new Particle(Math.random() * width, Math.random() * height));
    }
  }

  var lastFrame = 0;
  var fpsLimit = 60;
  var frameInterval = 1000 / fpsLimit;

  function animate(timestamp) {
    requestAnimationFrame(animate);
    var elapsed = timestamp - lastFrame;
    if (elapsed < frameInterval) return;
    lastFrame = timestamp - (elapsed % frameInterval);

    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connect();
  }

  function connect() {
    var maxDist = 140 * 140;
    var maxLinks = 5;
    for (var a = 0; a < particles.length; a++) {
      var count = 0;
      for (var b = a + 1; b < particles.length && count < maxLinks; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var distance = dx * dx + dy * dy;
        if (distance < maxDist) {
          var opacityValue = 1 - (distance / maxDist) * 0.6;
          ctx.strokeStyle = "rgba(139, 92, 246, " + opacityValue + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          count++;
        }
      }
    }
  }

  resize();
  requestAnimationFrame(animate);
}
