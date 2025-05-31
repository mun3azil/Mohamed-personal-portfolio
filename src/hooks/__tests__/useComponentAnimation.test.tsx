import { renderHook } from '@testing-library/react';
import { useComponentAnimation } from '../useComponentAnimation';
import { useReducedMotionPreference } from '../useReducedMotionPreference';

// Mock the useReducedMotionPreference hook
jest.mock('../useReducedMotionPreference', () => ({
  useReducedMotionPreference: jest.fn()
}));

describe('useComponentAnimation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    (useReducedMotionPreference as jest.Mock).mockReturnValue({
      prefersReducedMotion: false
    });
  });

  it('should return hero animation variants with default direction', () => {
    const { result } = renderHook(() => 
      useComponentAnimation({ component: 'hero' })
    );

    // Check that variants object contains expected keys
    expect(result.current.variants).toHaveProperty('container');
    expect(result.current.variants).toHaveProperty('item');
    expect(result.current.variants).toHaveProperty('floatingIcon');
    expect(result.current.variants).toHaveProperty('scrollIndicator');
    expect(result.current.variants).toHaveProperty('blob');
    expect(result.current.variants).toHaveProperty('cta');
    
    // Check that prefersReducedMotion is passed through
    expect(result.current.prefersReducedMotion).toBe(false);
  });

  it('should return header animation variants', () => {
    const { result } = renderHook(() => 
      useComponentAnimation({ component: 'header' })
    );

    // Check that variants object contains expected keys
    expect(result.current.variants).toHaveProperty('container');
    expect(result.current.variants).toHaveProperty('logo');
    expect(result.current.variants).toHaveProperty('nav');
    expect(result.current.variants).toHaveProperty('navItem');
    expect(result.current.variants).toHaveProperty('mobileMenu');
    expect(result.current.variants).toHaveProperty('mobileMenuItems');
    expect(result.current.variants).toHaveProperty('hamburger');
  });

  it('should return footer animation variants', () => {
    const { result } = renderHook(() => 
      useComponentAnimation({ component: 'footer' })
    );

    // Check that variants object contains expected keys
    expect(result.current.variants).toHaveProperty('container');
    expect(result.current.variants).toHaveProperty('item');
    expect(result.current.variants).toHaveProperty('socialIcon');
  });

  it('should return section animation variants', () => {
    const { result } = renderHook(() => 
      useComponentAnimation({ component: 'section' })
    );

    // Check that variants object contains expected keys
    expect(result.current.variants).toHaveProperty('container');
    expect(result.current.variants).toHaveProperty('item');
  });

  it('should respect reduced motion preference', () => {
    // Mock reduced motion preference to true
    (useReducedMotionPreference as jest.Mock).mockReturnValue({
      prefersReducedMotion: true
    });

    const { result } = renderHook(() => 
      useComponentAnimation({ component: 'hero' })
    );

    // Check that prefersReducedMotion is passed through
    expect(result.current.prefersReducedMotion).toBe(true);
    
    // Check that variants are simplified for reduced motion
    expect(result.current.variants.item.visible).toHaveProperty('opacity', 1);
    expect(result.current.variants.item.visible.transition).toHaveProperty('duration');
    
    // Check that willChange is set to 'auto' for reduced motion
    expect(result.current.willChange).toBe('auto');
  });

  it('should apply custom direction', () => {
    const { result } = renderHook(() => 
      useComponentAnimation({ component: 'hero', direction: 'left' })
    );

    // For non-reduced motion, the item variant should have x offset for left direction
    const hiddenState = result.current.variants.item.hidden;
    expect(hiddenState).toHaveProperty('x', 20);
  });

  it('should merge custom variants', () => {
    const customVariants = {
      custom: {
        hidden: { scale: 0 },
        visible: { scale: 1 }
      }
    };

    const { result } = renderHook(() => 
      useComponentAnimation({ 
        component: 'hero', 
        custom: customVariants 
      })
    );

    // Check that custom variants are merged
    expect(result.current.variants).toHaveProperty('custom');
    expect(result.current.variants.custom).toHaveProperty('hidden');
    expect(result.current.variants.custom.hidden).toHaveProperty('scale', 0);
  });
});