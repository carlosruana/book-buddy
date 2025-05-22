import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchForm } from '../SearchForm';

describe('SearchForm', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders search input and button', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search by book title or author...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search books/i })).toBeInTheDocument();
  });

  it('disables submit button when input is empty', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: /search books/i });
    expect(button).toBeDisabled();
  });

  it('enables submit button when input has text', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by book title or author...');
    fireEvent.change(input, { target: { value: 'Harry Potter' } });
    
    const button = screen.getByRole('button', { name: /search books/i });
    expect(button).toBeEnabled();
  });

  it('calls onSearch with trimmed input value when form is submitted', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by book title or author...');
    fireEvent.change(input, { target: { value: '  Harry Potter  ' } });
    
    const button = screen.getByRole('button', { name: /search books/i });
    fireEvent.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Harry Potter');
  });

  it('does not call onSearch when form is submitted with empty input', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by book title or author...');
    fireEvent.change(input, { target: { value: '   ' } });
    
    const button = screen.getByRole('button', { name: /search books/i });
    fireEvent.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('updates input value when user types', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by book title or author...');
    fireEvent.change(input, { target: { value: 'Harry' } });
    
    expect(input).toHaveValue('Harry');
  });

  it('handles form submission with enter key', () => {
    render(<SearchForm onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search by book title or author...');
    fireEvent.change(input, { target: { value: 'Harry Potter' } });
    fireEvent.submit(input);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Harry Potter');
  });
}); 