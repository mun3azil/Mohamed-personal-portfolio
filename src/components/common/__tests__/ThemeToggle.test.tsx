import React from 'react';
import { render, screen, fireEvent } from '@/lib/test-utils';
import ThemeToggle from '../ThemeToggle';
import { useTheme } from 'next-themes';

// Mock the next-themes module
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
  })),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

// Mock the useLocalStorage hook
jest.mock('@/hooks/useLocalStorage', () => {
  return jest.fn(() => [false, jest.fn()]);
});

// Mock the errorHandling module
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: (Component: React.ComponentType) => Component,
}));

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the theme toggle button with default icons', () => {
    render(<ThemeToggle />);

    // Check if the toggle button is rendered
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
    
    // Check if the default light icon is rendered
    expect(toggleButton.textContent).toContain('☀️');
    
    // Check if the system theme button is rendered
    const systemButton = screen.getByRole('button', { name: /use system theme/i });
    expect(systemButton).toBeInTheDocument();
    expect(systemButton.textContent).toContain('🖥️');
  });

  it('renders with custom icons when provided', () => {
    render(
      <ThemeToggle 
        lightIcon={<span data-testid="custom-light-icon">Light</span>}
        darkIcon={<span data-testid="custom-dark-icon">Dark</span>}
        systemIcon={<span data-testid="custom-system-icon">System</span>}
      />
    );

    // Check if custom light icon is rendered
    expect(screen.getByTestId('custom-light-icon')).toBeInTheDocument();
    
    // Check if custom system icon is rendered
    expect(screen.getByTestId('custom-system-icon')).toBeInTheDocument();
  });

  it('shows labels when showLabel is true', () => {
    render(<ThemeToggle showLabel />);

    // Check if the light theme label is rendered
    expect(screen.getByText('Light')).toBeInTheDocument();
    
    // Check if the system theme label is rendered
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('does not show system theme button when includeSystem is false', () => {
    render(<ThemeToggle includeSystem={false} />);

    // Check if the toggle button is rendered
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
    
    // Check if the system theme button is not rendered
    expect(screen.queryByRole('button', { name: /use system theme/i })).not.toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<ThemeToggle className="custom-theme-toggle" />);

    // Check if the custom class is applied to the container
    const container = screen.getByRole('button', { name: /toggle theme/i }).parentElement;
    expect(container).toHaveClass('custom-theme-toggle');
  });

  it('calls setTheme when toggle button is clicked', () => {
    // Mock the useTheme hook with a spy on setTheme
    const setThemeMock = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);

    // Click the toggle button
    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }));

    // Check if setTheme was called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with system when system button is clicked', () => {
    // Mock the useTheme hook with a spy on setTheme
    const setThemeMock = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
      resolvedTheme: 'light',
    });

    render(<ThemeToggle />);

    // Click the system button
    fireEvent.click(screen.getByRole('button', { name: /use system theme/i }));

    // Check if setTheme was called with 'system'
    expect(setThemeMock).toHaveBeenCalledWith('system');
  });

  it('toggles from dark to light theme', () => {
    // Mock the useTheme hook with dark theme
    const setThemeMock = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
      resolvedTheme: 'dark',
    });

    render(<ThemeToggle />);

    // Check if the dark icon is rendered
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton.textContent).toContain('🌙');

    // Click the toggle button
    fireEvent.click(toggleButton);

    // Check if setTheme was called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('toggles from system theme correctly', () => {
    // Mock the useTheme hook with system theme
    const setThemeMock = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: setThemeMock,
      resolvedTheme: 'dark', // System is resolving to dark
    });

    render(<ThemeToggle />);

    // Check if the system icon is rendered
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton.textContent).toContain('🖥️');

    // Click the toggle button
    fireEvent.click(toggleButton);

    // Since system is resolving to dark, it should toggle to light
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});