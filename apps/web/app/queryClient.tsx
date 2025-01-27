import { GraphQLClient } from 'graphql-request'

const GRAPHQL_BASE_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/graphql'

export const graphqlClient = new GraphQLClient(GRAPHQL_BASE_URL)
