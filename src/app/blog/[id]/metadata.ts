import type { Metadata } from 'next'

// Blog post data
const blogs = [
  {
    id: '1',
    title: '薬屋のひとりごと 第2期',
    description: 'Maomao, an apothecary daughter who was sold to the imperial court as a servant, defying expectations with her exceptional skill in identifying poisons and preparing medicines. Despite her attempts to lay low, her abilities caught the eye of the handsome eunuch Jinshi. As she is promoted to lady-in-waiting, Maomao becomes involved in mysterious incidents within the courts, where imperial families plot against each other. Using her pharmaceutical knowledge and keen observation skills, she navigates through the dangerous political landscape of the rear palace.',
    imageUrl: '/image/112.jpg',
    tags: ['Drama', 'Mystery'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-20'
  },
  {
    id: '2',
    title: 'Re:ゼロから始める異世界生活',
    description: 'One year after the events at the Sanctuary, Subaru Natsuki trains hard to better face future challenges. The peaceful days come to an end when Emilia receives an invitation to a meeting in the Watergate City of Priestella from none other than Anastasia Hoshin, one of her rivals in the royal selection. Considering the meeting s significance and the potential dangers Emilia could face, Subaru and his friends accompany her to the city. However, as they meet the other royal candidates and their knights, the Sin Archbishop of Lust, Capella Emerada Lugunica, makes a sudden appearance, starting an assault on the city. Subaru, along with Emilia and their allies, must overcome this new threat to save Priestella and its people.',
    imageUrl: '/image/121.jpg',
    tags: ['Drama', 'Fantasy', 'Suspense'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-04'
  },
  {
    id: '3',
    title: 'マジック・メイカー',
    description: 'A man who was thirty years old and wanted to use magic died unexpectedly, and when he woke up, he was reborn in another world. Named Theon, he had high hopes that there would be magic in another world, but there was no magic in that world. However, when Theon reached puberty, he awakened to knowledge from his previous life, and when he performed the magic of his original world, space itself was dyed with light. That was the birth of magic in another world. High magic builder, Theon, invented magic and has been developing it to become a master of combat magic at the dawn of an era.',
    imageUrl: '/image/111.jpg',
    tags: ['Isekai', 'Reincarnation'],
    readTime: '5 min',
    views: 9999,
    date: '2025-01-11'
  },
  {
    id: '4',
    title: '無職転生 ～異世界行ったら本気だす～',
    description: 'Despite being bullied, scorned, and oppressed all of his life, a 34-year-old shut-in still found the resolve to attempt something heroic—only for it to end in a tragic accident. But in a twist of fate, he awakens in another world as Rudeus Greyrat, starting life again as a baby born to two loving parents. Preserving his memories and knowledge from his previous life, Rudeus quickly adapts to his new environment. With the mind of a grown adult, he starts to display magical talent that exceeds all expectations, honing his skill with the help of a mage named Roxy Migurdia. Rudeus learns swordplay from his father, Paul, and meets Sylphiette, a young girl who quickly becomes his closest friend. As Rudeus\'s new life unfolds, he tries to make the most of his new chance while conquering his traumatic past. And perhaps, one day, he may find the one thing he could not find in his old world—love.',
    imageUrl: '/image/232.jpeg',
    tags: ['Isekai', 'Reincarnation'],
    readTime: '5 min',
    views: 9999,
    date: '2024-12-29'
  }
]

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // For server components, we can directly use params as it's not yet a Promise in generateMetadata
  const blog = blogs.find(blog => blog.id === params.id)
  return {
    title: blog?.title ?? 'Blog Post',
    description: blog?.description
  }
}

// Export blogs data to be used in client component
export { blogs }