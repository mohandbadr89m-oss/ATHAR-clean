document.addEventListener('DOMContentLoaded', function () {

    const intro = document.getElementById('athar-intro');
    const landing = document.getElementById('landing-content');
    const skipButton = document.getElementById('skip-intro');

    if (!intro || !landing) return;

    let introFinished = false;

    const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    function finishIntro() {

        if (introFinished) return;

        introFinished = true;

        // Hide the intro first.
        intro.style.transition = 'opacity 900ms ease';
        intro.style.opacity = '0';
        intro.style.pointerEvents = 'none';

        // Reveal the landing page after the intro disappears.
        window.setTimeout(function () {

            intro.remove();

            landing.classList.remove('opacity-0');
            landing.classList.add('opacity-100');

        }, 950);
    }

    if (skipButton) {
        skipButton.addEventListener('click', finishIntro);
    }

    if (reducedMotion) {
        finishIntro();
    } else {
        window.setTimeout(finishIntro, 4800);
    }

});
