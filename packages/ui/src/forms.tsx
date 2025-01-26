"use client"

import styled from "styled-components"
import { forwardRef } from "react"

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  font-size: 0.875rem;
  transition: border-color 150ms ease-in-out;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid var(--color-border);
  font-size: 0.875rem;
  background-color: white;
  color: #374151;
  transition: border-color 150ms ease-in-out;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary);
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`

const SelectIcon = styled.div`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  pointer-events: none;
`

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, ...props }, ref) => (
    <SelectWrapper>
      <StyledSelect ref={ref} {...props}>
        {children}
      </StyledSelect>
      <SelectIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </SelectIcon>
    </SelectWrapper>
  ),
)

Select.displayName = "Select"

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid var(--);
  transition: border-color 150ms ease-in-out;

  &:checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--);
  }
`


