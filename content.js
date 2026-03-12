// YouTube Focus Mode v4 — Infinite Feed Algorithm + Hustle Quotes
(function () {
  "use strict";

  // ═══════════════════════════════════════════════════════
  //  TRUSTED TYPES (YouTube requires this)
  // ═══════════════════════════════════════════════════════
  let ttPolicy;
  try {
    if (window.trustedTypes && trustedTypes.createPolicy) {
      ttPolicy = trustedTypes.createPolicy("ytFocusMode", { createHTML: (s) => s });
    }
  } catch (e) {}
  function safeHTML(el, html) {
    if (ttPolicy) el.innerHTML = ttPolicy.createHTML(html);
    else el.innerHTML = html;
  }

  // ═══════════════════════════════════════════════════════
  //  CONFIG
  // ═══════════════════════════════════════════════════════
  const DEFAULT_CONFIG = { enabled: true, categories: { growth: true, coding: true, comptia: true } };
  let config = { ...DEFAULT_CONFIG };

  // ═══════════════════════════════════════════════════════
  //  MASSIVE QUERY DATABASE — Never runs out
  //  Each category has many queries. The algorithm rotates
  //  through them, picking unused ones each time.
  // ═══════════════════════════════════════════════════════
  const QUERIES = {
    growth: [
      // Habits & Discipline
      "growth mindset motivation", "atomic habits summary", "how to build discipline",
      "power of consistency habits", "morning routine productivity", "daily habits successful people",
      "how to stop procrastinating", "building self discipline", "habit stacking technique",
      "tiny habits BJ Fogg", "one percent better every day", "how to be more consistent",
      // Mindset & Philosophy
      "stoicism for beginners", "marcus aurelius meditations", "how to think clearly",
      "fixed vs growth mindset", "how to develop mental toughness", "resilience mindset training",
      "how to overcome fear of failure", "mindset of successful entrepreneurs", "navy seal mental toughness",
      "jocko willink discipline", "goggins mindset motivation", "how to stop overthinking",
      // Productivity & Focus
      "deep work cal newport", "productivity tips for developers", "time management for programmers",
      "pomodoro technique explained", "how to focus for hours", "digital minimalism",
      "second brain building", "zettelkasten method explained", "note taking for developers",
      "how to learn faster", "active recall study technique", "spaced repetition learning",
      // Career & Self Improvement
      "self improvement for programmers", "goal setting strategies SMART", "how to negotiate salary tech",
      "personal branding for developers", "how to network in tech", "imposter syndrome developer",
      "career advice for junior developers", "how to get promoted in tech", "work life balance programmer",
      // Books & Learning
      "james clear habits", "deep work book summary", "cant hurt me goggins summary",
      "7 habits highly effective people summary", "think and grow rich summary",
      "the compound effect book summary", "mans search for meaning summary",
      "learning how to learn coursera", "how to read technical books faster",
      "best self improvement books for developers", "mindset carol dweck summary",
    ],
    coding: [
      // Python
      "python tutorial for beginners 2025", "python projects for beginners", "python automation tutorial",
      "python for data science beginner", "python web scraping tutorial", "python flask tutorial",
      "python django tutorial 2025", "python machine learning beginner", "advanced python techniques",
      // JavaScript & Web
      "javascript full course 2025", "javascript ES6 features explained", "javascript async await tutorial",
      "react tutorial for beginners 2025", "react project from scratch", "next.js full course",
      "node.js backend tutorial", "express.js REST API tutorial", "typescript crash course 2025",
      "vue.js tutorial beginner", "angular tutorial 2025", "svelte tutorial beginner",
      // Full Stack & Projects
      "full stack project tutorial 2025", "MERN stack project tutorial", "build a SaaS application",
      "portfolio website tutorial developer", "ecommerce website tutorial full stack",
      "real time chat app tutorial", "social media clone tutorial", "authentication tutorial JWT",
      // DevOps & Tools
      "docker tutorial beginners 2025", "kubernetes tutorial beginner", "CI CD pipeline tutorial",
      "git and github tutorial 2025", "linux command line basics", "bash scripting tutorial",
      "AWS for beginners tutorial", "terraform tutorial beginner", "github actions tutorial",
      // Data & Backend
      "SQL database tutorial beginner", "PostgreSQL tutorial full course", "MongoDB tutorial beginner",
      "Redis tutorial for beginners", "GraphQL tutorial beginner", "REST API design best practices",
      "system design interview preparation", "microservices architecture explained",
      // Computer Science
      "data structures and algorithms 2025", "big O notation explained", "dynamic programming tutorial",
      "coding interview preparation 2025", "leetcode solving strategies", "recursion tutorial explained",
      "object oriented programming explained", "design patterns for developers",
      // Web Development
      "web development roadmap 2025", "CSS grid flexbox tutorial", "tailwind CSS tutorial 2025",
      "responsive web design tutorial", "web accessibility tutorial", "SEO for developers",
      "progressive web app tutorial", "web performance optimization",
      // Career
      "how to get first developer job", "developer portfolio tips", "technical interview preparation",
      "freelance developer getting started", "remote developer job tips", "open source contributing guide",
      // Other Languages & Tech
      "rust programming tutorial beginner", "go programming tutorial", "java tutorial 2025",
      "C++ tutorial for beginners", "kotlin tutorial android", "swift tutorial iOS beginner",
      "cloud computing for developers 2025", "AI for developers getting started",
    ],
    comptia: [
      // A+
      "comptia a+ full course 2025", "comptia a+ 1101 study guide", "comptia a+ 1102 study guide",
      "professor messer comptia a+", "comptia a+ practice exam questions", "comptia a+ lab setup",
      "comptia a+ hardware troubleshooting", "comptia a+ networking basics",
      "how to pass comptia a+ first try", "comptia a+ study plan 30 days",
      // Network+
      "comptia network+ study guide 2025", "comptia network+ N10-009 full course",
      "professor messer network+", "network+ practice questions", "subnetting tutorial",
      "comptia network+ lab practice", "network+ wireless networking", "OSI model explained",
      "TCP IP model explained", "DNS DHCP explained for beginners",
      // Security+
      "comptia security+ tutorial 2025", "comptia security+ SY0-701 full course",
      "professor messer security+", "security+ practice exam questions",
      "security+ cryptography explained", "security+ threat analysis", "security+ risk management",
      "how to pass security+ first try", "security+ study plan",
      // Advanced Certs
      "comptia cysa+ training 2025", "comptia pentest+ course", "comptia linux+ tutorial",
      "comptia cloud+ certification course", "comptia server+ training",
      "comptia data+ certification course", "comptia CASP+ advanced security",
      // IT Career
      "IT certification roadmap 2025", "cybersecurity career path beginner",
      "help desk technician training", "IT support career guide", "SOC analyst training",
      "how to become system administrator", "network engineer career path",
      "cloud engineer certification path", "penetration testing career guide",
      "IT career no degree", "highest paying IT certifications 2025",
      "cybersecurity vs cloud computing career", "day in life IT support technician",
      "IT interview questions and answers", "building a home lab IT",
      // Networking & Security Concepts
      "firewall configuration tutorial", "VPN explained for beginners", "active directory tutorial",
      "windows server administration beginner", "linux server administration basics",
      "ethical hacking for beginners", "network security fundamentals",
      "incident response training", "SIEM tutorial for beginners", "wireshark tutorial beginner",
    ],
  };

  const CAT_META = {
    growth: { label: "Growth Mindset", emoji: "🧠", color: "#10b981" },
    coding: { label: "Coding", emoji: "💻", color: "#3b82f6" },
    comptia: { label: "CompTIA & IT", emoji: "🛡️", color: "#f59e0b" },
  };

  // ═══════════════════════════════════════════════════════
  //  INFINITE FEED ALGORITHM
  //  Tracks which queries have been used, rotates through
  //  all of them, deduplicates videos by ID, and loads
  //  more when user scrolls.
  // ═══════════════════════════════════════════════════════
  const usedQueries = { growth: new Set(), coding: new Set(), comptia: new Set() };
  const seenVideoIds = new Set();
  let isLoadingMore = false;
  let loadBatchCount = 0;

  function getNextQueries(cat, count) {
    const all = QUERIES[cat];
    const unused = all.filter((q) => !usedQueries[cat].has(q));

    // If all used, reset and start over
    if (unused.length < count) {
      usedQueries[cat].clear();
      return shuffle(all).slice(0, count);
    }

    const picked = shuffle(unused).slice(0, count);
    picked.forEach((q) => usedQueries[cat].add(q));
    return picked;
  }

  // ═══════════════════════════════════════════════════════
  //  MOTIVATIONAL TEXT
  // ═══════════════════════════════════════════════════════
  const M_STATS = [
    "🔥 {n}+ people leveled up watching this",
    "💪 {n}+ viewers said this changed their career",
    "🚀 {n}+ people found this incredibly useful",
    "⭐ Helped {n}+ people break into tech",
    "📈 {n}+ learners recommended this to friends",
    "🎯 {n}+ people passed their exam after this",
    "💡 {n}+ devs built something after watching this",
    "🏆 {n}+ people credited this for their first job",
    "🔑 {n}+ people said 'I wish I found this sooner'",
    "💻 {n}+ students went from zero to hired",
    "🧠 {n}+ people said this expanded their mind",
    "📚 {n}+ learners binged this entire channel",
  ];
  const M_PHRASES = [
    "💪 Every expert was once a beginner — start now",
    "🔥 Your future self will thank you for clicking this",
    "⚡ One video closer to your dream career",
    "🧠 Invest in yourself — it pays the best interest",
    "🎯 Discipline beats motivation every single time",
    "🚀 While they scroll, you study. That's the difference.",
    "💎 Hard work compounds. Keep stacking knowledge.",
    "🏆 You didn't come this far to only come this far",
    "⭐ The grind is temporary. The skills are forever.",
    "🔑 Nobody's coming to save you. Be your own hero.",
    "📈 Every line of code is a step toward freedom",
    "🎓 One certification can change your whole life",
    "💼 Your skills are your resume. Keep building.",
    "🛡️ Knowledge is the one thing nobody can take from you",
    "⏰ The best time to start was yesterday. Second best is now.",
  ];
  function motivText() {
    if (Math.random() > 0.4) {
      const t = M_STATS[Math.floor(Math.random() * M_STATS.length)];
      const n = (Math.floor(Math.random() * 45) + 5) * 100;
      return t.replace("{n}", n.toLocaleString());
    }
    return M_PHRASES[Math.floor(Math.random() * M_PHRASES.length)];
  }

  // ═══════════════════════════════════════════════════════
  //  HUSTLE QUOTES
  // ═══════════════════════════════════════════════════════
  const QUOTES = [
    { q: "While you're sleeping, someone is grinding. Wake up.", a: "Unknown" },
    { q: "Don't stop when you're tired. Stop when you're done.", a: "David Goggins" },
    { q: "The only thing standing between you and your goal is the story you keep telling yourself.", a: "Jordan Belfort" },
    { q: "Work so hard that one day your signature will be called an autograph.", a: "Unknown" },
    { q: "If it was easy, everybody would do it.", a: "Tom Hanks" },
    { q: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
    { q: "Success isn't owned. It's rented. And rent is due every day.", a: "J.J. Watt" },
    { q: "Outwork everyone in the room and you'll never worry about competition.", a: "Unknown" },
    { q: "Your comfort zone is beautiful, but nothing ever grows there.", a: "Unknown" },
    { q: "The harder you work, the luckier you get.", a: "Gary Player" },
    { q: "Be so good they can't ignore you.", a: "Steve Martin" },
    { q: "Suffer the pain of discipline or suffer the pain of regret.", a: "Jim Rohn" },
    { q: "Nobody cares. Work harder.", a: "Cameron Hanes" },
    { q: "You're not behind. You're just getting started. Now go harder.", a: "Unknown" },
    { q: "Every master was once a disaster. Keep coding. Keep learning.", a: "Unknown" },
    { q: "The code doesn't care about your excuses. Ship it.", a: "Unknown" },
    { q: "One year from now you'll wish you started today.", a: "Karen Lamb" },
    { q: "Hustle in silence. Let your certification speak.", a: "Unknown" },
    { q: "The best investment you can make is in yourself.", a: "Warren Buffett" },
    { q: "Stay hungry. Stay foolish. Stay grinding.", a: "Steve Jobs" },
    { q: "Your 9-to-5 builds someone else's dream. Your 6-to-midnight builds yours.", a: "Unknown" },
    { q: "Don't wish it were easier. Wish you were better.", a: "Jim Rohn" },
    { q: "Brick by brick. Commit by commit. You're building an empire.", a: "Unknown" },
    { q: "They don't have to believe in your dream. You do.", a: "Unknown" },
    { q: "The pain of discipline weighs ounces. The pain of regret weighs tons.", a: "Jim Rohn" },
    { q: "I fear not the man who has practiced 10,000 kicks once. I fear the man who has practiced one kick 10,000 times.", a: "Bruce Lee" },
    { q: "You are the average of the five videos you watch. Choose wisely.", a: "Unknown" },
    { q: "Debugging life one problem at a time. Keep compiling.", a: "Unknown" },
    { q: "The only impossible journey is the one you never begin.", a: "Tony Robbins" },
    { q: "Your network is your net worth. But your skills are your foundation.", a: "Unknown" },
  ];
  let quoteIndex = Math.floor(Math.random() * QUOTES.length);
  function nextQuote() {
    quoteIndex = (quoteIndex + 1) % QUOTES.length;
    return QUOTES[quoteIndex];
  }
  function randQuote() { return QUOTES[Math.floor(Math.random() * QUOTES.length)]; }

  // ═══════════════════════════════════════════════════════
  //  UTILITY
  // ═══════════════════════════════════════════════════════
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function esc(s) {
    if (!s) return "";
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ═══════════════════════════════════════════════════════
  //  FETCH VIDEOS VIA BACKGROUND
  // ═══════════════════════════════════════════════════════
  const cache = {};
  function searchYT(query, max) {
    if (cache[query]) return Promise.resolve(cache[query]);
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(
          { action: "searchYouTube", query, maxResults: max || 8 },
          (resp) => {
            if (chrome.runtime.lastError) { resolve([]); return; }
            const v = resp?.videos || [];
            if (v.length) cache[query] = v;
            resolve(v);
          }
        );
      } catch (e) { resolve([]); }
    });
  }

  // ═══════════════════════════════════════════════════════
  //  CONFIG
  // ═══════════════════════════════════════════════════════
  function loadConfig() {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get("ytFocusConfig", (data) => {
          if (chrome.runtime.lastError) { resolve(config); return; }
          if (data?.ytFocusConfig) config = { ...DEFAULT_CONFIG, ...data.ytFocusConfig };
          resolve(config);
        });
      } catch (e) { resolve(config); }
    });
  }
  try {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.ytFocusConfig) {
        config = { ...DEFAULT_CONFIG, ...changes.ytFocusConfig.newValue };
        run();
      }
    });
  } catch (e) {}

  // ═══════════════════════════════════════════════════════
  //  HIDE / SHOW
  // ═══════════════════════════════════════════════════════
  function hideRecs() {
    const browse = document.querySelector('ytd-browse[page-subtype="home"]');
    if (browse) browse.style.display = "none";
    document.querySelectorAll("#related, ytd-watch-next-secondary-results-renderer").forEach((el) => {
      if (!el.closest("#yt-focus-root")) el.style.display = "none";
    });
    document.querySelectorAll(".ytp-endscreen-content").forEach((el) => { el.style.display = "none"; });
  }
  function showRecs() {
    const browse = document.querySelector('ytd-browse[page-subtype="home"]');
    if (browse) browse.style.display = "";
    document.querySelectorAll("#related, ytd-watch-next-secondary-results-renderer, .ytp-endscreen-content").forEach((el) => { el.style.display = ""; });
    const root = document.getElementById("yt-focus-root");
    if (root) root.remove();
  }

  // ═══════════════════════════════════════════════════════
  //  HTML BUILDERS
  // ═══════════════════════════════════════════════════════
  function skeletonHTML(mode) {
    if (mode === "side") return '<div class="ytf-sc ytf-sc--side"><div class="ytf-sc-thumb"></div><div class="ytf-sc-body"><div class="ytf-sc-line" style="width:85%"></div><div class="ytf-sc-line" style="width:55%"></div><div class="ytf-sc-line" style="width:70%"></div></div></div>';
    return '<div class="ytf-sc"><div class="ytf-sc-thumb"></div><div class="ytf-sc-body"><div class="ytf-sc-line" style="width:85%"></div><div class="ytf-sc-line" style="width:55%"></div><div class="ytf-sc-line" style="width:70%"></div></div></div>';
  }

  function videoCardHTML(vid, cat) {
    const m = CAT_META[cat];
    return '<a href="/watch?v=' + esc(vid.videoId) + '" class="ytf-vc">' +
      '<div class="ytf-vc-thumb"><img src="' + esc(vid.thumbnail) + '" alt="" loading="lazy" />' +
      (vid.duration ? '<span class="ytf-dur">' + esc(vid.duration) + '</span>' : '') +
      '<span class="ytf-badge" style="background:' + m.color + '">' + m.emoji + ' ' + esc(m.label) + '</span></div>' +
      '<div class="ytf-vc-info"><div class="ytf-vc-title">' + esc(vid.title) + '</div>' +
      '<div class="ytf-vc-chan">' + esc(vid.channel) + (vid.views ? ' &middot; ' + esc(vid.views) : '') + '</div>' +
      '<div class="ytf-vc-motiv">' + motivText() + '</div></div></a>';
  }

  function sideCardHTML(vid, cat) {
    const m = CAT_META[cat];
    return '<a href="/watch?v=' + esc(vid.videoId) + '" class="ytf-side">' +
      '<div class="ytf-side-thumb"><img src="' + esc(vid.thumbnail) + '" alt="" loading="lazy" />' +
      (vid.duration ? '<span class="ytf-dur ytf-dur--sm">' + esc(vid.duration) + '</span>' : '') + '</div>' +
      '<div class="ytf-side-info"><div class="ytf-side-vtitle">' + esc(vid.title) + '</div>' +
      '<div class="ytf-side-chan">' + esc(vid.channel) + '</div>' +
      '<div class="ytf-side-motiv" style="color:' + m.color + '">' + motivText() + '</div></div></a>';
  }

  function quoteBannerHTML(q) {
    return '<div class="ytf-quote"><div class="ytf-quote-icon">⚡</div>' +
      '<div class="ytf-quote-content"><div class="ytf-quote-text">&ldquo;' + esc(q.q) + '&rdquo;</div>' +
      '<div class="ytf-quote-author">— ' + esc(q.a) + '</div></div></div>';
  }

  // ═══════════════════════════════════════════════════════
  //  FETCH A BATCH OF VIDEOS FOR A CATEGORY
  // ═══════════════════════════════════════════════════════
  async function fetchBatch(cat, queryCount) {
    const queries = getNextQueries(cat, queryCount || 3);
    const allVids = [];
    for (const q of queries) {
      const vids = await searchYT(q, 8);
      allVids.push(...vids.map((v) => ({ ...v, _cat: cat })));
    }
    // Deduplicate against globally seen videos
    return allVids.filter((v) => {
      if (seenVideoIds.has(v.videoId)) return false;
      seenVideoIds.add(v.videoId);
      return true;
    });
  }

  // ═══════════════════════════════════════════════════════
  //  INJECT HOME — with infinite scroll
  // ═══════════════════════════════════════════════════════
  async function injectHome(root) {
    const bq = randQuote();
    const activeCats = Object.keys(config.categories).filter((c) => config.categories[c]);

    // Banner + initial sections with skeletons
    let html = '<div class="ytf-banner">' +
      '<div class="ytf-banner-left"><div class="ytf-banner-icon">⚡</div>' +
      '<div><div class="ytf-banner-title">OwnYourFeed — You\'re In Control</div>' +
      '<div class="ytf-banner-sub">Distractions eliminated. Scroll for unlimited focused content.</div></div></div>' +
      '<div class="ytf-banner-quote">&ldquo;' + esc(bq.q) + '&rdquo; — ' + esc(bq.a) + '</div></div>';

    // Initial sections for each category
    for (const cat of activeCats) {
      const m = CAT_META[cat];
      html += '<div class="ytf-sec"><div class="ytf-sec-hdr">' +
        '<span class="ytf-dot" style="background:' + m.color + ';box-shadow:0 0 8px ' + m.color + '"></span> ' +
        m.emoji + ' ' + esc(m.label) + '</div>' +
        '<div class="ytf-grid" id="ytf-grid-' + cat + '">' +
        skeletonHTML("grid").repeat(4) + '</div></div>';
    }

    // Container for infinite scroll batches
    html += '<div id="ytf-infinite"></div>';
    // Loading indicator
    html += '<div id="ytf-load-more" class="ytf-load-more">' +
      '<div class="ytf-load-spinner"></div> Loading more content...</div>';

    safeHTML(root, html);

    // Fetch initial batch for each category
    for (const cat of activeCats) {
      const vids = await fetchBatch(cat, 3);
      const grid = document.getElementById("ytf-grid-" + cat);
      if (!grid) continue;

      const show = vids.slice(0, 8);
      if (show.length === 0) {
        safeHTML(grid, '<div class="ytf-empty">Loading... <a href="https://www.youtube.com/results?search_query=' + encodeURIComponent(QUERIES[cat][0]) + '" class="ytf-link">Search ' + esc(CAT_META[cat].label) + ' →</a></div>');
        continue;
      }
      let cards = "";
      show.forEach((v) => { cards += videoCardHTML(v, cat); });
      safeHTML(grid, cards);
      Array.from(grid.children).forEach((c, i) => { c.style.animationDelay = (i * 0.06) + "s"; });
    }

    // Set up infinite scroll
    setupInfiniteScroll(activeCats);
  }

  // ═══════════════════════════════════════════════════════
  //  INFINITE SCROLL — loads more on scroll
  // ═══════════════════════════════════════════════════════
  function setupInfiniteScroll(activeCats) {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          await loadMoreVideos(activeCats);
        }
      },
      { rootMargin: "600px" }
    );

    const loadMore = document.getElementById("ytf-load-more");
    if (loadMore) observer.observe(loadMore);
  }

  async function loadMoreVideos(activeCats) {
    if (isLoadingMore) return;
    isLoadingMore = true;
    loadBatchCount++;

    const infinite = document.getElementById("ytf-infinite");
    if (!infinite) { isLoadingMore = false; return; }

    // Rotate categories — each batch focuses on different ones
    const catOrder = shuffle(activeCats);

    for (const cat of catOrder) {
      const m = CAT_META[cat];
      const vids = await fetchBatch(cat, 2);
      if (vids.length === 0) continue;

      const show = vids.slice(0, 8);

      // Insert a motivational quote banner every 3 batches
      if (loadBatchCount % 2 === 0 && cat === catOrder[0]) {
        const qDiv = document.createElement("div");
        qDiv.className = "ytf-inline-quote";
        safeHTML(qDiv, '<div class="ytf-inline-quote-inner">' +
          '<span class="ytf-inline-quote-icon">⚡</span>' +
          '<span class="ytf-inline-quote-text">&ldquo;' + esc(nextQuote().q) + '&rdquo;</span></div>');
        infinite.appendChild(qDiv);
      }

      // Section header
      const secDiv = document.createElement("div");
      secDiv.className = "ytf-sec";
      let secHTML = '<div class="ytf-sec-hdr">' +
        '<span class="ytf-dot" style="background:' + m.color + ';box-shadow:0 0 8px ' + m.color + '"></span> ' +
        m.emoji + ' ' + esc(m.label) + '</div><div class="ytf-grid">';
      show.forEach((v) => { secHTML += videoCardHTML(v, cat); });
      secHTML += '</div>';
      safeHTML(secDiv, secHTML);

      // Add animation
      const cards = secDiv.querySelectorAll(".ytf-vc");
      cards.forEach((c, i) => { c.style.animationDelay = (i * 0.06) + "s"; });

      infinite.appendChild(secDiv);
    }

    isLoadingMore = false;
  }

  // ═══════════════════════════════════════════════════════
  //  INJECT WATCH PAGE — Quote + focused sidebar
  // ═══════════════════════════════════════════════════════
  async function injectWatch(root) {
    const q = nextQuote();
    const activeCats = Object.keys(config.categories).filter((c) => config.categories[c]);

    let html = quoteBannerHTML(q) +
      '<div class="ytf-side-hdr">🔥 Keep The Momentum Going</div>' +
      '<div class="ytf-side-list" id="ytf-side-list">' + skeletonHTML("side").repeat(5) + '</div>';

    safeHTML(root, html);

    // Fetch more videos for sidebar — 3 queries per category for variety
    const allVids = [];
    for (const cat of activeCats) {
      const queries = getNextQueries(cat, 2);
      for (const q of queries) {
        const vids = await searchYT(q, 5);
        allVids.push(...vids.map((v) => ({ ...v, _cat: cat })));
      }
    }

    const unique = shuffle(allVids.filter((v) => {
      if (seenVideoIds.has(v.videoId)) return false;
      seenVideoIds.add(v.videoId);
      return true;
    })).slice(0, 15);

    const list = document.getElementById("ytf-side-list");
    if (!list) return;

    let cards = "";
    unique.forEach((v) => { cards += sideCardHTML(v, v._cat); });
    safeHTML(list, cards);
    Array.from(list.children).forEach((c, i) => { c.style.animationDelay = (i * 0.05) + "s"; });
  }

  // ═══════════════════════════════════════════════════════
  //  RUN
  // ═══════════════════════════════════════════════════════
  async function run() {
    await loadConfig();
    if (!config.enabled) { showRecs(); return; }

    hideRecs();

    const old = document.getElementById("yt-focus-root");
    if (old) old.remove();

    const isHome = location.pathname === "/" || location.pathname === "/feed/subscriptions";
    const isWatch = location.pathname === "/watch";
    if (!isHome && !isWatch) return;

    // Reset infinite scroll state on navigation
    isLoadingMore = false;
    loadBatchCount = 0;

    const root = document.createElement("div");
    root.id = "yt-focus-root";

    if (isHome) {
      const browse = document.querySelector('ytd-browse[page-subtype="home"]') || document.querySelector('ytd-browse');
      const pm = document.querySelector('#page-manager');
      if (browse && pm) pm.insertBefore(root, browse);
      else if (pm) pm.prepend(root);
      else return;
      await injectHome(root);
    } else if (isWatch) {
      const target = document.querySelector("#secondary-inner") || document.querySelector("#secondary");
      if (!target) return;
      target.prepend(root);
      await injectWatch(root);
    }
  }

  // ═══════════════════════════════════════════════════════
  //  OBSERVER + INIT
  // ═══════════════════════════════════════════════════════
  let lastUrl = "";
  function startObserver() {
    lastUrl = location.href;
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(run, 1500);
      }
      if (config.enabled) hideRecs();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function waitForYT(cb, tries) {
    tries = tries || 0;
    const el = document.querySelector("ytd-browse") || document.querySelector("ytd-watch-flexy") || document.querySelector("#page-manager");
    if (el) cb();
    else if (tries < 60) setTimeout(() => waitForYT(cb, tries + 1), 300);
  }

  function init() { waitForYT(() => { run(); startObserver(); }); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
