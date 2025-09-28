import { Course, Feature, Testimonial, CourseReview } from '@/types';

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
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    rating: 5
  },
  {
    id: '4',
    name: '최프론트',
    role: '프론트엔드 개발자',
    content: 'GitHub Copilot과 ChatGPT를 활용한 React 개발 방법을 배웠는데, 코드 품질이 확실히 개선되었어요.',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&q=80',
    rating: 5
  },
  {
    id: '5',
    name: '정백엔드',
    role: '백엔드 개발자',
    content: 'AI 도구를 이용한 API 설계와 데이터베이스 최적화 강의가 특히 도움이 되었습니다.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    rating: 5
  },
  {
    id: '6',
    name: '황데이터',
    role: '데이터 사이언티스트',
    content: 'Claude와 ChatGPT를 활용한 데이터 분석 및 시각화 과정이 정말 실무에 바로 적용되었어요.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
    rating: 5
  }
];

export const courseReviews: CourseReview[] = [
  {
    id: '1',
    courseTitle: 'AI와 함께하는 Python 기초',
    reviewer: '김코딩',
    role: '신입 개발자',
    content: 'Python을 처음 배우는데 AI 도구들과 함께 학습하니까 이해가 훨씬 빨랐어요. ChatGPT로 코드 설명받고 GitHub Copilot으로 실습하는 과정이 정말 효율적이었습니다.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80',
    date: '2024-01-15'
  },
  {
    id: '2',
    courseTitle: 'AI 도구로 빠른 웹 개발',
    reviewer: '박리액트',
    role: '프론트엔드 개발자',
    content: 'Next.js 프로젝트를 AI 도구와 함께 개발하는 방법을 배웠는데, 개발 속도가 정말 빨라졌어요. 특히 컴포넌트 설계할 때 Claude의 도움이 크게 도움되었습니다.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    date: '2024-01-20'
  },
  {
    id: '3',
    courseTitle: 'AI 활용 데이터 사이언스',
    reviewer: '이데이터',
    role: '데이터 분석가',
    content: '머신러닝 모델을 구축할 때 AI 도구들의 도움을 받는 방법을 배웠어요. 복잡한 통계 개념도 AI와 대화하면서 이해하니까 훨씬 쉬웠습니다.',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80',
    date: '2024-01-25'
  },
  {
    id: '4',
    courseTitle: 'AI 도구로 모바일 앱 개발',
    reviewer: '최모바일',
    role: '앱 개발자',
    content: 'React Native로 크로스플랫폼 앱을 개발하는데, AI 도구들이 플랫폼별 차이점을 설명해주고 최적화 방법도 제안해줘서 정말 유용했어요.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
    date: '2024-02-01'
  },
  {
    id: '5',
    courseTitle: 'AI와 함께하는 Python 기초',
    reviewer: '한초보',
    role: '비전공자',
    content: '프로그래밍을 전혀 몰랐는데, AI 도구들이 마치 개인 튜터처럼 친절하게 설명해줘서 차근차근 배울 수 있었어요. 이제 간단한 웹 스크래핑도 할 수 있게 되었습니다!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    date: '2024-02-05'
  },
  {
    id: '6',
    courseTitle: 'AI 도구로 빠른 웹 개발',
    reviewer: '강풀스택',
    role: '풀스택 개발자',
    content: '기존에 수동으로 작성하던 코드들을 AI와 함께 더 효율적으로 작성할 수 있게 되었어요. 특히 TypeScript 타입 정의나 테스트 코드 작성에서 Claude가 정말 큰 도움이 되었습니다.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
    date: '2024-02-10'
  }
];