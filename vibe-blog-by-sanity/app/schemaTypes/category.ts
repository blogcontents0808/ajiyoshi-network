import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'カテゴリ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 200,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '説明',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'color',
      title: 'カラー',
      type: 'string',
      options: {
        list: [
          { title: 'オレンジ', value: '#E67E22' },
          { title: 'ブルー', value: '#3498DB' },
          { title: 'グリーン', value: '#27AE60' },
          { title: 'レッド', value: '#E74C3C' },
          { title: 'パープル', value: '#9B59B6' },
          { title: 'イエロー', value: '#F1C40F' },
        ],
      },
      initialValue: '#E67E22',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})