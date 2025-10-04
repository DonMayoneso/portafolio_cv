'use strict';

// Portfolio data
let portfolioData = [];
let threeJSInitialized = false;

// Element toggle function
const elementToggleFunc = function (elem) { 
  elem.classList.toggle("active"); 
}

// Theme toggle functionality
function initializeThemeToggle() {
  const themeCheckbox = document.getElementById('theme-checkbox');
  const themeText = document.querySelector('.theme-text');
  
  const transitionOverlay = document.createElement('div');
  transitionOverlay.className = 'theme-transition-overlay';
  document.body.appendChild(transitionOverlay);
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (savedTheme === 'light') {
    themeCheckbox.checked = true;
    themeText.textContent = 'Modo Claro';
  } else {
    themeText.textContent = 'Modo Oscuro';
  }
  
  themeCheckbox.addEventListener('change', function() {
    document.body.classList.add('theme-changing');
    transitionOverlay.classList.add('active');
    
    setTimeout(() => {
      if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeText.textContent = 'Modo Claro';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeText.textContent = 'Modo Oscuro';
      }
      
      setTimeout(() => {
        transitionOverlay.classList.remove('active');
        document.body.classList.remove('theme-changing');
      }, 400);
    }, 50);
  });
}

// Language toggle functionality
function initializeLanguageToggle() {
  const languageToggle = document.getElementById('language-toggle');
  const languageText = document.querySelector('.language-text');
  const downloadCvText = document.querySelector('.download-cv-btn span');
  
  const savedLanguage = localStorage.getItem('language') || 'es';
  document.documentElement.setAttribute('data-language', savedLanguage);
  
  if (savedLanguage === 'en') {
    languageText.textContent = 'English';
    downloadCvText.textContent = 'Download CV';
    updateContentToEnglish();
  } else {
    languageText.textContent = 'Español';
    downloadCvText.textContent = 'Descargar CV';
    updateContentToSpanish();
  }
  
  languageToggle.addEventListener('click', function() {
    const currentLang = document.documentElement.getAttribute('data-language');
    const newLang = currentLang === 'es' ? 'en' : 'es';
    
    document.documentElement.setAttribute('data-language', newLang);
    localStorage.setItem('language', newLang);
    
    if (newLang === 'en') {
      languageText.textContent = 'English';
      downloadCvText.textContent = 'Download CV';
      updateContentToEnglish();
    } else {
      languageText.textContent = 'Español';
      downloadCvText.textContent = 'Descargar CV';
      updateContentToSpanish();
    }
  });
}

// Language content updates
function updateContentToEnglish() {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach(link => {
    const text = link.textContent.trim();
    if (text === 'Sobre Mí') link.textContent = 'About Me';
    else if (text === 'Currículum') link.textContent = 'Resume';
    else if (text === 'Portafolio') link.textContent = 'Portfolio';
    else if (text === 'Referencias') link.textContent = 'References';
    else if (text === 'Contacto') link.textContent = 'Contact';
  });

  const pageTitles = document.querySelectorAll('.article-title');
  pageTitles.forEach(title => {
    const text = title.textContent.trim();
    if (text === 'Sobre Mí') title.textContent = 'About Me';
    else if (text === 'Currículum') title.textContent = 'Resume';
    else if (text === 'Portafolio') title.textContent = 'Portfolio';
    else if (text === 'Referencias') title.textContent = 'References';
    else if (text === 'Contacto') title.textContent = 'Contact';
  });
}

function updateContentToSpanish() {
  const navLinks = document.querySelectorAll('[data-nav-link]');
  navLinks.forEach(link => {
    const text = link.textContent.trim();
    if (text === 'About Me') link.textContent = 'Sobre Mí';
    else if (text === 'Resume') link.textContent = 'Currículum';
    else if (text === 'Portfolio') link.textContent = 'Portafolio';
    else if (text === 'References') link.textContent = 'Referencias';
    else if (text === 'Contact') link.textContent = 'Contacto';
  });

  const pageTitles = document.querySelectorAll('.article-title');
  pageTitles.forEach(title => {
    const text = title.textContent.trim();
    if (text === 'About Me') title.textContent = 'Sobre Mí';
    else if (text === 'Resume') title.textContent = 'Currículum';
    else if (text === 'Portfolio') title.textContent = 'Portafolio';
    else if (text === 'References') title.textContent = 'Referencias';
    else if (text === 'Contact') title.textContent = 'Contacto';
  });
}

