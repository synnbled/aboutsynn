document.addEventListener("DOMContentLoaded", () => {
  // ==================== 0. ИНИЦИАЛИЗАЦИЯ SUPABASE ====================
  const SUPABASE_URL = "https://qeqpdoxyiwduybqkbxmo.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcXBkb3h5aXdkdXlicWtieG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ3MzM5ODksImV4cCI6MjExMDMwOTk4OX0.hkVVgU-ioWDcsEcE4SgT092tCTvKijAZ8ZP513NzkAo";
  
  let supabaseClient = null;
  try {
    if (window.supabase && typeof window.supabase.createClient === "function") {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (err) {
    console.warn("Supabase init skipped:", err);
  }

  // ==================== 1. ВСТРОЕННЫЙ САУНД-ДИЗАЙН ====================
  let sfxEnabled = true;
  let audioCtx = null;

  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    } catch (e) {}
  }

  function playSfx(type = "click") {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "tab") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.07);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "hack") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(420, now + 0.12);
        osc.frequency.linearRampToValueAtTime(95, now + 0.28);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.31);
      } else if (type === "post") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.06);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.17);
      }
    } catch (e) {}
  }

  const sfxToggleBtn = document.getElementById("sfx-toggle");
  const sfxIcon = document.getElementById("sfx-icon");
  const sfxLabel = document.getElementById("sfx-label");

  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener("click", () => {
      sfxEnabled = !sfxEnabled;
      sfxIcon.textContent = sfxEnabled ? "🔊" : "🔇";
      sfxLabel.textContent = sfxEnabled ? "SFX On" : "SFX Off";
      if (sfxEnabled) playSfx("tab");
    });
  }

  function haptic(pattern = 10) {
    if ("vibrate" in navigator) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  // ==================== 2. ЭКРАН ПРИВЕТСТВИЯ ====================
  const introLoader = document.getElementById("intro-loader");
  const decryptEl = document.getElementById("intro-decrypt-text");
  if (introLoader && decryptEl) {
    const targetIntroText = "hello, friend.";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*-_<>[]/";
    let iteration = 0;

    const decryptInterval = setInterval(() => {
      decryptEl.textContent = targetIntroText
        .split("")
        .map((char, index) => {
          if (char === " " || char === "." || char === ",") return char;
          if (index < iteration) return targetIntroText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= targetIntroText.length) {
        clearInterval(decryptInterval);
        setTimeout(() => introLoader.classList.add("fade-out"), 320);
      }
      iteration += 1 / 3;
    }, 38);
  }

  // ==================== 3. ПЕРЕКЛЮЧАТЕЛЬ БАННЕРОВ (МОЛНИЕНОСНЫЙ) ====================
  const bannerImages = ["banner.jpg", "banner1.jpg", "banner2.jpg", "banner3.jpg"];
  bannerImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let currentBannerIdx = 0;
  let bannerTimer = null;
  const bannerSwitcher = document.getElementById("banner-switcher");
  const bannerImgEl = document.getElementById("banner-img");
  const bannerIndicator = document.getElementById("banner-indicator");

  if (bannerSwitcher && bannerImgEl && bannerIndicator) {
    bannerSwitcher.addEventListener("click", () => {
      playSfx("click");
      haptic(15);
      currentBannerIdx = (currentBannerIdx + 1) % bannerImages.length;

      bannerImgEl.style.opacity = "0.2";
      if (bannerTimer) clearTimeout(bannerTimer);
      
      bannerTimer = setTimeout(() => {
        bannerImgEl.src = bannerImages[currentBannerIdx];
        bannerIndicator.textContent = `${currentBannerIdx + 1} / ${bannerImages.length}`;
        bannerImgEl.style.opacity = "1";
      }, 80);
    });
  }

  // ==================== 4. НАВИГАЦИЯ ПО СТРАНИЦАМ ====================
  const navTabs = document.querySelectorAll(".nav-tab");
  const pageViews = document.querySelectorAll(".page-view");

  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-page");
      playSfx("tab");
      haptic(12);
      hideTip(true);

      navTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      pageViews.forEach(view => {
        view.hidden = view.id !== `page-${target}`;
      });
    });
  });

  // ==================== 5. КАССЕТА NOW PLAYING ====================
  const cassetteBanner = document.querySelector(".banner-cassette");
  const playTapeBtn = document.getElementById("play-tape-btn");
  const playTapeIcon = document.getElementById("play-tape-icon");
  const playTapeText = document.getElementById("play-tape-text");
  let previewAudio = null;
  let isPlayingTape = false;

  if (playTapeBtn) {
    playTapeBtn.addEventListener("click", async () => {
      playSfx("click");
      haptic(15);

      if (isPlayingTape && previewAudio) {
        previewAudio.pause();
        isPlayingTape = false;
        cassetteBanner.classList.remove("is-playing");
        playTapeIcon.textContent = "▶";
        playTapeText.textContent = "Play Preview";
        return;
      }

      playTapeText.textContent = "Loading...";

      try {
        if (!previewAudio) {
          const res = await fetch("https://itunes.apple.com/search?term=The+Neighbourhood+The+Beach&entity=song&limit=1");
          const data = await res.json();
          if (data.results && data.results.length > 0 && data.results[0].previewUrl) {
            previewAudio = new Audio(data.results[0].previewUrl);
            previewAudio.volume = 0.65;
            previewAudio.addEventListener("ended", () => {
              isPlayingTape = false;
              cassetteBanner.classList.remove("is-playing");
              playTapeIcon.textContent = "▶";
              playTapeText.textContent = "Play Preview";
            });
          }
        }

        if (previewAudio) {
          await previewAudio.play();
          isPlayingTape = true;
          cassetteBanner.classList.add("is-playing");
          playTapeIcon.textContent = "❚❚";
          playTapeText.textContent = "Pause Tape";
        } else {
          throw new Error("No preview URL");
        }
      } catch (err) {
        isPlayingTape = !isPlayingTape;
        cassetteBanner.classList.toggle("is-playing", isPlayingTape);
        playTapeIcon.textContent = isPlayingTape ? "❚❚" : "▶";
        playTapeText.textContent = isPlayingTape ? "Spinning..." : "Play Preview";
      }
    });
  }

  // ==================== 6. ИНТЕРАКТИВНАЯ СТЕНА (SUPABASE: wall_notes) ====================
  const wallGrid = document.getElementById("wall-grid");
  const wallForm = document.getElementById("wall-form");
  const wallAuthorInput = document.getElementById("wall-author");
  const wallMsgInput = document.getElementById("wall-message");
  const tagButtons = document.querySelectorAll(".w-tag");
  let selectedWallTag = "vibe";

  let wallNotes = [];
  let userLikes = JSON.parse(localStorage.getItem("synnbled_user_likes")) || {};

  tagButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("click");
      tagButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedWallTag = btn.getAttribute("data-tag") || btn.textContent;
    });
  });

  async function fetchWallNotes() {
    if (!wallGrid) return;
    
    if (!supabaseClient) {
      wallNotes = [
        { id: "fallback_1", author: "Elliot", tag: "# fsociety", text: "Control can sometimes feel like an absolute. But it’s an illusion.", time: "pinned", likes: 24, liked: !!userLikes["fallback_1"] }
      ];
      renderWall();
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from("wall_notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        wallNotes = data.map(item => ({
          id: item.id,
          author: item.author || "anon",
          tag: item.tag || "✦ vibe",
          text: item.text,
          time: new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          likes: item.likes || 0,
          liked: !!userLikes[item.id]
        }));
        renderWall();
      }
    } catch (err) {
      console.warn("Supabase fetch error:", err);
      wallNotes = [
        { id: "fallback_1", author: "Elliot", tag: "# fsociety", text: "Control can sometimes feel like an absolute. But it’s an illusion.", time: "pinned", likes: 24, liked: !!userLikes["fallback_1"] }
      ];
      renderWall();
    }
  }

  function renderWall() {
    if (!wallGrid) return;
    wallGrid.innerHTML = "";
    
    if (wallNotes.length === 0) {
      wallGrid.innerHTML = `<p style="color: var(--text-secondary); font-size: 0.85rem; grid-column: 1/-1;">No messages on the wall yet. Be the first.</p>`;
      return;
    }

    wallNotes.forEach((note) => {
      const card = document.createElement("div");
      card.className = "wall-note";
      card.innerHTML = `
        <div class="note-top">
          <span class="note-author">${escapeHtml(note.author)}</span>
          <span class="note-badge">${escapeHtml(note.tag)}</span>
        </div>
        <p class="note-body">${escapeHtml(note.text)}</p>
        <div class="note-footer">
          <span>${escapeHtml(note.time)}</span>
          <button type="button" class="like-note-btn ${note.liked ? "liked" : ""}" data-id="${note.id}">
            ♥ ${note.likes}
          </button>
        </div>
      `;
      wallGrid.appendChild(card);
    });

    wallGrid.querySelectorAll(".like-note-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        playSfx("click");
        haptic(10);
        const noteId = btn.getAttribute("data-id");
        const note = wallNotes.find(n => String(n.id) === String(noteId));
        if (!note) return;

        if (!note.liked) {
          note.likes += 1;
          note.liked = true;
          userLikes[note.id] = true;
        } else {
          note.likes = Math.max(0, note.likes - 1);
          note.liked = false;
          delete userLikes[note.id];
        }

        localStorage.setItem("synnbled_user_likes", JSON.stringify(userLikes));
        renderWall();

        if (supabaseClient && !String(noteId).startsWith("fallback")) {
          try {
            await supabaseClient
              .from("wall_notes")
              .update({ likes: note.likes })
              .eq("id", note.id);
          } catch (e) {}
        }
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  if (wallForm) {
    wallForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = wallMsgInput.value.trim();
      if (!msg) return;

      playSfx("post");
      haptic([15, 25, 15]);

      const author = wallAuthorInput.value.trim() || "anon";
      const tag = selectedWallTag;
      wallMsgInput.value = "";

      if (supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from("wall_notes")
            .insert([{ author, tag, text: msg, likes: 0 }]);

          if (error) {
            alert("Ошибка отправки в базу: " + error.message);
          } else {
            fetchWallNotes();
          }
        } catch (err) {
          console.error("Insert error:", err);
        }
      } else {
        alert("База данных Supabase не подключена.");
      }
    });
  }

  fetchWallNotes();

  // ==================== 7. DNI LIST ====================
  const dniItems = [
    "@kabelft and her so5sx14 friend",
    "Muslims",
    "T-friendly",
    "Ivti / Misu / Till / ALNST fans",
    "Oliver & Edmond from NU: Carnival",
    "All male characters from Genshin Impact & their fans (especially Tartaglia/Childe)",
    "Antis (puriteens)",
    "Blade from Honkai: Star Rail & Renheng fans",
    "Roblox games fans",
    "Python users",
    "Moral police",
    "Fiction police",
    "People who take pixels too seriously",
    "Snowflakes",
    "White knights",
    "Chronically online",
    "Discourse accounts",
    "Fandom gatekeepers",
    "People who harass artists/writers over fictional ships",
    "Kinkshamers",
    "People who can't separate fiction from reality",
    "Clout chasers",
    "Performative activists",
    "Cancel culture warriors",
    "Dry texters",
    "People who DM without asking",
    "Unsolicited advice givers",
    "People who make their entire personality about one ship (especially yaoi)",
    "Toxic meta slaves",
    "Normies",
    "TikTok brainrot",
    "Passive-aggressive people",
    "Virtue signalers",
    "Anti-selfshippers",
    "Anti-yume",
    "People who call selfshippers delusional",
    "\"He's not real\" people",
    "Reality checkers",
    "Fakeclaimers",
    "Canon-police",
    "People who treat headcanons as canon",
    "Fandom purists",
    "Pro-censorship",
    "People who stalk profiles just to start drama",
    "Callout post makers",
    "Twitlonger writers",
    "Terminally online teenagers",
    "People who use tone indicators unironically",
    "Therapy speak users",
    "People who weaponize mental health terms",
    "People who act like they know me",
    "Parasocial weirdos",
    "Reply guys",
    "Clout goblins",
    "Drama channels / drama accounts",
    "People who can't read",
    "DNI breakers",
    "Subtwt drama starters",
    "People who gatekeep characters",
    "People who hate fun",
    "Boring people",
    "NPCs",
    "Main character syndrome",
    "Pick-mes",
    "Keyboard warriors",
    "Armchair psychologists",
    "People who write essays in the comments",
    "Ratio attempts",
    "Quote tweet warriors",
    "People who get mad over pixels",
    "Unfunny meme spammers",
    "Threads users",
    "Ivan haters",
    "Stalinists / Stalin apologists / Stalin fans",
    "Tankies",
    "Uneducated people",
    "People with zero media literacy",
    "People who don't know basic history",
    "Historical revisionists",
    "People who argue about history/politics without reading a single book",
    "Pseudo-intellectuals",
    "People who get all their info from TikTok",
    "People who lack critical thinking",
    "Black-and-white thinkers",
    "People who can't handle nuanced discussions",
    "People who conflate aesthetic/interest with endorsement",
    "Anti-intellectuals",
    "People who speak on topics they know nothing about",
    "Gullible people",
    "Sheep mentality",
    "People who blindly follow propaganda",
    "Blind haters",
    "Bandwagon haters",
    "Forced hate enjoyers",
    "People who hate things just for the sake of hating",
    "Irrational haters",
    "Fake film critics",
    "Media illiterate critics",
    "People who don't understand basic psychology",
    "People who can't analyze character motivation",
    "Surface-level media consumers",
    "People who miss the entire point of a character",
    "Shallow reviewers",
    "People with zero psychological literacy",
    "2010 Karate Kid remake fans (original 1984 only)",
    "People who mischaracterize Sherlock",
    "Hypocrites",
    "People who don't read the full DNI list",
    "\"I ain't reading allat\" people",
    "Tyrell Wellick & Elliot Alderson / Tyrelliot haters",
    "People who take obvious sarcasm literally",
    "Tone-deaf people",
    "Unsolicited voice message senders",
    "One-word repliers",
    "People who can't hold a conversation to save their life",
    "Personality thieves",
    "Trend-hopping larpers",
    "Stereotype typers",
    "People who use typology as an excuse to be annoying",
    "Pseudo-psychologists",
    "Self-diagnosed everything",
    "People who trauma-dump on strangers without asking",
    "Nosy people",
    "Backseat moderators",
    "Grammar nazis who lose arguments and point out typos",
    "People who edit their comments to look right",
    "Screen-shotting snakes",
    "Two-faced people",
    "Fake friends",
    "People who overexplain obvious jokes",
    "Buzzkills",
    "Walking red flags",
    "Pinterest humor (people who unironically use Pinterest reaction memes)",
    "People with bad breath",
    "People who don't brush their teeth",
    "People with inflated egos",
    "Arrogant know-it-alls",
    "People with a god complex",
    "Self-centered narcissists",
    "People who mispronounce my username as \"sunnbled\" (it's pronounced \"sinnbleed\", learn basic English phonetics)",
    "People with copy-pasted \"DNI: basics\" lists",
    "Python bros who make coding their entire personality",
    "People who brag about writing 10 lines of Python",
    "Vibe coders",
    "People who think learning Python makes them a genius hacker",
    "Tech bros with zero social skills",
    "People who ask stupid questions they could easily Google",
    "Chronically indecisive people",
    "People who apologize for breathing",
    "Fake deep people",
    "Pseudo-philosophers",
    "People who overuse ellipsis (...) in every sentence",
    "People who type like a corporate email in casual chats",
    "People with zero self-awareness",
    "Walking contradictions",
    "People who take everything personally",
    "People who don't like me"
  ];

  const dniContainer = document.getElementById("dni-list");
  const dniCount = document.getElementById("dni-count");
  const dniSearch = document.getElementById("dni-search");
  const checkerBar = document.getElementById("dni-checker-bar");
  const checkerBadge = document.getElementById("checker-badge");
  const checkerVerdict = document.getElementById("checker-verdict");
  const resetDniBtn = document.getElementById("reset-dni-btn");
  const shareDniBtn = document.getElementById("share-dni-btn");
  const randomDniBtn = document.getElementById("random-dni-btn");

  const checkedSet = new Set();

  function updateCheckerBar() {
    if (!checkerBar) return;
    const count = checkedSet.size;
    if (count === 0) {
      checkerBar.classList.remove("triggered");
      checkerBadge.textContent = "0 matches";
      checkerVerdict.textContent = "Clear to interact — welcome.";
      if (resetDniBtn) resetDniBtn.hidden = true;
      if (shareDniBtn) shareDniBtn.hidden = true;
    } else {
      checkerBar.classList.add("triggered");
      checkerBadge.textContent = count === 1 ? "1 match" : `${count} matches`;
      checkerVerdict.textContent = count >= 3
        ? "Critical DNI violation — close this tab immediately."
        : "DNI triggered — please do not interact.";
      if (resetDniBtn) resetDniBtn.hidden = false;
      if (shareDniBtn) shareDniBtn.hidden = false;
    }
  }

  function renderDni(filterText = "") {
    if (!dniContainer) return;
    const query = filterText.toLowerCase().trim();
    const filtered = dniItems.filter(item => item.toLowerCase().includes(query));

    dniContainer.innerHTML = "";
    filtered.forEach(item => {
      const tag = document.createElement("button");
      tag.type = "button";
      tag.className = "dni-tag";
      if (checkedSet.has(item)) tag.classList.add("checked");
      tag.textContent = item;

      tag.addEventListener("click", () => {
        playSfx("click");
        haptic(15);
        if (checkedSet.has(item)) {
          checkedSet.delete(item);
          tag.classList.remove("checked");
        } else {
          checkedSet.add(item);
          tag.classList.add("checked");
        }
        updateCheckerBar();
      });

      dniContainer.appendChild(tag);
    });

    if (dniCount) dniCount.textContent = filtered.length;
  }

  if (randomDniBtn) {
    randomDniBtn.addEventListener("click", () => {
      playSfx("tab");
      haptic(25);
      if (dniSearch) dniSearch.value = "";
      renderDni("");
      const randomItem = dniItems[Math.floor(Math.random() * dniItems.length)];
      const buttons = dniContainer.querySelectorAll(".dni-tag");
      for (let btn of buttons) {
        if (btn.textContent === randomItem) {
          btn.scrollIntoView({ behavior: "smooth", block: "center" });
          btn.classList.add("pulse-highlight");
          setTimeout(() => btn.classList.remove("pulse-highlight"), 1000);
          break;
        }
      }
    });
  }

  if (shareDniBtn) {
    shareDniBtn.addEventListener("click", () => {
      playSfx("post");
      haptic([20, 30, 20]);
      const count = checkedSet.size;
      const textToCopy = `synnbled's DNI check result: ${count} matches. (${count === 0 ? "Clear to interact" : "DNI triggered — abort"})`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const original = shareDniBtn.textContent;
        shareDniBtn.textContent = "Copied Card!";
        setTimeout(() => shareDniBtn.textContent = original, 1800);
      });
    });
  }

  if (resetDniBtn) {
    resetDniBtn.addEventListener("click", () => {
      playSfx("click");
      haptic(10);
      checkedSet.clear();
      updateCheckerBar();
      renderDni(dniSearch ? dniSearch.value : "");
    });
  }

  if (dniSearch) {
    dniSearch.addEventListener("input", (e) => renderDni(e.target.value));
  }
  renderDni();

  // ==================== 8. ОЗВУЧКА НИКА ====================
  const pronounceBtn = document.getElementById("pronounce-btn");
  if (pronounceBtn) {
    pronounceBtn.addEventListener("click", () => {
      if (!("speechSynthesis" in window)) return;
      haptic(10);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("sin bleed");
      utterance.lang = "en-US";
      utterance.rate = 0.92;

      pronounceBtn.classList.add("speaking");
      utterance.onend = () => pronounceBtn.classList.remove("speaking");
      utterance.onerror = () => pronounceBtn.classList.remove("speaking");

      window.speechSynthesis.speak(utterance);
    });
  }

  // ==================== 9. ПОДСКАЗКИ ====================
  const tooltip = document.getElementById("floating-tooltip");
  let activePill = null;

  function positionTooltip(targetEl) {
    if (!tooltip) return;
    const rect = targetEl.getBoundingClientRect();
    tooltip.textContent = targetEl.getAttribute("data-tip");
    tooltip.classList.add("visible");

    const tipRect = tooltip.getBoundingClientRect();
    const margin = 10;
    const isMobile = window.innerWidth <= 820;
    let left, top;

    if (isMobile) {
      left = rect.left + rect.width / 2 - tipRect.width / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));
      top = rect.top - tipRect.height - 8;
      if (top < margin) top = rect.bottom + 8;
    } else {
      left = rect.right + 10;
      if (left + tipRect.width > window.innerWidth - margin) {
        left = rect.left - tipRect.width - 10;
      }
      top = rect.top + rect.height / 2 - tipRect.height / 2;
      top = Math.max(margin, Math.min(top, window.innerHeight - tipRect.height - margin));
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function showTip(pillEl, lock = false) {
    if (activePill && activePill !== pillEl) activePill.classList.remove("active-tip");
    if (lock) {
      activePill = pillEl;
      pillEl.classList.add("active-tip");
    }
    positionTooltip(pillEl);
  }

  function hideTip(force = false) {
    if (!force && activePill) return;
    if (activePill) {
      activePill.classList.remove("active-tip");
      activePill = null;
    }
    if (tooltip) tooltip.classList.remove("visible");
  }

  document.querySelectorAll(".has-tip").forEach(pill => {
    pill.addEventListener("mouseenter", () => {
      if (!activePill) showTip(pill, false);
    });
    pill.addEventListener("mouseleave", () => {
      if (!activePill) hideTip(false);
    });
    pill.addEventListener("click", (e) => {
      e.stopPropagation();
      playSfx("click");
      haptic(10);
      if (activePill === pill) hideTip(true);
      else showTip(pill, true);
    });
  });

  document.addEventListener("click", () => hideTip(true));
  window.addEventListener("scroll", () => hideTip(true), { passive: true });
  window.addEventListener("resize", () => hideTip(true));

  // ==================== 10. ПАСХАЛКА FSOCIETY ====================
  const elliotPill = document.getElementById("elliot-pill");
  const fsocietyBar = document.getElementById("fsociety-bar");
  const exitFsocietyBtn = document.getElementById("exit-fsociety");
  let isFsociety = false;
  let lastElliotTap = 0;

  function toggleFsociety(forceState) {
    isFsociety = typeof forceState === "boolean" ? forceState : !isFsociety;
    playSfx("hack");
    haptic([30, 50, 30]);
    document.body.classList.toggle("fsociety-mode", isFsociety);
    if (fsocietyBar) fsocietyBar.hidden = !isFsociety;
    hideTip(true);
    initParticles();
  }

  if (elliotPill) {
    elliotPill.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      toggleFsociety();
    });

    elliotPill.addEventListener("touchend", (e) => {
      const now = Date.now();
      if (now - lastElliotTap < 350) {
        e.preventDefault();
        toggleFsociety();
        lastElliotTap = 0;
      } else {
        lastElliotTap = now;
      }
    });
  }

  if (exitFsocietyBtn) {
    exitFsocietyBtn.addEventListener("click", () => toggleFsociety(false));
  }

  // ==================== 11. ФОНОВЫЕ ЧАСТИЦЫ И ТЕМА ====================
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let currentTheme = localStorage.getItem("theme") || "dark";

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    const isStarMode = currentTheme === "dark" || isFsociety;
    const count = isStarMode ? 95 : 36;

    for (let i = 0; i < count; i++) {
      if (isStarMode) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.7 + 0.5,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -Math.random() * 0.2 - 0.05,
          alpha: Math.random() * 0.75 + 0.25,
          twinkleSpeed: Math.random() * 0.02 + 0.006,
          phase: Math.random() * Math.PI * 2
        });
      } else {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 20 + 7,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -Math.random() * 0.42 - 0.15,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.022 + 0.008
        });
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isStarMode = currentTheme === "dark" || isFsociety;

    particles.forEach(p => {
      if (isStarMode) {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.twinkleSpeed;

        if (p.y < -5) p.y = canvas.height + 5;
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isFsociety
          ? `rgba(0, 255, 65, ${currentAlpha})`
          : `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fill();
      } else {
        p.wobbleOffset += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobbleOffset) * 0.25;
        p.y += p.vy;

        if (p.y < -p.radius * 2) {
          p.y = canvas.height + p.radius * 2;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 113, 227, 0.06)";
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(0, 113, 227, 0.2)";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x - p.radius * 0.32, p.y - p.radius * 0.32, p.radius * 0.24, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
    });

    requestAnimationFrame(animateParticles);
  }

  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");
  const htmlEl = document.documentElement;

  function applyTheme(theme) {
    currentTheme = theme;
    htmlEl.setAttribute("data-theme", theme);
    if (themeLabel) themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
    localStorage.setItem("theme", theme);
    initParticles();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      playSfx("tab");
      haptic(15);
      if (isFsociety) toggleFsociety(false);
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => {
      playSfx("post");
      haptic(15);
      const text = btn.getAttribute("data-copy");
      navigator.clipboard.writeText(text).then(() => {
        const status = btn.querySelector(".copy-status");
        if (status) {
          status.textContent = "Copied!";
          setTimeout(() => status.textContent = "Copy", 1800);
        }
      });
    });
  });

  resizeCanvas();
  applyTheme(currentTheme);
  animateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });
});