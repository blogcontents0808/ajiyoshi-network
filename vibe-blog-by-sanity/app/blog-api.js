// ブログ記事自動作成システム API
class BlogCreatorAPI {
    constructor() {
        this.blogTemplate = null;
        this.indexTemplate = null;
        this.loadTemplates();
    }

    // テンプレートファイルを読み込み
    async loadTemplates() {
        try {
            // blog-template.html を読み込み
            const templateResponse = await fetch('blog-template.html');
            this.blogTemplate = await templateResponse.text();
            
            // index.html を読み込み
            const indexResponse = await fetch('index.html');
            this.indexTemplate = await indexResponse.text();
        } catch (error) {
            console.error('テンプレートの読み込みに失敗しました:', error);
        }
    }

    // 記事作成メイン関数
    async createBlogPost(formData) {
        try {
            // 1. 画像を保存
            const imagePath = await this.saveImage(formData.get('image'));
            
            // 2. HTMLファイルを生成
            const articleData = this.extractArticleData(formData, imagePath);
            const htmlContent = this.generateHTML(articleData);
            
            // 3. ファイル名を生成
            const fileName = this.generateFileName(articleData.title, articleData.date);
            
            // 4. HTMLファイルを保存
            await this.saveHTMLFile(fileName, htmlContent);
            
            // 5. index.htmlを更新
            await this.updateIndexHTML(articleData, fileName);
            
            return {
                success: true,
                message: '記事が正常に作成されました',
                fileName: fileName,
                imagePath: imagePath
            };
            
        } catch (error) {
            console.error('記事作成エラー:', error);
            return {
                success: false,
                message: error.message || '記事の作成に失敗しました'
            };
        }
    }

    // フォームデータから記事データを抽出
    extractArticleData(formData, imagePath) {
        const sections = JSON.parse(formData.get('sections') || '[]');
        
        return {
            title: formData.get('title'),
            category: formData.get('category'),
            date: this.formatDate(formData.get('date')),
            description: formData.get('description'),
            intro: formData.get('intro'),
            conclusion: formData.get('conclusion'),
            sections: sections,
            imagePath: imagePath,
            imageFileName: imagePath ? imagePath.split('/').pop() : ''
        };
    }

