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

    // Calculate visible count based on screen width
    function updateVisibleCount() {
        const trackWidth = track.offsetWidth;
        const circleWidth = circles[0].offsetWidth;
        const gap = 24;
        visibleCount = Math.floor((trackWidth + gap) / (circleWidth + gap));
        visibleCount = Math.max(1, Math.min(visibleCount, 4));
    }

    // Update slider position
    function updateSlider() {
        const circleWidth = circles[0].offsetWidth;
        const gap = 24;
        const offset = currentIndex * (circleWidth + gap);
        slides.style.transform = `translateX(-${offset}px)`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= circles.length - visibleCount;
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

    // Initialize
    updateVisibleCount();
    updateSlider();

    // Update on resize
    window.addEventListener('resize', function() {
        updateVisibleCount();
        // Reset to beginning if current index is out of bounds
        if (currentIndex > circles.length - visibleCount) {
            currentIndex = Math.max(0, circles.length - visibleCount);
        }
        updateSlider();
    });
});
