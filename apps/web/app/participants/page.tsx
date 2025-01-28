"use client"

import { Card, CardContent, ResponsiveCardHeader, List, ListItem, ListItemContent } from "@repo/ui/containers"
import { Heading1, Text } from "@repo/ui/typography"
import { PrimaryButton } from "@repo/ui/buttons"
import Image from "next/image"
import { useQuery } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { Participant } from '@repo/api/graphql'
import { graphqlClient } from "../queryClient"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Participants",
  robots: {
    index: false,
    follow: false,
  },
}

const GET_PARTICIPANTS = gql`
  query GetParticipants {
    participants {
      id
      name
      enrolledAt
    }
  }
`



function ParticipantsHeader() {
  return (
    <ResponsiveCardHeader>
      <Heading1>Participants</Heading1>
      <Link href="/participants/enroll">
        <PrimaryButton>
          Enroll a participant
        </PrimaryButton>
      </Link>
    </ResponsiveCardHeader>
  )
}

export default function ParticipantsPage() {
  const { data, isLoading, error } = useQuery<{participants: Participant[]}>({
    queryKey: ['participants'],
    queryFn: async () => {
      return await graphqlClient.request(GET_PARTICIPANTS)
    },
    refetchInterval: 30000,
    staleTime: 10000,
  })

  if (isLoading) return (
    <Card>
      <ParticipantsHeader />
      <CardContent>
        <Text>Loading...</Text>
      </CardContent>
    </Card>
  )

  if (error) return (
    <Card>
      <ParticipantsHeader />
      <CardContent>
        <Text>Error loading participants</Text>
      </CardContent>
    </Card>
  )

  if (!data?.participants.length) return (
    <Card>
      <ParticipantsHeader />
      <CardContent>
        <Text>No participants enrolled yet</Text>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <ParticipantsHeader />
      <List>
        {data?.participants.map((participant) => (
          <ListItem key={participant.id}>
            <ListItemContent>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Text style={{ fontWeight: 400, color: "#0C0C0DE0" }}>{participant.name}</Text>
                  <Text style={{ fontSize: 12, fontWeight: 400, color: "#0C0C0D7A" }}>
                    {/* Added year to date format for better readability */}
                    {`Enrolled in ${new Date(participant.enrolledAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}`}
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

