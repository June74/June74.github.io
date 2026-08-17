'use strict';

const projects = [...document.querySelectorAll('.project')];
if (projects.length > 0) {
  const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let pinnedProject = null;

  const orbitLayer = typeof document.querySelector === 'function'
    ? document.querySelector('[data-orbit-layer]')
    : null;
  const orbitLabels = typeof document.querySelector === 'function'
    ? document.querySelector('[data-orbit-labels]')
    : null;

  function orbitInitial(name) {
    return (name.trim().match(/[A-Za-z0-9]/)?.[0] ?? '?').toUpperCase();
  }

  function renderProjectOrbits() {
    if (!orbitLayer || !orbitLabels) return;
    const svgNamespace = 'http:' + String.fromCharCode(47, 47) + 'www.w3.org/2000/svg';
    const radii = [96, 130, 164, 186, 202];
    orbitLayer.replaceChildren();
    orbitLabels.replaceChildren();

    const entries = projects.map((project, index) => {
      const name = project.querySelector('.project-name')?.textContent.trim()
        || project.dataset.project
        || `Project ${index + 1}`;
      const initial = orbitInitial(name);
      const angle = 20 + index * (360 / Math.max(projects.length, 3));
      const radians = angle * Math.PI / 180;
      const radius = radii[index] ?? radii.at(-1);
      const x = 210 + Math.cos(radians) * radius;
      const y = 210 + Math.sin(radians) * radius;

      const orbit = document.createElementNS(svgNamespace, 'g');
      orbit.setAttribute('class', 'project-orbit');
      orbit.setAttribute('data-orbit-project', project.dataset.project || name.toLowerCase());
      orbit.setAttribute('data-orbit-initial', initial);
      const orbitDuration = `${24 + index * 6}s`;
      orbit.style.animationDuration = orbitDuration;

      const ring = document.createElementNS(svgNamespace, 'circle');
      ring.setAttribute('class', 'orbit-ring');
      ring.setAttribute('cx', '210');
      ring.setAttribute('cy', '210');
      ring.setAttribute('r', String(radius));

      const marker = document.createElementNS(svgNamespace, 'g');
      marker.setAttribute('class', 'orbit-marker');
      marker.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      const markerFace = document.createElementNS(svgNamespace, 'g');
      markerFace.setAttribute('class', 'orbit-marker-face');
      markerFace.style.animationDuration = orbitDuration;
      const disc = document.createElementNS(svgNamespace, 'circle');
      disc.setAttribute('class', 'orbit-marker-disc');
      disc.setAttribute('r', '18');
      const label = document.createElementNS(svgNamespace, 'text');
      label.setAttribute('class', 'orbit-marker-label');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('y', '6');
      label.textContent = initial;
      markerFace.append(disc, label);
      marker.append(markerFace);
      orbit.append(ring, marker);
      orbitLayer.append(orbit);

      const item = document.createElement('li');
      const key = document.createElement('span');
      key.className = 'orbit-key';
      key.textContent = initial;
      const textNode = document.createElement('span');
      textNode.textContent = name;
      item.append(key, textNode);
      orbitLabels.append(item);
      return { initial, name };
    });

    orbitLayer.setAttribute('aria-label', entries.map(({ initial, name }) => `${initial} ${name}`).join(', '));
  }

  renderProjectOrbits();

function restartAnimation(project) {
  project.classList.remove('is-animating');
  void project.offsetWidth;
  project.classList.add('is-animating');
}

function closeProject(project) {
  project.open = false;
  project.classList.remove('is-preview', 'is-pinned', 'is-animating');
  if (pinnedProject === project) pinnedProject = null;
}

function closeOthers(activeProject) {
  for (const project of projects) {
    if (project !== activeProject) closeProject(project);
  }
}

function openPinned(project) {
  closeOthers(project);
  project.open = true;
  project.classList.remove('is-preview');
  project.classList.add('is-pinned');
  pinnedProject = project;
  restartAnimation(project);
}

function previewProject(project) {
  if (!fineHover.matches || pinnedProject || project.open) return;
  project.open = true;
  project.classList.add('is-preview');
  restartAnimation(project);
}

function togglePinned(project) {
  const shouldOpen = !project.open || project.classList.contains('is-preview');
  if (shouldOpen) openPinned(project);
  else closeProject(project);
}

const hoverListeners = projects.map((project) => ({
  project,
  onPointerEnter: () => previewProject(project),
  onPointerLeave: () => {
    if (project.classList.contains('is-preview')) closeProject(project);
  },
}));
let hoverListenersBound = false;

function updateHoverListeners() {
  if (fineHover.matches && !hoverListenersBound) {
    for (const { project, onPointerEnter, onPointerLeave } of hoverListeners) {
      project.addEventListener('pointerenter', onPointerEnter);
      project.addEventListener('pointerleave', onPointerLeave);
    }
    hoverListenersBound = true;
  } else if (!fineHover.matches && hoverListenersBound) {
    for (const { project, onPointerEnter, onPointerLeave } of hoverListeners) {
      project.removeEventListener('pointerenter', onPointerEnter);
      project.removeEventListener('pointerleave', onPointerLeave);
      if (project.classList.contains('is-preview')) closeProject(project);
    }
    hoverListenersBound = false;
  }
}

for (const project of projects) {
  const summary = project.querySelector('.project-summary');
  let activationGeneration = 0;
  let pendingKeyboardClick = 0;

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.detail === 0 && pendingKeyboardClick !== 0) {
      pendingKeyboardClick = 0;
      return;
    }
    togglePinned(project);
  });

  summary.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    if (event.repeat) return;
    activationGeneration += 1;
    pendingKeyboardClick = activationGeneration;
    togglePinned(project);
  });

  summary.addEventListener('keyup', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    const completedGeneration = activationGeneration;
    setTimeout(() => {
      if (pendingKeyboardClick === completedGeneration) pendingKeyboardClick = 0;
    }, 0);
  });

}

fineHover.addEventListener('change', updateHoverListeners);
updateHoverListeners();
}
