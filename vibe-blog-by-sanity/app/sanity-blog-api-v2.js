// Sanity CMS連携 ブログ記事作成API v2 (別CDN使用)
class SanityBlogAPI {
    constructor() {
        this.projectId = 'qier3te';
        this.dataset = 'production';
        this.apiVersion = '2023-05-03';
        this.token = null;
        
        this.client = null;
        this.isInitialized = false;
        this.isInitializing = false;
        
        // 初期化を開始
        this.initializeClient();
    }

    // Sanity Client初期化（fetch API使用版）
    async initializeClient() {
        if (this.isInitializing || this.isInitialized) {
            return;
        }
        
        this.isInitializing = true;
        
        try {
            // fetch APIを使用してSanity APIを直接呼び出し
            this.client = {
                fetch: async (query, params = {}) => {
                    const url = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/query/${this.dataset}`;
                    const response = await fetch(`${url}?query=${encodeURIComponent(query)}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`API Error: ${response.status} ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    return data.result;
                },
                
                create: async (document) => {
                    const url = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/data/mutate/${this.dataset}`;
                    const mutation = {
                        mutations: [
                            {
                                create: {
                                    _type: document._type,
                                    ...document
                                }
                            }
                        ]
                    };
                    
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(mutation)
                    });
                    
                    if (!response.ok) {
                        throw new Error(`API Error: ${response.status} ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    return data.results[0].document;
                },
                
                assets: {
                    upload: async (type, file) => {
                        const url = `https://${this.projectId}.api.sanity.io/v${this.apiVersion}/assets/images/${this.dataset}`;
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        const response = await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${this.token}`
                            },
                            body: formData
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Asset upload error: ${response.status} ${response.statusText}`);
                        }
                        
                        return await response.json();
                    }
                }
            };

            this.isInitialized = true;
            this.isInitializing = false;
            console.log('Sanity Client (Fetch版) created successfully', {
                projectId: this.projectId,
                hasToken: !!this.token
            });
            
        } catch (error) {
            console.error('Client作成エラー:', error);
            this.isInitializing = false;
            throw error;
        }
    }

    // Write Tokenを設定
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
        
        console.log('Token設定完了:', { hasToken: !!this.token, isInitialized: this.isInitialized });
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

    // 接続テスト
    async testConnection() {
        try {
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
            
            // エラーの詳細分析
            let errorMessage = error.message;
            if (error.message.includes('401')) {
                errorMessage = 'Tokenが無効または権限が不足しています。Editor権限のTokenを作成してください。';
            } else if (error.message.includes('404')) {
                errorMessage = 'プロジェクトが見つかりません。プロジェクトIDを確認してください。';
            } else if (error.message.includes('403')) {
                errorMessage = 'アクセスが拒否されました。Tokenの権限を確認してください。';
            }
            
            return {
                success: false,
                message: errorMessage,
                error: error
            };
        }
    }

    // ブログ記事をSanityに投稿
    async createBlogPost(formData) {
        try {
            if (!this.isInitialized || !this.client || !this.token) {
                throw new Error('Sanity Clientが初期化されていないか、Tokenが設定されていません');
            }

            // 1. 画像をSanity Assetsにアップロード
            let imageAsset = null;
            const imageFile = formData.get('image');
            if (imageFile) {
                console.log('画像アップロード開始:', imageFile.name);
                imageAsset = await this.uploadImage(imageFile);
                console.log('画像アップロード完了:', imageAsset);
            }

            // 2. 記事データの準備
            const articleData = this.prepareArticleData(formData, imageAsset);
            console.log('記事データ準備完了:', articleData);

            // 3. Sanityに記事を作成
            const result = await this.client.create(articleData);
            console.log('記事作成完了:', result);

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
            const imageAsset = await this.client.assets.upload('image', imageFile);
            
            return {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset.document._id
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
            tags: []
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
                _key: 'intro-' + Date.now(),
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _key: 'span-' + Date.now(),
                        _type: 'span',
                        text: intro,
                        marks: []
                    }
                ],
                markDefs: []
            });
        }

        // セクション
        sections.forEach((section, index) => {
            if (section.title) {
                blocks.push({
                    _key: 'heading-' + index + '-' + Date.now(),
                    _type: 'block',
                    style: 'h2',
                    children: [
                        {
                            _key: 'span-h-' + index + '-' + Date.now(),
                            _type: 'span',
                            text: section.title,
                            marks: []
                        }
                    ],
                    markDefs: []
                });
            }

            if (section.content) {
                const paragraphs = section.content.split('\n').filter(p => p.trim());
                paragraphs.forEach((paragraph, pIndex) => {
                    blocks.push({
                        _key: 'paragraph-' + index + '-' + pIndex + '-' + Date.now(),
                        _type: 'block',
                        style: 'normal',
                        children: [
                            {
                                _key: 'span-p-' + index + '-' + pIndex + '-' + Date.now(),
                                _type: 'span',
                                text: paragraph,
                                marks: []
                            }
                        ],
                        markDefs: []
                    });
                });
            }
        });

        // まとめ
        if (conclusion) {
            blocks.push({
                _key: 'conclusion-' + Date.now(),
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _key: 'span-c-' + Date.now(),
                        _type: 'span',
                        text: conclusion,
                        marks: []
                    }
                ],
                markDefs: []
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
            clientType: 'fetch-api'
        };
    }
}

// グローバルインスタンス
const sanityBlogAPI = new SanityBlogAPI();

// API関数
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

console.log('Sanity API v2 (Fetch版) loaded');