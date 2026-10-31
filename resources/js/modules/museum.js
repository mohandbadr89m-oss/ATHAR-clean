document.addEventListener('DOMContentLoaded', () => {

    // ATHAR — Museum Cinematic Intro
    // =========================================

    const museumIntro = document.getElementById('museum-intro');
    const museumContent = document.getElementById('museum-content');
    const skipIntroButton = document.getElementById('skip-museum-intro');

    if (museumIntro && museumContent) {

        let introFinished = false;
        let introTimer;

        function finishMuseumIntro() {
            if (introFinished) return;

            introFinished = true;

            clearTimeout(introTimer);

            museumIntro.classList.add('opacity-0');

            museumContent.classList.remove('opacity-0');
            museumContent.classList.add('opacity-100');

            setTimeout(() => {
                museumIntro.classList.add('hidden');
            }, 1000);
        }

        // Automatically finish the intro after 3 seconds.
        introTimer = setTimeout(finishMuseumIntro, 3000);

        // Skip intro.
        skipIntroButton?.addEventListener('click', finishMuseumIntro);
    }


    // =========================================
    // ATHAR — Museum Quote Details
    // =========================================

    const museumDetails = document.getElementById('museum-details');

    if (museumDetails) {

        const detailQuote = document.getElementById('museum-detail-quote');
        const detailAuthor = document.getElementById('museum-detail-author');
        const detailLikes = document.getElementById('museum-detail-likes');
        const detailRank = document.getElementById('museum-detail-rank');
        const closeDetailsButton = document.getElementById('close-museum-details');

        function openMuseumDetails(piece) {

            detailQuote.textContent = piece.dataset.quote || '';
            detailAuthor.textContent = piece.dataset.author || 'كاتب مجهول';

            detailLikes.textContent =
                `♥ ${piece.dataset.likes || 0} إعجاب`;

            detailRank.textContent =
                `المرتبة ${piece.dataset.rank || ''} في المتحف`;

            museumDetails.classList.remove('hidden');
            museumDetails.classList.add('flex');

            document.body.classList.add('overflow-hidden');
        }

        function closeMuseumDetails() {

            museumDetails.classList.add('hidden');
            museumDetails.classList.remove('flex');

            document.body.classList.remove('overflow-hidden');
        }

        // Open quote details.
        document.querySelectorAll('[data-museum-quote]').forEach((piece) => {

            piece.addEventListener('click', () => {
                openMuseumDetails(piece);
            });

        });

        // Close button.
        closeDetailsButton?.addEventListener('click', closeMuseumDetails);

        // Close when clicking outside the details card.
        museumDetails.addEventListener('click', (event) => {

            if (event.target === museumDetails) {
                closeMuseumDetails();
            }

        });

        // Close with Escape.
        document.addEventListener('keydown', (event) => {

            if (
                event.key === 'Escape' &&
                !museumDetails.classList.contains('hidden')
            ) {
                closeMuseumDetails();
            }

        });
    }


});
