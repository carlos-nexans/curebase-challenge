"use client"

import styled from "styled-components"
import { forwardRef } from "react"

export const FormGroup = styled.div`
  margin-bottom: 52px;
  position: relative;
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
  border-radius: 5px;
  border: 1px solid var(--color-border);
  font-size: 0.875rem;
  transition: border-color 150ms ease-in-out;
  height: 56px;
  background-color: var(--background);
  color: #374151;

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
  padding: 16px 15px;
  border-radius: 5px;
  border: 1px solid var(--color-border);
  font-size: 16px;
  background-color: white;
  color: #374151;
  transition: border-color 150ms ease-in-out;
  appearance: none;
  cursor: pointer;
  height: 56px;

  &::placeholder {
    color: #0C0C0DB8;
    opacity: 0.72;
  }

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
  border-radius: 4px;
  border: 2px solid #0C0C0DE0;
  color-scheme: light;
  accent-color: var(--color-primary);
  width: 20px;
  height: 20px;
  position: relative;
  top: 4px;
  margin-right: 12px;
  appearance: none;
  position: relative;

  &::before {
    display: block;
    content: "";
    width: 1.4rem;
    height: 1.4rem;
    clip-path: polygon(14% 44%, 0 58%, 35% 94%, 100% 35%, 88% 23%, 35% 71%);
    transform: scale(0);
    background-color: var(--color-primary);
    position: absolute;
    top: -5px;
    left: -2px;
    transition: transform 100ms ease-in-out;
  }

  &:checked::before {
    transform: scale(1.1);
  }

  &:checked {
    background-color: var(--color-background);
  }
`



