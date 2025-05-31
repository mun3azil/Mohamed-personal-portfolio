/**
 * Utility functions for image handling and optimization
 */

/**
 * Get the appropriate image path based on the environment and format
 * @param path - The original image path
 * @param format - The desired image format (webp, avif, etc.)
 * @returns The optimized image path
 */
export function getOptimizedImagePath(path: string, format?: string): string {
  // If the path is already an optimized format, return it
  if (path.includes('/optimized/')) {
    return path;
  }

  // Extract the directory and file name
  const pathParts = path.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const directory = pathParts[pathParts.length - 2]; // e.g., 'projects', 'blog', 'profile'
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));

  // If format is specified, use it, otherwise keep the original format
  const extension = format ? format.toLowerCase() : fileName.substring(fileName.lastIndexOf('.') + 1);

  // Construct the optimized path with correct structure: /images/optimized/{directory}/{filename}
  return `/images/optimized/${directory}/${nameWithoutExt}.${extension}`;
}

/**
 * Get responsive image sizes based on the image type
 * @param type - The type of image (profile, project, blog, etc.)
 * @returns The appropriate sizes attribute for the Next.js Image component
 */
export function getResponsiveSizes(type: 'profile' | 'project' | 'blog' | 'hero' | 'default'): string {
  switch (type) {
    case 'profile':
      return '(max-width: 768px) 16rem, 20rem';
    case 'project':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'blog':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'hero':
      return '100vw';
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  }
}

/**
 * Generate alt text for an image if none is provided
 * @param title - The title or name associated with the image
 * @param type - The type of image (profile, project, blog, etc.)
 * @returns Generated alt text
 */
export function generateAltText(title: string, type: 'profile' | 'project' | 'blog' | 'hero' | 'default'): string {
  switch (type) {
    case 'profile':
      return `Profile picture of ${title}`;
    case 'project':
      return `Screenshot of ${title} project`;
    case 'blog':
      return `Cover image for article: ${title}`;
    case 'hero':
      return `Hero image for ${title}`;
    default:
      return title;
  }
}

/**
 * Check if an image exists and return a fallback if it doesn't
 * @param path - The image path to check
 * @param fallback - The fallback image path
 * @returns The original path if the image exists, otherwise the fallback
 */
export function getImageWithFallback(path: string, fallback: string): string {
  // In a real implementation, this would check if the file exists
  // For now, we'll just return the path since we can't check file existence on the client
  return path;
}

/**
 * Get the appropriate image quality based on the image type
 * @param type - The type of image
 * @returns The quality value (1-100)
 */
export function getImageQuality(type: 'profile' | 'project' | 'blog' | 'hero' | 'default'): number {
  switch (type) {
    case 'profile':
      return 90; // Higher quality for profile images
    case 'hero':
      return 85; // High quality for hero images
    case 'project':
      return 80; // Good quality for project images
    case 'blog':
      return 80; // Good quality for blog images
    default:
      return 75; // Default quality
  }
}
