import { defineField, defineType } from 'sanity'

export const setting = defineType({
  name: 'setting',
  title: 'サイト設定',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'サイトタイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'サイト説明',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'url',
      title: 'サイトURL',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'ロゴ',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'ファビコン',
      type: 'image',
    }),
    defineField({
      name: 'ogImage',
      title: 'OGP画像',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'SNSリンク',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook',
          type: 'url',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'url',
        },
        {
          name: 'twitter',
          title: 'Twitter',
          type: 'url',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'logo',
    },
  },
})