// Cargar portfolio desde JSON
async function loadPortfolio() {
  try {
    const response = await fetch('./portfolio.json');
    const data = await response.json();
    portfolioData = data.projects;
    displayPortfolio(portfolioData);
    initializeFilters();
  } catch (error) {
    console.error('Error cargando el portfolio:', error);
    portfolioData = [];
    displayPortfolio(portfolioData);
    initializeFilters();
  }
}

// Display portfolio projects con soporte para 3D
function displayPortfolio(projects) {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';

  projects.forEach(project => {
    const projectItem = document.createElement('li');
    projectItem.className = 'project-item active';
    projectItem.setAttribute('data-filter-item', '');
    projectItem.setAttribute('data-category', project.category);
    
    let mediaContent = '';
    if (project.type === 'video') {
      mediaContent = `
        <div class="video-thumbnail">
          <video preload="metadata" muted>
            <source src="${project.video}" type="video/mp4">
          </video>
        </div>
      `;
    } else if (project.type === 'pdf') {
      mediaContent = `
        <div class="pdf-preview">
          <ion-icon name="document-text-outline" class="pdf-icon"></ion-icon>
          <div class="pdf-preview-info">
            <div class="pdf-preview-title">${project.title}</div>
            <div class="pdf-preview-text">Documento PDF</div>
          </div>
        </div>
      `;
    } else if (project.type === '3d') {
      // Vista previa para modelos 3D
      if (project.preview) {
        mediaContent = `
          <div class="image-container">
            <img src="${project.preview}" alt="${project.title}" loading="lazy"
                 onload="this.style.opacity='1'"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'model3d-preview\\'><ion-icon name=\\'cube-outline\\' class=\\'model3d-icon\\'></ion-icon><div class=\\'model3d-preview-info\\'><div class=\\'model3d-preview-title\\'>${project.title}</div><div class=\\'model3d-preview-text\\'>Modelo 3D</div></div></div>'">
          </div>
        `;
      } else {
        mediaContent = `
          <div class="model3d-preview">
            <ion-icon name="cube-outline" class="model3d-icon"></ion-icon>
            <div class="model3d-preview-info">
              <div class="model3d-preview-title">${project.title}</div>
              <div class="model3d-preview-text">Modelo 3D</div>
            </div>
          </div>
        `;
      }
    } else {
      // Para imágenes normales
      mediaContent = `
        <div class="image-container">
          <img src="${project.image}" alt="${project.title}" loading="lazy"
               onload="this.style.opacity='1'"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'media-error\\'><ion-icon name=\\'image-outline\\'></ion-icon><p>Error cargando imagen</p></div>'">
        </div>
      `;
    }

    projectItem.innerHTML = `
      <a href="#" class="project-link" data-project-id="${project.id}">
        <figure class="project-img">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          ${mediaContent}
        </figure>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-category">${getCategoryName(project.category)}</p>
      </a>
    `;
    
    projectList.appendChild(projectItem);
  });

  // Inicializar miniaturas de video después de que se cargue el DOM
  setTimeout(initializeVideoThumbnails, 100);

  // Agregar event listeners para abrir el modal
  const projectLinks = document.querySelectorAll('.project-link');
  projectLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const projectId = parseInt(this.getAttribute('data-project-id'));
      openProjectModal(projectId);
    });
  });
}

// Inicializar miniaturas de video
function initializeVideoThumbnails() {
  const videoThumbnails = document.querySelectorAll('.video-thumbnail video');
  
  videoThumbnails.forEach(video => {
    video.addEventListener('loadeddata', function() {
      if (this.duration > 0) {
        this.currentTime = 0;
      }
    });
    
    video.load();
  });
}

// Obtener nombre de categoría
function getCategoryName(category) {
  const currentLang = document.documentElement.getAttribute('data-language') || 'es';
  const categories = {
    'ilustracion-digital': currentLang === 'es' ? 'Ilustración Digital' : 'Digital Illustration',
    'diseno-grafico': currentLang === 'es' ? 'Diseño Gráfico' : 'Graphic Design',
    'animacion-digital': currentLang === 'es' ? 'Animación Digital' : 'Digital Animation',
    'fotografia': currentLang === 'es' ? 'Fotografía' : 'Photography',
    'desarrollo-web': currentLang === 'es' ? 'Desarrollo Web' : 'Web Development',
    'modelado-3d': currentLang === 'es' ? 'Modelado 3D' : '3D Modeling',
    'realidad-aumentada': currentLang === 'es' ? 'Realidad Aumentada' : 'Augmented Reality'
  };
  return categories[category] || category;
}

