/* =========================================================
   THE REBUILD — shared site JS
   No build step, no framework. Three small jobs:
   1. Mobile nav toggle (hamburger)
   2. Blog category filter
   3. Signup form -> provider submission (see foundations.html
      and the SETUP GUIDE for how to wire this to your email tool)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close the menu when a link is tapped
    nav.querySelectorAll('.nav-links a, .nav-actions a').forEach(function (link) {
      link.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* ---------- 2. Blog category filter ---------- */
  var filters = document.querySelectorAll('.filter');
  var cards = document.querySelectorAll('.blog-card');
  if (filters.length && cards.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (f) { f.classList.remove('active'); });
        btn.classList.add('active');
        var pillar = btn.getAttribute('data-pillar');
        cards.forEach(function (card) {
          var match = pillar === 'all' || card.getAttribute('data-pillar') === pillar;
          card.closest('.blog-card-wrap') ? (card.closest('.blog-card-wrap').style.display = match ? '' : 'none') : (card.style.display = match ? '' : 'none');
        });
      });
    });
  }

  /* ---------- 3. Signup forms ----------
     Every form with class "js-signup-form" is handled the same way.
     Out of the box it just shows a local confirmation message, so the
     site works the moment you publish it. Once you connect a real
     email tool (MailerLite etc — see the setup guide, step 5) this
     form should instead POST to the embed snippet your provider gives
     you, or you can leave this fallback in place and simply point the
     <form action="..."> at your provider's form endpoint directly,
     in which case this script steps out of the way automatically. */
  document.querySelectorAll('.js-signup-form').forEach(function (form) {
    if (form.hasAttribute('data-provider-connected')) return; // real endpoint wired up — let it submit normally
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type=email]');
      var note = form.querySelector('.form-result');
      if (!email || !email.value) return;
      if (note) {
        note.textContent = "Almost there — this form isn't connected to an email tool yet. See the setup guide (step 5) to wire it up in a few minutes.";
        note.style.display = 'block';
      }
    });
  });

});
