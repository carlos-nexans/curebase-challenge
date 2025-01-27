import { describe, it, expect, vi, afterEach, Mock } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import TrialsPage from './page'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { graphqlClient } from '../queryClient'

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

// Mock graphql client
vi.mock('../queryClient', () => ({
  graphqlClient: {
    request: vi.fn(),
  },
}))

describe('TrialsPage', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  afterEach(() => {
    cleanup()
  })

  it('displays list of trials when data is loaded', async () => {
    const mockTrials = {
      trials: [
        { id: '1', name: 'Trial 1', participantCount: 10 },
        { id: '2', name: 'Trial 2', participantCount: 5 },
      ],
    } as any

    (graphqlClient.request as Mock).mockResolvedValueOnce(mockTrials)

    render(<TrialsPage />, { wrapper: createWrapper() })

    // Check loading state first
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Check for trial data
    expect(await screen.findByText('Trial 1')).toBeInTheDocument()
    expect(screen.getByText('10 participants')).toBeInTheDocument()
    expect(screen.getByText('Trial 2')).toBeInTheDocument()
    expect(screen.getByText('5 participants')).toBeInTheDocument()
  })

  it('shows loading state when trials are being fetched', () => {
    (graphqlClient.request as Mock).mockImplementationOnce(() => new Promise(() => {}))

    render(<TrialsPage />, { wrapper: createWrapper() })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error message when fetch fails and no data is cached', async () => {
    (graphqlClient.request as Mock).mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<TrialsPage />, { wrapper: createWrapper() })

    // Wait for error message to appear
    expect(await screen.findByText('Error loading trials')).toBeInTheDocument()
  })

  it('shows "No trials found" when data is loaded but trials array is empty', async () => {
    const mockTrials = {
      trials: [],
    } as any

    (graphqlClient.request as Mock).mockResolvedValueOnce(mockTrials)

    render(<TrialsPage />, { wrapper: createWrapper() })

    // Wait for "No trials found" message
    expect(await screen.findByText('No trials found')).toBeInTheDocument()
  })
})