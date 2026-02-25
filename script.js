/* ============================================================
   script.js — Optimized with CSS Animations & GSAP
   ============================================================ */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============ GitHub API Configuration ============
const GITHUB_USERNAME = 'go0dz1lah';
const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// ============ GitHub Data Cache ============
let githubDataCache = {
  user: null,
  repos: [],
  events: [],
  weeklyCommits: [],
  totalCommits: 0,
  lastFetch: null
};

// ============ Local Storage Cache Helpers ============
function getCachedData(key) {
  try {
    const cached = localStorage.getItem(`github_${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    // Ignore cache errors
  }
  return null;
}

function setCachedData(key, data) {
  try {
    localStorage.setItem(`github_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (e) {
    // Ignore cache errors
  }
}

// ============ Fetch Commits Per Repo (GitHub Statistics) ============
async function fetchCommitsPerRepo(repos) {
  if (!repos || !Array.isArray(repos) || repos.length === 0) {
    return { totalCommits: 0, commitsPerRepo: [] };
  }

  try {
    const cached = getCachedData('commitsPerRepo');
    if (cached) {
      console.log('Using cached commits per repo');
      return cached;
    }

    const headers = { Accept: 'application/vnd.github.v3+json' };
    let totalCommits = 0;
    const commitsPerRepo = [];

    // Fetch commits for each repo (limit to first 10 repos to avoid rate limits)
    const reposToFetch = repos.filter(r => !r.fork).slice(0, 10);

    for (const repo of reposToFetch) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?per_page=100`,
          { headers }
        );

        if (response.ok) {
          const commits = await response.json();
          const commitCount = Array.isArray(commits) ? commits.length : 0;
          totalCommits += commitCount;
          commitsPerRepo.push({
            name: repo.name,
            commits: commitCount,
            language: repo.language
          });
        }
      } catch (e) {
        console.warn(`Failed to fetch commits for ${repo.name}:`, e);
      }
    }

    const result = { totalCommits, commitsPerRepo };
    setCachedData('commitsPerRepo', result);
    console.log('Fetched commits per repo:', result);
    return result;
  } catch (error) {
    console.warn('Commits per repo fetch failed:', error);
    return { totalCommits: 0, commitsPerRepo: [] };
  }
}

// ============ Calculate Total Stars from Repos ============
function calculateTotalStars(repos) {
  if (!repos || !Array.isArray(repos)) return 0;
  return repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
}

// ============ Personal Data ============
const PROFILE = {
  name: "Ramin Maghami",
  title: "Full-Stack Developer & Cloud Architect",
  avatar: "https://github.com/go0dz1lah.png",
  currentFocus: {
    project: "Building Future",
    description: "Architecting tomorrow's web today",
    progress: 88,
    tasks: { resources: 15, edits: 24 }
  },
  github: "go0dz1lah"
};

const SKILLS = [
  { name: "Google Cloud", sub: "Monitor & Manage", pct: 100, color: "#4285F4", icon: "☁️" },
  { name: "Microsoft Windows", sub: "OS Administration", pct: 100, color: "#8b5cf6", icon: "🪟" },
  { name: "Linux", sub: "OS Administration", pct: 90, color: "#FCC624", icon: "🐧" },
  { name: "Python", sub: "Automation / ML", pct: 95, color: "#FFD43B", icon: "🐍" },
  { name: "Networking", sub: "Cisco Basics", pct: 85, color: "#1BA0D7", icon: "🌐" },
  { name: "Cybersecurity", sub: "ISC2 Candidate", pct: 85, color: "#D11F36", icon: "🔒" },
  { name: "Premiere Pro", sub: "Video Editing", pct: 100, color: "#9999FF", icon: "🎬" },
  { name: "After Effects", sub: "Motion Graphics", pct: 95, color: "#D8A4FF", icon: "✨" },
  { name: "AI Development", sub: "Vibe Coding", pct: 100, color: "#8b5cf6", icon: "⚡" },

];

const PROJECTS = [
  { id: "01", title: "Cloud Infrastructure", status: "In Progress", pct: 65, desc: "AWS/GCP multi-cloud architecture with Terraform.", tags: ["AWS", "Terraform", "Docker"] },
  { id: "02", title: "AI Assistant", status: "Development", pct: 40, desc: "LLM-powered developer assistant with RAG.", tags: ["Python", "OpenAI", "FastAPI"] },
  { id: "03", title: "Portfolio v2", status: "Complete", pct: 100, desc: "This portfolio with CSS animations.", tags: ["JavaScript", "CSS", "GSAP"] },
  { id: "04", title: "Security Scanner", status: "Planning", pct: 25, desc: "Automated vulnerability detection system.", tags: ["Python", "Security", "CI/CD"] },
  { id: "05", title: "Video Pipeline", status: "Testing", pct: 50, desc: "Automated video processing workflow.", tags: ["FFmpeg", "Node.js", "AWS"] },
  { id: "06", title: "Mesh Network", status: "Concept", pct: 10, desc: "Zero-trust mesh network router.", tags: ["Go", "Networking", "WireGuard"] },
];

const ACTIVITY = [
  { text: "Pushed to Portfolio v2", sub: "main • 3 commits", color: "#8b5cf6", time: "2h ago" },
  { text: "Created pull request", sub: "feature/physics-bg", color: "#34d399", time: "5h ago" },
  { text: "Merged cloud-infra", sub: "terraform modules", color: "#3b82f6", time: "1d ago" },
  { text: "Deployed to Vercel", sub: "production build", color: "#fbbf24", time: "2d ago" },
];

const CERTIFICATES = [
  { id: "89de1370-36a1-4739-a685-c4e183c01f71", name: "Google Cloud", issuer: "Google" },
  { id: "ea1d9bac-f9a1-4675-b3d8-9b4a0b2510ae", name: "Python", issuer: "Cisco" },
  { id: "52c8a52e-5f7b-432e-b55d-2889c1459a03", name: "Linux", issuer: "Linux Foundation" },
  { id: "4025f4f6-41ac-46b9-b9eb-e6f0ff6ac2bd", name: "Networking", issuer: "Cisco" },
  { id: "544ef690-fc2d-4d18-98a7-85548e8e7c34", name: "Cybersecurity", issuer: "ISC2" },
];

const CONTACT = {
  email: "mail@go0dz1lah.indevs.in",
  github: "github.com/go0dz1lah",
  linkedin: "linkedin.com/in/raminmaghami",
  twitter: "x.com/go0dz1lah",
};

// ============ GitHub API Functions ============
async function fetchGitHubData() {
  try {
    // Check cache first
    const cachedData = getCachedData('fullData');
    if (cachedData) {
      console.log('Using cached GitHub data');
      githubDataCache = cachedData;
      return cachedData;
    }

    const headers = { Accept: 'application/vnd.github.v3+json' };

    // Fetch user data
    const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, { headers });
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, { headers });
    const reposData = await reposResponse.json();

    // Fetch events (activity) - use more events for better commit counting
    const eventsResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=100`, { headers });
    const eventsData = await eventsResponse.json();

    // Calculate total commits from events
    let totalCommits = 0;
    const weeklyCommits = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

    if (Array.isArray(eventsData)) {
      eventsData.forEach(event => {
        if (event.type === 'PushEvent') {
          // Count commits from payload if available
          const commitCount = event.payload?.commits?.length || 1;
          totalCommits += commitCount;

          // Calculate day of week for weekly chart
          if (event.created_at) {
            const eventDate = new Date(event.created_at);
            const dayIndex = eventDate.getDay(); // 0 = Sunday
            weeklyCommits[dayIndex] += commitCount;
          }
        }
      });
    }

    // Calculate total stars from repos
    const totalStars = calculateTotalStars(reposData);

    // Fetch commits per repo for GitHub Statistics section
    const commitsData = await fetchCommitsPerRepo(Array.isArray(reposData) ? reposData : []);

    // Use commits from repos if events don't give enough data
    if (totalCommits < 5 && commitsData.totalCommits > 0) {
      totalCommits = commitsData.totalCommits;
    }

    // Cache the data
    githubDataCache = {
      user: userData,
      repos: reposData,
      events: eventsData,
      weeklyCommits,
      totalCommits,
      totalStars,
      commitsPerRepo: commitsData.commitsPerRepo,
      lastFetch: Date.now()
    };

    // Save to localStorage
    setCachedData('fullData', githubDataCache);

    return githubDataCache;
  } catch (error) {
    console.warn('GitHub API fetch failed, using fallback data:', error);
    return null;
  }
}

// Get day name from index (0 = Sunday)
function getDayName(dayIndex) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
}

