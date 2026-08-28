const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer:fine)').matches;
document.querySelectorAll('.bar').forEach((bar) => bar.remove());
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => entry.target.classList.add('in'), index % 2 === 0 ? 0 : 80);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
document.querySelectorAll('.exp-item').forEach((item) => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { item.classList.add('in'); observer.unobserve(item); }
  }, { threshold: 0.3 });
  observer.observe(item);
});
document.querySelectorAll('[data-count]').forEach((element) => {
  const target = Number(element.dataset.count);
  const decimals = Number(element.dataset.decimals || 0);
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    if (reduceMotion) element.textContent = target.toFixed(decimals);
    else {
      const start = performance.now();
      const animate = (time) => { const progress = Math.min((time - start) / 1200, 1); element.textContent = (target * progress).toFixed(decimals); if (progress < 1) requestAnimationFrame(animate); };
      requestAnimationFrame(animate);
    }
    observer.unobserve(element);
  }, { threshold: 0.5 });
  observer.observe(element);
});
if (finePointer && !reduceMotion) {
  const hero = document.getElementById('hero-spot');
  hero.addEventListener('mousemove', (event) => { const bounds = hero.getBoundingClientRect(); hero.style.setProperty('--mx', `${((event.clientX - bounds.left) / bounds.width) * 100}%`); hero.style.setProperty('--my', `${((event.clientY - bounds.top) / bounds.height) * 100}%`); });
  const frame = document.getElementById('photoFrame');
  const stage = frame.parentElement;
  stage.addEventListener('mousemove', (event) => { const bounds = frame.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width - 0.5; const y = (event.clientY - bounds.top) / bounds.height - 0.5; frame.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`; frame.classList.add('tilt'); });
  stage.addEventListener('mouseleave', () => { frame.style.transform = 'rotateY(0deg) rotateX(0deg)'; frame.classList.remove('tilt'); });
}
