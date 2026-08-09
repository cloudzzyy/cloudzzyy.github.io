(function () {
  "use strict";

  // ==================================================================
  // EDIT THIS SECTION TO UPDATE THE WEBSITE
  //
  // Everything below, down to the "END OF EDITABLE SECTION" comment,
  // is the ONLY place you should need to touch to update your
  // Discord account, status, links, changelog, or account history.
  // Change a value here and it updates everywhere it's shown on the
  // site automatically — nothing else needs to be edited by hand.
  // ==================================================================

  var siteData = {

    // Who you are and your current Discord status.
    identity: {
      name: "cloudzzy",
      discord: "tuff.kid",
      status: "Regularly online",
      lastVerified: "2026-08-08" // format: "YYYY-MM-DD"
    },

    // Your other official links. Discord itself isn't listed here —
    // it comes from identity.discord above, since it has no URL of
    // its own (Discord profiles can't be linked to directly).
    // To add or remove a link, add/remove an object in this list.
    accounts: [
      { label: "GitHub", url: "https://github.com/cloudzzyy" },
      { label: "Website", url: "https://cloudzzyy.github.io/" },
      { label: "guns.lol", url: "https://guns.lol/cloudzzy" }
    ],

    // Previous Discord accounts, if this one is ever replaced.
    // Leave this empty ([]) until you actually have one to add.
    // To add one later, add an object like this inside the [ ]:
    //   { username: "oldname", type: "Previous", date: "2026-07-01", note: "Replaced by tuff.kid" }
    history: [],

    // Site changelog. To add an entry, add an object anywhere in
    // this list — you don't need to put it first, newest is shown
    // automatically based on the date.
    changelog: [
      { date: "2026-08-08", title: "Identity/status page established." }
    ],

    // The public URL that the "copy link" button on the Status view
    // copies. This stays the eventual /status/ URL even while the
    // site is being worked on at /prerelease/.
    publicStatusUrl: "https://cloudzzyy.github.io/status/"
  };

  // ==================================================================
  // END OF EDITABLE SECTION
  // Everything below this line is rendering/interaction logic. You
  // shouldn't need to change it just to update your information.
  // ==================================================================


  // ---- small helpers -------------------------------------------------

  var MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

  // "2026-08-08" -> "8 August 2026"
  function formatDate(iso) {
    var parts = iso.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var day = parseInt(parts[2], 10);
    return day + " " + MONTHS[month] + " " + year;
  }

  // "https://github.com/cloudzzyy" -> "github.com/cloudzzyy"
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

  var ARROW_SVG = '<svg class="link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>';

  var CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';


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

    // Discord row first — no href, just a copy button.
    var discordRow = el("div", "link-row");
    discordRow.innerHTML =
      '<div class="link-left">' +
        '<span class="link-name">Discord</span>' +
        '<span class="link-value">' + siteData.identity.discord + '</span>' +
      '</div>';
    discordRow.appendChild(copyButton(siteData.identity.discord, "copy"));
    list.appendChild(discordRow);

    // Then every other account link, generated from siteData.accounts.
    siteData.accounts.forEach(function (account) {
      var row = el("a", "link-row");
      row.href = account.url;
      row.target = "_blank";
      row.rel = "noopener";
      row.innerHTML =
        '<div class="link-left">' +
          '<span class="link-name">' + account.label + '</span>' +
          '<span class="link-value">' + displayUrl(account.url) + '</span>' +
        '</div>' + ARROW_SVG;
      list.appendChild(row);
    });
  }


  // ---- render: Verify view --------------------------------------------

  function renderVerify() {
    var current = document.getElementById("verifyCurrent");
    if (!current) return;
    current.innerHTML =
      "Current account: <strong>" + siteData.identity.discord + "</strong> · " +
      "verified " + formatDate(siteData.identity.lastVerified);
  }


  // ---- render: History view (changelog + previous accounts) ----------

  function renderHistory() {
    var log = document.getElementById("changelogList");
    if (log) {
      log.innerHTML = "";
      newestFirst(siteData.changelog).forEach(function (entry) {
        var item = el("div", "log-entry");
        item.innerHTML =
          '<div class="log-date">' + formatDate(entry.date) + '</div>' +
          '<div class="log-text">' + entry.title + '</div>';
        log.appendChild(item);
      });
    }

    var historyList = document.getElementById("historyList");
    if (historyList) {
      historyList.innerHTML = "";
      if (siteData.history.length === 0) {
        historyList.appendChild(el("div", "prev-empty", "No previous accounts recorded."));
      } else {
        var wrap = el("div", "prev-list");
        newestFirst(siteData.history).forEach(function (item) {
          var row = el("div", "prev-row");
          row.innerHTML =
            "<span>" + item.username + "</span>" +
            '<span class="reason">' + item.note + " · " + formatDate(item.date) + "</span>";
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
  // NAVIGATION — unchanged from before. Handles the four-item glass
  // nav, the sliding pill, the traveling label, and hash routing.
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
    items[id] = document.querySelector('.nav-item[data-target="' + id + '"]');
    views[id] = document.getElementById(id);
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    pill.style.transform = "translateX(" + item.offsetLeft + "px)";
    pill.style.width = item.offsetWidth + "px";
  }

  // Measures the left/width a given nav item WOULD have if it were the
  // active (expanded) one — without waiting for its label transition to
  // finish. It does this by disabling transitions on the navbar, flipping
  // to the hypothetical state, forcing one synchronous layout pass, and
  // restoring the real current state — all in a single tick, so nothing
  // is ever painted mid-flip and no flicker occurs.
  //
  // This exists because reading offsetWidth right after adding the
  // "active" class (even one requestAnimationFrame later) can catch the
  // label's max-width transition partway through, returning a small,
  // still-collapsing value instead of the button's true expanded size —
  // that mismeasurement is what made the pill collapse into a circle.
  function measureExpandedMetrics(id) {
    var target = items[id];
    if (!navbar || !target) {
      return { left: target ? target.offsetLeft : 0, width: target ? target.offsetWidth : 0 };
    }

    var activeIds = VALID.filter(function (key) {
      return items[key].classList.contains("active");
    });

    navbar.classList.add("no-anim");
    VALID.forEach(function (key) {
      items[key].classList.toggle("active", key === id);
    });
    void navbar.offsetWidth; // force layout with transitions off

    var metrics = { left: target.offsetLeft, width: target.offsetWidth };

    VALID.forEach(function (key) {
      items[key].classList.toggle("active", activeIds.indexOf(key) !== -1);
    });
    void navbar.offsetWidth; // force layout back to the real current state
    navbar.classList.remove("no-anim");

    return metrics;
  }

  function runTravel(fromItem, toId) {
    if (!travel || !travelSpan || reduceMotion) return;
    travelSpan.textContent = labelText(toId);
    travel.style.transition = "none";
    travel.style.transform = "translateX(" + fromItem.offsetLeft + "px)";
    travel.style.opacity = "1";
    // force reflow so the next transform change animates
    void travel.offsetWidth;
    travel.style.transition = "";
    travel.style.transform = "translateX(" + items[toId].offsetLeft + "px)";

    clearTimeout(travelTimer);
    travelTimer = setTimeout(function () {
      travel.style.opacity = "0";
    }, 380);
  }

  function activate(id, opts) {
    opts = opts || {};
    if (!views[id] || !items[id]) id = DEFAULT_ID;
    if (id === currentId && !opts.force) return;

    var previousItem = currentId ? items[currentId] : null;

    // Measure the target's true expanded size BEFORE triggering any
    // transitions (see measureExpandedMetrics for why this has to
    // happen first, synchronously, rather than after the class toggle).
    var metrics = measureExpandedMetrics(id);

    VALID.forEach(function (key) {
      var isActive = key === id;
      views[key].classList.toggle("active", isActive);
      items[key].classList.toggle("active", isActive);
      items[key].setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (previousItem) {
      runTravel(previousItem, id);
    }

    if (pill) {
      pill.style.opacity = "1";
      pill.style.transform = "translateX(" + metrics.left + "px)";
      pill.style.width = metrics.width + "px";
    }

    if (!opts.silent && "#" + id !== location.hash) {
      history.pushState(null, "", "#" + id);
    }

    currentId = id;
  }

  VALID.forEach(function (id) {
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
      if (currentId) movePill(items[currentId]);
    }, 120);
  });

  // Initial view, from the URL hash if present.
  activate(idFromHash(), { silent: true, force: true });

  // Re-measure once fonts/layout have fully settled.
  window.addEventListener("load", function () {
    if (currentId) movePill(items[currentId]);
  });

  // Copy-to-clipboard — works for every button with a data-copy
  // attribute, including the ones rendered dynamically above.
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      var reset = btn.textContent;
      var done = function () {
        btn.textContent = "copied";
        setTimeout(function () {
          btn.textContent = reset;
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () {});
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
