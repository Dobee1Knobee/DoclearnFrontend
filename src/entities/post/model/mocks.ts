import type { Post } from "./types"

export const demoData: Post[] = [
  {
    id: "post1",
    author: {
      id: "user1",
      name: "Александра Миронова",
      avatar: "/Avatars/Avatar1.jpg",
      isVerified: true,
    },
    content: {
      text: "Технологии развиваются невероятными темпами. Каждый день мы видим новые инновации, которые меняют нашу жизнь. Что вы думаете о последних трендах в IT?",
      images: [
        "/example1.jpg",
      ],
    },
    createdAt: "2023-11-25T14:30:00Z",
    stats: {
      likes: 245,
      comments: 32,
      shares: 14,
      isLiked: false,
      isSaved: false,
    },
  },
  {
    id: "post2",
    author: {
      id: "user2",
      name: "Максим Петров",
      avatar: "/Avatars/Avatar2.jpg",
      isVerified: false,
    },
    content: {
      text: "Только что закончил работу над новым проектом! Использовал React и TypeScript. Очень доволен результатом. Посмотрите на сайт: https://example.com",
      
      links: [
        {
          url: "https://example.com",
          title: "Мой новый проект",
        },
      ],
    },
    createdAt: "2023-11-24T09:15:00Z",
    stats: {
      likes: 118,
      comments: 24,
      shares: 5,
      isLiked: true,
      isSaved: true,
    },
  },
  {
    id: "post3",
    author: {
      id: "user3",
      name: "Елена Соколова",
      avatar: "/Avatars/Avatar3.jpg",
      isVerified: true,
    },
    content: {
      text: "Работаю над новой функцией для нашего приложения. Пользователи долго её ждали, и вот она почти готова!",
      images: [
        "/example1.jpg",
        "/example2.jpg",
      ],
    },
    createdAt: "2023-11-23T18:45:00Z",
    stats: {
      likes: 321,
      comments: 45,
      shares: 22,
      isLiked: false,
      isSaved: true,
    },
  },
  {
    id: "post4",
    author: {
      id: "user4",
      name: "Артём Лебедев",
      avatar: "/Avatars/Avatar4.jpg",
      isVerified: true,
    },
    content: {
      text: "Вчера посетил конференцию по искусственному интеллекту. Было много интересных докладов и дискуссий. Особенно понравился доклад о применении ИИ в медицине.",
      images: [
        "/example1.jpg",
        "/example2.jpg",
        // "/example3.jpg",
      ],
    },
    createdAt: "2023-11-22T12:10:00Z",
    stats: {
      likes: 156,
      comments: 28,
      shares: 8,
      isLiked: true,
      isSaved: false,
    },
  },
  {
    id: "post5",
    author: {
      id: "user5",
      name: "Наталья Иванова",
      avatar: "/Avatars/Avatar5.jpg",
      isVerified: false,
    },
    content: {
      text: "Сегодня изучаю новые фреймворки для фронтенд-разработки. А вы какие технологии предпочитаете использовать в своих проектах?",
      links: [
        {
          url: "https://react.dev",
          title: "React Documentation",
        },
        {
          url: "https://vuejs.org",
          title: "Vue.js - The Progressive JavaScript Framework",
        },
      ],
    },
    createdAt: "2023-11-21T15:20:00Z",
    stats: {
      likes: 89,
      comments: 37,
      shares: 4,
      isLiked: false,
      isSaved: false,
    },
  },
]

