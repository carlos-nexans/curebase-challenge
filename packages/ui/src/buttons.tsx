"use client"

import styled from "styled-components"

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 150ms ease-in-out;
  cursor: pointer;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const PrimaryButton = styled(Button)`
  background-color: var(--color-primary);
  color: white;
  padding: 10px 16px;
  border-radius: 4px;
  height: 2.5rem;
  font-weight: 700;
  font-size: 14px;


  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }
    
`

export const SecondaryButton = styled(Button)`
  background-color: white;
  color: var(--color-primary);
  border: 1px solid var(--color-border);

  &:hover:not(:disabled) {
    background-color: var(--color-background);
  }
`

