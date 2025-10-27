'use strict';

// Datos globales
let portfolioData = [];

// Función para alternar elementos
const toggleElement = (elem) => elem.classList.toggle("active");

//  GESTIÓN DE TEMA 

// Configuración del cambio de tema
function initTheme() {
  const themeToggle = document.getElementById('theme-checkbox');
  const themeText = document.querySelector('.theme-text');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  // Aplicar tema guardado
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    if (themeToggle) themeToggle.checked = (theme === 'light');
    
    // Actualizar texto según idioma detectado
    const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
    if (themeText) {
      themeText.textContent = (theme === 'light') 
        ? (isEnglish ? 'Light Mode' : 'Modo Claro')
        : (isEnglish ? 'Dark Mode' : 'Modo Oscuro');
    }
    
    localStorage.setItem('theme', theme);
  }

  // Cambiar tema con transición
  function handleThemeChange() {
    document.body.classList.add('theme-changing');
    
    setTimeout(() => {
      const newTheme = themeToggle.checked ? 'light' : 'dark';
      applyTheme(newTheme);
      
      setTimeout(() => {
        document.body.classList.remove('theme-changing');
      }, 600);
    }, 50);
  }

  // Inicializar
  applyTheme(savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('change', handleThemeChange);
  }
}

//  PORTFOLIO 

// Cargar proyectos del portfolio
async function loadPortfolio() {
  try {
    // Determinar qué archivo JSON cargar basado en la página actual
    let portfolioPath;
    if (typeof portfolioFile !== 'undefined') {
      portfolioPath = portfolioFile;
    } else {
      // Detectar automáticamente basado en la URL o lang attribute
      const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
      portfolioPath = isEnglish ? './portfolio_en.json' : './portfolio_es.json';
    }
    
    const response = await fetch(portfolioPath);
    const data = await response.json();
    portfolioData = data.projects;
    displayPortfolio(portfolioData);
    initFilters();
  } catch (error) {
    console.error('Error cargando portfolio:', error);
    portfolioData = [];
    displayPortfolio(portfolioData);
    initFilters();
  }
}

// Mostrar proyectos en la grid
function displayPortfolio(projects) {
  const projectList = document.getElementById('project-list');
  if (!projectList) return;

  projectList.innerHTML = '';

  projects.forEach(project => {
    const projectItem = createProjectItem(project);
    projectList.appendChild(projectItem);
  });

  // Configurar eventos después de crear los elementos
  setTimeout(() => {
    initVideoThumbnails();
    initProjectLinks();
  }, 100);
}

// Crear elemento de proyecto
function createProjectItem(project) {
  const projectItem = document.createElement('li');
  projectItem.className = 'project-item active';
  projectItem.setAttribute('data-filter-item', '');
  projectItem.setAttribute('data-category', project.category);
  
  const mediaContent = getMediaContent(project);
  
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
  
  return projectItem;
}

// Obtener contenido multimedia según tipo
function getMediaContent(project) {
  switch (project.type) {
    case 'video':
      return `
        <div class="video-thumbnail">
          <video preload="metadata" muted>
            <source src="${project.video}" type="video/mp4">
          </video>
        </div>
      `;
    
    case 'pdf':
      const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
      return `
        <div class="pdf-preview">
          <ion-icon name="document-text-outline" class="pdf-icon"></ion-icon>
          <div class="pdf-preview-info">
            <div class="pdf-preview-title">${project.title}</div>
            <div class="pdf-preview-text">${isEnglish ? 'PDF Document' : 'Documento PDF'}</div>
          </div>
        </div>
      `;
    
    case '3d':
      const isEnglish3d = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
      return project.preview ? `
        <div class="image-container">
          <img src="${project.preview}" alt="${project.title}" loading="lazy"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'model3d-preview\\'>
               <ion-icon name=\\'cube-outline\\' class=\\'model3d-icon\\'></ion-icon><div class=\\'model3d-preview-info\\'>
               <div class=\\'model3d-preview-title\\'>${project.title}</div><div class=\\'model3d-preview-text\\'>${isEnglish3d ? '3D Model' : 'Modelo 3D'}</div></div></div>'">
        </div>
      ` : `
        <div class="model3d-preview">
          <ion-icon name="cube-outline" class="model3d-icon"></ion-icon>
          <div class="model3d-preview-info">
            <div class="model3d-preview-title">${project.title}</div>
            <div class="model3d-preview-text">${isEnglish3d ? '3D Model' : 'Modelo 3D'}</div>
          </div>
        </div>
      `;
    
    default:
      return `
        <div class="image-container">
          <img src="${project.image}" alt="${project.title}" loading="lazy"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'media-error\\'><ion-icon name=\\'image-outline\\'>
               </ion-icon><p>${document.documentElement.lang === 'en' ? 'Error loading image' : 'Error cargando imagen'}</p></div>'">
        </div>
      `;
  }
}

