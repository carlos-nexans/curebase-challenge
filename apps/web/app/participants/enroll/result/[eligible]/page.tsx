"use client"

import { PrimaryButton } from "@repo/ui/buttons"
import { Card, CardContent } from "@repo/ui/containers"
import { Heading1, Text } from "@repo/ui/typography"
import styled from "styled-components"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

const CenteredCard = styled(Card)`
  max-width: 400px;
  margin: 172px auto 0 auto;
  text-align: center;
`

const IconWrapper = styled.div<{ $isEligible: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isEligible ? "#e6f6f4" : "#fde8e8")};
  margin-bottom: 30px;
`

const EligibilityHeading = styled(Heading1)`
  margin-bottom: 7px;
`

const EligibilityText = styled(Text)`
  margin-bottom: 30px;
`

interface StatusProps {
  isEligible: boolean
}

function Status({ isEligible }: StatusProps) {
  const icon = isEligible 
    ? <Image src="/assets/svg/ok.svg" alt="Success icon" width={48} height={48} />
    : <Image src="/assets/svg/error.svg" alt="Error icon" width={48} height={48} />
  
  const heading = isEligible 
    ? "Participant is eligible"
    : "Participant is not eligible"
  
  const message = isEligible
    ? "The participant can participate in this study."
    : "The participant can't participate in this study."

  return (
    <>
      <IconWrapper $isEligible={isEligible}>
        {icon}
      </IconWrapper>
      <EligibilityHeading>
        {heading}
      </EligibilityHeading>
      <EligibilityText>
        {message}
      </EligibilityText>
    </>
  )
}

export default function EligibilityResultPage() {
  const params = useParams()
  const router = useRouter()
  const isEligible = params.eligible === 'eligible'

  const handleOkClick = () => {
    router.push('/participants')
  }

  return (
    <CenteredCard>
      <CardContent>
        <Status isEligible={isEligible} />
        <PrimaryButton onClick={handleOkClick}>OK</PrimaryButton>
      </CardContent>
    </CenteredCard>
  )
}
