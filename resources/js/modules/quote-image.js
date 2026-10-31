    function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(/\s+/);
        let line = '';
        let currentY = y;

        ctx.textAlign = 'center';
        ctx.direction = 'rtl';

        words.forEach((word) => {
            const testLine = line ? `${line} ${word}` : word;

            if (ctx.measureText(testLine).width > maxWidth && line) {
                ctx.fillText(line, x, currentY);
                line = word;
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        });

        if (line) {
            ctx.fillText(line, x, currentY);
        }

        return currentY;
    }


export async function createQuoteImage(quote, author, category) {
        await document.fonts.ready;

        const canvas = document.createElement('canvas');

        canvas.width = 1080;
        canvas.height = 1350;

        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('تعذر إنشاء بطاقة المشاركة');
        }

        // Background
        const background = ctx.createLinearGradient(
            0, 0, 1080, 1350
        );

        background.addColorStop(0, '#20382C');
        background.addColorStop(0.5, '#14251F');
        background.addColorStop(1, '#0B130F');

        ctx.fillStyle = background;
        ctx.fillRect(0, 0, 1080, 1350);

        // Golden lighting
        const glow = ctx.createRadialGradient(
            540, 300, 20,
            540, 300, 700
        );

        glow.addColorStop(0, 'rgba(197,161,91,0.16)');
        glow.addColorStop(1, 'rgba(197,161,91,0)');

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 1080, 1350);

        // Outer frame
        ctx.strokeStyle = '#C5A15B';
        ctx.lineWidth = 3;
        ctx.strokeRect(48, 48, 984, 1254);

        // Inner frame
        ctx.strokeStyle = 'rgba(197,161,91,0.35)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(65, 65, 950, 1220);

        // Diamond logo
        ctx.save();
        ctx.translate(540, 185);
        ctx.rotate(Math.PI / 4);

        ctx.strokeStyle = '#C5A15B';
        ctx.lineWidth = 4;
        ctx.strokeRect(-32, -32, 64, 64);

        ctx.strokeStyle = '#D6B66F';
        ctx.lineWidth = 2;
        ctx.strokeRect(-19, -19, 38, 38);

        ctx.restore();

        // Brand
        ctx.direction = 'ltr';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#D6B66F';
        ctx.font = 'bold 66px Georgia, serif';
        ctx.fillText('ATHAR', 540, 330);

        ctx.direction = 'rtl';
        ctx.fillStyle = '#E8DFC9';
        ctx.font = '34px "Amiri", serif';
        ctx.fillText('أثر · كلمات تبقى.', 540, 395);

        // Divider
        ctx.strokeStyle = 'rgba(197,161,91,0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(230, 455);
        ctx.lineTo(850, 455);
        ctx.stroke();

        // Category
        ctx.fillStyle = '#D6B66F';
        ctx.font = '32px "IBM Plex Sans Arabic", sans-serif';
        ctx.fillText(category || 'عام', 540, 540);

        // Quote
        ctx.fillStyle = '#F0E7D5';
        ctx.font = '52px "Amiri", serif';

        const lastLineY = drawWrappedText(
            ctx,
            `“${quote}”`,
            540,
            675,
            820,
            92
        );

        // Author divider
        const dividerY = Math.min(
            Math.max(lastLineY + 170, 950),
            1090
        );

        ctx.strokeStyle = 'rgba(197,161,91,0.4)';
        ctx.beginPath();
        ctx.moveTo(300, dividerY);
        ctx.lineTo(780, dividerY);
        ctx.stroke();

        // Author
        ctx.fillStyle = '#D6B66F';
        ctx.font = '36px "IBM Plex Sans Arabic", sans-serif';
        ctx.fillText(author, 540, dividerY + 90);

        // Footer
        ctx.fillStyle = '#A99B7D';
        ctx.font = '26px "Amiri", serif';
        ctx.fillText(
            'من ذاكرة الحضارة، إلى خلود الكلمات',
            540,
            1190
        );

        ctx.direction = 'ltr';
        ctx.font = 'bold 25px Georgia, serif';
        ctx.fillStyle = '#C5A15B';
        ctx.fillText('ATHAR', 540, 1250);

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('تعذر إنشاء صورة المشاركة'));
                    return;
                }

                resolve(blob);
            }, 'image/png');
        });
    }