// Obtener nombre traducido de categoría
function getCategoryName(category) {
  const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
  
  const categories = {
    'ilustracion-digital': isEnglish ? 'Digital Illustration' : 'Ilustración Digital',
    'diseno-grafico': isEnglish ? 'Graphic Design' : 'Diseño Gráfico',
    'animacion-digital': isEnglish ? 'Digital Animation' : 'Animación Digital',
    'fotografia': isEnglish ? 'Photography' : 'Fotografía',
    'desarrollo-web': isEnglish ? 'Web Development' : 'Desarrollo Web',
    'realidad-aumentada': isEnglish ? 'Augmented Reality' : 'Realidad Aumentada'
  };
  
  return categories[category] || category;
}

// Inicializar miniaturas de video
function initVideoThumbnails() {
  document.querySelectorAll('.video-thumbnail video').forEach(video => {
    video.load();
  });
}

// Configurar eventos para abrir modal
function initProjectLinks() {
  document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const projectId = parseInt(this.getAttribute('data-project-id'));
      openProjectModal(projectId);
    });
  });
}

//  MODAL 

// Abrir modal de proyecto
function openProjectModal(projectId) {
  const project = portfolioData.find(p => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById('portfolio-modal');
  const modalMedia = document.getElementById('modal-media');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalTechnologies = document.getElementById('modal-technologies');

  // Limpiar y configurar contenido
  modalMedia.innerHTML = '';
  modalTechnologies.innerHTML = '';

  modalTitle.textContent = project.title;
  modalCategory.textContent = getCategoryName(project.category);
  modalDescription.textContent = project.description;

  // Agregar tecnologías
  if (project.technologies) {
    project.technologies.forEach(tech => {
      const techSpan = document.createElement('span');
      techSpan.className = 'technology-tag';
      techSpan.textContent = tech;
      modalTechnologies.appendChild(techSpan);
    });
  }

  // Configurar contenido multimedia
  setupModalMedia(modalMedia, project);
  modal.classList.add('active');
  
  // Prevenir que el clic en el modal interno cierre el modal
  modal.querySelector('.portfolio-modal').addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

// Configurar contenido multimedia del modal
function setupModalMedia(container, project) {
  switch (project.type) {
    case 'video':
      setupVideoModal(container, project);
      break;
    case 'pdf':
      setupPdfModal(container, project);
      break;
    case '3d':
      setup3dModal(container, project);
      break;
    default:
      setupImageModal(container, project);
  }
}

// Configurar video en modal
function setupVideoModal(container, project) {
  const video = document.createElement('video');
  video.className = 'modal-video';
  video.controls = true;
  video.autoplay = true;
  
  if (project.poster) video.poster = project.poster;
  
  const source = document.createElement('source');
  source.src = project.video;
  source.type = 'video/mp4';
  video.appendChild(source);
  
  container.appendChild(video);
}

// Configurar PDF en modal
function setupPdfModal(container, project) {
  const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
  
  const pdfContainer = document.createElement('div');
  pdfContainer.className = 'modal-media-content';
  
  // Botón de descarga
  const downloadBtn = document.createElement('a');
  downloadBtn.className = 'pdf-download-btn';
  downloadBtn.href = project.pdf;
  downloadBtn.download = `${project.title}.pdf`;
  downloadBtn.innerHTML = `<ion-icon name="download-outline"></ion-icon> ${isEnglish ? 'Download PDF' : 'Descargar PDF'}`;
  
  // Visor PDF
  const pdfViewer = document.createElement('iframe');
  pdfViewer.className = 'pdf-viewer';
  pdfViewer.src = project.pdf;
  
  pdfContainer.appendChild(downloadBtn);
  pdfContainer.appendChild(pdfViewer);
  container.appendChild(pdfContainer);
}

// Configurar modelo 3D en modal
function setup3dModal(container, project) {
  const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
  
  const modelContainer = document.createElement('div');
  modelContainer.className = 'modal-media-content';
  
  // Botón de descarga
  const downloadBtn = document.createElement('a');
  downloadBtn.className = 'model3d-download-btn';
  downloadBtn.href = project.model3d;
  downloadBtn.download = `${project.title}.3ds`;
  downloadBtn.innerHTML = `<ion-icon name="download-outline"></ion-icon> ${isEnglish ? 'Download 3D Model' : 'Descargar Modelo 3D'}`;
  
  // Vista previa
  const preview = document.createElement('div');
  preview.className = 'model3d-viewer';
  
  if (project.preview) {
    const previewImg = document.createElement('img');
    previewImg.src = project.preview;
    previewImg.alt = `Vista previa de ${project.title}`;
    previewImg.style.cssText = 'width:100%; height:100%; object-fit:contain; border-radius:12px;';
    preview.appendChild(previewImg);
  } else {
    preview.innerHTML = `
      <div class="model3d-placeholder">
        <ion-icon name="cube-outline"></ion-icon>
        <h4>${isEnglish ? '3D Model' : 'Modelo 3D'}</h4>
        <p>${project.title}</p>
      </div>
    `;
  }
  
  modelContainer.appendChild(downloadBtn);
  modelContainer.appendChild(preview);
  container.appendChild(modelContainer);
}

// Configurar imagen en modal CON FUNCIONALIDAD DE LUPA
function setupImageModal(container, project) {
  const imgContainer = document.createElement('div');
  imgContainer.className = 'modal-image-container';
  imgContainer.style.position = 'relative';

  const img = document.createElement('img');
  img.src = project.image;
  img.alt = project.title;
  img.style.cssText = 'width:100%; height:auto; border-radius:12px; cursor: zoom-in;';
  
  // Agregar funcionalidad de zoom al hacer clic en la imagen
  img.addEventListener('click', function() {
    openImageZoom(project.image, project.title);
  });

  // Botón de lupa
  const zoomBtn = document.createElement('button');
  zoomBtn.className = 'image-zoom-btn';
  zoomBtn.innerHTML = '<ion-icon name="search-outline"></ion-icon>';
  zoomBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    transition: all 0.3s ease;
    z-index: 10;
  `;

  zoomBtn.addEventListener('mouseenter', () => {
    zoomBtn.style.background = 'rgba(0, 0, 0, 0.9)';
    zoomBtn.style.transform = 'scale(1.1)';
  });

  zoomBtn.addEventListener('mouseleave', () => {
    zoomBtn.style.background = 'rgba(0, 0, 0, 0.7)';
    zoomBtn.style.transform = 'scale(1)';
  });

  // Al hacer clic en la lupa, abrir imagen en zoom
  zoomBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openImageZoom(project.image, project.title);
  });

  imgContainer.appendChild(img);
  imgContainer.appendChild(zoomBtn);
  container.appendChild(imgContainer);
}

// Función para abrir imagen en zoom completo
function openImageZoom(imageSrc, title) {
  // Crear overlay de zoom
  const zoomOverlay = document.createElement('div');
  zoomOverlay.className = 'zoom-overlay';
  zoomOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: zoom-out;
  `;

  const zoomImg = document.createElement('img');
  zoomImg.src = imageSrc;
  zoomImg.alt = title;
  zoomImg.style.cssText = `
    max-width: 95%;
    max-height: 95%;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  `;

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.3s ease;
    z-index: 10001;
  `;

  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(0, 0, 0, 0.8)';
    closeBtn.style.transform = 'scale(1.1)';
  });

  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'rgba(0, 0, 0, 0.5)';
    closeBtn.style.transform = 'scale(1)';
  });

  // Función para cerrar el zoom
  function closeZoom() {
    document.body.removeChild(zoomOverlay);
    document.removeEventListener('keydown', handleKeyDown);
  }

  // Cerrar con tecla ESC
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeZoom();
    }
  }

  closeBtn.addEventListener('click', closeZoom);
  zoomOverlay.addEventListener('click', (e) => {
    if (e.target === zoomOverlay) {
      closeZoom();
    }
  });

  document.addEventListener('keydown', handleKeyDown);

  zoomOverlay.appendChild(zoomImg);
  zoomOverlay.appendChild(closeBtn);
  document.body.appendChild(zoomOverlay);
}

// Cerrar modal
function closeModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.classList.remove('active');
  
  // Limpiar reproductores
  modal.querySelectorAll('video').forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
}

//  FILTROS 

// Inicializar sistema de filtros
function initFilters() {
  const filterBtns = document.querySelectorAll("[data-filter-btn]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const select = document.querySelector("[data-select]");

  // Aplicar filtro
  function applyFilter(selectedValue) {
    document.querySelectorAll("[data-filter-item]").forEach(item => {
      const showItem = selectedValue === "todos" || selectedValue === item.dataset.category;
      item.classList.toggle("active", showItem);
    });
  }

  let activeFilter = document.querySelector('[data-filter-btn].active');

  // Eventos para botones de filtro
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const selectedValue = this.getAttribute('data-category');
      
      selectValue.textContent = this.textContent;
      applyFilter(selectedValue);

      activeFilter.classList.remove("active");
      this.classList.add("active");
      activeFilter = this;
    });
  });

  // Eventos para select móvil
  selectItems.forEach(item => {
    item.addEventListener("click", function () {
      const selectedValue = this.getAttribute('data-category');
      
      selectValue.textContent = this.textContent;
      toggleElement(select);
      applyFilter(selectedValue);

      // Activar botón correspondiente
      const correspondingBtn = document.querySelector(`[data-filter-btn][data-category="${selectedValue}"]`);
      if (correspondingBtn) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        correspondingBtn.classList.add('active');
        activeFilter = correspondingBtn;
      }
    });
  });

  // Toggle del select
  if (select) {
    select.addEventListener("click", () => toggleElement(select));
  }
}

//  NAVEGACIÓN 

// Configurar navegación entre páginas
function initNavigation() {
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  navLinks.forEach(link => {
    link.addEventListener("click", function () {
      const targetPage = this.textContent.toLowerCase();
      
      pages.forEach((page, index) => {
        const isActive = targetPage === page.dataset.page;
        page.classList.toggle("active", isActive);
        navLinks[index].classList.toggle("active", isActive);
      });
      
      window.scrollTo(0, 0);
    });
  });
}

//  FORMULARIO DE CONTACTO

// Configurar formulario de contacto
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', handleFormSubmit);
}

// Manejar envío del formulario
function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('.form-btn');
  const originalText = submitBtn.innerHTML;
  
  // Obtener datos del formulario
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  };
  
  // Detectar idioma para mensajes
  const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
  
  // Validar datos
  if (!data.name || !data.email || !data.message) {
    showFormMessage(isEnglish ? 'Please fill in all fields' : 'Por favor completa todos los campos', 'error');
    return;
  }
  
  // Mostrar estado de carga
  submitBtn.innerHTML = `<ion-icon name="hourglass-outline"></ion-icon><span>${isEnglish ? 'Sending...' : 'Enviando...'}</span>`;
  submitBtn.disabled = true;
  
  // Enviar correo usando mailto (solución simple)
  sendEmail(data, submitBtn, originalText, isEnglish);
}

// Enviar correo usando mailto
function sendEmail(data, submitBtn, originalText, isEnglish) {
  const subject = isEnglish 
    ? `New message from ${data.name} from your portfolio`
    : `Nuevo mensaje de ${data.name} desde tu portfolio`;
  
  const body = isEnglish
    ? `Name: ${data.name}%0D%0AEmail: ${data.email}%0D%0A%0D%0AMessage:%0D%0A${data.message}`
    : `Nombre: ${data.name}%0D%0AEmail: ${data.email}%0D%0A%0D%0AMensaje:%0D%0A${data.message}`;
  
  const mailtoLink = `mailto:jtroncosoart@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Intentar abrir el cliente de correo
  const mailWindow = window.open(mailtoLink, '_blank');
  
  setTimeout(() => {
    if (mailWindow && !mailWindow.closed) {
      showFormMessage(isEnglish ? 'Message sent! I will reply soon.' : '¡Mensaje enviado! Te responderé pronto.', 'success');
      document.getElementById('contact-form').reset();
    } else {
      window.location.href = mailtoLink;
      showFormMessage(isEnglish ? 'Email client opened. Complete the sending there.' : 'Cliente de correo abierto. Completa el envío allí.', 'success');
      document.getElementById('contact-form').reset();
    }
    
    // Restaurar botón
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
  }, 1000);
}

// Mostrar mensaje del formulario
function showFormMessage(message, type) {
  // Remover mensajes anteriores
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Crear nuevo mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  
  // Insertar después del formulario
  const form = document.getElementById('contact-form');
  form.parentNode.insertBefore(messageDiv, form.nextSibling);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 5000);
}

// Validación en tiempo real
function initFormValidation() {
  const formInputs = document.querySelectorAll('#contact-form .form-input');
  
  formInputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      clearFieldError(this);
    });
  });
}

