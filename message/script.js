(function () {
  "use strict";

  // ==================================================================
  // EDIT THIS SECTION TO UPDATE THE WEBSITE
  // ==================================================================

  var siteData = {

    identity: {
      name: "cloudzzy",
      discord: "tuff.kid",
      status: "Regularly online",
      lastVerified: "2026-08-08"
    },

    accounts: [
      { label: "GitHub", url: "https://github.com/cloudzzyy" },
      { label: "Website", url: "https://cloudzzyy.github.io/" },
      { label: "guns.lol", url: "https://guns.lol/cloudzzy" }
    ],

    history: [],

    changelog: [
      { date: "2026-08-08", title: "Identity/status page established." }
    ],

    publicStatusUrl: "https://cloudzzyy.github.io/status/",

    contact: {
      endpoint: "https://formspree.io/f/mrpzpajk"
    }
  };

  // ==================================================================
  // END OF EDITABLE SECTION
  // ==================================================================

  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function formatDate(iso) {
    var parts = iso.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    return day + " " + MONTHS[month] + " " + year;
  }

  function displayUrl(url) {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  function newestFirst(list) {
    return list.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0);
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function copyButton(value, label) {
    var btn = el("button", "copy-btn", label || "copy");
    btn.type = "button";
    btn.setAttribute("data-copy", value);
    return btn;
  }

  var ARROW_SVG =
    '<svg class="link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>';

  var CHECK_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  // ---- render: Status view -------------------------------------------

  function renderStatus() {
    var identity = siteData.identity;

    var brandName = document.getElementById("brandName");
    if (brandName) brandName.textContent = identity.name;

    var discordName = document.getElementById("discordName");
    if (discordName) {
      discordName.textContent = "";
      discordName.appendChild(document.createTextNode(identity.discord + " "));
      discordName.appendChild(copyButton(identity.discord, "copy"));
    }

    var statusLive = document.getElementById("statusLive");
    if (statusLive) {
      statusLive.innerHTML =
        '<span class="status-dot" aria-hidden="true"></span>' +
        '<span class="label">' + identity.status + '</span>' +
        '<span class="sep">·</span>' +
        '<span class="verified">verified ' + formatDate(identity.lastVerified) + '</span>';
    }

    var badge = document.getElementById("verifyBadge");
    if (badge) {
      badge.innerHTML =
        CHECK_SVG +
        '<span class="vb-label">Verified</span>' +
        '<span class="sep">·</span>' +
        '<span>' + identity.discord + '</span>' +
        '<span class="sep">·</span>' +
        '<span>' + formatDate(identity.lastVerified) + '</span>';
    }

    var copyLinkBtn = document.getElementById("copyStatusLinkBtn");
    if (copyLinkBtn) {
      copyLinkBtn.setAttribute("data-copy", siteData.publicStatusUrl);
    }
  }

  // ---- render: Accounts view -----------------------------------------

  function renderAccounts() {
    var list = document.getElementById("accountsList");
    if (!list) return;

    list.innerHTML = "";

    var discordRow = el("div", "link-row");

    discordRow.innerHTML =
      '<div class="link-left">' +
        '<span class="link-name">Discord</span>' +
        '<span class="link-value">' + siteData.identity.discord + '</span>' +
      '</div>';

    discordRow.appendChild(
      copyButton(siteData.identity.discord, "copy")
    );

    list.appendChild(discordRow);

    siteData.accounts.forEach(function (account) {
      var row = el("a", "link-row");

      row.href = account.url;
      row.target = "_blank";
      row.rel = "noopener";

      row.innerHTML =
        '<div class="link-left">' +
          '<span class="link-name">' + account.label + '</span>' +
          '<span class="link-value">' + displayUrl(account.url) + '</span>' +
        '</div>' +
        ARROW_SVG;

      list.appendChild(row);
    });
  }

  // ---- render: Verify view -------------------------------------------

  function renderVerify() {
    var current = document.getElementById("verifyCurrent");
    if (!current) return;

    current.innerHTML =
      "Current account: <strong>" +
      siteData.identity.discord +
      "</strong> · verified " +
      formatDate(siteData.identity.lastVerified);
  }

  // ---- render: History view ------------------------------------------

  function renderHistory() {
    var log = document.getElementById("changelogList");

    if (log) {
      log.innerHTML = "";

      newestFirst(siteData.changelog).forEach(function (entry) {
        var item = el("div", "log-entry");

        item.innerHTML =
          '<div class="log-date">' +
          formatDate(entry.date) +
          '</div>' +
          '<div class="log-text">' +
          entry.title +
          '</div>';

        log.appendChild(item);
      });
    }

    var historyList = document.getElementById("historyList");

    if (historyList) {
      historyList.innerHTML = "";

      if (siteData.history.length === 0) {
        historyList.appendChild(
          el(
            "div",
            "prev-empty",
            "No previous accounts recorded."
          )
        );
      } else {
        var wrap = el("div", "prev-list");

        newestFirst(siteData.history).forEach(function (item) {
          var row = el("div", "prev-row");

          row.innerHTML =
            "<span>" +
            item.username +
            "</span>" +
            '<span class="reason">' +
            item.note +
            " · " +
            formatDate(item.date) +
            "</span>";

          wrap.appendChild(row);
        });

        historyList.appendChild(wrap);
      }
    }
  }

  renderStatus();
  renderAccounts();
  renderVerify();
  renderHistory();

  // ==================================================================
  // NAVIGATION
  // ==================================================================

  var VALID = ["status", "accounts", "verify", "history"];
  var DEFAULT_ID = "status";

  var navbar = document.querySelector(".navbar");
  var pill = document.querySelector(".nav-pill");
  var travel = document.querySelector(".nav-travel");
  var travelSpan = travel ? travel.querySelector("span") : null;

  var items = {};
  var views = {};

  VALID.forEach(function (id) {
    items[id] = document.querySelector(
      '.nav-item[data-target="' + id + '"]'
    );

    views[id] = document.getElementById(id);
  });

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var currentId = null;
  var travelTimer = null;

  function idFromHash() {
    var h = (location.hash || "").replace("#", "");
    return VALID.indexOf(h) !== -1 ? h : DEFAULT_ID;
  }

  function labelText(id) {
    var span = items[id].querySelector(".nav-label span");
    return span ? span.textContent : "";
  }

  function movePill(item) {
    if (!pill || !item) return;

    pill.style.opacity = "1";
    pill.style.transform =
      "translateX(" + item.offsetLeft + "px)";
    pill.style.width = item.offsetWidth + "px";
  }

  function measureExpandedMetrics(id) {
    var target = items[id];

    if (!navbar || !target) {
      return {
        left: target ? target.offsetLeft : 0,
        width: target ? target.offsetWidth : 0
      };
    }

    var activeIds = VALID.filter(function (key) {
      return items[key].classList.contains("active");
    });

    navbar.classList.add("no-anim");

    VALID.forEach(function (key) {
      items[key].classList.toggle("active", key === id);
    });

    void navbar.offsetWidth;

    var metrics = {
      left: target.offsetLeft,
      width: target.offsetWidth
    };

    VALID.forEach(function (key) {
      items[key].classList.toggle(
        "active",
        activeIds.indexOf(key) !== -1
      );
    });

    void navbar.offsetWidth;
    navbar.classList.remove("no-anim");

    return metrics;
  }

  function runTravel(fromItem, toId) {
    if (!travel || !travelSpan || reduceMotion) return;

    travelSpan.textContent = labelText(toId);

    travel.style.transition = "none";
    travel.style.transform =
      "translateX(" + fromItem.offsetLeft + "px)";
    travel.style.opacity = "1";

    void travel.offsetWidth;

    travel.style.transition = "";
    travel.style.transform =
      "translateX(" + items[toId].offsetLeft + "px)";

    clearTimeout(travelTimer);

    travelTimer = setTimeout(function () {
      travel.style.opacity = "0";
    }, 380);
  }

  function activate(id, opts) {
    opts = opts || {};

    if (!views[id] || !items[id]) {
      id = DEFAULT_ID;
    }

    if (id === currentId && !opts.force) return;

    var previousItem = currentId
      ? items[currentId]
      : null;

    var metrics = measureExpandedMetrics(id);

    VALID.forEach(function (key) {
      var isActive = key === id;

      views[key].classList.toggle("active", isActive);
      items[key].classList.toggle("active", isActive);

      items[key].setAttribute(
        "aria-current",
        isActive ? "true" : "false"
      );
    });

    if (previousItem) {
      runTravel(previousItem, id);
    }

    if (pill) {
      pill.style.opacity = "1";
      pill.style.transform =
        "translateX(" + metrics.left + "px)";
      pill.style.width = metrics.width + "px";
    }

    if (!opts.silent && "#" + id !== location.hash) {
      history.pushState(null, "", "#" + id);
    }

    currentId = id;
  }

  VALID.forEach(function (id) {
    if (!items[id]) return;

    items[id].addEventListener("click", function () {
      activate(id);
    });
  });

  window.addEventListener("popstate", function () {
    activate(idFromHash(), { silent: true });
  });

  var resizeTimer = null;

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
      if (currentId) {
        movePill(items[currentId]);
      }
    }, 120);
  });

  activate(idFromHash(), {
    silent: true,
    force: true
  });

  window.addEventListener("load", function () {
    if (currentId) {
      movePill(items[currentId]);
    }
  });

  // ==================================================================
  // CONTACT MODAL
  // ==================================================================

  (function initContact() {
    var openBtn = document.getElementById("openContactBtn");
    var backdrop = document.getElementById("contactBackdrop");
    var panel = backdrop
      ? backdrop.querySelector(".modal-panel")
      : null;

    var closeBtn = document.getElementById("contactCloseBtn");
    var form = document.getElementById("contactForm");
    var statusEl = document.getElementById("contactStatus");
    var submitBtn = document.getElementById("contactSubmitBtn");
    var successEl = document.getElementById("contactSuccess");
    var againBtn = document.getElementById("contactAgainBtn");
    var nameInput = document.getElementById("contactName");
    var messageInput = document.getElementById("contactMessage");

    if (!openBtn || !backdrop || !form) return;

    if (siteData.contact && siteData.contact.endpoint) {
      form.setAttribute(
        "action",
        siteData.contact.endpoint
      );
    }

    form.style.display = "";

    if (successEl) {
      successEl.style.display = "none";
    }

    var isSubmitting = false;
    var lastFocused = null;

    function setStatus(message, state) {
      if (!statusEl) return;

      statusEl.textContent = message || "";

      if (state) {
        statusEl.setAttribute("data-state", state);
      } else {
        statusEl.removeAttribute("data-state");
      }
    }

    function resetForm() {
      form.reset();
      setStatus("", null);
      form.style.display = "";

      if (successEl) {
        successEl.style.display = "none";
      }
    }

    function focusableElements() {
      if (!panel) return [];

      var nodes = panel.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      return Array.prototype.slice
        .call(nodes)
        .filter(function (node) {
          return !node.disabled && node.offsetParent !== null;
        });
    }

    function onKeydown(e) {
      if (e.key === "Escape") {
        closeModal();
        return;
      }

      if (e.key === "Tab") {
        var focusable = focusableElements();

        if (focusable.length === 0) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (
          e.shiftKey &&
          document.activeElement === first
        ) {
          e.preventDefault();
          last.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === last
        ) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function openModal() {
      if (form.style.display === "none") {
        resetForm();
      }

      lastFocused = document.activeElement;

      backdrop.classList.add("open");
      document.body.style.overflow = "hidden";

      document.addEventListener(
        "keydown",
        onKeydown
      );

      window.setTimeout(function () {
        if (nameInput) {
          nameInput.focus();
        }
      }, 50);
    }

    function closeModal() {
      backdrop.classList.remove("open");
      document.body.style.overflow = "";

      document.removeEventListener(
        "keydown",
        onKeydown
      );

      if (
        lastFocused &&
        typeof lastFocused.focus === "function"
      ) {
        lastFocused.focus();
      }
    }

    openBtn.addEventListener("click", openModal);

    if (closeBtn) {
      closeBtn.addEventListener(
        "click",
        closeModal
      );
    }

    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    if (againBtn) {
      againBtn.addEventListener("click", function () {
        resetForm();

        if (nameInput) {
          nameInput.focus();
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (isSubmitting) return;

      if (
        messageInput &&
        !messageInput.value.trim()
      ) {
        messageInput.focus();

        setStatus(
          "Please write a message before sending.",
          "error"
        );

        return;
      }

      isSubmitting = true;

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      setStatus("", null);

      var endpoint = form.getAttribute("action");
      var formData = new FormData(form);

      fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: formData
      })
        .then(function (response) {
          if (response.ok) {
            form.style.display = "none";

            if (successEl) {
              successEl.style.display = "flex";
            }

            if (againBtn) {
              againBtn.focus();
            }
          } else {
            setStatus(
              "Something went wrong — please try again.",
              "error"
            );
          }
        })
        .catch(function () {
          setStatus(
            "Something went wrong — please try again.",
            "error"
          );
        })
        .finally(function () {
          isSubmitting = false;
          submitBtn.disabled = false;
          submitBtn.textContent = "Send message";
        });
    });
  })();

  // ==================================================================
  // COPY TO CLIPBOARD
  // ==================================================================

  document
    .querySelectorAll("[data-copy]")
    .forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-copy");
        var reset = btn.textContent;

        var done = function () {
          btn.textContent = "copied";

          setTimeout(function () {
            btn.textContent = reset;
          }, 1400);
        };

        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {
          navigator.clipboard
            .writeText(value)
            .then(done)
            .catch(function () {});
        } else {
          var ta = document.createElement("textarea");

          ta.value = value;
          ta.style.position = "fixed";
          ta.style.opacity = "0";

          document.body.appendChild(ta);

          ta.select();

          try {
            document.execCommand("copy");
            done();
          } catch (e) {}

          document.body.removeChild(ta);
        }
      });
    });
})();

// ======================================================================
// PAGE VIEW TRACKING
// ======================================================================

(function trackPageView() {
  var TRACK_URL =
    "https://syiorcgftobjehyzypbt.supabase.co/functions/v1/track";

  try {
    fetch(TRACK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        path: window.location.pathname
      }),
      keepalive: true
    }).catch(function () {
      // Tracking failure never affects the website.
    });
  } catch (e) {
    // Covers environments where fetch itself throws.
  }
})();
