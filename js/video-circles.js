// Video circles functionality
document.addEventListener('DOMContentLoaded', function() {
    const videoCircles = document.querySelectorAll('.video-circle');
    let currentlyPlaying = null;

    videoCircles.forEach(circle => {
        const video = circle.querySelector('.video-circle__video');

        circle.addEventListener('click', function() {
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
});