// Validar campo individual
function validateField(field) {
  const value = field.value.trim();
  const isEnglish = document.documentElement.lang === 'en' || window.location.href.includes('index_en');
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, isEnglish ? 'Please enter a valid email' : 'Por favor ingresa un email válido');
      return false;
    }
  }
  
  if (field.required && !value) {
    showFieldError(field, isEnglish ? 'This field is required' : 'Este campo es requerido');
    return false;
  }
  
  clearFieldError(field);
  return true;
}

// Mostrar error en campo
function showFieldError(field, message) {
  clearFieldError(field);
  field.style.borderColor = 'var(--bittersweet-shimmer)';
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: var(--bittersweet-shimmer);
    font-size: var(--fs-8);
    margin-top: 5px;
  `;
  
  field.parentNode.appendChild(errorDiv);
}

// Limpiar error del campo
function clearFieldError(field) {
  field.style.borderColor = '';
  
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
}

//  INICIALIZACIÓN 
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  loadPortfolio();
  initNavigation();
  initContactForm();
  initFormValidation();

  // Sidebar toggle
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');
  const sidebar = document.querySelector('[data-sidebar]');
  
  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener('click', () => toggleElement(sidebar));
  }

  // Cerrar modal al hacer clic fuera (overlay) o con ESC
  const modalContainer = document.getElementById('portfolio-modal');
  const overlay = document.querySelector("[data-overlay]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  
  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }
  
  // Cerrar modal con tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
      closeModal();
    }
  });

  // Cerrar modal al hacer clic en el overlay del modal
  if (modalContainer) {
    modalContainer.addEventListener('click', function(e) {
      if (e.target === modalContainer) {
        closeModal();
      }
    });
  }
});