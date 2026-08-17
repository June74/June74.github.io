'use strict';

const projects = [...document.querySelectorAll('.project')];
if (projects.length > 0) {
  const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let pinnedProject = null;

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