// Modal functionality con soporte para 3D
function openProjectModal(projectId) {
  const project = portfolioData.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('portfolio-modal');
  const modalMedia = document.getElementById('modal-media');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalTechnologies = document.getElementById('modal-technologies');

  // Limpiar contenido previo
  modalMedia.innerHTML = '';
  modalTechnologies.innerHTML = '';

  // Configurar contenido
  modalTitle.textContent = project.title;
  modalCategory.textContent = getCategoryName(project.category);
  modalDescription.textContent = project.description;

  // Configurar tecnologías
  if (project.technologies && project.technologies.length > 0) {
    project.technologies.forEach(tech => {
      const techSpan = document.createElement('span');
      techSpan.className = 'technology-tag';
      techSpan.textContent = tech;
      modalTechnologies.appendChild(techSpan);
    });
  }

  // Configurar media según el tipo
  if (project.type === 'video') {
    setupVideoModal(modalMedia, project);
  } else if (project.type === 'pdf') {
    setupPdfModal(modalMedia, project);
  } else if (project.type === '3d') {
    setup3dModal(modalMedia, project);
  } else {
    setupImageModal(modalMedia, project);
  }

  // Mostrar modal
  modal.classList.add('active');
}

// Setup 3D model in modal
function setup3dModal(modalMedia, project) {
  const model3dContainer = document.createElement('div');
  model3dContainer.className = 'modal-media-content';
  
  // Controles para modelo 3D
  const model3dControls = document.createElement('div');
  model3dControls.className = 'model3d-controls';
  
  const downloadBtn = document.createElement('a');
  downloadBtn.className = 'model3d-download-btn';
  downloadBtn.href = project.model3d;
  downloadBtn.download = `${project.title}.3ds`;
  downloadBtn.innerHTML = '<ion-icon name="download-outline"></ion-icon> Descargar Modelo 3D';
  
  model3dControls.appendChild(downloadBtn);
  
  // Contenedor para el visor 3D
  const model3dViewer = document.createElement('div');
  model3dViewer.className = 'model3d-viewer';
  
  if (project.preview) {
    // Mostrar imagen de vista previa
    const previewImg = document.createElement('img');
    previewImg.src = project.preview;
    previewImg.alt = `Vista previa de ${project.title}`;
    previewImg.style.width = '100%';
    previewImg.style.height = '100%';
    previewImg.style.objectFit = 'contain';
    previewImg.style.borderRadius = '12px';
    
    previewImg.addEventListener('error', function() {
      show3dPlaceholder(model3dViewer, project);
    });
    
    model3dViewer.appendChild(previewImg);
  } else {
    // Mostrar placeholder si no hay vista previa
    show3dPlaceholder(model3dViewer, project);
  }
  
  // Información sobre el visor 3D
  const viewerInfo = document.createElement('div');
  viewerInfo.className = 'modal-description';
  viewerInfo.style.marginTop = '15px';
  viewerInfo.style.fontSize = 'var(--fs-7)';
  viewerInfo.style.color = 'var(--light-gray-70)';
  viewerInfo.innerHTML = `
    <p><strong>Formato:</strong> .3DS (3D Studio)</p>
    <p><strong>Tamaño del archivo:</strong> <span id="file-size-info">Calculando...</span></p>
    <p>Para ver este modelo en 3D, descarga el archivo y ábrelo con software compatible como Blender, 3DS Max, o Maya.</p>
  `;
  
  model3dContainer.appendChild(model3dControls);
  model3dContainer.appendChild(model3dViewer);
  model3dContainer.appendChild(viewerInfo);
  modalMedia.appendChild(model3dContainer);
  
  // Intentar obtener el tamaño del archivo
  getFileSize(project.model3d).then(size => {
    const sizeInfo = document.getElementById('file-size-info');
    if (sizeInfo) {
      sizeInfo.textContent = formatFileSize(size);
    }
  }).catch(() => {
    const sizeInfo = document.getElementById('file-size-info');
    if (sizeInfo) {
      sizeInfo.textContent = 'No disponible';
    }
  });
}

// Mostrar placeholder para modelos 3D
function show3dPlaceholder(container, project) {
  container.innerHTML = `
    <div class="model3d-placeholder">
      <ion-icon name="cube-outline"></ion-icon>
      <h4>Modelo 3D</h4>
      <p>${project.title}</p>
      <p style="margin-top: 10px; font-size: var(--fs-7);">Vista previa no disponible</p>
    </div>
  `;
}

// Obtener tamaño del archivo
async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const size = response.headers.get('content-length');
    return size ? parseInt(size) : 0;
  } catch (error) {
    throw new Error('No se pudo obtener el tamaño del archivo');
  }
}

