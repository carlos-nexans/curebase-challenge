import { Card, CardHeader, List, ListItem, ListItemContent } from "@repo/ui/containers"
import { Heading1, Text } from "@repo/ui/typography"
import Image from "next/image"

export default function TrialsPage() {
  const trials = [
    { id: "Trial 01", description: "Trial description" },
    { id: "Trial 02", description: "Trial description" },
    { id: "Trial 03", description: "Trial description" },
  ]

  return (
    <Card>
      <CardHeader>
        <Heading1>Trials</Heading1>
      </CardHeader>
      <List>
        {trials.map((trial, i) => (
          <ListItem key={i}>
            <ListItemContent>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontWeight: 500, color: "#0c0c0d" }}>{trial.id}</Text>
                  <Image 
                    src="/assets/svg/chevron-right.svg" 
                    alt="Chevron right" 
                    width={5} 
                    height={13}
                  />
                </div>
                <Text>{trial.description}</Text>
              </div>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

