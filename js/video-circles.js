// Video circles slider functionality
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.video-slider');
    if (!slider) return;

    const track = slider.querySelector('.video-slider__track');
    const slides = slider.querySelector('.video-slider__slides');
    const circles = slider.querySelectorAll('.video-circle');
    const prevBtn = slider.querySelector('.video-slider__arrow--left');
    const nextBtn = slider.querySelector('.video-slider__arrow--right');

    let currentIndex = 0;
    let visibleCount = 4;
    let currentlyPlaying = null;

    // Кешируем размеры чтобы избежать forced layout
    let cachedTrackWidth = 0;
    let cachedCircleWidth = 0;
    const gap = 24;

    // Calculate visible count based on cached dimensions
    function updateVisibleCount() {
        visibleCount = Math.floor((cachedTrackWidth + gap) / (cachedCircleWidth + gap));
        visibleCount = Math.max(1, Math.min(visibleCount, 4));
    }

    // Update slider position (no layout reads here)
    function updateSlider() {
        const offset = currentIndex * (cachedCircleWidth + gap);
        slides.style.transform = `translateX(-${offset}px)`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= circles.length - visibleCount;
    }

    // Read dimensions once (batched read)
    function cacheDimensions() {
        cachedTrackWidth = track.offsetWidth;
        cachedCircleWidth = circles[0] ? circles[0].offsetWidth : 180;
    }

    // Navigation
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < circles.length - visibleCount) {
            currentIndex++;
            updateSlider();
        }
    });

    // Video play/pause
    circles.forEach(circle => {
        const video = circle.querySelector('.video-circle__video');

        circle.addEventListener('click', function(e) {
            e.stopPropagation();

            if (currentlyPlaying && currentlyPlaying !== video) {
                currentlyPlaying.pause();
                currentlyPlaying.muted = true;
                currentlyPlaying.closest('.video-circle').classList.remove('playing');
            }

            if (video.paused) {
                video.muted = false;
                video.play();
                circle.classList.add('playing');
                currentlyPlaying = video;
            } else {
                video.pause();
                video.muted = true;
                circle.classList.remove('playing');
                currentlyPlaying = null;
            }
        });

        video.addEventListener('ended', function() {
            circle.classList.remove('playing');
            currentlyPlaying = null;
        });
    });

    // Initialize - single layout read
    cacheDimensions();
    updateVisibleCount();
    updateSlider();

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            cacheDimensions();
            updateVisibleCount();
            if (currentIndex > circles.length - visibleCount) {
                currentIndex = Math.max(0, circles.length - visibleCount);
            }
            updateSlider();
        }, 150);
    });
});
