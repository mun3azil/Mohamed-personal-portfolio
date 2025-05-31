import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import useClickOutside from './useClickOutside';
import * as errorHandling from '@/lib/errorHandling';

// Mock error handling
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: jest.fn((fn, options) => fn),
}));

// Test component that uses the hook
const TestComponent = ({
  onClickOutside,
  enabled = true,
  withExceptionalRef = false,
}: {
  onClickOutside: jest.Mock;
  enabled?: boolean;
  withExceptionalRef?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const exceptionalRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(
    ref,
    onClickOutside,
    enabled,
    withExceptionalRef ? [exceptionalRef] : []
  );
  
  return (
    <div>
      <div ref={ref} data-testid="inside-element">
        Inside Element
      </div>
      <div data-testid="outside-element">Outside Element</div>
      {withExceptionalRef && (
        <div ref={exceptionalRef} data-testid="exceptional-element">
          Exceptional Element
        </div>
      )}
    </div>
  );
};

describe('useClickOutside Hook', () => {
  let onClickOutside: jest.Mock;
  
  beforeEach(() => {
    onClickOutside = jest.fn();
    jest.clearAllMocks();
  });
  
  it('calls callback when clicking outside the referenced element', () => {
    render(<TestComponent onClickOutside={onClickOutside} />);
    
    // Click inside the element - callback should not be called
    fireEvent.mouseDown(screen.getByTestId('inside-element'));
    expect(onClickOutside).not.toHaveBeenCalled();
    
    // Click outside the element - callback should be called
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });
  
  it('does not call callback when hook is disabled', () => {
    render(<TestComponent onClickOutside={onClickOutside} enabled={false} />);
    
    // Click outside the element - callback should not be called because hook is disabled
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    expect(onClickOutside).not.toHaveBeenCalled();
  });
  
  it('does not call callback when clicking on exceptional refs', () => {
    render(<TestComponent onClickOutside={onClickOutside} withExceptionalRef={true} />);
    
    // Click inside the main element - callback should not be called
    fireEvent.mouseDown(screen.getByTestId('inside-element'));
    expect(onClickOutside).not.toHaveBeenCalled();
    
    // Click on exceptional element - callback should not be called
    fireEvent.mouseDown(screen.getByTestId('exceptional-element'));
    expect(onClickOutside).not.toHaveBeenCalled();
    
    // Click outside both elements - callback should be called
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });
  
  it('is wrapped with error handling', () => {
    expect(errorHandling.withErrorHandling).toHaveBeenCalledWith(
      expect.any(Function),
      { hookName: 'useClickOutside' }
    );
  });
});