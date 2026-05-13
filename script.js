// Fetch resume.toml and render the page
fetch('resume.toml')
  .then(r => r.text())
  .then(text => {
    const data = TOML.parse(text);
    render(data);
  })
  .catch(err => {
    console.error('Failed to load resume.toml:', err);
  });

function render(d) {
  // Hero
  const eyebrow = document.getElementById('hero-eyebrow');
  eyebrow.textContent = d.identity.tag;

  document.getElementById('hero-name').textContent = d.identity.name;
  document.title = d.identity.name + ' — ' + d.identity.tag;

  document.getElementById('hero-summary').textContent = d.summary.text;

  // Contact
  const contact = document.getElementById('hero-contact');
  contact.innerHTML = `
    <a href="mailto:${d.identity.email}">${d.identity.email}</a>
    <a href="https://${d.identity.linkedin}" target="_blank">${d.identity.linkedin}</a>
    <a href="https://${d.identity.github}" target="_blank">${d.identity.github}</a>
    <span>${d.identity.location}</span>
  `;

  // Impact bar
  const bar = document.getElementById('impact-bar');
  bar.innerHTML = d.impact.map(i => `
    <div class="impact-cell">
      <div class="impact-number">${i.number}</div>
      <div class="impact-label">${i.label}</div>
    </div>
  `).join('');

  // Experience
  const expList = document.getElementById('experience-list');
  expList.innerHTML = d.experience.map(e => `
    <div class="role">
      <div class="role-left">
        <div class="role-title">${e.title}</div>
        <div class="role-company">${e.company}</div>
        <div class="role-dates">${e.start} — ${e.end}</div>
      </div>
      <div class="role-right">
        ${e.context ? `<div class="role-context">${e.context}</div>` : ''}
        <ul class="bullets">
          ${e.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  // IP
  const ipList = document.getElementById('ip-list');
  ipList.innerHTML = d.ip.map(i => `
    <div class="ip-item">
      <div class="ip-name">${i.name}</div>
      <div class="ip-meta">${i.meta}</div>
      <div class="ip-desc">${i.description}</div>
    </div>
  `).join('');

  // Skills
  const skillsList = document.getElementById('skills-list');
  skillsList.innerHTML = d.skill_group.map(s => `
    <div class="skill-item">
      <div class="skill-cat">${s.category}</div>
      <div class="skill-items">${s.items}</div>
    </div>
  `).join('');

  // Certifications
  const certList = document.getElementById('cert-list');
  certList.innerHTML = d.certification.map(c => `
    <span class="cert-tag">${c.name}</span>
  `).join('');

  // Education
  const edu = document.getElementById('education-content');
  edu.innerHTML = `
    <div class="edu-degree">${d.education.degree}</div>
    <div class="edu-inst">${d.education.institution}</div>
    <div class="edu-year">${d.education.years}</div>
  `;

  // Languages
  document.getElementById('languages-content').innerHTML = `
    <div class="lang-text">${d.languages.list}</div>
  `;

  // Nav scroll shadow
  window.addEventListener('scroll', () => {
    document.getElementById('nav').style.borderBottomColor =
      window.scrollY > 10 ? 'var(--border)' : 'transparent';
  }, { passive: true });

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
