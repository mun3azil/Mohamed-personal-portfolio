import { renderHook } from '@testing-library/react';
import { useAnimation } from '../useAnimation';
import { useReducedMotion } from 'framer-motion';

// Mock framer-motion's useReducedMotion hook
jest.mock('framer-motion', () => ({
  useReducedMotion: jest.fn()
}));

describe('useAnimation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementation
    (useReducedMotion as jest.Mock).mockReturnValue(false);
  });

  it('should return default animation variants when no options are provided', () => {
    const { result } = renderHook(() => useAnimation());
    
    // Check that variants object contains expected keys
    expect(result.current.variants).toHaveProperty('container');
    expect(result.current.variants).toHaveProperty('item');
    expect(result.current.variants).toHaveProperty('hover');
    expect(result.current.variants).toHaveProperty('tap');
    
    // Check that prefersReducedMotion is passed through
    expect(result.current.prefersReducedMotion).toBe(false);
  });

  it('should apply fade animation by default', () => {
    const { result } = renderHook(() => useAnimation());
    
    // Check that fade animation is applied
    expect(result.current.variants.item.hidden).toHaveProperty('opacity', 0);
    expect(result.current.variants.item.visible).toHaveProperty('opacity', 1);
  });

  it('should apply slide animation when specified', () => {
    const { result } = renderHook(() => 
      useAnimation({ type: 'slide', direction: 'up' })
    );
    
    // Check that slide animation is applied
    expect(result.current.variants.item.hidden).toHaveProperty('y', 30);
    expect(result.current.variants.item.visible).toHaveProperty('y', 0);
  });

  it('should apply scale animation when specified', () => {
    const { result } = renderHook(() => 
      useAnimation({ type: 'scale', scale: 0.8 })
    );
    
    // Check that scale animation is applied
    expect(result.current.variants.item.hidden).toHaveProperty('scale', 0.8);
    expect(result.current.variants.item.visible).toHaveProperty('scale', 1);
  });

  it('should apply rotate animation when specified', () => {
    const { result } = renderHook(() => 
      useAnimation({ type: 'rotate', rotation: 45 })
    );
    
    // Check that rotate animation is applied
    expect(result.current.variants.item.hidden).toHaveProperty('rotate', 45);
    expect(result.current.variants.item.visible).toHaveProperty('rotate', 0);
  });

  it('should apply multiple animation types when specified as an array', () => {
    const { result } = renderHook(() => 
      useAnimation({ type: ['fade', 'slide', 'scale'], direction: 'left' })
    );
    
    // Check that all animation types are applied
    expect(result.current.variants.item.hidden).toHaveProperty('opacity', 0);
    expect(result.current.variants.item.hidden).toHaveProperty('x', 30);
    expect(result.current.variants.item.hidden).toHaveProperty('scale', 0.95);
    
    expect(result.current.variants.item.visible).toHaveProperty('opacity', 1);
    expect(result.current.variants.item.visible).toHaveProperty('x', 0);
    expect(result.current.variants.item.visible).toHaveProperty('scale', 1);
  });

  it('should respect reduced motion preference', () => {
    // Mock reduced motion preference to true
    (useReducedMotion as jest.Mock).mockReturnValue(true);

    const { result } = renderHook(() => 
      useAnimation({ type: ['fade', 'slide', 'scale', 'rotate'] })
    );

    // Check that prefersReducedMotion is passed through
    expect(result.current.prefersReducedMotion).toBe(true);
    
    // Check that variants are simplified for reduced motion
    expect(result.current.variants.item.hidden).toHaveProperty('opacity', 0);
    expect(result.current.variants.item.visible).toHaveProperty('opacity', 1);
    
    // Check that complex animations are not applied for reduced motion
    expect(result.current.variants.item.hidden).not.toHaveProperty('y');
    expect(result.current.variants.item.hidden).not.toHaveProperty('scale');
    expect(result.current.variants.item.hidden).not.toHaveProperty('rotate');
    
    // Check that willChange is set to 'auto' for reduced motion
    expect(result.current.willChange).toBe('auto');
  });

  it('should apply custom transition properties', () => {
    const { result } = renderHook(() => 
      useAnimation({
        duration: 1.2,
        delay: 0.5,
        stiffness: 200,
        damping: 30,
        mass: 2
      })
    );
    
    // Check that custom transition properties are applied
    const transition = result.current.variants.item.visible.transition;
    expect(transition).toHaveProperty('stiffness', 200);
    expect(transition).toHaveProperty('damping', 30);
    expect(transition).toHaveProperty('mass', 2);
    expect(transition).toHaveProperty('delay', 0.5);
  });

  it('should apply stagger and delay children to container', () => {
    const { result } = renderHook(() => 
      useAnimation({
        staggerChildren: 0.2,
        delayChildren: 0.3
      })
    );
    
    // Check that stagger and delay children are applied to container
    const containerTransition = result.current.variants.container.visible.transition;
    expect(containerTransition).toHaveProperty('staggerChildren', 0.2);
    expect(containerTransition).toHaveProperty('delayChildren', 0.3);
  });
});