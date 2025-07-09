// --- スクロールでふわっと表示させるコード ---
const targets = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
});
targets.forEach(target => {
    observer.observe(target);
});


// --- ハンバーガーメニュー用のコード ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const headerNav = document.querySelector('.header-nav');
const body = document.body;

hamburgerBtn.addEventListener('click', () => {
    // is-active クラスを付け外し
    hamburgerBtn.classList.toggle('is-active');
    headerNav.classList.toggle('is-active');
    
    // 背景のスクロールを制御
    if (body.style.overflow === 'hidden') {
        body.style.overflow = '';
    } else {
        body.style.overflow = 'hidden';
    }
});