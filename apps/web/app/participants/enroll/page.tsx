"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormGroup, Label, Input, Select, Checkbox } from "@repo/ui/forms"
import { PrimaryButton } from "@repo/ui/buttons"
import { Card, CardHeader, CardContent } from "@repo/ui/containers"
import { Heading1, ErrorText } from "@repo/ui/typography"
import { graphqlClient } from "../../queryClient"
import { useQuery, useMutation } from "@tanstack/react-query"
import { EnrollmentResult, Trial } from "@repo/api/graphql"
import { useRouter } from "next/navigation"

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

// Add this GraphQL mutation
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

// Define the validation schema
const participantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  hasDiabetes: z.boolean(),
  hadCovid: z.boolean(),
  trial: z.string().min(1, "Trial selection is required"),
})

type ParticipantFormData = z.infer<typeof participantSchema>

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
      console.error('Enrollment failed:', error)
      alert('Enrollment failed due to an internal error')
    }
  })

  const onSubmit = (data: ParticipantFormData) => {
    enrollParticipant(data)
  }

  return (
    <Card>
      <CardHeader>
        <Heading1>Enroll a participant</Heading1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              type="number"
              {...register("height")}
            />
            {errors.height && <ErrorText>{errors.height.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="weight">Weight (pounds)</Label>
            <Input
              id="weight"
              type="number"
              {...register("weight")}
            />
            {errors.weight && <ErrorText>{errors.weight.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>
              <Checkbox {...register("hasDiabetes")} /> I have diabetes
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>
              <Checkbox {...register("hadCovid")} /> Had COVID-19
            </Label>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="trial">Trial</Label>
            {isLoading ? (
              <div>Loading trials...</div>
            ) : (
              <Select id="trial" {...register("trial")}>
                <option value="">Select</option>
                {trials?.map(trial => (
                  <option key={trial.id} value={trial.id}>
                    {trial.name}
                  </option>
                ))}
              </Select>
            )}
            {errors.trial && <ErrorText>{errors.trial.message}</ErrorText>}
          </FormGroup>

          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? 'Enrolling...' : 'Save'}
          </PrimaryButton>
        </form>
      </CardContent>
    </Card>
  )
}

