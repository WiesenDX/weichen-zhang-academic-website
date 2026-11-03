const { projects, publications, experience, honors } = window.siteData;

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function renderProject(project) {
  const visual = renderProjectVisual(project, "project-image");

  return `
    <article class="project project--${project.group} ${project.featured ? "project--featured" : ""}" id="${project.id}">
      <header class="project-head">
        <h3>${project.detailHref ? `<a class="project-title-link" href="${project.detailHref}">${project.title}</a>` : project.title}</h3>
        <p class="project-subtitle">${project.subtitle}</p>
      </header>
      ${visual}
      <div class="project-copy">
        ${(project.detailHref || project.links.length) ? `<div class="link-row">${project.detailHref ? `<a href="${project.detailHref}">View project<span aria-hidden="true">→</span></a>` : ""}${project.links.map(link => `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label}<span aria-hidden="true">↗</span></a>`).join("")}</div>` : ""}
      </div>
    </article>`;
}

function renderProjectVisual(project, className) {
  if (project.coverImages?.length) {
    return `<figure class="${className} ${className}--collage">${project.coverImages.map((src, index) => `<span><img src="${src}" alt="${index === 0 ? project.imageAlt : ""}" loading="lazy"></span>`).join("")}</figure>`;
  }
  return project.image ? `<figure class="${className}"><img src="${project.image}" alt="${project.imageAlt}" loading="lazy"></figure>` : "";
}

function renderCarouselProject(project, duplicate = false) {
  return `
    <a class="carousel-project carousel-project--${project.group} carousel-project--${project.id}" href="${project.detailHref}"${duplicate ? ' aria-hidden="true" tabindex="-1"' : ""}>
      ${renderProjectVisual({...project, imageAlt: duplicate ? "" : project.imageAlt}, "carousel-project-visual")}
      <div><h3>${project.title}</h3><p>${project.subtitle}</p></div>
    </a>`;
}

function emphasizeName(authors) {
  return authors.replaceAll("Zhang, W.", "<strong>Zhang, W.</strong>");
}

function renderPublication(item) {
  return `
    <article class="publication" data-topic="${item.topic}">
      <time>${item.year}</time>
      <div>
        <p class="authors">${emphasizeName(item.authors)}</p>
        <h3>${item.title}</h3>
        <p class="venue">${item.venue}</p>
      </div>
      <a href="${item.doi}" target="_blank" rel="noreferrer" aria-label="Open DOI for ${item.title}">DOI <span aria-hidden="true">↗</span></a>
    </article>`;
}

qsa("[data-project-list]").forEach(projectsGrid => {
  const group = projectsGrid.dataset.projectGroup;
  const view = projectsGrid.dataset.view;
  const limit = Number(projectsGrid.dataset.limit || projects.length);
  let selection = group ? projects.filter(project => project.group === group) : projects;
  if (view === "home") {
    selection = selection.filter(project => project.image && project.detailHref);
    projectsGrid.classList.add("projects-carousel");
    projectsGrid.innerHTML = `<div class="projects-carousel-track">${selection.map(project => renderCarouselProject(project)).join("")}${selection.map(project => renderCarouselProject(project, true)).join("")}</div>`;
    return;
  }
  projectsGrid.innerHTML = selection.slice(0, limit).map(renderProject).join("");
});

const publicationsList = qs("#publications-list");
if (publicationsList) {
  const limit = Number(publicationsList.dataset.limit || publications.length);
  publicationsList.innerHTML = publications.slice(0, limit).map(renderPublication).join("");
}

const experienceList = qs("#experience-list");
if (experienceList) {
  experienceList.innerHTML = experience.map(item => `
    <article class="experience-item">
      <time>${item.period}</time>
      <div><h3>${item.place}</h3><p class="experience-role">${item.roleHref ? `<a href="${item.roleHref}" target="_blank" rel="noreferrer">${item.role}</a>` : item.role}</p><p>${item.detail}</p></div>
    </article>`).join("");
}

const honorsList = qs("#honors-list");
if (honorsList) {
  honorsList.innerHTML = honors.map(item => `
    <li>
      <time>${item.year}</time>
      <div class="honor-main"><strong>${item.award}</strong>${item.project ? `<em>${item.project}</em>` : ""}</div>
      <div class="honor-context"><span>${item.institutionHref ? `<a href="${item.institutionHref}" target="_blank" rel="noreferrer">${item.institution}</a>` : item.institution}</span></div>
    </li>`).join("");
}

qsa("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    qsa("[data-filter]").forEach(item => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
    qsa(".publication").forEach(item => {
      item.hidden = filter !== "all" && item.dataset.topic !== filter;
    });
  });
});

const navToggle = qs(".nav-toggle");
const siteNav = qs("#site-nav");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!open));
  siteNav.dataset.open = String(!open);
});
qsa("a", siteNav).forEach(link => link.addEventListener("click", () => {
  navToggle.setAttribute("aria-expanded", "false");
  siteNav.dataset.open = "false";
}));

const year = qs("#year");
if (year) year.textContent = new Date().getFullYear();

qsa("[data-youtube-id]").forEach(frame => {
  const iframe = document.createElement("iframe");
  const origin = /^https?:$/.test(window.location.protocol)
    ? `&origin=${encodeURIComponent(window.location.origin)}`
    : "";
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(frame.dataset.youtubeId)}?rel=0&playsinline=1&enablejsapi=1${origin}`;
  iframe.title = frame.dataset.videoTitle || "Project video";
  iframe.loading = "lazy";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  frame.append(iframe);
});
