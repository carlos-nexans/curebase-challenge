"use client"

import { Card, CardHeader, CardContent, List, ListItem, ListItemContent } from "@repo/ui/containers"
import { Heading1, Text } from "@repo/ui/typography"
import { PrimaryButton } from "@repo/ui/buttons"
import Image from "next/image"

export default function ParticipantsPage() {
  const participants = [
    { name: "Lisa Schäfer", status: "Enrolled" },
    { name: "Randy Ross", status: "Enrolled" },
    { name: "Martha Steel Mathew", status: "Enrolled" },
    { name: "Cooper Stanton", status: "Enrolled" },
    { name: "Karen Mango", status: "Enrolled" },
    { name: "Kathryn Westervelt", status: "Enrolled" },
    { name: "Henrik Lipshultz", status: "Enrolled" },
    { name: "Miranda Stanton", status: "Enrolled" },
    { name: "Gretchen Dixon", status: "Enrolled" },
    { name: "Kathryn Bourgan", status: "Enrolled" },
  ]

  return (
    <Card>
      <CardHeader>
        <Heading1>Participants</Heading1>
        <PrimaryButton onClick={() => (window.location.href = "/participants/enroll")}>
          Enroll a participant
        </PrimaryButton>
      </CardHeader>
      <List>
        {participants.map((participant, i) => (
          <ListItem key={i}>
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
                <Text>{participant.status}</Text>
              </div>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

