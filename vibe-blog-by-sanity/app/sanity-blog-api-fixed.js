// 修正版 Sanity CMS連携 ブログ記事作成API
class SanityBlogAPI {
    constructor() {
        // 正しいプロジェクトID（スクリーンショットから確認）
        this.projectId = 'qier3te'; // 修正: qier3tei → qier3te
        this.dataset = 'production';
        this.apiVersion = '2023-05-03';
        this.token = null;
        
        this.client = null;
        this.isInitialized = false;
        this.isInitializing = false;
        
        // 初期化を開始
        this.initializeClient();
    }

    // Sanity Client初期化（修正版）
    async initializeClient() {
        if (this.isInitializing || this.isInitialized) {
            return;
        }
        
        this.isInitializing = true;
        
        try {
            // 既にライブラリが読み込まれているかチェック
            if (window.sanityClient) {
                this.createClient();
                return;
            }
            
            // CDNからSanity Clientを読み込み
            await this.loadSanityClient();
            this.createClient();
            
        } catch (error) {
            console.error('Sanity Client初期化エラー:', error);
            this.isInitializing = false;
            throw error;
        }
    }

    // Sanity Clientライブラリの読み込み
    loadSanityClient() {
        return new Promise((resolve, reject) => {
            // 既に読み込み済みの場合
            if (window.sanityClient) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@sanity/client@6.4.11/dist/index.browser.js';
            
            script.onload = () => {
                console.log('Sanity Client library loaded');
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Sanity Clientライブラリの読み込みに失敗しました'));
            };
            
            document.head.appendChild(script);
        });
    }

    // Clientインスタンスの作成
    createClient() {
        try {
            if (!window.sanityClient) {
                throw new Error('window.sanityClientが見つかりません');
            }

            this.client = window.sanityClient.createClient({
                projectId: this.projectId,
                dataset: this.dataset,
                apiVersion: this.apiVersion,
                useCdn: false,
                token: this.token
            });

            this.isInitialized = true;
            this.isInitializing = false;
            console.log('Sanity Client created successfully', {
                projectId: this.projectId,
                hasToken: !!this.token
            });
            
        } catch (error) {
            console.error('Client作成エラー:', error);
            this.isInitializing = false;
            throw error;
        }
    }

    // Write Tokenを設定（修正版）
    async setWriteToken(token) {
        this.token = token;
        
        // まだ初期化中の場合は待機
        if (this.isInitializing) {
            await this.waitForInitialization();
        }
        
        // 初期化されていない場合は初期化を実行
        if (!this.isInitialized) {
            await this.initializeClient();
        }
        
        // Clientを再作成（新しいTokenで）
        if (this.isInitialized) {
            this.createClient();
        }
    }