// Formatear tamaño del archivo
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Setup video in modal
function setupVideoModal(modalMedia, project) {
  const videoContainer = document.createElement('div');
  videoContainer.className = 'modal-media-content';
  
  const video = document.createElement('video');
  video.className = 'modal-video';
  video.controls = true;
  video.preload = 'auto';
  video.autoplay = true;
  
  if (project.poster) {
    video.poster = project.poster;
  }
  
  const source = document.createElement('source');
  source.src = project.video;
  source.type = 'video/mp4';
  video.appendChild(source);
  
  video.addEventListener('error', function() {
    showMediaError(modalMedia, 'Error al cargar el video. Verifica que el archivo exista.');
  });
  
  videoContainer.appendChild(video);
  modalMedia.appendChild(videoContainer);
}

// Setup PDF in modal
function setupPdfModal(modalMedia, project) {
  const pdfContainer = document.createElement('div');
  pdfContainer.className = 'modal-media-content';
  
  const pdfControls = document.createElement('div');
  pdfControls.className = 'pdf-controls';
  
  const downloadBtn = document.createElement('a');
  downloadBtn.className = 'pdf-download-btn';
  downloadBtn.href = project.pdf;
  downloadBtn.download = `${project.title}.pdf`;
  downloadBtn.innerHTML = '<ion-icon name="download-outline"></ion-icon> Descargar PDF';
  
  pdfControls.appendChild(downloadBtn);
  
  const pdfViewer = document.createElement('iframe');
  pdfViewer.className = 'pdf-viewer';
  pdfViewer.src = project.pdf;
  pdfViewer.addEventListener('error', function() {
    showMediaError(modalMedia, 'Error al cargar el PDF. Verifica que el archivo exista.');
  });
  
  pdfContainer.appendChild(pdfControls);
  pdfContainer.appendChild(pdfViewer);
  modalMedia.appendChild(pdfContainer);
}

// Setup image in modal
function setupImageModal(modalMedia, project) {
  const img = document.createElement('img');
  img.src = project.image;
  img.alt = project.title;
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.3s ease';
  
  img.addEventListener('load', function() {
    this.style.opacity = '1';
    modalMedia.appendChild(this);
  });
  
  img.addEventListener('error', function() {
    showMediaError(modalMedia, 'Error al cargar la imagen. Verifica que el archivo exista.');
  });
}

// Mostrar error de media
function showMediaError(modalMedia, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'media-error';
  errorDiv.innerHTML = `
    <ion-icon name="warning-outline"></ion-icon>
    <p>${message}</p>
  `;
  modalMedia.appendChild(errorDiv);
}

// Cerrar modal
function closeModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.classList.remove('active');
  
  // Limpiar reproductores de video
  const videos = modal.querySelectorAll('video');
  videos.forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
}

// Inicializar filtros
function initializeFilters() {
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const select = document.querySelector("[data-select]");

  const filterFunc = function (selectedValue) {
    const filterItems = document.querySelectorAll("[data-filter-item]");
    
    for (let i = 0; i < filterItems.length; i++) {
      if (selectedValue === "todos" || selectedValue === "all" || selectedValue === "select category" || selectedValue === "seleccionar categoría") {
        filterItems[i].classList.add("active");
      } else if (selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }
    }
  }

  let lastClickedBtn = document.querySelector('[data-filter-btn].active');

  for (let i = 0; i < filterBtn.length; i++) {
    filterBtn[i].addEventListener("click", function () {
      let selectedValue = this.getAttribute('data-category');
      selectValue.innerText = this.textContent;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;
    });
  }

  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {
      let selectedValue = this.getAttribute('data-category');
      selectValue.innerText = this.textContent;
      elementToggleFunc(select);
      filterFunc(selectedValue);

      const correspondingBtn = document.querySelector(`[data-filter-btn][data-category="${selectedValue}"]`);
      if (correspondingBtn) {
        document.querySelectorAll('[data-filter-btn]').forEach(btn => btn.classList.remove('active'));
        correspondingBtn.classList.add('active');
        lastClickedBtn = correspondingBtn;
      }
    });
  }

  select.addEventListener("click", function () { 
    elementToggleFunc(this); 
  });
}

// Sidebar functionality
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { 
    elementToggleFunc(sidebar); 
  });
}

// Page navigation
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}

// Modal close functionality
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}

if (overlay) {
  overlay.addEventListener("click", closeModal);
}

// Cargar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  loadPortfolio();
  initializeThemeToggle();
  initializeLanguageToggle();
});
// Este efecto funciona solo con CSS, pero si necesitas JavaScript para otras funcionalidades:
document.addEventListener('DOMContentLoaded', function() {
  // Código para otras interacciones si es necesario
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
});