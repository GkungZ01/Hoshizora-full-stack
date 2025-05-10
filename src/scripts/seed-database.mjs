import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('เริ่มสร้างข้อมูลตัวอย่าง...');

  try {
    // สร้าง User ตัวอย่าง
    console.log('สร้างผู้ใช้ตัวอย่าง...');
    
    // ตรวจสอบและสร้าง Admin User
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (!adminExists) {
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@hoshizora.com',
          password: await hash('admin123', 12),
          role: 'ADMIN',
          image: 'https://api.dicebear.com/7.x/identicon/svg?seed=admin'
        }
      });
      console.log('สร้าง Admin User เรียบร้อยแล้ว');
    } else {
      console.log('มี Admin User อยู่แล้ว ข้ามขั้นตอนนี้');
    }
    
    // สร้าง Editor User
    const editorExists = await prisma.user.findFirst({
      where: { role: 'EDITOR' }
    });
    
    if (!editorExists) {
      await prisma.user.create({
        data: {
          name: 'Editor User',
          email: 'editor@hoshizora.com',
          password: await hash('editor123', 12),
          role: 'EDITOR',
          image: 'https://api.dicebear.com/7.x/identicon/svg?seed=editor'
        }
      });
      console.log('สร้าง Editor User เรียบร้อยแล้ว');
    } else {
      console.log('มี Editor User อยู่แล้ว ข้ามขั้นตอนนี้');
    }
    
    // สร้าง Regular User
    const userExists = await prisma.user.findFirst({
      where: { 
        role: 'USER',
        email: 'user@hoshizora.com'
      }
    });
    
    if (!userExists) {
      await prisma.user.create({
        data: {
          name: 'Regular User',
          email: 'user@hoshizora.com',
          password: await hash('user123', 12),
          role: 'USER',
          image: 'https://api.dicebear.com/7.x/identicon/svg?seed=user'
        }
      });
      console.log('สร้าง Regular User เรียบร้อยแล้ว');
    } else {
      console.log('มี Regular User อยู่แล้ว ข้ามขั้นตอนนี้');
    }

    // สร้าง Tags
    console.log('สร้าง Tags...');
    const tags = [
      { name: 'Drama', slug: 'drama' },
      { name: 'Mystery', slug: 'mystery' },
      { name: 'Fantasy', slug: 'fantasy' },
      { name: 'Suspense', slug: 'suspense' },
      { name: 'Isekai', slug: 'isekai' },
      { name: 'Reincarnation', slug: 'reincarnation' }
    ];
    
    // สร้าง Tags หรือข้ามถ้ามีอยู่แล้ว
    for (const tag of tags) {
      const tagExists = await prisma.tag.findUnique({
        where: { slug: tag.slug }
      });
      
      if (!tagExists) {
        await prisma.tag.create({
          data: tag
        });
      }
    }
    
    console.log('สร้าง Tags เรียบร้อยแล้ว');
    
    // ดึงข้อมูล Tags และ Admin User สำหรับสร้าง Posts
    const allTags = await prisma.tag.findMany();
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    // สร้าง Image Assets
    console.log('สร้าง Image Assets...');
    const imageAssets = [
      { 
        filename: 'the-apothecary-diaries.jpg',
        originalUrl: '/image/112.jpg',
        width: 1280,
        height: 720,
        mimeType: 'image/jpeg',
        altText: 'The Apothecary Diaries',
        sizes: {
          small: '/image/112.jpg',
          medium: '/image/112.jpg',
          large: '/image/112.jpg'
        }
      },
      { 
        filename: 're-zero.jpg',
        originalUrl: '/image/121.jpg',
        width: 1280,
        height: 720,
        mimeType: 'image/jpeg',
        altText: 'Re:Zero',
        sizes: {
          small: '/image/121.jpg',
          medium: '/image/121.jpg',
          large: '/image/121.jpg'
        }
      },
      { 
        filename: 'magic-maker.jpg',
        originalUrl: '/image/111.jpg',
        width: 1280,
        height: 720,
        mimeType: 'image/jpeg',
        altText: 'Magic Maker',
        sizes: {
          small: '/image/111.jpg',
          medium: '/image/111.jpg',
          large: '/image/111.jpg'
        }
      },
      { 
        filename: 'mushoku-tensei.jpeg',
        originalUrl: '/image/232.jpeg',
        width: 1280,
        height: 720,
        mimeType: 'image/jpeg',
        altText: 'Mushoku Tensei',
        sizes: {
          small: '/image/232.jpeg',
          medium: '/image/232.jpeg',
          large: '/image/232.jpeg'
        }
      }
    ];
    
    // สร้าง Image Assets หรือข้ามถ้ามีอยู่แล้ว
    const createdAssets = [];
    for (const asset of imageAssets) {
      const assetExists = await prisma.imageAsset.findFirst({
        where: { filename: asset.filename }
      });
      
      if (!assetExists) {
        const createdAsset = await prisma.imageAsset.create({
          data: asset
        });
        createdAssets.push(createdAsset);
      } else {
        createdAssets.push(assetExists);
      }
    }
    
    console.log('สร้าง Image Assets เรียบร้อยแล้ว');
    
    // สร้าง Posts
    console.log('สร้าง Posts...');
    const posts = [
      {
        title: '薬屋のひとりごと 第2期',
        slug: 'the-apothecary-diaries-season-2',
        description: 'Maomao, an apothecary daughter, has been plucked from her peaceful life and sold to the lowest echelons of the imperial court. Now merely a maid, Maomao settles into her new mundane life and hides her extensive knowledge of medicine in order to avoid any unwanted attention.',
        content: 'Maomao, an apothecary daughter who was sold to the imperial court as a servant, defying expectations with her exceptional skill in identifying poisons and preparing medicines. Despite her attempts to lay low, her abilities caught the eye of the handsome eunuch Jinshi. As she is promoted to lady-in-waiting, Maomao becomes involved in mysterious incidents within the courts, where imperial families plot against each other. Using her pharmaceutical knowledge and keen observation skills, she navigates through the dangerous political landscape of the rear palace.',
        imageUrl: '/image/112.jpg',
        readTime: '5 min',
        views: 9999,
        published: true,
        publishedAt: new Date('2025-01-20'),
        authorId: adminUser.id,
        tagIds: [
          allTags.find(t => t.name === 'Drama').id,
          allTags.find(t => t.name === 'Mystery').id
        ],
        featuredImageId: createdAssets[0].id
      },
      {
        title: 'Re:ゼロから始める異世界生活',
        slug: 're-zero-starting-life-in-another-world',
        description: 'One year after the events at the Sanctuary, Subaru Natsuki trains hard to better face future challenges. The peaceful days come to an end when Emilia receives an invitation to a meeting in the Watergate City of Priestella from none other than Anastasia Hoshin, one of her rivals in the royal selection',
        content: 'One year after the events at the Sanctuary, Subaru Natsuki trains hard to better face future challenges. The peaceful days come to an end when Emilia receives an invitation to a meeting in the Watergate City of Priestella from none other than Anastasia Hoshin, one of her rivals in the royal selection. Considering the meeting s significance and the potential dangers Emilia could face, Subaru and his friends accompany her to the city. However, as they meet the other royal candidates and their knights, the Sin Archbishop of Lust, Capella Emerada Lugunica, makes a sudden appearance, starting an assault on the city. Subaru, along with Emilia and their allies, must overcome this new threat to save Priestella and its people.',
        imageUrl: '/image/121.jpg',
        readTime: '5 min',
        views: 9999,
        published: true,
        publishedAt: new Date('2025-01-04'),
        authorId: adminUser.id,
        tagIds: [
          allTags.find(t => t.name === 'Drama').id,
          allTags.find(t => t.name === 'Fantasy').id,
          allTags.find(t => t.name === 'Suspense').id
        ],
        featuredImageId: createdAssets[1].id
      },
      {
        title: 'マジック・メイカー',
        slug: 'magic-maker',
        description: 'A man who was thirty years old and wanted to use magic died unexpectedly, and when he woke up, he was reborn in another world. Named Theon, he had high hopes that there would be magic in another world, but there was no magic in that world.',
        content: 'A man who was thirty years old and wanted to use magic died unexpectedly, and when he woke up, he was reborn in another world. Named Theon, he had high hopes that there would be magic in another world, but there was no magic in that world. However, when Theon reached puberty, he awakened to knowledge from his previous life, and when he performed the magic of his original world, space itself was dyed with light. That was the birth of magic in another world. High magic builder, Theon, invented magic and has been developing it to become a master of combat magic at the dawn of an era.',
        imageUrl: '/image/111.jpg',
        readTime: '5 min',
        views: 9999,
        published: true,
        publishedAt: new Date('2025-01-11'),
        authorId: adminUser.id,
        tagIds: [
          allTags.find(t => t.name === 'Isekai').id,
          allTags.find(t => t.name === 'Reincarnation').id
        ],
        featuredImageId: createdAssets[2].id
      },
      {
        title: '無職転生 ～異世界行ったら本気だす～',
        slug: 'mushoku-tensei-jobless-reincarnation',
        description: 'Despite being bullied, scorned, and oppressed all of his life, a 34-year-old shut-in still found the resolve to attempt something heroic—only for it to end in a tragic accident. But in a twist of fate, he awakens in another world as Rudeus Greyrat, starting life again as a baby born to two loving parents.',
        content: 'Despite being bullied, scorned, and oppressed all of his life, a 34-year-old shut-in still found the resolve to attempt something heroic—only for it to end in a tragic accident. But in a twist of fate, he awakens in another world as Rudeus Greyrat, starting life again as a baby born to two loving parents. Preserving his memories and knowledge from his previous life, Rudeus quickly adapts to his new environment. With the mind of a grown adult, he starts to display magical talent that exceeds all expectations, honing his skill with the help of a mage named Roxy Migurdia. Rudeus learns swordplay from his father, Paul, and meets Sylphiette, a young girl who quickly becomes his closest friend. As Rudeus\'s new life unfolds, he tries to make the most of his new chance while conquering his traumatic past. And perhaps, one day, he may find the one thing he could not find in his old world—love.',
        imageUrl: '/image/232.jpeg',
        readTime: '5 min',
        views: 9999,
        published: true,
        publishedAt: new Date('2024-12-29'),
        authorId: adminUser.id,
        tagIds: [
          allTags.find(t => t.name === 'Isekai').id,
          allTags.find(t => t.name === 'Reincarnation').id
        ],
        featuredImageId: createdAssets[3].id
      }
    ];
    
    // สร้าง Posts หรือข้ามถ้ามีอยู่แล้ว
    for (const post of posts) {
      const postExists = await prisma.post.findUnique({
        where: { slug: post.slug }
      });
      
      if (!postExists) {
        await prisma.post.create({
          data: post
        });
      }
    }
    
    console.log('สร้าง Posts เรียบร้อยแล้ว');
    
    // สร้าง Site Settings
    console.log('สร้าง Site Settings...');
    const settingsExist = await prisma.siteSettings.findFirst();
    
    if (!settingsExist) {
      await prisma.siteSettings.create({
        data: {
          siteName: 'Hoshizora',
          siteDescription: 'Anime Blog and Reviews',
          logo: '/logo.png',
          favicon: '/favicon.ico',
          primaryColor: '#102154',
          secondaryColor: '#040720',
          socialLinks: {
            twitter: 'https://twitter.com/hoshizora',
            facebook: 'https://facebook.com/hoshizora',
            instagram: 'https://instagram.com/hoshizora'
          }
        }
      });
      console.log('สร้าง Site Settings เรียบร้อยแล้ว');
    } else {
      console.log('มี Site Settings อยู่แล้ว ข้ามขั้นตอนนี้');
    }
    
    console.log('สร้างข้อมูลตัวอย่างเสร็จสมบูรณ์');
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();