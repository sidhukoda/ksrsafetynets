 document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');
    const dropdownBtns = document.querySelectorAll('.dropdown-btn');
    
    if (mobileMenuToggle && navList) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }
    
    // Dropdown Menu Toggle
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Close other dropdowns when opening a new one
            if (!isExpanded) {
                dropdownBtns.forEach(otherBtn => {
                    if (otherBtn !== btn && otherBtn.getAttribute('aria-expanded') === 'true') {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        otherBtn.nextElementSibling.classList.remove('show');
                    }
                });
            }
            
            this.nextElementSibling.classList.toggle('show');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdownBtns.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                btn.nextElementSibling.classList.remove('show');
            });
        }
    });
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelector('.testimonial-slides');
        const prevBtn = testimonialSlider.querySelector('.prev');
        const nextBtn = testimonialSlider.querySelector('.next');
        const testimonialCards = testimonialSlider.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        
        function updateSlider() {
            if (testimonialCards.length > 0) {
                const cardWidth = testimonialCards[0].offsetWidth + 30; // Include gap
                slides.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
        }
        
        if (prevBtn) prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonialCards.length - 1;
            updateSlider();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex < testimonialCards.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });
        
        // Make slider responsive
        window.addEventListener('resize', updateSlider);
        
        // Initialize slider
        updateSlider();
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        const answer = question.nextElementSibling;
        answer.style.maxHeight = null; // Reset all answers to be closed initially
        
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    if (header) {
        // Initialize based on current scroll position
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Lazy loading for images
    const lazyLoadImages = function() {
        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading is supported
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        } else {
            // Fallback for browsers without native lazy loading
            const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                lazyLoadObserver.observe(img);
            });
        }
    };
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Formspree form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to success page or show success message
                    window.location.href = '/thank-you.html';
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                alert('There was a problem submitting your form. Please try again later.');
                console.error('Form submission error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        });
    }

    // Gallery Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDesc = document.getElementById('lightbox-desc');
        const viewButtons = document.querySelectorAll('.view-btn');
        const closeLightbox = document.querySelector('.close-lightbox');
        const prevButton = document.querySelector('.lightbox-nav.prev');
        const nextButton = document.querySelector('.lightbox-nav.next');
        
        let currentImageIndex = 0;
        let images = [];
        
        // Initialize gallery items array
        function initGalleryItems() {
            images = Array.from(document.querySelectorAll('.gallery-item'));
        }
        
        // Open lightbox
        function openLightbox(index) {
            const item = images[index];
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-overlay h3')?.textContent || '';
            const desc = item.querySelector('.gallery-overlay p')?.textContent || '';
            
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = desc;
            
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        // Close lightbox
        function closeLightboxFunc() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Navigate to previous image
        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            openLightbox(currentImageIndex);
        }
        
        // Navigate to next image
        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            openLightbox(currentImageIndex);
        }
        
        // Set up event listeners
        if (viewButtons.length > 0) {
            viewButtons.forEach((button, index) => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    initGalleryItems();
                    // Find the parent gallery item of the clicked button
                    const item = button.closest('.gallery-item');
                    // Find its index in the images array
                    currentImageIndex = images.indexOf(item);
                    openLightbox(currentImageIndex);
                });
            });
        }
        
        if (closeLightbox) closeLightbox.addEventListener('click', closeLightboxFunc);
        if (prevButton) prevButton.addEventListener('click', prevImage);
        if (nextButton) nextButton.addEventListener('click', nextImage);
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightboxFunc();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                switch(e.key) {
                    case 'Escape':
                        closeLightboxFunc();
                        break;
                    case 'ArrowLeft':
                        prevImage();
                        break;
                    case 'ArrowRight':
                        nextImage();
                        break;
                }
            }
        });
    }

    // Tab switching functionality
    const tabs = document.querySelectorAll('.pricing-tab');
    const tabContents = document.querySelectorAll('.pricing-content');

    if (tabs.length > 0 && tabContents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                const content = document.getElementById(`${tabId}-tab`);
                if (content) content.classList.add('active');
            });
        });
        
        // Activate first tab by default
        tabs[0]?.click();
    }

    // Hero Background Slider
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const images = heroBackground.querySelectorAll('.bg-image');
        let currentIndex = 0;
        let interval;
        
        function changeBackground() {
            // Remove active class from current image
            images.forEach(img => img.classList.remove('active'));
            
            // Add active class to new image
            images[currentIndex].classList.add('active');
            
            // Move to next image
            currentIndex = (currentIndex + 1) % images.length;
        }
        
        // Initialize - show first image
        if (images.length > 0) {
            images[0].classList.add('active');
            
            // Change image every 5 seconds
            interval = setInterval(changeBackground, 5000);
            
            // Pause on hover (optional)
            heroBackground.addEventListener('mouseenter', function() {
                clearInterval(interval);
            });
            
            heroBackground.addEventListener('mouseleave', function() {
                interval = setInterval(changeBackground, 5000);
            });
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const heroBg = document.querySelector('.hero-background.manual-scroll');
    if (!heroBg) return;

    const bgImages = heroBg.querySelectorAll('.bg-image');
    const prevBtn = document.querySelector('.scroll-prev');
    const nextBtn = document.querySelector('.scroll-next');
    let currentIndex = 0;

    function showImage(index) {
        // Validate index
        if (index < 0) index = bgImages.length - 1;
        if (index >= bgImages.length) index = 0;
        
        // Update active class
        bgImages.forEach(img => img.classList.remove('active'));
        bgImages[index].classList.add('active');
        
        currentIndex = index;
    }

    // Button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showImage(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showImage(currentIndex + 1);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            showImage(currentIndex + 1);
        }
    });

    // Initialize
    showImage(0);
});
document.addEventListener('DOMContentLoaded', function() {
    // Hero Carousel
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Set up auto-rotation
        let slideInterval = setInterval(nextSlide, 5000);
        
        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            currentSlide = (n + totalSlides) % totalSlides;
            
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Reset timer when manually changing slides
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }
        
        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });
        
        // Pause on hover
        heroCarousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        heroCarousel.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        });
    }
});
// Dropdown Toggle
document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    // Close other dropdowns
    document.querySelectorAll('.dropdown').forEach(drop => {
      if (drop !== btn.parentElement) drop.classList.remove('open');
      drop.querySelector('.dropdown-btn').setAttribute('aria-expanded', 'false');
    });
    // Toggle current dropdown
    const isOpen = btn.parentElement.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

// Close dropdowns if clicked outside
document.addEventListener('click', function(e) {
  document.querySelectorAll('.dropdown').forEach(drop => {
    if (!drop.contains(e.target)) {
      drop.classList.remove('open');
      drop.querySelector('.dropdown-btn').setAttribute('aria-expanded', 'false');
    }
  });
});

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle.addEventListener('click', function() {
  const expanded = this.getAttribute('aria-expanded') === 'true' || false;
  this.setAttribute('aria-expanded', !expanded);
  navMenu.classList.toggle('active');
});