    // 初期化完了を待機
    waitForInitialization(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            const checkInitialization = () => {
                if (this.isInitialized) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('初期化がタイムアウトしました'));
                } else {
                    setTimeout(checkInitialization, 100);
                }
            };
            
            checkInitialization();
        });
    }

    // 接続テスト（修正版）
    async testConnection() {
        try {
            // 初期化チェック
            if (!this.isInitialized || !this.client) {
                return {
                    success: false,
                    message: 'Sanity Clientが初期化されていません。Tokenを設定してください。'
                };
            }

            if (!this.token) {
                return {
                    success: false,
                    message: 'Write Tokenが設定されていません'
                };
            }

            // 簡単なクエリでテスト
            const result = await this.client.fetch('*[_type == "post"][0..0]');
            
            return {
                success: true,
                message: 'Sanity接続成功',
                projectId: this.projectId,
                data: result
            };
            
        } catch (error) {
            console.error('接続テストエラー:', error);
            return {
                success: false,
                message: `接続エラー: ${error.message}`,
                error: error
            };
        }
    }

    // ブログ記事をSanityに投稿（修正版）
    async createBlogPost(formData) {
        try {
            // 初期化とToken確認
            if (!this.isInitialized || !this.client || !this.token) {
                throw new Error('Sanity Clientが初期化されていないか、Tokenが設定されていません');
            }

            // 1. 画像をSanity Assetsにアップロード
            let imageAsset = null;
            const imageFile = formData.get('image');
            if (imageFile) {
                imageAsset = await this.uploadImage(imageFile);
            }

            // 2. 記事データの準備
            const articleData = this.prepareArticleData(formData, imageAsset);

            // 3. Sanityに記事を作成
            const result = await this.client.create(articleData);

            return {
                success: true,
                data: result,
                message: '記事がSanityに正常に投稿されました',
                sanityId: result._id
            };

        } catch (error) {
            console.error('Sanity投稿エラー:', error);
            return {
                success: false,
                message: error.message || 'Sanityへの投稿に失敗しました',
                error: error
            };
        }
    }

    // 画像をSanity Assetsにアップロード
    async uploadImage(imageFile) {
        try {
            const imageAsset = await this.client.assets.upload('image', imageFile, {
                filename: imageFile.name
            });
            
            return {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id
                }
            };
        } catch (error) {
            console.error('画像アップロードエラー:', error);
            throw new Error('画像のアップロードに失敗しました: ' + error.message);
        }
    }

    // 記事データをSanity形式に変換
    prepareArticleData(formData, imageAsset) {
        const title = formData.get('title');
        const category = formData.get('category');
        const date = formData.get('date');
        const description = formData.get('description');
        const intro = formData.get('intro');
        const conclusion = formData.get('conclusion');
        const sections = JSON.parse(formData.get('sections') || '[]');

        // スラッグ生成
        const slug = this.generateSlug(title);

        // コンテンツブロックの生成
        const contentBlocks = this.generateContentBlocks(intro, sections, conclusion);

        return {
            _type: 'post',
            title: title,
            slug: {
                _type: 'slug',
                current: slug
            },
            excerpt: description,
            content: contentBlocks,
            thumbnail: imageAsset,
            publishedAt: new Date(date).toISOString(),
            published: true,
            category: {
                _type: 'reference',
                _ref: this.getCategoryReference(category)
            },
            author: {
                _type: 'reference',
                _ref: this.getAuthorReference()
            },
            tags: [] // 必要に応じて追加
        };
    }

    // スラッグ生成
    generateSlug(title) {
        const timestamp = Date.now();
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, '-') 
            .substring(0, 50) + '-' + timestamp;
    }

    // コンテンツブロックの生成
    generateContentBlocks(intro, sections, conclusion) {
        const blocks = [];

        // 導入文
        if (intro) {
            blocks.push({
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: intro
                    }
                ]
            });
        }

        // セクション
        sections.forEach(section => {
            if (section.title) {
                blocks.push({
                    _type: 'block',
                    style: 'h2',
                    children: [
                        {
                            _type: 'span',
                            text: section.title
                        }
                    ]
                });
            }

            if (section.content) {
                const paragraphs = section.content.split('\n').filter(p => p.trim());
                paragraphs.forEach(paragraph => {
                    blocks.push({
                        _type: 'block',
                        style: 'normal',
                        children: [
                            {
                                _type: 'span',
                                text: paragraph
                            }
                        ]
                    });
                });
            }
        });

        // まとめ
        if (conclusion) {
            blocks.push({
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: conclusion
                    }
                ]
            });
        }

        return blocks;
    }

    // カテゴリ参照の取得
    getCategoryReference(categoryName) {
        const categoryMap = {
            'お知らせ': 'category-oshirase',
            'イベント': 'category-event',
            '活動報告': 'category-activity',
            '重要': 'category-important'
        };
        
        return categoryMap[categoryName] || 'category-oshirase';
    }

    // 著者参照の取得
    getAuthorReference() {
        return 'author-ajiyoshi-network';
    }

    // デバッグ情報
    getDebugInfo() {
        return {
            projectId: this.projectId,
            dataset: this.dataset,
            isInitialized: this.isInitialized,
            isInitializing: this.isInitializing,
            hasToken: !!this.token,
            hasClient: !!this.client,
            hasSanityGlobal: !!window.sanityClient
        };
    }
}

// グローバルインスタンス
const sanityBlogAPI = new SanityBlogAPI();

// 修正版関数
async function createSanityBlogPost(formData) {
    return await sanityBlogAPI.createBlogPost(formData);
}

// デバッグ関数
window.setSanityToken = async (token) => {
    try {
        await sanityBlogAPI.setWriteToken(token);
        console.log('Token設定完了');
    } catch (error) {
        console.error('Token設定エラー:', error);
        throw error;
    }
};

window.testSanityConnection = async () => {
    return await sanityBlogAPI.testConnection();
};

window.getSanityDebugInfo = () => {
    return sanityBlogAPI.getDebugInfo();
};

// 初期化完了の通知
window.addEventListener('load', () => {
    console.log('Sanity API initialized on page load');
});