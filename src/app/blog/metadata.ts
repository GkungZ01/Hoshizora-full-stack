import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Hoshizora',
  description: 'Blog posts from Hoshizora'
}

// Blog data
export const blogs = [
  {
    id: '1',
    title: '薬屋のひとりごと 第2期',
    description: 'Maomao, an apothecary daughter, has been plucked from her peaceful life and sold to the lowest echelons of the imperial court. Now merely a maid, Maomao settles into her new mundane life and hides her extensive knowledge of medicine in order to avoid any unwanted attention.',
    imageUrl: '/image/112.jpg',
    tags: ['Drama', 'Mystery'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-20'
  },
  {
    id: '2',
    title: 'Re:ゼロから始める異世界生活',
    description: 'One year after the events at the Sanctuary, Subaru Natsuki trains hard to better face future challenges. The peaceful days come to an end when Emilia receives an invitation to a meeting in the Watergate City of Priestella from none other than Anastasia Hoshin, one of her rivals in the royal selection',
    imageUrl: '/image/121.jpg',
    tags: ['Drama', 'Fantasy', 'Suspense'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-04'
  },
  {
    id: '3',
    title: 'マジック・メイカー',
    description: 'A man who was thirty years old and wanted to use magic died unexpectedly, and when he woke up, he was reborn in another world. Named Theon, he had high hopes that there would be magic in another world, but there was no magic in that world.',
    imageUrl: '/image/111.jpg',
    tags: ['Isekai', 'Reincarnation'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-11'
  },
  {
    id: '4',
    title: '無職転生 ～異世界行ったら本気だす～',
    description: 'Despite being bullied, scorned, and oppressed all of his life, a 34-year-old shut-in still found the resolve to attempt something heroic—only for it to end in a tragic accident. But in a twist of fate, he awakens in another world as Rudeus Greyrat, starting life again as a baby born to two loving parents.',
    imageUrl: '/image/232.jpeg',
    tags: ['Isekai', 'Reincarnation'],
    readTime: '5 min',
    views: 9999,
    date: '2024-12-29'
  },
]