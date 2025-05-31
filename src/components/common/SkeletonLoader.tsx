import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-300 dark:bg-gray-700',
        className
      )}
    />
  );
}

interface SectionSkeletonProps {
  type: 'about' | 'projects' | 'blog' | 'contact';
  className?: string;
}

export function SectionSkeleton({ type, className }: SectionSkeletonProps) {
  const baseClasses = 'py-20';
  const bgClasses = {
    about: 'bg-light-100 dark:bg-dark-200',
    projects: 'bg-light-200 dark:bg-dark-100', 
    blog: 'bg-light-100 dark:bg-dark-200',
    contact: 'bg-light-200 dark:bg-dark-100',
  };

  return (
    <div className={cn(baseClasses, bgClasses[type], className)}>
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          {/* Section Title */}
          <Skeleton className="h-8 w-1/3 mx-auto mb-8" />
          
          {/* Section Content */}
          {type === 'about' && <AboutSkeleton />}
          {type === 'projects' && <ProjectsSkeleton />}
          {type === 'blog' && <BlogSkeleton />}
          {type === 'contact' && <ContactSkeleton />}
        </div>
      </div>
    </div>
  );
}

function AboutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Profile Image */}
      <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-full mx-auto" />
      
      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        
        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center gap-4 mt-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Form Fields */}
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
        <Skeleton className="h-32 w-full rounded" />
        
        {/* Submit Button */}
        <Skeleton className="h-12 w-1/3 rounded" />
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
