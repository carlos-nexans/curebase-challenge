"use client"

import styled from "styled-components"

export const Card = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
`

export const CardHeader = styled.div`
  padding: 1.25rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 640px) {
    padding: 1.25rem 1.5rem;
  }
`

export const CardContent = styled.div`
  padding: 1.25rem 1rem;

  @media (min-width: 640px) {
    padding: 1.25rem 1.5rem;
  }
`

export const List = styled.ul`
  list-style: none;
  divide-y divide-gray-200;
`

export const ListItem = styled.li`
  &:hover {
    background-color: var(--color-background);
  }
`

export const ListItemContent = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  
  @media (min-width: 640px) {
    padding: 1rem 1.5rem;
  }
`

export const PageContent = styled.main`
  padding: 1.25rem 1rem;
  max-width: 80rem;
  margin: 0 auto;
`