    // 日付フォーマット
    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }

    // ファイル名生成
    generateFileName(title, date) {
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        // タイトルをファイル名用に変換
        const cleanTitle = title
            .replace(/[！？。、]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 20);
        
        return `post-${year}-${month}-${day}-${cleanTitle}.html`;
    }

    // HTML生成
    generateHTML(data) {
        let html = this.blogTemplate;
        
        // 基本情報の置換
        html = html.replace(/【記事タイトル】/g, data.title);
        html = html.replace(/【記事の概要】/g, data.description);
        html = html.replace(/【日付】/g, data.date);
        html = html.replace(/【カテゴリ】/g, data.category);
        html = html.replace(/【画像ファイル名】/g, data.imageFileName);
        
        // カテゴリ色の設定
        const categoryColor = this.getCategoryColor(data.category);
        if (categoryColor) {
            html = html.replace(
                '<span class="blog-post-category">【カテゴリ】</span>',
                `<span class="blog-post-category" style="background-color: ${categoryColor};">${data.category}</span>`
            );
        }

        // 記事本文の生成
        const contentHTML = this.generateContentHTML(data);
        html = html.replace(/<!-- ここに記事の内容を書く -->[\s\S]*?<p>【まとめ】<\/p>/, contentHTML);

        return html;
    }

    // カテゴリ色を取得
    getCategoryColor(category) {
        const colors = {
            'お知らせ': '#FF6600',
            'イベント': '#3498DB',
            '活動報告': '#27AE60',
            '重要': '#E74C3C'
        };
        return colors[category] || '#FF6600';
    }

    // 記事本文HTML生成
    generateContentHTML(data) {
        let contentHTML = `<p>${data.intro}</p>\n\n`;
        
        // セクション追加
        data.sections.forEach(section => {
            if (section.title) {
                contentHTML += `                        <h2>${section.title}</h2>\n`;
            }
            if (section.content) {
                // 改行を<p>タグに変換
                const paragraphs = section.content.split('\n').filter(p => p.trim());
                paragraphs.forEach(paragraph => {
                    contentHTML += `                        <p>${paragraph}</p>\n`;
                });
            }
            contentHTML += '\n';
        });
        
        // まとめ
        if (data.conclusion) {
            contentHTML += `                        <p>${data.conclusion}</p>`;
        }
        
        return contentHTML;
    }

    // 画像保存（シミュレーション）
    async saveImage(imageFile) {
        if (!imageFile) return null;
        
        // 実際の実装では、ここでファイルをサーバーに保存
        // 現在はシミュレーション
        const fileName = `${Date.now()}-${imageFile.name}`;
        const imagePath = `../../images/${fileName}`;
        
        // ローカルストレージに画像データを保存（デモ用）
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                try {
                    localStorage.setItem(`image_${fileName}`, reader.result);
                    resolve(imagePath);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    // HTMLファイル保存（シミュレーション）
    async saveHTMLFile(fileName, content) {
        // 実際の実装では、ここでファイルをサーバーに保存
        // 現在はローカルストレージに保存（デモ用）
        try {
            localStorage.setItem(`blog_${fileName}`, content);
            console.log(`HTMLファイルが保存されました: ${fileName}`);
        } catch (error) {
            throw new Error(`HTMLファイルの保存に失敗しました: ${error.message}`);
        }
    }

    // index.html更新
    async updateIndexHTML(articleData, fileName) {
        try {
            // 新しい記事カードのHTML生成
            const cardHTML = this.generateArticleCard(articleData, fileName);
            
            // index.htmlに追加（シミュレーション）
            const currentIndex = localStorage.getItem('blog_index') || this.indexTemplate;
            
            // 記事一覧セクションを検索して、最初に挿入
            const insertPoint = currentIndex.indexOf('<article class="blog-post-card">');
            if (insertPoint !== -1) {
                const updatedIndex = currentIndex.substring(0, insertPoint) + 
                                  cardHTML + '\n\n                ' + 
                                  currentIndex.substring(insertPoint);
                localStorage.setItem('blog_index', updatedIndex);
                console.log('index.htmlが更新されました');
            } else {
                throw new Error('記事挿入位置が見つかりませんでした');
            }
        } catch (error) {
            throw new Error(`index.htmlの更新に失敗しました: ${error.message}`);
        }
    }

    // 記事カードHTML生成
    generateArticleCard(data, fileName) {
        const categoryColor = this.getCategoryColor(data.category);
        const categoryStyle = categoryColor ? ` style="background-color: ${categoryColor};"` : '';
        
        return `<article class="blog-post-card">
                    <img src="../../images/${data.imageFileName}" alt="${data.title}" class="blog-post-image">
                    <div class="blog-post-content">
                        <div class="blog-post-meta">
                            <time class="blog-post-date">${data.date}</time>
                            <span class="blog-post-category"${categoryStyle}>${data.category}</span>
                        </div>
                        <h2 class="blog-post-title">
                            <a href="${fileName}">${data.title}</a>
                        </h2>
                        <p class="blog-post-excerpt">${data.description}</p>
                        <div class="blog-post-footer">
                            <div class="blog-post-author">
                                <img src="../../images/kantaro_yoroshiku.png" alt="味美ネットワーク">
                                <span>味美ネットワーク</span>
                            </div>
                            <a href="${fileName}" class="blog-post-readmore">続きを読む →</a>
                        </div>
                    </div>
                </article>`;
    }

    // デバッグ用：保存されたデータを表示
    showStoredData() {
        console.log('=== 保存されたブログデータ ===');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('blog_') || key.startsWith('image_')) {
                console.log(`${key}:`, localStorage.getItem(key).substring(0, 100) + '...');
            }
        }
    }

    // データクリア（デバッグ用）
    clearStoredData() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('blog_') || key.startsWith('image_')) {
                keys.push(key);
            }
        }
        keys.forEach(key => localStorage.removeItem(key));
        console.log('ブログデータをクリアしました');
    }
}

// グローバルインスタンス
const blogAPI = new BlogCreatorAPI();

// 実際の記事作成関数（blog-creator.htmlから呼び出される）
async function createBlogPost(formData) {
    return await blogAPI.createBlogPost(formData);
}

// デバッグ関数をグローバルに公開
window.showBlogData = () => blogAPI.showStoredData();
window.clearBlogData = () => blogAPI.clearStoredData();