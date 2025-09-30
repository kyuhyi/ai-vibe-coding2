export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  image: string;
  tags: string[];
  instructor: string;
  rating: number;
  students: number;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface CourseReview {
  id: string;
  courseTitle: string;
  reviewer: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  date: string;
  images?: string[]; // 첨부 이미지 URLs
  imagePaths?: string[]; // Storage 경로들 (삭제용)
}