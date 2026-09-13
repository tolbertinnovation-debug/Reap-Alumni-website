(() => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const backToTop = document.querySelector('.back-to-top');
  const form = document.querySelector('#interest-form');
  const toast = document.querySelector('#form-toast');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelector('#current-year').textContent = new Date().getFullYear();

  const closeNavigation = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    primaryNav.classList.remove('open');
    document.body.classList.remove('nav-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryNav.classList.toggle('open', !isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });

  primaryNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });

  const handleScroll = () => {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 650);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('in-view'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -35px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const counters = document.querySelectorAll('[data-count]');
  let countersStarted = false;

  const runCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach((counter) => {
      const target = Number(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const duration = 1200;
      const startedAt = performance.now();

      const update = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(update);
      };

      requestAnimationFrame(update);
    });
  };

  const impactStrip = document.querySelector('.impact-strip');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    counters.forEach((counter) => {
      counter.textContent = `${counter.dataset.count}${counter.dataset.suffix || ''}`;
    });
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        runCounters();
        observer.disconnect();
      }
    }, { threshold: 0.4 });
    counterObserver.observe(impactStrip);
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...primaryNav.querySelectorAll('a[href^="#"]')];

  const updateActiveLink = () => {
    const position = window.scrollY + 170;
    let activeId = '';
    sections.forEach((section) => {
      if (position >= section.offsetTop && position < section.offsetTop + section.offsetHeight) {
        activeId = section.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const originalLabel = button.innerHTML;
    button.disabled = true;
    button.textContent = 'Interest Recorded ✓';
    toast.classList.add('show');

    window.setTimeout(() => {
      form.reset();
      button.disabled = false;
      button.innerHTML = originalLabel;
    }, 1800);

    window.setTimeout(() => toast.classList.remove('show'), 5200);
  });
})();
