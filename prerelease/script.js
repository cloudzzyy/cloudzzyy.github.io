(function () {
  "use strict";

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

  // Copy-to-clipboard for the Discord username.
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
