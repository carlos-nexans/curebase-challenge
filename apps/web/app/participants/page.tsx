"use client"

import { Card, CardHeader, List, ListItem, ListItemContent } from "@repo/ui/containers"
import { Heading1, Text } from "@repo/ui/typography"
import { PrimaryButton } from "@repo/ui/buttons"
import Image from "next/image"
import { useQuery } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { Participant } from '@repo/api/graphql'
import { graphqlClient } from "../queryClient"

const GET_PARTICIPANTS = gql`
  query GetParticipants {
    participants {
      id
      name
      enrolledAt
    }
  }
`

export default function ParticipantsPage() {
  const { data, isLoading, error } = useQuery<{participants: Participant[]}>({
    queryKey: ['participants'],
    queryFn: async () => {
      return await graphqlClient.request(GET_PARTICIPANTS)
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading participants</div>

  return (
    <Card>
      <CardHeader>
        <Heading1>Participants</Heading1>
        <PrimaryButton onClick={() => (window.location.href = "/participants/enroll")}>
          Enroll a participant
        </PrimaryButton>
      </CardHeader>
      <List>
        {data?.participants.map((participant) => (
          <ListItem key={participant.id}>
            <ListItemContent>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontWeight: 500, color: "#0c0c0d" }}>{participant.name}</Text>
                  <Image 
                    src="/assets/svg/chevron-right.svg" 
                    alt="Chevron right" 
                    width={5} 
                    height={13}
                  />
                </div>
                <Text>
                  {`Enrolled in ${new Date(participant.enrolledAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}`}
                </Text>
              </div>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

