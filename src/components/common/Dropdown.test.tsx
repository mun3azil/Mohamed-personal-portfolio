import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Dropdown from './Dropdown';
import * as errorHandling from '@/lib/errorHandling';
import * as useClickOutside from '@/hooks/useClickOutside';

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

// Mock error handling
jest.mock('@/lib/errorHandling', () => ({
  withErrorHandling: jest.fn((component) => component),
}));

// Mock useClickOutside hook
jest.mock('@/hooks/useClickOutside', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Dropdown Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 'option4', label: 'Option 4', icon: <span data-testid="option-icon">🔍</span> },
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders with default props', () => {
    render(<Dropdown options={options} />);
    
    expect(screen.getByTestId('dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-button')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });
  
  it('shows dropdown menu when button is clicked', () => {
    render(<Dropdown options={options} />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    expect(screen.getByText('Option 4')).toBeInTheDocument();
  });
  
  it('selects an option when clicked', () => {
    const onChange = jest.fn();
    render(<Dropdown options={options} onChange={onChange} />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(onChange).toHaveBeenCalledWith('option1');
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });
  
  it('does not close dropdown when closeOnSelect is false', () => {
    const onChange = jest.fn();
    render(<Dropdown options={options} onChange={onChange} closeOnSelect={false} />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(onChange).toHaveBeenCalledWith('option1');
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });
  
  it('does not select disabled options', () => {
    const onChange = jest.fn();
    render(<Dropdown options={options} onChange={onChange} />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    fireEvent.click(screen.getByText('Option 3'));
    
    expect(onChange).not.toHaveBeenCalled();
  });
  
  it('displays the selected option label', () => {
    render(<Dropdown options={options} value="option2" />);
    
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
  
  it('displays placeholder when no option is selected', () => {
    render(<Dropdown options={options} placeholder="Custom placeholder" />);
    
    expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
  });
  
  it('disables the dropdown when disabled prop is true', () => {
    render(<Dropdown options={options} disabled />);
    
    expect(screen.getByTestId('dropdown-button')).toBeDisabled();
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });
  
  it('applies custom class names', () => {
    render(
      <Dropdown 
        options={options} 
        className="custom-dropdown"
        buttonClassName="custom-button"
        menuClassName="custom-menu"
        optionClassName="custom-option"
      />
    );
    
    expect(screen.getByTestId('dropdown')).toHaveClass('custom-dropdown');
    expect(screen.getByTestId('dropdown-button')).toHaveClass('custom-button');
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(screen.getByTestId('dropdown-menu')).toHaveClass('custom-menu');
    expect(screen.getByTestId('dropdown-option-option1')).toHaveClass('custom-option');
  });
  
  it('renders custom trigger element', () => {
    render(
      <Dropdown 
        options={options} 
        trigger={<button data-testid="custom-trigger">Custom Trigger</button>}
      />
    );
    
    expect(screen.getByTestId('custom-trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-button')).not.toBeInTheDocument();
  });
  
  it('renders search input when searchable is true', () => {
    render(<Dropdown options={options} searchable />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(screen.getByTestId('dropdown-search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
  
  it('filters options based on search term', () => {
    render(<Dropdown options={options} searchable />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    const searchInput = screen.getByTestId('dropdown-search');
    fireEvent.change(searchInput, { target: { value: 'Option 1' } });
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });
  
  it('shows "No results found" when search has no matches', () => {
    render(<Dropdown options={options} searchable />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    const searchInput = screen.getByTestId('dropdown-search');
    fireEvent.change(searchInput, { target: { value: 'No match' } });
    
    expect(screen.getByTestId('dropdown-no-results')).toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
  
  it('renders custom search placeholder', () => {
    render(<Dropdown options={options} searchable searchPlaceholder="Find options..." />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(screen.getByPlaceholderText('Find options...')).toBeInTheDocument();
  });
  
  it('renders option icons', () => {
    render(<Dropdown options={options} />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(screen.getByTestId('option-icon')).toBeInTheDocument();
  });
  
  it('renders clear button when clearable is true and an option is selected', () => {
    render(<Dropdown options={options} value="option1" clearable />);
    
    expect(screen.getByTestId('dropdown-clear-button')).toBeInTheDocument();
  });
  
  it('clears selection when clear button is clicked', () => {
    const onChange = jest.fn();
    render(<Dropdown options={options} value="option1" onChange={onChange} clearable />);
    
    fireEvent.click(screen.getByTestId('dropdown-clear-button'));
    
    expect(onChange).toHaveBeenCalledWith('');
  });
  
  it('calls onOpen when dropdown is opened', () => {
    const onOpen = jest.fn();
    render(<Dropdown options={options} onOpen={onOpen} />);
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
  
  it('calls onClose when dropdown is closed', () => {
    const onClose = jest.fn();
    render(<Dropdown options={options} onClose={onClose} />);
    
    // Open and then close
    fireEvent.click(screen.getByTestId('dropdown-button'));
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  
  it('supports multi-select mode', () => {
    const onMultiChange = jest.fn();
    render(
      <Dropdown 
        options={options} 
        multiSelect 
        selectedValues={['option1']} 
        onMultiChange={onMultiChange} 
      />
    );
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    fireEvent.click(screen.getByText('Option 2'));
    
    expect(onMultiChange).toHaveBeenCalledWith(['option1', 'option2']);
  });
  
  it('removes value from multi-select when clicked again', () => {
    const onMultiChange = jest.fn();
    render(
      <Dropdown 
        options={options} 
        multiSelect 
        selectedValues={['option1', 'option2']} 
        onMultiChange={onMultiChange} 
      />
    );
    
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('dropdown-button'));
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(onMultiChange).toHaveBeenCalledWith(['option2']);
  });
  
  it('clears all selected values in multi-select mode when clear button is clicked', () => {
    const onMultiChange = jest.fn();
    render(
      <Dropdown 
        options={options} 
        multiSelect 
        selectedValues={['option1', 'option2']} 
        onMultiChange={onMultiChange} 
        clearable
      />
    );
    
    fireEvent.click(screen.getByTestId('dropdown-clear-button'));
    
    expect(onMultiChange).toHaveBeenCalledWith([]);
  });
  
  it('opens dropdown with keyboard navigation', () => {
    render(<Dropdown options={options} />);
    
    const button = screen.getByTestId('dropdown-button');
    fireEvent.keyDown(button, { key: 'ArrowDown' });
    
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });
  
  it('closes dropdown with Escape key', () => {
    render(<Dropdown options={options} />);
    
    // Open dropdown
    fireEvent.click(screen.getByTestId('dropdown-button'));
    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
    
    // Press Escape
    fireEvent.keyDown(screen.getByTestId('dropdown-button'), { key: 'Escape' });
    
    expect(screen.queryByTestId('dropdown-menu')).not.toBeInTheDocument();
  });
  
  it('uses useClickOutside hook to close dropdown when clicking outside', () => {
    render(<Dropdown options={options} />);
    
    // Verify the hook was called with the right parameters
    expect(useClickOutside.default).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function),
      false
    );
    
    // Open dropdown and check hook parameters again
    fireEvent.click(screen.getByTestId('dropdown-button'));
    
    expect(useClickOutside.default).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function),
      true
    );
  });
  
  it('is wrapped with error handling', () => {
    expect(errorHandling.withErrorHandling).toHaveBeenCalled();
  });
});