import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Tooltip from './Tooltip';
import * as errorHandling from '@/lib/errorHandling';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

// Mock Portal component
jest.mock('./Portal', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="portal-container">{children}</div>,
  };
});

// Mock error handling
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: jest.fn((component) => component),
}));

// Mock timers
jest.useFakeTimers();

describe('Tooltip Component', () => {
  const TriggerButton = () => <button>Hover me</button>;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the trigger element without tooltip initially', () => {
    render(
      <Tooltip content="Tooltip content">
        <TriggerButton />
      </Tooltip>
    );
    
    expect(screen.getByText('Hover me')).toBeInTheDocument();
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('shows tooltip on hover when trigger is "hover"', async () => {
    render(
      <Tooltip content="Tooltip content" trigger="hover">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
    
    fireEvent.mouseLeave(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('shows tooltip on click when trigger is "click"', () => {
    render(
      <Tooltip content="Tooltip content" trigger="click">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.click(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    // Click again to hide
    fireEvent.click(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('shows tooltip on focus when trigger is "focus"', () => {
    render(
      <Tooltip content="Tooltip content" trigger="focus">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.focus(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    fireEvent.blur(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('supports multiple triggers', () => {
    render(
      <Tooltip content="Tooltip content" trigger={['hover', 'click']}>
        <TriggerButton />
      </Tooltip>
    );
    
    // Test hover
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    fireEvent.mouseLeave(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    
    // Test click
    fireEvent.click(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
  
  it('respects delayShow and delayHide props', () => {
    render(
      <Tooltip content="Tooltip content" delayShow={500} delayHide={300}>
        <TriggerButton />
      </Tooltip>
    );
    
    // Hover but don't wait full delay - tooltip shouldn't show
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
    
    // Wait remaining time - tooltip should show
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    // Mouse leave but don't wait full hide delay
    fireEvent.mouseLeave(screen.getByText('Hover me'));
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    // Wait remaining hide time
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('does not show tooltip when disabled', () => {
    render(
      <Tooltip content="Tooltip content" disabled>
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('applies custom className', () => {
    render(
      <Tooltip content="Tooltip content" className="custom-tooltip">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveClass('custom-tooltip');
  });
  
  it('renders tooltip inline when disablePortal is true', () => {
    render(
      <Tooltip content="Tooltip content" disablePortal>
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('portal-container')).not.toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
  
  it('renders tooltip in portal when disablePortal is false', () => {
    render(
      <Tooltip content="Tooltip content">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('portal-container')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });
  
  it('sets aria-describedby when id is provided', () => {
    render(
      <Tooltip content="Tooltip content" id="test-tooltip">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByText('Hover me')).toHaveAttribute('aria-describedby', 'test-tooltip');
    expect(screen.getByTestId('tooltip')).toHaveAttribute('id', 'test-tooltip');
  });
  
  it('closes tooltip when Escape key is pressed', () => {
    render(
      <Tooltip content="Tooltip content">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Escape' });
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('applies maxWidth to tooltip', () => {
    render(
      <Tooltip content="Tooltip content" maxWidth={150}>
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveStyle({ maxWidth: '150px' });
  });
  
  it('applies string maxWidth to tooltip', () => {
    render(
      <Tooltip content="Tooltip content" maxWidth="10rem">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveStyle({ maxWidth: '10rem' });
  });
  
  it('renders arrow with correct position', () => {
    render(
      <Tooltip content="Tooltip content" position="right">
        <TriggerButton />
      </Tooltip>
    );
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    const arrow = screen.getByTestId('tooltip-arrow');
    expect(arrow).toBeInTheDocument();
    expect(arrow).toHaveStyle({ left: '-4px' });
  });
  
  it('keeps tooltip open when interactive is true and mouse enters tooltip', () => {
    render(
      <Tooltip content="Tooltip content" interactive>
        <TriggerButton />
      </Tooltip>
    );
    
    // Show tooltip
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    // Mouse leaves trigger but enters tooltip
    fireEvent.mouseLeave(screen.getByText('Hover me'));
    fireEvent.mouseEnter(screen.getByTestId('tooltip'));
    act(() => {
      jest.runAllTimers();
    });
    
    // Tooltip should still be visible
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    
    // Mouse leaves tooltip
    fireEvent.mouseLeave(screen.getByTestId('tooltip'));
    act(() => {
      jest.runAllTimers();
    });
    
    // Tooltip should be hidden
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
  
  it('preserves original event handlers on trigger element', () => {
    const onClickMock = jest.fn();
    const onMouseEnterMock = jest.fn();
    const onFocusMock = jest.fn();
    
    render(
      <Tooltip content="Tooltip content" trigger={['hover', 'click', 'focus']}>
        <button 
          onClick={onClickMock} 
          onMouseEnter={onMouseEnterMock} 
          onFocus={onFocusMock}
        >
          Hover me
        </button>
      </Tooltip>
    );
    
    fireEvent.click(screen.getByText('Hover me'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(onMouseEnterMock).toHaveBeenCalledTimes(1);
    
    fireEvent.focus(screen.getByText('Hover me'));
    expect(onFocusMock).toHaveBeenCalledTimes(1);
  });
  
  it('is wrapped with error handling', () => {
    expect(errorHandling.withErrorHandling).toHaveBeenCalled();
  });
});