"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormGroup, Label, Input, Select, Checkbox } from "@repo/ui/forms"
import { PrimaryButton } from "@repo/ui/buttons"
import { Card, CardContent, ResponsiveCardHeader } from "@repo/ui/containers"
import { Heading1, ErrorText } from "@repo/ui/typography"
import { graphqlClient } from "../../queryClient"
import { useQuery, useMutation } from "@tanstack/react-query"
import { EnrollmentResult, Trial } from "@repo/api/graphql"
import { useRouter } from "next/navigation"
import styled from "styled-components"

const TRIALS_QUERY = `
  query {
    trials {
      id
      name
    }
  }
`

type MutationResult = {
  createParticipant: EnrollmentResult
}

const CREATE_PARTICIPANT_MUTATION = `
  mutation CreateParticipant(
    $name: String!
    $height: Float!
    $weight: Float!
    $hasDiabetes: Boolean!
    $hadCovid: Boolean!
    $trialId: Int!
  ) {
    createParticipant(
      name: $name
      height: $height
      weight: $weight
      hasDiabetes: $hasDiabetes
      hadCovid: $hadCovid
      trialId: $trialId
    ) {
      isEligible
      ineligibilityReasons
    }
  }
`

const participantSchema = z.object({
  name: z.string().min(1, "This is a required field"),
  height: z.string().min(1, "This is a required field"),
  weight: z.string().min(1, "This is a required field"),
  hasDiabetes: z.boolean(),
  hadCovid: z.boolean(),
  trial: z.string().min(1, "This is a required field"),
})

type ParticipantFormData = z.infer<typeof participantSchema>

const FloatingErrorText = styled(ErrorText)`
  position: absolute;
  bottom: -27px;
`

const ButtonContainer = styled.div`
  @media (max-width: 768px) {
    display: flex;
    justify-content: flex-end;
  }
`

export default function EnrollParticipantPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      height: "",
      weight: "",
      hasDiabetes: false,
      hadCovid: false,
      trial: "",
    },
  })

  const router = useRouter()

  const { data: trialsResponse, isLoading } = useQuery<{trials: Trial[]}>({
    queryKey: ['trials:slim'],
    queryFn: () => graphqlClient.request(TRIALS_QUERY)
  })

  const trials = trialsResponse?.trials ?? []

  const { mutate: enrollParticipant, isPending } = useMutation({
    mutationFn: (data: ParticipantFormData) => 
      graphqlClient.request<MutationResult>(CREATE_PARTICIPANT_MUTATION, {
        name: data.name,
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        hasDiabetes: data.hasDiabetes,
        hadCovid: data.hadCovid,
        trialId: parseInt(data.trial, 10)
      }),
    onSuccess: (data: MutationResult) => {
      if (data.createParticipant.isEligible) {
        router.push('/participants/enroll/result/eligible')
      } else {
        router.push('/participants/enroll/result/not-eligible')
      }
    },
    onError: (error) => {
      // Log the error to the console to have observability in New Relic, Datadog, etc.
      console.error('Enrollment failed:', error)
      alert('Enrollment failed due to an internal error')
    }
  })

  const onSubmit = (data: ParticipantFormData) => {
    enrollParticipant(data)
  }

  return (
    <Card>
      <ResponsiveCardHeader>
        <Heading1>Enroll a participant</Heading1>
      </ResponsiveCardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <FloatingErrorText>{errors.name.message}</FloatingErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              type="number"
              {...register("height")}
            />
            {errors.height && <FloatingErrorText>{errors.height.message}</FloatingErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="weight">Weight (pounds)</Label>
            <Input
              id="weight"
              type="number"
              {...register("weight")}
            />
            {errors.weight && <FloatingErrorText>{errors.weight.message}</FloatingErrorText>}
          </FormGroup>

          <FormGroup style={{ marginBottom: 15 }}>
            <Label>
              <Checkbox {...register("hasDiabetes")} /> I have diabetes
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>
              <Checkbox {...register("hadCovid")} /> Had COVID-19
            </Label>
          </FormGroup>
          <FormGroup style={{ marginBottom: 68 }}>
            <Label htmlFor="trial">Trial</Label>
            <Select id="trial" {...register("trial")}>
              <option value="">{isLoading ? "Loading..." : "Select"}</option>
              {trials?.map(trial => (
                <option key={trial.id} value={trial.id}>
                  {trial.name}
                </option>
              ))}
            </Select>
            {errors.trial && <FloatingErrorText>{errors.trial.message}</FloatingErrorText>}
          </FormGroup>

          {/* Button positioned to the right on mobile to help users */}
          <ButtonContainer>
            <PrimaryButton type="submit" disabled={isPending}>
              {isPending ? 'Enrolling...' : 'Save'}
            </PrimaryButton>
          </ButtonContainer>
        </form>
      </CardContent>
    </Card>
  )
}

