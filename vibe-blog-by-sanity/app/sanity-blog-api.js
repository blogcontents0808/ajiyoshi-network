// Sanity CMS連携 ブログ記事作成API
class SanityBlogAPI {
    constructor() {
        this.projectId = 'qier3tei';
        this.dataset = 'production';
        this.apiVersion = '2023-05-03';
        this.token = null; // Sanity Write Tokenが必要
        
        // Sanity Client初期化
        this.client = null;
        this.initializeClient();
    }

    // Sanity Client初期化
    async initializeClient() {
        try {
            // Sanity Clientをインポート（CDN版）
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@sanity/client@6.4.11/dist/index.browser.js';
            document.head.appendChild(script);
            
            script.onload = () => {
                this.client = window.sanityClient.createClient({
                    projectId: this.projectId,
                    dataset: this.dataset,
                    apiVersion: this.apiVersion,
                    useCdn: false,
                    token: this.token // Write権限が必要
                });
                console.log('Sanity Client initialized');
            };
        } catch (error) {
            console.error('Sanity Client初期化エラー:', error);
        }
    }

    // Write Tokenを設定
    setWriteToken(token) {
        this.token = token;
        if (this.client) {
            this.client = window.sanityClient.createClient({
                projectId: this.projectId,
                dataset: this.dataset,
                apiVersion: this.apiVersion,
                useCdn: false,
                token: this.token
            });
        }
    }

    // ブログ記事をSanityに投稿
    async createBlogPost(formData) {
        if (!this.client || !this.token) {
            throw new Error('Sanity Clientが初期化されていないか、Write Tokenが設定されていません');
        }

        try {
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
            // ファイルサイズチェック（5MB制限）
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (imageFile.size > maxSize) {
                throw new Error(`画像サイズが大きすぎます（最大5MB）。現在のサイズ: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`);
            }

            console.log(`画像アップロード開始: ${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)}MB)`);
            
            const imageAsset = await this.client.assets.upload('image', imageFile, {
                filename: imageFile.name
            });
            
            console.log('画像アップロード完了:', imageAsset._id);
            
            return {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id
                }
            };
        } catch (error) {
            console.error('画像アップロードエラー:', error);
            
            // より具体的なエラーメッセージを提供
            let errorMessage = '画像のアップロードに失敗しました';
            
            if (error.message.includes('サイズが大きすぎます')) {
                errorMessage = error.message;
            } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
                errorMessage = 'アップロードがタイムアウトしました。ネットワーク接続を確認して再度お試しください。';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'ネットワークエラーです。接続を確認して再度お試しください。';
            } else if (error.message.includes('413') || error.message.includes('too large')) {
                errorMessage = 'ファイルサイズが大きすぎます。5MB以下の画像を選択してください。';
            } else {
                errorMessage = `画像のアップロードに失敗しました: ${error.message}`;
            }
            
            throw new Error(errorMessage);
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
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // 特殊文字除去
            .replace(/\s+/g, '-') // スペースをハイフンに
            .substring(0, 50); // 50文字制限
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
                // 段落に分割
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

    // カテゴリ参照の取得（既存のカテゴリIDを返す）
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
        return 'author-ajiyoshi-network'; // 既存の著者IDを使用
    }

    // Sanity接続テスト
    async testConnection() {
        if (!this.client) {
            return {
                success: false,
                message: 'Sanity Clientが初期化されていません'
            };
        }

        try {
            const result = await this.client.fetch('*[_type == "post"][0..0]');
            return {
                success: true,
                message: 'Sanity接続成功',
                data: result
            };
        } catch (error) {
            return {
                success: false,
                message: 'Sanity接続エラー: ' + error.message,
                error: error
            };
        }
    }

    // 必要なカテゴリとAuthorを作成（初回セットアップ用）
    async setupInitialData() {
        if (!this.client || !this.token) {
            throw new Error('Write権限が必要です');
        }

        try {
            // カテゴリ作成
            const categories = [
                {
                    _id: 'category-oshirase',
                    _type: 'category',
                    title: 'お知らせ',
                    slug: { _type: 'slug', current: 'oshirase' },
                    description: 'お知らせカテゴリ',
                    color: '#FF6600'
                },
                {
                    _id: 'category-event',
                    _type: 'category',
                    title: 'イベント',
                    slug: { _type: 'slug', current: 'event' },
                    description: 'イベントカテゴリ',
                    color: '#3498DB'
                },
                {
                    _id: 'category-activity',
                    _type: 'category',
                    title: '活動報告',
                    slug: { _type: 'slug', current: 'activity' },
                    description: '活動報告カテゴリ',
                    color: '#27AE60'
                },
                {
                    _id: 'category-important',
                    _type: 'category',
                    title: '重要',
                    slug: { _type: 'slug', current: 'important' },
                    description: '重要なお知らせ',
                    color: '#E74C3C'
                }
            ];

            // 著者作成
            const author = {
                _id: 'author-ajiyoshi-network',
                _type: 'author',
                name: '味美ネットワーク',
                slug: { _type: 'slug', current: 'ajiyoshi-network' },
                bio: '私たち味美ネットワークは、自分たちが関わる街が住みよく愛される街になるように、春日井市南部の味美地区を中心に、平成４年より活動している地域団体です。',
                social: {
                    facebook: 'https://www.facebook.com/watch/?v=1872150119939498',
                    instagram: 'https://www.instagram.com/ajiyoshi.net.work/'
                }
            };

            // データを作成
            const results = await Promise.all([
                ...categories.map(cat => this.client.createOrReplace(cat)),
                this.client.createOrReplace(author)
            ]);

            return {
                success: true,
                message: '初期データの作成が完了しました',
                results: results
            };

        } catch (error) {
            console.error('初期データ作成エラー:', error);
            throw error;
        }
    }
}

// グローバルインスタンス
const sanityBlogAPI = new SanityBlogAPI();

// 記事作成関数（フォームから呼び出される）
async function createSanityBlogPost(formData) {
    return await sanityBlogAPI.createBlogPost(formData);
}

// デバッグ関数
window.setSanityToken = (token) => sanityBlogAPI.setWriteToken(token);
window.testSanityConnection = () => sanityBlogAPI.testConnection();
window.setupSanityData = () => sanityBlogAPI.setupInitialData();