document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.profile-tab');

    const quotesPanel = document.getElementById('profile-quotes');
    const favoritesPanel = document.getElementById('profile-favorites');

    tabs.forEach((tab) => {

        tab.addEventListener('click', () => {

            const selectedTab = tab.dataset.profileTab;
            const showQuotes = selectedTab === 'quotes';

            quotesPanel.classList.toggle('hidden', !showQuotes);
            favoritesPanel.classList.toggle('hidden', showQuotes);

            tabs.forEach((item) => {

                const isActive = item === tab;

                item.setAttribute('aria-pressed', String(isActive));

                item.classList.toggle('bg-[#C5A15B]', isActive);
                item.classList.toggle('text-[#101B15]', isActive);
                item.classList.toggle('border-[#C5A15B]', isActive);

                item.classList.toggle('bg-[#1C2B21]', !isActive);
                item.classList.toggle('text-[#E8DFC9]', !isActive);
                item.classList.toggle('border-[#80683D]/50', !isActive);

            });

        });

    });

});
