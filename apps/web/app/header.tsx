"use client"

import Link from "next/link"
import Image from "next/image"
import styled from "styled-components"

const HeaderWrapper = styled.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
`

const HeaderContent = styled.div`
  margin: 0 auto;
  padding: 1rem;
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    height: 4rem;
    justify-content: space-between;
    gap: 0;
  }
`

const NavLink = styled(Link)`
  color: #1c565a;
  font-size: 0.875rem;
  padding: 0.5rem;
  transition: color 150ms ease-in-out;

  &:hover {
    color: #259fa4;
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`

interface NavigationItem {
  href: string
  label: string
}

interface NavigationHeaderProps {
  logoSrc: string
  logoAlt: string
  navigationItems: NavigationItem[]
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ logoSrc, logoAlt, navigationItems }) => {
  return (
    <HeaderWrapper>
      <HeaderContent>
        <Nav>
          <Link href="/">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt={logoAlt}
              width={286}
              height={80}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Link>
          <NavLinks>
            {navigationItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </NavLinks>
        </Nav>
      </HeaderContent>
    </HeaderWrapper>
  )
}

export default NavigationHeader

