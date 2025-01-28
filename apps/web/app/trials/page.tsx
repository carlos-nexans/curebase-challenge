'use client'

import { Card, CardContent, ResponsiveCardHeader, List, ListItem, ListItemContent } from "@repo/ui/containers"
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
    <ResponsiveCardHeader>
      <title>Trials</title>
      <Heading1>Trials</Heading1>
    </ResponsiveCardHeader>
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
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text style={{ fontWeight: 400, color: "#0C0C0DE0" }}>{trial.name}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 400, color: "#0C0C0D7A" }}>
                    {trial.participantCount} participants
                  </Text>
                </div>
                <Image 
                  src="/assets/svg/chevron-right.svg" 
                  alt="Chevron right" 
                  width={5} 
                  height={13}
                />
              </div>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

