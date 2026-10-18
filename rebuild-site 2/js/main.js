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
     A form still pointing at action="#" is unwired — it just shows a
     local placeholder message, so the site works the moment you
     publish it even before an email tool is connected.

     A form with a real action (data-provider-connected="mailerlite",
     action pointing at an assets.mailerlite.com endpoint) is submitted
     by fetch() in the background with mode:"no-cors" instead of letting
     the browser navigate there directly — a normal form POST to that
     endpoint would carry the visitor away from the site to a bare JSON
     response. "no-cors" fires the request and can't read the response,
     but that's fine: MailerLite still receives and processes the
     signup, and we just show our own on-page thank-you message once
     the request has gone out. */
  document.querySelectorAll('.js-signup-form').forEach(function (form) {
    var isConnected = form.hasAttribute('data-provider-connected') && form.getAttribute('action') !== '#';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type=email]');
      var note = form.querySelector('.form-result');
      if (!email || !email.value) return;

      if (!isConnected) {
        if (note) {
          note.textContent = "Almost there — this form isn't connected to an email tool yet. See the setup guide (step 5) to wire it up in a few minutes.";
          note.style.display = 'block';
        }
        return;
      }

      var submitBtn = form.querySelector('button[type=submit]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(form.getAttribute('action'), {
        method: 'POST',
        mode: 'no-cors',
        body: new FormData(form)
      }).then(function () {
        form.reset();
        // Hide just the field + button (not the whole <form>) so the
        // confirmation note, which lives inside the form, stays visible.
        form.querySelectorAll('input, button').forEach(function (el) { el.style.display = 'none'; });
        if (note) {
          note.textContent = "You're in — check your inbox (and spam folder, just in case) for the confirmation email.";
          note.style.display = 'block';
        }
      }).catch(function () {
        if (submitBtn) submitBtn.disabled = false;
        if (note) {
          note.textContent = "Something went wrong sending that — mind trying again in a moment?";
          note.style.display = 'block';
        }
      });
    });
  });

});
