"use client"

import styled from "styled-components"

export const Card = styled.div`
  background: var(--background);
`

export const CardHeader = styled.div`
  padding: 1.25rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

export const ResponsiveCardHeader = styled(CardHeader)`
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
    margin: 0px;
  }
`

export const CardContent = styled.div`
`

export const List = styled.ul`
  list-style: none;
  divide-y divide-gray-200;
`

export const ListItem = styled.li`
  padding: 21px 0;
  border-bottom: 1px solid #e5e7eb;
`

export const ListItemContent = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  padding-bottom: 21px 0;
`

export const PageContent = styled.main`
  padding: 20px 0 100px 20px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    padding: 20px;
  }
`