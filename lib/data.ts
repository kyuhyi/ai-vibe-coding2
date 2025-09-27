import { Course, Feature, Testimonial } from '@/types';

export const courses: Course[] = [
  {
    id: '1',
    title: 'AI와 함께하는 Python 기초',
    description: 'ChatGPT와 GitHub Copilot을 활용하여 Python 프로그래밍을 효율적으로 학습합니다.',
    level: 'Beginner',
    duration: '8주',
    price: 299000,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    tags: ['Python', 'AI', 'ChatGPT', 'GitHub Copilot'],
    instructor: '김개발',
    rating: 4.8,
    students: 1250
  },
  {
    id: '2',
    title: 'AI 도구로 빠른 웹 개발',
    description: 'React와 Next.js를 AI 도구들과 함께 사용하여 현대적인 웹 애플리케이션을 구축합니다.',
    level: 'Intermediate',
    duration: '12주',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tags: ['React', 'Next.js', 'TypeScript', 'AI'],
    instructor: '박프론트',
    rating: 4.9,
    students: 890
  },
  {
    id: '3',
    title: 'AI 활용 데이터 사이언스',
    description: 'ChatGPT와 Claude를 활용하여 데이터 분석과 머신러닝을 쉽게 배웁니다.',
    level: 'Advanced',
    duration: '16주',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Python', 'Data Science', 'Machine Learning', 'AI'],
    instructor: '이데이터',
    rating: 4.7,
    students: 567
  },
  {
    id: '4',
    title: 'AI 도구로 모바일 앱 개발',
    description: 'React Native와 Flutter를 AI 도구와 함께 사용하여 크로스플랫폼 앱을 개발합니다.',
    level: 'Intermediate',
    duration: '10주',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    tags: ['React Native', 'Flutter', 'Mobile', 'AI'],
    instructor: '최모바일',
    rating: 4.6,
    students: 723
  }
];

export const features: Feature[] = [
  {
    title: 'AI 도구 활용 교육',
    description: 'ChatGPT, Claude, GitHub Copilot 등 최신 AI 도구를 실무에 바로 적용할 수 있도록 교육합니다.',
    icon: 'Brain'
  },
  {
    title: '실전 프로젝트 중심',
    description: '이론보다는 실제 프로젝트를 통해 AI와 함께 코딩하는 방법을 체득합니다.',
    icon: 'Code'
  },
  {
    title: '1:1 멘토링',
    description: '개인별 맞춤 피드백과 멘토링을 통해 빠른 성장을 지원합니다.',
    icon: 'Users'
  },
  {
    title: '평생 업데이트',
    description: '새로운 AI 도구와 기술이 나올 때마다 강의 내용을 무료로 업데이트합니다.',
    icon: 'Zap'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: '김학습',
    role: '웹 개발자',
    content: 'AI 도구를 활용한 코딩 방법을 배운 후, 개발 생산성이 3배 이상 향상되었습니다. 정말 추천합니다!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    rating: 5
  },
  {
    id: '2',
    name: '이직장',
    role: '스타트업 CTO',
    content: 'AI 도구들을 회사 개발 프로세스에 도입했더니 팀 전체의 효율성이 크게 개선되었어요.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    rating: 5
  },
  {
    id: '3',
    name: '박신입',
    role: '주니어 개발자',
    content: '비전공자였지만 AI와 함께 코딩하는 방법을 배워서 빠르게 개발자로 전향할 수 있었습니다.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
    rating: 5
  }
];