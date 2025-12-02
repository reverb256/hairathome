// gallery-lightbox.js - Lightbox functionality for gallery
class GalleryLightbox {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.init();
    }

    init() {
        this.createLightboxHTML();
        this.bindEvents();
    }

    createLightboxHTML() {
        const lightboxHTML = `
            <div id="gallery-lightbox" class="gallery-lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" aria-describedby="lightbox-description">
                <div class="lightbox-overlay" role="presentation"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close gallery lightbox">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    <button class="lightbox-prev" aria-label="Previous image">
                        <i class="fas fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <button class="lightbox-next" aria-label="Next image">
                        <i class="fas fa-chevron-right" aria-hidden="true"></i>
                    </button>
                    <div class="lightbox-image-container">
                        <img id="lightbox-image" src="" alt="" loading="lazy">
                        <div class="lightbox-caption">
                            <h3 id="lightbox-title"></h3>
                            <p id="lightbox-description"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    bindEvents() {
        // Gallery item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.gallery-item')) {
                e.preventDefault();
                const galleryItem = e.target.closest('.gallery-item');
                this.openLightbox(galleryItem);
            }
        });

        // Lightbox controls
        document.addEventListener('click', (e) => {
            const lightbox = document.getElementById('gallery-lightbox');
            if (!lightbox) return;

            if (e.target.classList.contains('lightbox-overlay') || e.target.classList.contains('lightbox-close')) {
                this.closeLightbox();
            } else if (e.target.classList.contains('lightbox-prev')) {
                this.showPrevImage();
            } else if (e.target.classList.contains('lightbox-next')) {
                this.showNextImage();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const lightbox = document.getElementById('gallery-lightbox');
            if (!lightbox || !lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.showPrevImage();
                    break;
                case 'ArrowRight':
                    this.showNextImage();
                    break;
            }
        });
    }

    openLightbox(galleryItem) {
        this.images = Array.from(document.querySelectorAll('.gallery-item'));
        this.currentIndex = this.images.indexOf(galleryItem);

        const img = galleryItem.querySelector('img');
        const overlay = galleryItem.querySelector('.gallery-overlay h3');
        const description = galleryItem.querySelector('.gallery-overlay p');

        this.updateLightboxImage(img.src, overlay.textContent, description.textContent);

        const lightbox = document.getElementById('gallery-lightbox');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        lightbox.focus();
    }

    updateLightboxImage(src, title, description) {
        const lightboxImg = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-description');

        lightboxImg.src = src;
        lightboxImg.alt = title;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = description;
    }

    showPrevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxFromCurrentIndex();
    }

    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxFromCurrentIndex();
    }

    updateLightboxFromCurrentIndex() {
        const currentItem = this.images[this.currentIndex];
        const img = currentItem.querySelector('img');
        const overlay = currentItem.querySelector('.gallery-overlay h3');
        const description = currentItem.querySelector('.gallery-overlay p');

        this.updateLightboxImage(img.src, overlay.textContent, description.textContent);
    }

    closeLightbox() {
        const lightbox = document.getElementById('gallery-lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to the gallery item that was clicked
        if (this.images[this.currentIndex]) {
            this.images[this.currentIndex].focus();
        }
    }
}

// Initialize gallery lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GalleryLightbox();
});