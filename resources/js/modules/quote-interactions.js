
import { createQuoteImage } from './quote-image.js';

document.addEventListener('DOMContentLoaded', () => {

    const messageBox = document.getElementById('favorite-message');

    // =========================================
    // Notifications
    // =========================================

    function showMessage(message) {
        if (messageBox) {
            messageBox.textContent = message;
            messageBox.classList.remove('hidden');
            return;
        }

        const notification = document.createElement('div');

        notification.textContent = message;
        notification.className =
            'fixed bottom-6 left-6 z-[150] rounded-xl border border-[#C5A15B]/50 bg-[#14251F] px-5 py-3 text-sm text-[#E8DFC9] shadow-xl';

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3500);
    }


    // =========================================
    // AJAX Requests
    // =========================================

    async function sendRequest(form, button, errorMessage, onSuccess) {
        if (button.disabled) return;

        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-wait');

        try {
            const csrfToken = form.querySelector('input[name="_token"]')?.value;

            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || errorMessage);
            }

            onSuccess(data);
            showMessage(data.message);

        } catch (error) {
            showMessage(error.message || errorMessage);

        } finally {
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-wait');
        }
    }


    // =========================================
    // Favorites Panel
    // =========================================

    function updateFavoritesPanel(form) {
        const favoritesPanel = document.getElementById('profile-favorites');

        if (!favoritesPanel || !favoritesPanel.contains(form)) {
            return;
        }

        const quoteCard = form.closest('blockquote');

        if (quoteCard) {
            quoteCard.remove();
        }

        const remainingQuotes = favoritesPanel.querySelectorAll(
            'blockquote[id^="quote-"]'
        ).length;

        const favoritesTab = document.querySelector(
            '[data-profile-tab="favorites"]'
        );

        if (favoritesTab) {
            favoritesTab.textContent = `المفضلة (${remainingQuotes})`;
        }

        if (remainingQuotes === 0) {
            const emptyState = document.createElement('div');

            emptyState.className =
                'rounded-2xl border border-[#80683D]/40 bg-[#1C2B21] p-10 text-center';

            const icon = document.createElement('p');
            icon.className = 'mb-3 text-4xl';
            icon.textContent = '🔖';

            const heading = document.createElement('h3');
            heading.className = 'athar-heading text-xl';
            heading.textContent = 'لم تحفظ أي عبارة بعد';

            const description = document.createElement('p');
            description.className = 'mt-3 text-sm text-[#B6A98D]';
            description.textContent =
                'احفظ العبارات التي تعجبك لتجدها هنا لاحقًا.';

            const link = document.createElement('a');
            link.href = '/';
            link.className = 'btn-primary mt-6 inline-block';
            link.textContent = 'اكتشف العبارات';

            emptyState.append(icon, heading, description, link);
            favoritesPanel.appendChild(emptyState);
        }
    }


    // =========================================
    // Favorite Buttons
    // =========================================

    document.querySelectorAll('.favorite-form').forEach((form) => {
        const button = form.querySelector('.favorite-button');
        const icon = form.querySelector('.favorite-icon');
        const label = form.querySelector('.favorite-label');

        if (!button || !icon || !label) return;

        button.addEventListener('click', () => {
            sendRequest(form, button, 'تعذر تحديث المفضلة', (data) => {
                const isFavorite = data.is_favorite;

                button.setAttribute('aria-pressed', String(isFavorite));

                button.setAttribute(
                    'aria-label',
                    isFavorite ? 'إزالة من المفضلة' : 'إضافة للمفضلة'
                );

                icon.setAttribute(
                    'fill',
                    isFavorite ? 'currentColor' : 'none'
                );

                label.textContent = isFavorite ? 'محفوظة' : 'حفظ';

                button.classList.toggle('text-[#D6B66F]', isFavorite);
                button.classList.toggle('text-[#B6A98D]', !isFavorite);

                if (!isFavorite) {
                    updateFavoritesPanel(form);
                }
            });
        });
    });


    // =========================================
    // Like Buttons
    // =========================================

    document.querySelectorAll('.like-form').forEach((form) => {
        const button = form.querySelector('.like-button');
        const icon = form.querySelector('.like-icon');
        const count = form.querySelector('.like-count');

        if (!button || !icon || !count) return;

        button.addEventListener('click', () => {
            sendRequest(form, button, 'تعذر تحديث الإعجاب', (data) => {
                const isLiked = data.is_liked;

                button.setAttribute('aria-pressed', String(isLiked));

                button.setAttribute(
                    'aria-label',
                    isLiked ? 'إلغاء الإعجاب' : 'إعجاب بالعبارة'
                );

                icon.textContent = isLiked ? '❤️' : '🤍';

                count.textContent =
                    Number(data.likes_count).toLocaleString('en-US');
            });
        });
    });


    // =========================================
    // ATHAR — Share Modal
    // =========================================

    function openShareModal(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeShareModal(modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }


    // Download PNG
    async function downloadQuoteImage(modal) {
        const blob = await createQuoteImage(
            modal.dataset.quote || '',
            modal.dataset.author || 'ATHAR',
            modal.dataset.category || 'عام'
        );

        const imageUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = imageUrl;
        link.download = 'ATHAR-Quote.png';

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);

        showMessage('تم تنزيل بطاقة الاقتباس بنجاح');
    }


    // Native Share
    async function shareQuoteImage(modal) {
        const blob = await createQuoteImage(
            modal.dataset.quote || '',
            modal.dataset.author || 'ATHAR',
            modal.dataset.category || 'عام'
        );

        const file = new File(
            [blob],
            'ATHAR-Quote.png',
            { type: 'image/png' }
        );

        if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
        ) {
            await navigator.share({
                files: [file],
                title: 'ATHAR — أثر',
                text: 'كلمات تبقى.'
            });

            showMessage('تم تجهيز بطاقة المشاركة');

        } else {
            await downloadQuoteImage(modal);

            showMessage(
                'المشاركة غير مدعومة في هذا المتصفح، تم تنزيل الصورة بدلًا منها'
            );
        }
    }


    // Open Share Modal
    document.querySelectorAll('.share-quote-button').forEach((button) => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalTarget;
            const modal = document.getElementById(modalId);

            if (modal) {
                openShareModal(modal);
            }
        });
    });


    // Close Share Modal
    document.querySelectorAll('.share-options-modal').forEach((modal) => {

        modal.querySelectorAll(
            '.share-modal-close, .share-modal-backdrop'
        ).forEach((button) => {
            button.addEventListener('click', () => {
                closeShareModal(modal);
            });
        });


        // Download / Share Actions
        modal.querySelectorAll('[data-share-action]').forEach((button) => {

            button.addEventListener('click', async () => {
                if (button.disabled) return;

                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-wait');

                try {
                    const action = button.dataset.shareAction;

                    if (action === 'download') {
                        await downloadQuoteImage(modal);
                        closeShareModal(modal);
                    }

                    if (action === 'share') {
                        await shareQuoteImage(modal);
                        closeShareModal(modal);
                    }

                } catch (error) {
                    if (error.name !== 'AbortError') {
                        showMessage(
                            error.message || 'تعذر تنفيذ المشاركة'
                        );
                    }

                } finally {
                    button.disabled = false;
                    button.classList.remove('opacity-50', 'cursor-wait');
                }
            });

        });

    });


    // Close Share Modal with Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.share-options-modal').forEach((modal) => {
                if (!modal.classList.contains('hidden')) {
                    closeShareModal(modal);
                }
            });
        }
    });



});
