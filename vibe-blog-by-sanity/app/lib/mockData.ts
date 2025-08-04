// モックデータ - 開発環境用フォールバック
export const mockPosts = [
  {
    _id: '1',
    title: 'ウェブサイトをリニューアルしました',
    slug: { current: '0001' },
    excerpt: '味美ネットワークのウェブサイトをリニューアルしました。新しいデザインで、より分かりやすく情報をお伝えできるようになりました。',
    publishedAt: '2024-07-15T00:00:00Z',
    published: true,
    thumbnail: {
      asset: {
        _ref: 'image-mock',
        _type: 'reference'
      }
    },
    category: {
      title: 'お知らせ',
      slug: { current: 'news' },
      color: '#4A90E2'
    },
    author: {
      name: '味美ネットワーク',
      slug: { current: 'ajiyoshi-network' },
      avatar: {
        asset: {
          _ref: 'image-mock',
          _type: 'reference'
        }
      }
    },
    tags: ['ウェブサイト', 'リニューアル', 'お知らせ'],
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '味美ネットワークのウェブサイトをリニューアルしました。新しいデザインで、より分かりやすく情報をお伝えできるようになりました。'
          }
        ]
      }
    ]
  },
  {
    _id: '2',
    title: 'サマーフェスタ味美2024開催のお知らせ',
    slug: { current: '0002' },
    excerpt: '今年もサマーフェスタ味美を開催いたします。地域の皆様と一緒に楽しい夏のイベントを企画しています。',
    publishedAt: '2024-06-15T00:00:00Z',
    published: true,
    thumbnail: {
      asset: {
        _ref: 'image-mock',
        _type: 'reference'
      }
    },
    category: {
      title: 'イベント',
      slug: { current: 'event' },
      color: '#E74C3C'
    },
    author: {
      name: '味美ネットワーク',
      slug: { current: 'ajiyoshi-network' },
      avatar: {
        asset: {
          _ref: 'image-mock',
          _type: 'reference'
        }
      }
    },
    tags: ['イベント', 'サマーフェスタ', '地域活動'],
    content: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: '今年もサマーフェスタ味美を開催いたします。地域の皆様と一緒に楽しい夏のイベントを企画しています。'
          }
        ]
      }
    ]
  }
]

export const mockCategories = [
  {
    _id: 'cat1',
    title: 'お知らせ',
    slug: { current: 'news' },
    description: '重要なお知らせや更新情報',
    color: '#4A90E2'
  },
  {
    _id: 'cat2',
    title: 'イベント',
    slug: { current: 'event' },
    description: '地域イベントの情報',
    color: '#E74C3C'
  },
  {
    _id: 'cat3',
    title: '活動報告',
    slug: { current: 'activity' },
    description: '日々の活動の報告',
    color: '#2ECC71'
  }
]

export const mockSettings = {
  title: '味美ネットワーク ブログ',
  description: '味美地区の情報発信・交流の場',
  url: 'https://ajiyoshi-network.com',
  logo: {
    asset: {
      _ref: 'image-mock',
      _type: 'reference'
    }
  },
  favicon: {
    asset: {
      _ref: 'image-mock',
      _type: 'reference'
    }
  },
  socialLinks: {
    twitter: '',
    facebook: '',
    instagram: ''
  }
}

export const mockAuthor = {
  _id: 'author1',
  name: '味美ネットワーク',
  slug: { current: 'ajiyoshi-network' },
  role: '地域コミュニティ',
  bio: '愛知県春日井市味美地区の情報発信・交流を目的とした地域コミュニティです。',
  avatar: {
    asset: {
      _ref: 'image-mock',
      _type: 'reference'
    }
  },
  social: {
    twitter: '',
    facebook: '',
    website: 'https://ajiyoshi-network.com'
  }
}