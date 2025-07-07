// スクロールでふわっと表示させるためのコード

// 監視対象の要素をすべて取得
const targets = document.querySelectorAll('.fade-in');

// 要素を監視するIntersectionObserverを作成
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // 画面内に入ったら is-visible クラスを追加
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // 一度表示されたら監視を停止
            observer.unobserve(entry.target);
        }
    });
});

// 各要素の監視を開始
targets.forEach(target => {
    observer.observe(target);
});