// Find peak day from weekly commits
function findPeakDay(weeklyCommits) {
  if (!weeklyCommits || weeklyCommits.length === 0) return { day: 'Sun', index: 0 };
  let maxIndex = 0;
  let maxValue = weeklyCommits[0];
  weeklyCommits.forEach((value, index) => {
    if (value > maxValue) {
      maxValue = value;
      maxIndex = index;
    }
  });
  return { day: getDayName(maxIndex), index: maxIndex, value: maxValue };
}

function parseGitHubEvents(events) {
  if (!events || !Array.isArray(events)) return ACTIVITY;

  return events.slice(0, 5).map(event => {
    let text = '';
    let sub = '';
    let color = '#8b5cf6';

    switch (event.type) {
      case 'PushEvent':
        text = `Pushed to ${event.repo?.name || 'repository'}`;
        sub = `${event.payload?.ref || 'main'} • ${event.payload?.commits?.length || 1} commits`;
        color = '#8b5cf6';
        break;
      case 'CreateEvent':
        text = `Created ${event.payload?.ref_type || 'resource'}`;
        sub = event.repo?.name || '';
        color = '#34d399';
        break;
      case 'IssuesEvent':
        text = `${event.payload?.action || 'Updated'} issue`;
        sub = event.repo?.name || '';
        color = '#fbbf24';
        break;
      case 'PullRequestEvent':
        text = `${event.payload?.action || 'Updated'} pull request`;
        sub = event.repo?.name || '';
        color = '#3b82f6';
        break;
      case 'WatchEvent':
        text = `Starred ${event.repo?.name || 'repository'}`;
        sub = '';
        color = '#fbbf24';
        break;
      default:
        text = event.type?.replace(/([A-Z])/g, ' $1').trim() || 'Activity';
        sub = event.repo?.name || '';
    }

    const time = formatTimeAgo(event.created_at);
    return { text, sub, color, time };
  });
}

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// ============ CSS Particle Background (Lightweight) ============
function initParticles() {
  // Skip on reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.getElementById('particles-bg');
  if (!container) return;

  const particleCount = window.innerWidth < 768 ? 8 : 15;
  // Future theme colors: Cyan, Purple, Fuchsia
  const colors = ['#22d3ee', '#a855f7', '#f472b6', '#6366f1'];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 20 + 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 15 + Math.random() * 20;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      top: ${top}%;
      background: ${color}40;
      border: 1px solid ${color}80;
      animation-delay: -${delay}s;
      animation-duration: ${duration}s;
    `;

    container.appendChild(particle);
  }
}

// ============ Navigation ============
function initNavigation() {
  const navLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('.view-section');
  const pageTitle = document.getElementById('page-title');
  const mobileNav = document.getElementById('mobile-nav');
  const sidebar = document.getElementById('sidebar');

  // Show mobile nav on small screens
  const checkMobile = () => {
    if (window.innerWidth <= 1024) {
      mobileNav.classList.remove('hidden');
    } else {
      mobileNav.classList.add('hidden');
    }
  };

  checkMobile();
  window.addEventListener('resize', checkMobile, { passive: true });

  function navigate(target) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(target);
    if (targetSection) {
      targetSection.classList.add('active');

      // Animate cards in the section
      const cards = targetSection.querySelectorAll('[data-animate]');
      gsap.fromTo(cards,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }

    // Update nav states
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === target) {
        link.classList.add('active');
      }
    });

    // Update page title
    const titles = {
      dashboard: 'Dashboard',
      projects: 'Projects',
      skills: 'Skills',
      certificates: 'Certificates',
      contact: 'Contact'
    };
    if (pageTitle) {
      pageTitle.textContent = titles[target] || 'Dashboard';
    }

    // Scroll to top - target main-panel which is the scrollable container
    const mainPanel = document.querySelector('.main-panel');
    if (mainPanel) {
      mainPanel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navigate(link.dataset.section);
    });
  });

  // Default view
  navigate('dashboard');
}

// ============ Render Profile ============
async function renderProfile() {
  // Fetch GitHub data only (removed broken external APIs)
  const githubData = await fetchGitHubData();

  // Use GitHub data if available, otherwise fallback to PROFILE defaults
  const avatarUrl = githubData?.user?.avatar_url || PROFILE.avatar;
  const name = githubData?.user?.name || PROFILE.name;
  const bio = githubData?.user?.bio || PROFILE.title;
  const publicRepos = githubData?.user?.public_repos || 0;
  const followers = githubData?.user?.followers || 0;
  const weeklyCommits = githubData?.weeklyCommits || [0, 0, 0, 0, 0, 0, 0];
  const totalCommits = githubData?.totalCommits || 0;
  const totalStars = githubData?.totalStars || 0;

  const elements = {
    'sidebar-avatar': avatarUrl,
    'sidebar-name': name,
    'sidebar-title': bio,
    'hero-avatar': avatarUrl,
    'hero-name': name,
    'hero-title': bio,
  };

  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'IMG') {
        el.src = value;
      } else {
        el.textContent = value;
      }
    }
  });

  // Update stats from GitHub
  const statRepos = document.getElementById('stat-repos');
  const statFollowers = document.getElementById('stat-followers');
  const statCommits = document.getElementById('stat-commits');
  const statStarsProfile = document.getElementById('stat-stars-profile');

  if (statRepos) statRepos.textContent = publicRepos;
  if (statFollowers) statFollowers.textContent = followers;
  // Show total commits in GitHub Statistics section
  if (statCommits) {
    statCommits.textContent = totalCommits > 0
      ? totalCommits.toLocaleString()
      : '--';
  }
  // Show total stars in Profile Stats Card with animation
  if (statStarsProfile) {
    statStarsProfile.textContent = totalStars > 0 ? totalStars.toLocaleString() : '--';
  }

  // Update Quick Stats Row from GitHub API
  renderQuickStats(githubData);

  // Render GitHub Activity
  renderGitHubActivity(githubData?.events);

  // Render Weekly Commits Chart with dynamic data
  renderWeeklyCommitsChart(weeklyCommits);

  // Render Skills Preview
  renderSkillsPreview();

  // Animate efficiency ring (new deployment card)
  setTimeout(() => {
    const efficiencyCircle = document.getElementById('efficiency-circle');
    const efficiencyText = document.getElementById('efficiency-text');

    if (efficiencyCircle) {
      // r=50 → circumference = 2π×50 ≈ 314.159
      const circumference = 314.159;
      const offset = circumference - (circumference * PROFILE.currentFocus.progress / 100);
      efficiencyCircle.style.strokeDashoffset = offset;
    }

    if (efficiencyText) {
      gsap.to({ val: 0 }, {
        val: PROFILE.currentFocus.progress,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function () {
          efficiencyText.textContent = Math.round(this.targets()[0].val) + '%';
        }
      });
    }
  }, 500);
}

// ============ Render Quick Stats Row ============
function renderQuickStats(githubData) {
  // Get data from GitHub API
  const totalStars = githubData?.totalStars || 0;
  const totalCommits = githubData?.totalCommits || 0;
  const commitsPerRepo = githubData?.commitsPerRepo || [];

  console.log('Rendering quick stats:', { totalStars, totalCommits, commitsPerRepo });

  // Update elements by ID - Contributions (total commits) and Commits
  const statTotalCommits = document.getElementById('stat-total-commits');
  const statCommits = document.getElementById('stat-commits');
  const statPRs = document.getElementById('stat-prs');
  const statIssues = document.getElementById('stat-issues');

  // Contributions = total commits from all repos
  if (statTotalCommits) statTotalCommits.textContent = totalCommits > 0 ? totalCommits.toLocaleString() : '--';
  // Commits = same as contributions for now
  if (statCommits) statCommits.textContent = totalCommits > 0 ? totalCommits.toLocaleString() : '--';

  // PRs and Issues - we don't have this data from basic GitHub API
  // Could be fetched from search API if needed
  if (statPRs) statPRs.textContent = '--';
  if (statIssues) statIssues.textContent = '--';

  // Render GitHub Statistics section with commits per repo
  renderGitHubStatistics(commitsPerRepo);
}

// ============ Render GitHub Statistics Section ============
function renderGitHubStatistics(commitsPerRepo) {
  const container = document.getElementById('github-stats-container');
  if (!container || !commitsPerRepo || commitsPerRepo.length === 0) return;

  // Sort by commits descending and take top 5
  const topRepos = [...commitsPerRepo]
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 5);

  if (topRepos.length === 0) return;

  container.innerHTML = topRepos.map(repo => `
    <div class="github-stat-item">
      <div class="github-stat-repo">
        <span class="github-stat-name">${repo.name}</span>
        ${repo.language ? `<span class="github-stat-lang">${repo.language}</span>` : ''}
      </div>
      <div class="github-stat-commits">${repo.commits} commits</div>
    </div>
  `).join('');
}

// ============ Render Weekly Commits Chart ============
function renderWeeklyCommitsChart(weeklyCommits) {
  const container = document.querySelector('.weekly-chart-bars');
  if (!container) return;

  // Find the peak day
  const peak = findPeakDay(weeklyCommits);
  const maxValue = Math.max(...weeklyCommits, 1); // Avoid division by zero
  const totalWeekCommits = weeklyCommits.reduce((a, b) => a + b, 0);

  // Update weekly stats display
  const statsEl = document.getElementById('weekly-stats');
  if (statsEl) {
    statsEl.innerHTML = `<span class="text-white font-medium">${totalWeekCommits}</span> commits this week`;
  }

  // Day order for display (Mon-Sun, but GitHub uses Sun-Sat)
  const displayDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Map to GitHub's day index (0=Sun, 1=Mon, etc.)
  const dayIndexMap = [1, 2, 3, 4, 5, 6, 0]; // Mon=1, Tue=2, ... Sun=0

  container.innerHTML = displayDays.map((day, displayIndex) => {
    const gitHubDayIndex = dayIndexMap[displayIndex];
    const commits = weeklyCommits[gitHubDayIndex] || 0;
    const heightPercent = Math.max((commits / maxValue) * 100, 5); // Minimum 5% for visibility
    const isPeak = gitHubDayIndex === peak.index;

    return `
      <div class="weekly-col">
        <div class="weekly-bar-track">
          <div class="weekly-bar ${isPeak ? 'weekly-bar--active' : ''}" 
               data-height="${heightPercent}" 
               data-commits="${commits}"
               title="${commits} commits">
          </div>
        </div>
        <span class="weekly-label ${isPeak ? 'weekly-label--active' : ''}">${day}</span>
      </div>
    `;
  }).join('');

  // Animate bars after render
  setTimeout(() => {
    const bars = container.querySelectorAll('.weekly-bar');
    bars.forEach((bar, i) => {
      const targetPct = parseFloat(bar.dataset.height) || 50;
      setTimeout(() => {
        bar.style.height = targetPct + '%';
      }, 100 + i * 90);
    });
  }, 300);
}

// ============ Render GitHub Activity ============
function renderGitHubActivity(events) {
  const container = document.getElementById('github-activity-list');
  if (!container) return;

  const activities = parseGitHubEvents(events);

  container.innerHTML = activities.map(activity => `
    <div class="github-activity-item">
      <div class="github-activity-dot" style="background-color: ${activity.color}"></div>
      <div class="github-activity-content">
        <div class="github-activity-title">${activity.text}</div>
        <div class="github-activity-meta">${activity.sub} ${activity.time ? '• ' + activity.time : ''}</div>
      </div>
    </div>
  `).join('');
}

// ============ Render Skills Preview ============
function renderSkillsPreview() {
  const container = document.getElementById('skills-preview');
  if (!container) return;

  const topSkills = SKILLS.slice(0, 4);

  container.innerHTML = topSkills.map(skill => `
    <div class="skill-preview-item">
      <div class="skill-preview-icon" style="background: ${skill.color}20;">
        ${skill.icon}
      </div>
      <div class="skill-preview-content">
        <div class="skill-preview-header">
          <span class="skill-preview-name">${skill.name}</span>
          <span class="skill-preview-pct">${skill.pct}%</span>
        </div>
        <div class="skill-preview-bar">
          <div class="skill-preview-bar-fill" style="width: 0%; background: ${skill.color}" data-width="${skill.pct}"></div>
        </div>
      </div>
    </div>
  `).join('');

  // Animate progress bars
  setTimeout(() => {
    container.querySelectorAll('.skill-preview-bar-fill').forEach((bar) => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 300);
}

// ============ Render Skills Full (Enhanced Design) ============
function renderSkillsFull() {
  const container = document.getElementById('skills-grid-full');
  if (!container) return;

  container.innerHTML = SKILLS.map((skill, i) => {
    // Calculate SVG circle properties
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * skill.pct / 100);

    return `
    <div class="skill-card-enhanced" data-animate="scale" style="animation-delay: ${i * 80}ms">
      <div class="skill-icon-enhanced" style="background: ${skill.color}15;">
        ${skill.icon}
      </div>
      <div class="skill-name-enhanced">${skill.name}</div>
      <div class="skill-sub-enhanced">${skill.sub}</div>
      <div class="skill-progress-ring">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle class="skill-progress-ring-bg" cx="30" cy="30" r="${radius}" />
          <circle class="skill-progress-ring-fill" cx="30" cy="30" r="${radius}"
            stroke="${skill.color}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference}"
            data-offset="${offset}"
            style="transition: stroke-dashoffset 1.2s ease-out;" />
        </svg>
        <div class="skill-progress-value">${skill.pct}%</div>
      </div>
    </div>
  `}).join('');

  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rings = entry.target.querySelectorAll('.skill-progress-ring-fill');
        rings.forEach((ring, i) => {
          setTimeout(() => {
            ring.style.strokeDashoffset = ring.dataset.offset;
          }, i * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(container);
}

// ============ Render Projects ============
function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  // Status color mapping
  const statusColors = {
    'Complete': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Development': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'Testing': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Planning': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Concept': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  container.innerHTML = PROJECTS.map((project, i) => `
    <div class="project-card-enhanced" data-animate="fade" style="animation-delay: ${i * 80}ms">
      <div class="project-card-header">
        <span class="project-card-id">#${project.id}</span>
        <span class="project-card-status ${statusColors[project.status] || statusColors['Concept']}">${project.status}</span>
      </div>
      <h3 class="project-card-title">${project.title}</h3>
      <p class="project-card-desc">${project.desc}</p>
      <div class="project-card-tags">
        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
      </div>
      <div class="project-card-footer">
        <div class="project-progress">
          <div class="project-progress-bar" style="width: ${project.pct}%"></div>
        </div>
        <span class="project-progress-text">${project.pct}%</span>
      </div>
    </div>
  `).join('');
}

// ============ Render Certificates ============
function renderCertificates() {
  const container = document.getElementById('certificates-grid');
  if (!container) return;

  container.innerHTML = CERTIFICATES.map((cert, i) => `
    <div class="cert-slot" data-animate="fade" style="animation-delay: ${i * 100}ms">
      <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="${cert.id}" data-share-badge-host="https://www.credly.com"></div>
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
          <i data-lucide="award" class="w-8 h-8 text-violet-400"></i>
        </div>
        <p class="text-white font-medium">${cert.name}</p>
        <p class="text-xs text-gray-500">${cert.issuer}</p>
      </div>
    </div>
  `).join('');

  // Load Credly script
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = '//cdn.credly.com/assets/utilities/embed.js';
  document.body.appendChild(script);
}

// ============ Render Contact ============
function renderContact() {
  const container = document.getElementById('terminal-body');
  if (!container) return;

  container.innerHTML = `
    <div class="font-mono text-sm">
      <p class="mb-4">
        <span class="prompt">~/contact</span>
        <span class="text-gray-600">$</span>
        cat info.json
      </p>
      <div class="mb-4">
        {<br>
        <span class="ml-4"><span class="key">"name"</span>: <span class="str">"${PROFILE.name}"</span>,</span><br>
        <span class="ml-4"><span class="key">"role"</span>: <span class="str">"${PROFILE.title}"</span>,</span><br>
        <span class="ml-4"><span class="key">"email"    </span>: <a href="mailto:${CONTACT.email}" class="str hover:text-cyan-400 transition-colors">"${CONTACT.email}"</a>,</span><br>
        <span class="ml-4"><span class="key">"github"   </span>: <a href="https://${CONTACT.github}" target="_blank" rel="noopener" class="str hover:text-cyan-400 transition-colors">"${CONTACT.github}"</a>,</span><br>
        <span class="ml-4"><span class="key">"linkedin" </span>: <a href="https://${CONTACT.linkedin}" target="_blank" rel="noopener" class="str hover:text-cyan-400 transition-colors">"${CONTACT.linkedin}"</a>,</span><br>
        <span class="ml-4"><span class="key">"twitter"  </span>: <a href="https://${CONTACT.twitter}" target="_blank" rel="noopener" class="str hover:text-cyan-400 transition-colors">"${CONTACT.twitter}"</a></span><br>
        }
      </div>
      <p>
        <span class="prompt">~/contact</span>
        <span class="text-gray-600">$</span>
        <span class="caret"></span>
      </p>
    </div>
  `;
}

// ============ Intersection Observer for Animations ============
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animateType = entry.target.dataset.animate;

        if (animateType === 'fade') {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          });
        } else if (animateType === 'scale') {
          gsap.to(entry.target, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all bento cards
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = '0';
    if (el.dataset.animate === 'fade') {
      el.style.transform = 'translateY(20px)';
    } else if (el.dataset.animate === 'scale') {
      el.style.transform = 'scale(0.95)';
    }
    observer.observe(el);
  });
}

// ============ Initialize Everything ============
document.addEventListener('DOMContentLoaded', () => {
  // Initialize lightweight CSS particles
  initParticles();

  // Initialize navigation
  initNavigation();

  // Render content (renderProfile is now async and handles GitHub API)
  renderProfile();
  renderGitHubActivity(githubDataCache.events || []);
  renderSkillsPreview();
  renderSkillsFull();
  renderProjects();
  renderCertificates();
  renderContact();

  // Initialize scroll animations
  initScrollAnimations();

  // Refresh Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  console.log('Portfolio initialized with GitHub API + GSAP');
});

// ============ Performance: Cleanup on page hide ============
window.addEventListener('beforeunload', () => {
  // Clean up particles
  const particles = document.getElementById('particles-bg');
  if (particles) {
    particles.innerHTML = '';
  }
});

