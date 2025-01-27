'use client'

import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'

const queryClient = new QueryClient()

const GRAPHQL_BASE_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'

export const graphqlClient = new GraphQLClient(GRAPHQL_BASE_URL)

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryClientProvider client={queryClient}>
      {children}
    </ReactQueryClientProvider>
  )
}