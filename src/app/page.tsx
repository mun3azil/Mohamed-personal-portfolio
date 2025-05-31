import dynamic from 'next/dynamic';
import MainLayout from '@/components/layout/MainLayout';
import HeroSection from '@/components/sections/hero/HeroSection';
import { SectionSkeleton } from '@/components/common/SkeletonLoader';

// Dynamic imports for non-critical sections with loading fallbacks
const AboutSection = dynamic(() => import('@/components/sections/about/AboutSection'), {
  loading: () => <SectionSkeleton type="about" />,
  ssr: true
});

const ProjectsSection = dynamic(() => import('@/components/sections/projects/ProjectsSection'), {
  loading: () => <SectionSkeleton type="projects" />,
  ssr: true
});

const BlogSection = dynamic(() => import('@/components/sections/blog/BlogSection'), {
  loading: () => <SectionSkeleton type="blog" />,
  ssr: true
});

const ContactSection = dynamic(() => import('@/components/sections/contact/ContactSection'), {
  loading: () => <SectionSkeleton type="contact" />,
  ssr: true
});

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </MainLayout>
  );
}
