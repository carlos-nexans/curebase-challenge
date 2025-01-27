'use client'

import { Card, CardContent, CardHeader, List, ListItem, ListItemContent } from "@repo/ui/containers"
import { Heading1, Text } from "@repo/ui/typography"
import Image from "next/image"
import { useQuery } from '@tanstack/react-query'
import { Trial } from '@repo/api/graphql'
import { graphqlClient } from "../queryClient"

const TRIALS_QUERY = `
  query {
    trials {
      id
      name
      participantCount
    }
  }
`

function TrialsHeader() {
  return (
    <CardHeader>
      <Heading1>Trials</Heading1>
    </CardHeader>
  )
}

export default function TrialsPage() {
  const { data, isLoading, error } = useQuery<{trials: Trial[]}>({
    queryKey: ['trials:full'],
    queryFn: () => graphqlClient.request(TRIALS_QUERY),
    refetchInterval: 30000,
    staleTime: 10000,
  })

  if (isLoading) return (
    <Card>
      <TrialsHeader />
      <CardContent>
        <Text>Loading...</Text>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <TrialsHeader />
      <CardContent>
        <Text>Error loading trials</Text>
      </CardContent>
    </Card>
  )

  const trials = data?.trials ?? []

  return (
    <Card>
      <TrialsHeader />
      <List>
        {trials.length === 0 && <Text>No trials found</Text>}
        {trials.map((trial) => (
          <ListItem key={trial.id}>
            <ListItemContent>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontWeight: 500, color: "#0c0c0d" }}>{trial.name}</Text>
                  <Image 
                    src="/assets/svg/chevron-right.svg" 
                    alt="Chevron right" 
                    width={5} 
                    height={13}
                  />
                </div>
                <Text>{trial.participantCount} participants</Text>
              </div>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

