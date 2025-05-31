import { renderHook, act } from '@testing-library/react-hooks';
import useModal from '../useModal';

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: any) => Component,
}));

describe('useModal Hook', () => {
  it('returns the correct initial state', () => {
    const { result } = renderHook(() => useModal());
    
    expect(result.current.isOpen).toBe(false);
    expect(typeof result.current.open).toBe('function');
    expect(typeof result.current.close).toBe('function');
    expect(typeof result.current.toggle).toBe('function');
  });

  it('respects the defaultIsOpen option', () => {
    const { result } = renderHook(() => useModal({ defaultIsOpen: true }));
    
    expect(result.current.isOpen).toBe(true);
  });

  it('opens the modal when open is called', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('closes the modal when close is called', () => {
    const { result } = renderHook(() => useModal({ defaultIsOpen: true }));
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('toggles the modal when toggle is called', () => {
    const { result } = renderHook(() => useModal());
    
    // Toggle from closed to open
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.isOpen).toBe(true);
    
    // Toggle from open to closed
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('calls onOpen callback when open is called', () => {
    const onOpen = jest.fn();
    const { result } = renderHook(() => useModal({ onOpen }));
    
    act(() => {
      result.current.open();
    });
    
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onClose callback when close is called', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useModal({ defaultIsOpen: true, onClose }));
    
    act(() => {
      result.current.close();
    });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls appropriate callbacks when toggle is called', () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const { result } = renderHook(() => useModal({ onOpen, onClose }));
    
    // Toggle from closed to open should call onOpen
    act(() => {
      result.current.toggle();
    });
    
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    
    // Toggle from open to closed should call onClose
    act(() => {
      result.current.toggle();
    });
    
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});