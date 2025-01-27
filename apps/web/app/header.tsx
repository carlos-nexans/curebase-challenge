"use client"

import Link from "next/link"
import Image from "next/image"
import styled from "styled-components"
import { usePathname } from "next/navigation"

const HeaderWrapper = styled.header`
  background: var(--color-background);
  margin-bottom: 10px;
`

const HeaderContent = styled.div`
  display: flex;
  padding: 34px 20px;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    height: 148px;
    padding: 34px 60px;
  }
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    height: 4rem;
    justify-content: space-between;
    gap: 0;
  }
`

const NavLink = styled(Link)`
  color: #1c565a;
  font-size: 16px;
  padding: 0.5rem;
  transition: color 150ms ease-in-out;

  &:hover {
    color: #259fa4;
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  
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
  const pathname = usePathname()

  const isActive = (href: string) => pathname.match(href)

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
              <NavLink key={item.href} href={item.href} style={{ color: isActive(item.href) ? 'var(--color-primary)' : '#0C0C0D7A'}}>
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

