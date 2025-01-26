"use client"

import { useState } from "react"
import { FormGroup, Label, Input, Select, Checkbox } from "@repo/ui/forms"
import { PrimaryButton } from "@repo/ui/buttons"
import { Card, CardHeader, CardContent } from "@repo/ui/containers"
import { Heading1, ErrorText } from "@repo/ui/typography"

export default function EnrollParticipantPage() {
  const [formData, setFormData] = useState({
    name: "",
    height: "",
    weight: "",
    termsAccepted: false,
    hadCovid: false,
    trial: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your backend
  }

  return (
    <Card>
      <CardHeader>
        <Heading1>Enroll a participant</Heading1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            {!formData.name && <ErrorText>This is a required field</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleInputChange}
              required
            />
            {!formData.height && <ErrorText>This is a required field</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="weight">Weight (pounds)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              required
            />
            {!formData.weight && <ErrorText>This is a required field</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>
              <Checkbox name="termsAccepted" checked={formData.termsAccepted} onChange={handleInputChange} /> Terms
              Accepted
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>
              <Checkbox name="hadCovid" checked={formData.hadCovid} onChange={handleInputChange} /> Had COVID-19
            </Label>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="trial">Trial</Label>
            <Select id="trial" name="trial" value={formData.trial} onChange={handleInputChange} required>
              <option value="">Select</option>
              <option value="trial1">Trial 01</option>
              <option value="trial2">Trial 02</option>
              <option value="trial3">Trial 03</option>
            </Select>
            {!formData.trial && <ErrorText>This is a required field</ErrorText>}
          </FormGroup>

          <PrimaryButton type="submit">Save</PrimaryButton>
        </form>
      </CardContent>
    </Card>
  )
}

