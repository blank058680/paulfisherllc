/* Ashford & Wray LLP — interactions */
(function () {
  "use strict";

  /* Sticky header */
  var header = document.querySelector(".header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    var top = document.querySelector(".to-top");
    if (top) top.classList.toggle("show", window.scrollY > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var burger = document.querySelector(".burger");
  var mobile = document.querySelector(".mobile-menu");
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      burger.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        burger.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Search overlay */
  var searchBtn = document.querySelector("[data-search-open]");
  var searchOverlay = document.querySelector(".search-overlay");
  var searchClose = document.querySelector(".search-close");
  function toggleSearch(state) {
    if (!searchOverlay) return;
    searchOverlay.classList.toggle("open", state);
    if (state) { var i = searchOverlay.querySelector("input"); if (i) setTimeout(function(){ i.focus(); }, 120); }
  }
  if (searchBtn) searchBtn.addEventListener("click", function () { toggleSearch(true); });
  if (searchClose) searchClose.addEventListener("click", function () { toggleSearch(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleSearch(false); });

  /* Back to top */
  var toTop = document.querySelector(".to-top");
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* FAQ accordion */
  document.querySelectorAll(".acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      var item = head.parentElement;
      var body = head.nextElementSibling;
      var isOpen = item.classList.contains("open");
      item.classList.toggle("open", !isOpen);
      body.style.maxHeight = isOpen ? null : body.scrollHeight + "px";
    });
  });

  /* Testimonial carousel */
  var car = document.querySelector(".tst");
  if (car) {
    var slidesEl = car.querySelector(".tst__slides");
    var slides = car.querySelectorAll(".tst__slide");
    var dotsWrap = car.querySelector(".tst__dots");
    var prev = car.querySelector("[data-prev]");
    var next = car.querySelector("[data-next]");
    var i = 0, timer;
    slides.forEach(function (_, idx) {
      var d = document.createElement("button");
      d.className = "tst__dot" + (idx === 0 ? " active" : "");
      d.setAttribute("aria-label", "Go to review " + (idx + 1));
      d.addEventListener("click", function () { go(idx); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll(".tst__dot");
    function go(n) {
      i = (n + slides.length) % slides.length;
      slidesEl.style.transform = "translateX(-" + i * 100 + "%)";
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });
      restart();
    }
    function restart() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6000); }
    if (prev) prev.addEventListener("click", function () { go(i - 1); });
    if (next) next.addEventListener("click", function () { go(i + 1); });
    restart();
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Animated counters */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var suffix = el.getAttribute("data-suffix") || "";
        var prefix = el.getAttribute("data-prefix") || "";
        var dec = (target % 1 !== 0) ? 1 : 0;
        var start = null, dur = 1800;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = (target * eased).toFixed(dec);
          el.textContent = prefix + Number(val).toLocaleString("en-GB") + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Form + newsletter (demo handlers) */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = f.querySelector(".form-note") || (function () {
        var n = document.createElement("p"); n.className = "form-note"; n.style.marginTop = "14px"; n.style.color = "#2f7a3f"; n.style.fontWeight = "600"; f.appendChild(n); return n;
      })();
      note.textContent = f.getAttribute("data-demo");
      f.reset();
    });
  });

  /* Newsletter signup (EmailJS) */
  document.querySelectorAll("form.newsletter").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = f.querySelector(".form-note") || (function () {
        var n = document.createElement("p"); n.className = "form-note"; n.style.marginTop = "10px"; n.style.fontSize = "0.85rem"; n.style.fontWeight = "600"; f.appendChild(n); return n;
      })();
      var submitBtn = f.querySelector("button[type=submit]");
      submitBtn.disabled = true;

      emailjs.sendForm("service_lvli5rh", "template_x91qoaj", f)
        .then(function () {
          note.style.color = "#2f7a3f";
          note.textContent = "Thank you — you're subscribed to our newsletter.";
          f.reset();
        })
        .catch(function (error) {
          note.style.color = "#b3261e";
          note.textContent = "Something went wrong. Please try again.";
          console.error("EmailJS error:", error);
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  });

  /* Year */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
