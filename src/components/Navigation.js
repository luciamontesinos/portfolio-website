import { useState, useEffect } from "react";
import styled from "styled-components";

const Navbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 95%;
  margin: 1% 3% 1% 3%;
  display: flex;
  justify-content: space-between;
  align-items: top-center;
  z-index: 1000;


  h1 {
    margin-top: 0;
    margin-bottom: 0;
  }
    h3 {
    margin-top: 3%;
  }

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const BurgerMenu = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1100;

  div {
    width: 100%;
    height: 3px;
    background: ${({ theme }) => theme.color};
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;

    &:nth-child(1) {
      transform: ${({ isMenuOpen }) => (isMenuOpen ? "rotate(45deg) translateY(12px)" : "none")};
    }

    &:nth-child(2) {
      opacity: ${({ isMenuOpen }) => (isMenuOpen ? "0" : "1")};
    }

    &:nth-child(3) {
      transform: ${({ isMenuOpen }) => (isMenuOpen ? "rotate(-45deg) translateY(-12px)" : "none")};
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

`;

const NavLinks = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: right;

  @media (max-width: 768px) {
    display: ${({ isMenuOpen }) => (isMenuOpen ? "flex" : "none")};
    position: absolute;
    top: 60px;
    right: 0;
    background: ${({ theme }) => theme.background};
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    z-index: 1000;

    a {
      margin: 8px 0;
    }
  }
`;

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Track navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track the last scroll position

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past a threshold
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <Navbar style={{ transform: isVisible ? "translateY(0)" : "translateY(-110%)", transition: "transform 0.3s ease-in-out" }}>
      <NameContainer>
        <h1>Lucía Montesinos</h1>
        <h3>Creative Technologist | PhD Fellow</h3>
      </NameContainer>

      <BurgerMenu onClick={toggleMenu} isMenuOpen={isMenuOpen}>
        <div />
        <div />
        <div />
      </BurgerMenu>
      <NavLinks isMenuOpen={isMenuOpen}>
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#about" onClick={closeMenu}>About Me</a>
        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#publications" onClick={closeMenu}>Publications</a>
        <a href="#cv" onClick={closeMenu}>CV</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </NavLinks>
    </Navbar>
  );
}

export default Navigation;
