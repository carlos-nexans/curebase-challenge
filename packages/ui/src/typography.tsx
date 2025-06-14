"use client"

import styled from "styled-components"

export const Heading1 = styled.h1`
  font-size: 32px;
  font-weight: 400;
  color: var(--color-text-primary);
  line-height: 1.75rem;
`

export const Heading2 = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.75rem;
`

export const Text = styled.p`
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.25rem;
`

export const ErrorText = styled(Text)`
  color: var(--color-text-error);
  font-size: 12px;
  font-weight: 700;
`

