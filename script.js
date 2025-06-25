// 味美ネットワーク - 簡易的なフロントエンドスクリプト

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // フォームデータ取得
        const formData = new FormData(form);
        const name = formData.get('name');

        alert(`${name} 様、お問い合わせありがとうございます！\n内容を確認のうえ、担当者よりご連絡いたします。`);
        form.reset();
    });
});
