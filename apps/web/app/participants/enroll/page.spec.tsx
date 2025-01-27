import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import EnrollParticipantPage from './page';

// Mock the next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}));

// Mock tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn()
}));

describe('EnrollParticipantPage', () => {
  const mockRouter = {
    push: vi.fn()
  };
  const mockTrials = {
    trials: [
      { id: 1, name: 'Trial 1' },
      { id: 2, name: 'Trial 2' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as Mock).mockReturnValue(mockRouter);
    (useQuery as Mock).mockReturnValue({
      data: mockTrials,
      isLoading: false
    });
    (useMutation as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows validation errors when form is submitted empty', async () => {
    render(<EnrollParticipantPage />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Height is required')).toBeInTheDocument();
      expect(screen.getByText('Weight is required')).toBeInTheDocument();
      expect(screen.getByText('Trial selection is required')).toBeInTheDocument();
    });
  });

  it('redirects to eligible page on successful enrollment of eligible participant', async () => {
    const mockMutate = vi.fn();
    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });

    render(<EnrollParticipantPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '70' } });
    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/trial/i), { target: { value: '1' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Get the onSuccess callback from the useMutation options
    const mutationOptions = (useMutation as Mock)?.mock?.calls?.[0]?.[0];
    
    // Simulate successful mutation with eligible participant
    mutationOptions.onSuccess({ createParticipant: { isEligible: true } });

    expect(mockRouter.push).toHaveBeenCalledWith('/participants/enroll/result/eligible');
  });

  it('redirects to not-eligible page when participant is not eligible', async () => {
    const mockMutate = vi.fn();
    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });

    render(<EnrollParticipantPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '70' } });
    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/trial/i), { target: { value: '1' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Get the onSuccess callback from the useMutation options
    const mutationOptions = (useMutation as Mock)?.mock?.calls?.[0]?.[0];
    
    // Simulate successful mutation with ineligible participant
    mutationOptions.onSuccess({ createParticipant: { isEligible: false } });

    expect(mockRouter.push).toHaveBeenCalledWith('/participants/enroll/result/not-eligible');
  });

  it('shows alert when enrollment fails', async () => {
    const mockMutate = vi.fn();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false
    });

    render(<EnrollParticipantPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/height/i), { target: { value: '70' } });
    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: '180' } });
    fireEvent.change(screen.getByLabelText(/trial/i), { target: { value: '1' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Get the onError callback from the useMutation options
    const mutationOptions = (useMutation as Mock)?.mock?.calls?.[0]?.[0];
    
    // Simulate error
    mutationOptions.onError(new Error('Test error'));

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith('Enrollment failed due to an internal error');

    consoleSpy.mockRestore();
    alertMock.mockRestore();
  });
});
