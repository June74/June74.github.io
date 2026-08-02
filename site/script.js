'use strict';

const projects = [...document.querySelectorAll('.project')];
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

for (const project of projects) {
  const summary = project.querySelector('.project-summary');
  let suppressKeyboardClick = false;

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    if (suppressKeyboardClick) {
      suppressKeyboardClick = false;
      return;
    }
    togglePinned(project);
  });

  summary.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    suppressKeyboardClick = true;
    togglePinned(project);
  });

  summary.addEventListener('keyup', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    setTimeout(() => {
      suppressKeyboardClick = false;
    }, 0);
  });

  project.addEventListener('pointerenter', () => previewProject(project));
  project.addEventListener('pointerleave', () => {
    if (project.classList.contains('is-preview')) closeProject(project);
  });
}

fineHover.addEventListener('change', () => {
  for (const project of projects) {
    if (project.classList.contains('is-preview')) closeProject(project);
  }
});
