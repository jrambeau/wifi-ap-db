import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoModal from '../../src/components/ui/InfoModal';

describe('InfoModal', () => {
  it('renders modal with title', () => {
    const mockClose = vi.fn();
    render(<InfoModal onClose={mockClose} />);
    
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('displays build information section', () => {
    const mockClose = vi.fn();
    render(<InfoModal onClose={mockClose} />);
    
    expect(screen.getByText('Build Information')).toBeInTheDocument();
    expect(screen.getByText('Version')).toBeInTheDocument();
    expect(screen.getByText('Build Date & Time')).toBeInTheDocument();
    expect(screen.getByText('Last Commit')).toBeInTheDocument();
  });

  it('displays version number', () => {
    const mockClose = vi.fn();
    render(<InfoModal onClose={mockClose} />);
    
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  it('displays contact section', () => {
    const mockClose = vi.fn();
    render(<InfoModal onClose={mockClose} />);
    
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Jonathan Rambeau')).toBeInTheDocument();
    expect(screen.getByText(/WiFi Expert, CWNE/)).toBeInTheDocument();
  });

  it('displays company and location', () => {
    const mockClose = vi.fn();
    render(<InfoModal onClose={mockClose} />);
    
    expect(screen.getByText(/Axians C&S/)).toBeInTheDocument();
    expect(screen.getByText(/Lyon, France/)).toBeInTheDocument();
  });

  it('displays email link', () => {
    const mockClose = vi.fn();
    render(<InfoModal onClose={mockClose} />);
    
    const emailLink = screen.getByText('jonathan.rambeau@axians.com');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:jonathan.rambeau@axians.com');
  });

  it('displays contact message in English', () => {
    const mockClose = vi.fn();
    render(<InfoModal onClose={mockClose} />);
    
    expect(screen.getByText(/For questions or contributions/i)).toBeInTheDocument();
  });

  it('calls onClose when footer close button is clicked', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    const footer = container.querySelector('.info-modal__footer');
    const closeButton = footer?.querySelector('button');
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    const overlay = container.querySelector('.info-modal-overlay');
    if (overlay) {
      fireEvent.click(overlay);
    }
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    const modal = container.querySelector('.info-modal');
    if (modal) {
      fireEvent.click(modal);
    }
    
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('renders close icon button in header', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    const header = container.querySelector('.info-modal__header');
    const closeButton = header?.querySelector('button[aria-label="Close"]');
    expect(closeButton).toBeInTheDocument();
    
    // Click header close button
    if (closeButton) {
      fireEvent.click(closeButton);
    }
    expect(mockClose).toHaveBeenCalled();
  });

  it('renders Close button in footer', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    const footer = container.querySelector('.info-modal__footer');
    const footerCloseButton = footer?.querySelector('button');
    expect(footerCloseButton).toBeInTheDocument();
    expect(footerCloseButton?.textContent).toContain('Close');
  });

  it('has proper structure with header, content, and footer', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    expect(container.querySelector('.info-modal__header')).toBeInTheDocument();
    expect(container.querySelector('.info-modal__content')).toBeInTheDocument();
    expect(container.querySelector('.info-modal__footer')).toBeInTheDocument();
  });

  it('displays sections with proper styling classes', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    const sections = container.querySelectorAll('.info-modal__section');
    expect(sections.length).toBeGreaterThanOrEqual(2); // Build info + Contact
  });

  it('contact info is in a highlighted container', () => {
    const mockClose = vi.fn();
    const { container } = render(<InfoModal onClose={mockClose} />);
    
    const contactContainer = container.querySelector('.info-modal__contact');
    expect(contactContainer).toBeInTheDocument();
  });
});
