import { parse } from 'https://cdn.jsdelivr.net/npm/smol-toml@1.4.1/+esm';

fetch('resume.toml')
  .then(r => {
    if (!r.ok) throw new Error('Failed to fetch resume.toml');
    return r.text();
  })
  .then(text => render(parse(text)))
  .catch(err => {
    console.error('Resume load error:', err);
    document.getElementById('hero-name').textContent = 'Amit Srivastava';
    document.getElementById('hero-eyebrow').textContent = 'CX Engineering Leader · Author of NXS';
  });

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(d) {
  const id = d.identity;

  // Meta
  document.title = `${id.name} — ${id.tag}`;
  document.querySelector('meta[name="description"]').content = d.summary.text;

  // Hero
  document.getElementById('hero-eyebrow').textContent = id.tag;
  document.getElementById('hero-name').innerHTML =
    id.name.split(' ').map((w, i) => i === 1 ? `<em>${esc(w)}</em>` : esc(w)).join(' ');
  document.getElementById('hero-summary').textContent = d.summary.text;

  // Contact
  document.getElementById('hero-contact').innerHTML = `
    <a href="mailto:${esc(id.email)}">${esc(id.email)}</a>
    <a href="https://${esc(id.linkedin)}" target="_blank" rel="noopener">${esc(id.linkedin)}</a>
    <a href="https://${esc(id.github)}" target="_blank" rel="noopener">${esc(id.github)}</a>
    <span>${esc(id.location)}</span>
  `;

  // Impact
  document.getElementById('impact-bar').innerHTML = d.impact.map(i => `
    <div class="impact-cell">
      <div class="impact-number">${esc(i.number)}</div>
      <div class="impact-label">${esc(i.label)}</div>
    </div>
  `).join('');

  // Experience
  document.getElementById('experience-list').innerHTML = d.experience.map(e => `
    <div class="role reveal">
      <div class="role-left">
        <div class="role-title">${esc(e.title)}</div>
        <div class="role-company">${esc(e.company)}</div>
        <div class="role-dates">${esc(e.start)} — ${esc(e.end)}</div>
      </div>
      <div class="role-right">
        ${e.context ? `<div class="role-context">${esc(e.context)}</div>` : ''}
        <ul class="bullets">
          ${e.bullets.map(b => `<li>${esc(b)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // IP
  document.getElementById('ip-list').innerHTML = d.ip.map(i => `
    <div class="ip-item">
      <div class="ip-name">${esc(i.name)}</div>
      <div class="ip-meta">${esc(i.meta)}</div>
      <div class="ip-desc">${esc(i.description)}</div>
    </div>
  `).join('');

  // Skills
  document.getElementById('skills-list').innerHTML = d.skill_group.map(s => `
    <div class="skill-item">
      <div class="skill-cat">${esc(s.category)}</div>
      <div class="skill-items">${esc(s.items)}</div>
    </div>
  `).join('');

  // Certifications
  document.getElementById('cert-list').innerHTML = d.certification.map(c => `
    <span class="cert-tag">${esc(c.name)}</span>
  `).join('');

  // Education
  document.getElementById('education-content').innerHTML = `
    <div class="edu-degree">${esc(d.education.degree)}</div>
    <div class="edu-inst">${esc(d.education.institution)}</div>
    <div class="edu-year">${esc(d.education.years)}</div>
  `;

  // Languages
  document.getElementById('languages-content').innerHTML = `
    <div class="lang-text">${esc(d.languages.list)}</div>
  `;

  // Nav scroll
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
