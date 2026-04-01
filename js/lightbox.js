/**
 * Lightbox Gallery - Script vanilla JavaScript
 * Funcionalidades:
 * - Clique em qualquer imagem para abrir o lightbox
 * - Navegação por setas (← →)
 * - Navegação por teclado (ArrowLeft, ArrowRight, Escape)
 * - Swipe em celular (deslize)
 * - Animação suave de entrada/saída
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elementos do DOM
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.close');
  const prevBtn = document.querySelector('.modal-nav.prev');
  const nextBtn = document.querySelector('.modal-nav.next');
  const galleryImages = document.querySelectorAll('.gallery .card img.gallery-img');

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  /**
   * Abre o lightbox e exibe a imagem
   * @param {number} index - Índice da imagem na galeria
   */
  function openLightbox(index) {
    if (!modal) return;
    
    currentIndex = index > galleryImages.length - 1 ? 0 : index < 0 ? galleryImages.length - 1 : index;
    
    const img = galleryImages[currentIndex];
    modalImg.src = img.src;
    
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Previne scroll
  }

  /**
   * Fecha o lightbox
   */
  function closeLightbox() {
    if (!modal) return;
    
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll
  }

  /**
   * Navega para a próxima imagem
   */
  function nextImage() {
    openLightbox(currentIndex + 1);
  }

  /**
   * Navega para a imagem anterior
   */
  function prevImage() {
    openLightbox(currentIndex - 1);
  }

  // ===== EVENT LISTENERS =====

  // Clique em cada imagem da galeria
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(index);
    });
    
    // Cursor apontador para indicar que é clicável
    img.style.cursor = 'pointer';
  });

  // Botão de fechar (X)
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Botões de navegação (setas)
  if (prevBtn) {
    prevBtn.addEventListener('click', prevImage);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextImage);
  }

  // Clique fora da imagem fecha o lightbox mas evita fechar ao clicar nas setas
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === modalImg) {
        closeLightbox();
      }
    });
  }

  // ===== NAVEGAÇÃO POR TECLADO =====
  document.addEventListener('keydown', (e) => {
    if (!modal || modal.style.display === 'none') return;

    if (e.key === 'ArrowRight' || e.key === 'Right') {
      e.preventDefault();
      nextImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
      e.preventDefault();
      prevImage();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    }
  });

  // ===== TOUCH/SWIPE PARA MOBILE =====
  if (modal) {
    modal.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, false);

    modal.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      // Swipe para esquerda = próxima imagem
      if (diffX > 50) {
        nextImage();
      }
      // Swipe para direita = imagem anterior
      else if (diffX < -50) {
        prevImage();
      }

      isDragging = false;
    }, false);

    // Previne comportamento padrão de swipe
    modal.addEventListener('touchmove', (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    }, false);
  }

  // ===== NAVEGAÇÃO COM MOUSE DRAG (DESKTOP) =====
  let mouseStartX = 0;
  let isMouseDragging = false;

  if (modal) {
    modal.addEventListener('mousedown', (e) => {
      mouseStartX = e.clientX;
      isMouseDragging = true;
    });

    modal.addEventListener('mousemove', (e) => {
      // Pode adicionar efeito visual durante drag, se desejar
    });

    modal.addEventListener('mouseup', (e) => {
      if (!isMouseDragging) return;

      const mouseEndX = e.clientX;
      const diffX = mouseStartX - mouseEndX;

      // Drag para esquerda = próxima imagem
      if (diffX > 100) {
        nextImage();
      }
      // Drag para direita = imagem anterior
      else if (diffX < -100) {
        prevImage();
      }

      isMouseDragging = false;
    });
  }
});
