import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { projectList, socialLinks, citiesList } from "./data"; // Import the citiesList
import { Splide, SplideSlide } from "@splidejs/react-splide"; // Import Splide components
import "@splidejs/react-splide/css"; // Import Splide styles
import '@splidejs/splide/css';
import { useTheme } from "styled-components";
import { useRef } from "react";


const darkTheme = {
  background: "#121212",
  color: "white",
  border: "white",
};
const lightTheme = {
  background: "white",
  color: "#121212",
  border: "#121212",
};

const GlobalStyle = createGlobalStyle`
  @font-face {
  font-family: 'TerminalGrotesque';
  src: url('fonts/terminal-grotesque.ttf') format('truetype');
}
@font-face {
  font-family: 'StandardBook';
  src: url('fonts/standard-book-webfont.ttf') format('truetype');
}
  *, *::before, *::after {
  box-sizing: border-box;
}
  body {
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.color};
    font-family: 'StandardBook', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  html {
    scroll-behavior: smooth;  
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'TerminalGrotesque', sans-serif;
  }
  h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 40px;
  }
  p {
    font-size: 30px;
  }

   p1 {
    font-size: 25px;
    vertical-align: bottom;
    display: inline-block; 
  height: 100%;
  }

  li {
    font-size: 25px;
    margin-bottom: 16px;

  }
  a {
    color: ${({ theme }) => theme.color};
    text-decoration: none;
    text-shadow: 1px 1px 10px red;

    transition: color 0.3s ease;
    &:hover {
      color: red;
    }
  }
  nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: right;
  }
    /* Media query for small screens */
  @media (max-width: 768px) {
    h1 {
      font-size: 22px; /* 70px reduced by 30% */
    }
    h2 {
      font-size: 35px; /* 50px reduced by 30% */
    }
      h3 {
      font-size: 12.6px; /* 50px reduced by 30% */
    }
    p {
      font-size: 21px; /* 30px reduced by 30% */
    }
    li {
      font-size: 17.5px; /* 25px reduced by 30% */
    }
    a {
      font-size: 17.5px; /* Adjust link font size */

    }
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 80vw;
`;

const tags = [...new Set(projectList.flatMap(p => p.tags))];

// For sorting by importance
const importanceOrder = { high: 3, medium: 2, low: 1 };

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

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  margin-top: 5%;
`;

const Section = styled.div`
    width: 100%;
  padding: 5%;
  margin-top: 0%;
`;

const FilterContainer = styled.div`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;

  @media (min-width: 768px) {
    display: flex; 
  }
`;



const StyledFilterButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ isSelected, theme }) => (isSelected ? "red" : theme.color)};
  background: transparent;
  border: 1px solid ${({ isSelected, theme }) => (isSelected ? "red" : theme.color)};
  border-radius: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  &:hover {
    background: transparent;
    color: red;
    border-color: red;
  }

  span {
    font-style: 'StandardBookItalic', sans-serif;
    font-size: 12px; 
    margin-left: 8px; 
    color: gray;
  }
`;

const SortFunnelButton = styled.button`
  padding: 8px 12px;
  font-size: 18px;
  color: ${({ theme }) => theme.color};
  background: transparent;
  border: 1.5px solid ${({ theme }) => theme.color};
  border-radius: 40%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
  &:hover {
    color: red;
    border-color: red;
    background: rgba(255, 0, 0, 0.07);
  }
`;

const SortDropdown = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.color};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 2000;
  min-width: 200px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
`;

const SortDropdownOption = styled.button`
  background: none;
  border: none;
  color: ${({ selected, theme }) => (selected ? 'red' : theme.color)};
  font-size: 16px;
  text-align: left;
  padding: 12px 18px;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s ease, color 0.2s ease;
  &:hover {
    background: rgba(255, 0, 0, 0.07);
    color: red;
  }
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column; 
  border-bottom: 1px solid ${({ theme }) => theme.color};
  padding: 16px 0;
  color: ${({ theme }) => theme.color};

  p1 {      
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: ${({ theme }) => theme.color};;
  border: none;
  padding: 10px;
  background: transparent;
  font-size: 40px;
  cursor: pointer;
  &:hover {
    color: red;
  }

  @media (max-width: 768px) {
    bottom: 4px;
    right: 4px;
    font-size: 28px;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
  max-width: 20%;
  overflow: flow;
  justify-content: flex-end;

  button {
    font-size: 10px; 
    padding: 4px 8px; 
  }

  @media (max-width: 768px) {
    display: none; 
  }
`;

const ListRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  align-items: flex-end; 
  

  h2 {
    font-size: 16px;
    margin: 0;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ isexpanded, theme }) => (isexpanded ? "red" : theme.color)};
  }

  p {
    margin: 0 16px;
    flex: 1;
    white-space: nowrap;
    
     color: ${({ isexpanded, theme }) => (isexpanded ? "red" : theme.color)}; 
  }
     p1 {
    margin: 0 16px;
    flex: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
     color: ${({ isexpanded, theme }) => (isexpanded ? "red" : theme.color)}; 
  }
`;

const DropdownRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%; 
  box-sizing: border-box; 
`;


const DetailsColumn = styled.div`
  color: ${({ theme }) => theme.color};
  font-size: 14px;
 
  grid-template-columns: 4fr 8fr; 
  gap: 16px; 
  text-align: justify;
  color: ${({ theme }) => theme.color};
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;


  @media (max-width: 768px) {
    grid-template-columns: 1fr; 
  }

  h2 {
    font-size: 35px; 
    margin: 0; 
  }

  p {
    font-size: 21px; 
    margin: 0; 
  }
`;

const SocialLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;


`;


const MediaContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  margin: 0 0;
  flex-wrap: wrap;
  padding: 0;
`;

const SocialLinkRow = styled.div`
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 18px;

  p {
    margin: 0px; 
    font-size: 18px;
    color: gray; 
  }

  a {
    color: ${({ theme }) => theme.color};
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: red;
    }
  }
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.color};
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: red;
  }
`;

const CityRow = styled.div`
  position: relative;
  display: inline-block; 
  cursor: pointer;
`;

const HoverInfo = styled.div`
  position: absolute;
  top: -20px; 
  left: 0;
  background: transparent; 
  color: ${({ theme }) => theme.color}; 
  font-size: 14px;
  white-space: nowrap;
  z-index: 10;
`;


const CVContainer = styled.div`
  display: grid;
  gap: 16px; /* Space between rows */
  p1 {
  color: ${({ theme }) => theme.color}; 
  font-size: 35px;}
`;

const CVRow = styled.div`
  display: grid;
  grid-template-columns: 4fr 8fr; 
  gap: 16px; 
  align-items: start; 
  text-align: justify;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; 
  }

  h2 {
    
    margin: 0; 
  }

  div {
    font-size: 20px;
    color: ${({ theme }) => theme.color};
    text-align: justify;
}
    p {
      font-size: 20px;
      margin-bottom: 16px; 
    }

    ul {
      font-size: 20px;
      margin: 16px 0; 
      padding-left: 20px; 
    }

    li {
      font-size: 20px;
      margin-bottom: 8px; 
      list-style: none; 
      position: relative;
    }

    li::before {
      content: "→"; 
      position: absolute;
      left: -40px; 
      top: -12px;
      color: red; 
      font-size: 40px; 
    }
  
`;

const DownloadButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color};
  border-radius: 24px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  &:hover {
    background: transparent;
    color: red;
    border-color: red;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const PublicationsList = styled.div`
   text-align: justify;

  div {
    font-size: 20px;
    color: ${({ theme }) => theme.color};
    text-align: justify;
}
    p {
      font-size: 20px;
      margin-bottom: 16px; 
    }

    ul {
      font-size: 20px;
      margin: 16px 0; 
      padding-left: 20px; 
    }

    li {
      font-size: 20px;
      margin-bottom: 8px;
      list-style: none;
      position: relative;
    }

    li::before {
      content: "→"; 
      position: absolute;
      left: -40px; 
      top: -12px;
      color: red; 
      font-size: 40px; 
    }
  
`;

const SplideWrapper = styled.div`
  width: 100%; 
  max-width: 100%; 
  overflow: hidden; 
 
  box-sizing: border-box; 
  .splide__arrow {
    background: rgba(255, 255, 255, 0.8);
    opacity: 0.7;
  }
  
  .splide__pagination__page.is-active {
    background: ${({ theme }) => theme.text};
  }

`;

  const ImagePreviewOverlay = styled.div`
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 2001;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 768px) {
      display: none !important;
    }
  `;

  const ImagePreviewContent = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    max-width: 90vw;
    max-height: 90vh;

    img {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 10px;
    }
  `;

  const PreviewCloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    background: transparent;
    border: none;
    color: white;
    font-size: 40px;
    cursor: pointer;
    transition: color 0.3s ease;
    z-index: 2002;

    &:hover {
      color: red;
    }
  `;

  const PreviewNavigationButton = styled.button`
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 32px;
    cursor: pointer;
    padding: 15px 20px;
    border-radius: 5px;
    transition: background 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  `;

  const PreviewCounter = styled.div`
    color: white;
    font-size: 18px;
    font-family: 'StandardBook', sans-serif;
  `;

const CoverflowContainer = styled.div`
  width: 100%;
  position: relative;
  height: 600px;
  margin: 20px 0;
  overflow: visible;
  display: none;

  @media (max-width: 768px) {
    display: none;
  }

  @media (min-width: 769px) {
    display: block;
  }
`;

const MobileCarouselContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    padding: 20px 0;
  }
`;



const CarouselCard = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CarouselOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const CarouselText = styled.p`
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  flex: 1;
`;

const CarouselArrow = styled.div`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-left: 10px;
`;

const CardStack = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
`;

const DraggableCard = styled.div`
  position: absolute;
  width: 350px;
  height: 450px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  box-shadow: ${({ theme }) => theme.background === '#121212'
    ? '0 10px 30px rgba(255, 255, 255, 0.06)'
    : '0 10px 30px rgba(0, 0, 0, 0.12)'};
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:active {
    cursor: grabbing;
    box-shadow: ${({ theme }) => theme.background === '#121212'
      ? '0 18px 50px rgba(255, 255, 255, 0.06)'
      : '0 18px 50px rgba(0, 0, 0, 0.2)'};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,0.35);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    color: white;
    padding: 16px 18px;
    border-radius: 0 0 12px 12px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .card-text {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    flex: 1 1 auto;
    text-align: left;
  }

  .card-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: red;
    }
  }

  @media (max-width: 768px) {
    width: 280px;
    height: 350px;

    .card-overlay {
      padding: 15px;
    }

    .card-text {
      font-size: 14px;
    }
  }
`;

const DragHint = styled.div`
  position: absolute;
  font-family: 'TerminalGrotesque', sans-serif;
  bottom: 10
  px;
  left: 50%;
  transform: translateX(-50%);
  color: red;
  text-shadow: 1px 1px 10px red;
  padding: 8px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  z-index: 3000;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);

  @media (max-width: 768px) {
    display: none;
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

function Home({ setExpandedProject }) {
  const highlights = [

    { image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/ericophone1.jpg", text: "Conversational User Interface", projectId: 1 },
    { image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/kinetip.png", text: "Interactive Virtual Game based on Gesture and Handwriting Recognition", projectId: 3 },
    { image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/tubularium1.png", text: "Tubularium - Musicking Artifact I", projectId: 9 },
    { image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/picnic4.png", text: "Picnic - Musicking Artifact II", projectId: 10 },
  ];

  const [cards, setCards] = useState(
    highlights.map((h, i) => ({
      ...h,
      id: i,
      x: Math.random() * 20 - 10, // Slight random offset for stacked effect
      y: i * 8, // Slight vertical offset for each card
      rotation: Math.random() * 4 - 2, // Slight rotation
      zIndex: i,
    }))
  );

  const containerRef = useRef(null);
  const dragState = useRef({ isDragging: false, cardId: null, offsetX: 0, offsetY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = (e, cardId) => {
    e.preventDefault();
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const card = cards.find(c => c.id === cardId);
    
    // Calculate card's actual center position in viewport coordinates
    const cardCenterX = containerRect.left + containerRect.width / 2 + card.x;
    const cardCenterY = containerRect.top + containerRect.height / 2 + card.y;

    dragState.current = {
      isDragging: true,
      cardId,
      offsetX: e.clientX - cardCenterX,
      offsetY: e.clientY - cardCenterY,
    };

    // Bring card to front
    setCards(prev =>
      prev.map(c =>
        c.id === cardId
          ? { ...c, zIndex: Math.max(...prev.map(x => x.zIndex)) + 1 }
          : c
      )
    );
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculate position relative to container center
    const mouseXFromCenter = e.clientX - rect.left - rect.width / 2;
    const mouseYFromCenter = e.clientY - rect.top - rect.height / 2;

    setCards(prev =>
      prev.map(c =>
        c.id === dragState.current.cardId
          ? {
            ...c,
            x: mouseXFromCenter - dragState.current.offsetX,
            y: mouseYFromCenter - dragState.current.offsetY,
            // Don't rotate while dragging - keep current rotation
          }
          : c
      )
    );
  };

  const handleMouseUp = () => {
    if (dragState.current.isDragging && dragState.current.cardId !== null) {
      // Apply random rotation only when released
      setCards(prev =>
        prev.map(c =>
          c.id === dragState.current.cardId
            ? { ...c, rotation: Math.random() * 8 - 4 }
            : c
        )
      );
    }
    dragState.current.isDragging = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
  <Section id="home">
    <h1 onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: 'pointer' }}>
      HIGHLIGHTS
    </h1>
    
    {/* Desktop: Draggable Cards */}
    <CoverflowContainer
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && !dragState.current.isDragging && (
        <DragHint>(DRAG TO REVEAL)</DragHint>
      )}
      <CardStack>
        {cards.map((card) => (
          <DraggableCard
            key={card.id}
            style={{
              left: `calc(50% + ${card.x}px)`,
              top: `calc(50% + ${card.y}px)`,
              transform: `translate(-50%, -50%) rotate(${card.rotation}deg)`,
              zIndex: card.zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(e, card.id)}
          >
            <img src={card.image} alt={card.text} />
            <div className="card-overlay">
              <p
                className="card-text"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setExpandedProject(card.projectId);
                  const projectsSection = document.getElementById("projects");
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                {card.text}
              </p>
              <button
                className="card-button"
                onClick={() => {
                  setExpandedProject(card.projectId);
                  const projectsSection = document.getElementById("projects");
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                →
              </button>
            </div>
          </DraggableCard>
        ))}
      </CardStack>
    </CoverflowContainer>

    {/* Mobile: Carousel */}
    <MobileCarouselContainer>
      <SplideWrapper>
        <Splide
          options={{
            type: "slide",
            perPage: 1,
            perMove: 1,
            gap: "16px",
            padding: { left: '10%', right: '10%' },
            focus: "center",
            autoWidth: false,
            arrows: true,
            pagination: true,
          }}
        >
          {highlights.slice()
  .sort((a, b) => b.projectId - a.projectId).map((highlight, index) => (
            <SplideSlide key={index}>
              <CarouselCard
                onClick={() => {
                  setExpandedProject(highlight.projectId);
                  const projectsSection = document.getElementById("projects");
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <img
                  src={highlight.image}
                  alt={highlight.text}
                />
                <CarouselOverlay>
                  <CarouselText>{highlight.text}</CarouselText>
                  <CarouselArrow>→</CarouselArrow>
                </CarouselOverlay>
              </CarouselCard>
            </SplideSlide>
          ))}
        </Splide>
      </SplideWrapper>
    </MobileCarouselContainer>
  </Section>
);
}

function Projects({ expandedProject, setExpandedProject }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [projectContent, setProjectContent] = useState({}); // Store content of each project
  const [projectMedia, setProjectMedia] = useState({}); // Store media URLs for each project
  const [isFilterVisible] = useState(false); // Track filter visibility
  const [isVideoPlaying] = useState(false); // Track if a video is playing
  const [previewState, setPreviewState] = useState({ isOpen: false, projectId: null, mediaIndex: 0 }); // Track preview modal state
  const [sortMode, setSortMode] = useState("importance"); // 'recent' or 'importance', default to importance
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  



  useEffect(() => {
    if (expandedProject) {
      const project = projectList.find(p => p.id === expandedProject);
      if (project && !projectContent[expandedProject]) {
        (async () => {
          try {
            const response = await fetch(project.file);
            if (!response.ok) return;
            const text = await response.text();
            const mediaSection = text.split("## Media")[1];
              const youtubeVideoMap = {
  "/images/Tubularium__Demo.mp4": "https://www.youtube.com/embed/X0vxTOJO0Us",
  "/images/ericophone.mp4": "https://www.youtube.com/embed/BpvtZOfE--s",
  "/images/livevisuals.mov": "https://www.youtube.com/embed/dIBtaVdXCPE",
  "/images/recommender.mp4": "https://www.youtube.com/embed/Gi7HCa44ZLw",
  "/images/picnic.mp4": "https://www.youtube.com/embed/vzOZoCOCKr0?si=ia0198lEJOoc9JzN",
  "/images/kinetip.mp4": "https://www.youtube.com/embed/IDFvhmlaa_E",
};
            let mediaUrls = [];
            if (mediaSection) {
              mediaUrls = mediaSection
                .split("\n")
                .filter((line) => line.trim().startsWith("![") || line.trim().startsWith("["))
                .map((line) => {
                  const match = line.match(/\((.*?)\)/);
                  if (!match) return null;
                  const url = match[1];
                  const isVideo = url.match(/\.(mp4|webm|ogg|mov|MOV)$/i);
                  if (isVideo && youtubeVideoMap[url]) {
                    return { type: "video", url: youtubeVideoMap[url] };
                  }
                  return { type: "image", url };
                })
                .filter(Boolean);
            }
            const filteredContent = text.replace(/## Media[\s\S]*/m, "").trim();
            setProjectContent((prev) => ({ ...prev, [expandedProject]: filteredContent }));
            setProjectMedia((prev) => ({ ...prev, [expandedProject]: mediaUrls }));
          } catch (error) {
            console.error(`Error fetching file: ${project.file}`, error);
          }
        })();
      }
      // Update URL
      window.location.hash = `#projects?project=${expandedProject}`;
    }
  }, [expandedProject, projectContent, setProjectContent, setProjectMedia]);

  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = projectList.filter((project) => project.tags.includes(tag)).length;
    return acc;
  }, {});

  let filteredProjects = selectedTags.length > 0
    ? projectList.filter((p) => selectedTags.every(tag => p.tags.includes(tag)))
    : [...projectList];

  if (sortMode === "recent") {
    filteredProjects = filteredProjects.sort((a, b) => b.year - a.year);
  } else if (sortMode === "importance") {
    filteredProjects = filteredProjects.sort((a, b) => {
      const impA = importanceOrder[a.importance] || 0;
      const impB = importanceOrder[b.importance] || 0;
      if (impB !== impA) return impB - impA;
      return b.year - a.year;
    });
  }

  const toggleExpand = (projectId) => {
    if (expandedProject === projectId) {
      setExpandedProject(null); // Collapse if already expanded
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      setExpandedProject(projectId); // Expand the selected project
    }
  };
  const urlPrefix = "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev";
//   const youtubeVideoMap = {
//   "/images/Tubularium__Demo.mp4": "https://www.youtube.com/embed/X0vxTOJO0Us",
//   "/images/ericophone.mp4": "https://www.youtube.com/embed/BpvtZOfE--s",
//   "/images/livevisuals.mov": "https://www.youtube.com/embed/dIBtaVdXCPE",
//   "/images/recommender.mp4": "https://www.youtube.com/embed/Gi7HCa44ZLw",
//   "/images/picnic.mp4": "https://www.youtube.com/embed/vzOZoCOCKr0?si=ia0198lEJOoc9JzN",

// };

  return (
    <Section id="projects">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })} style={{ cursor: 'pointer', margin: 0 }}>PROJECTS</h1>
      </div>
      <FilterContainer isVisible={isFilterVisible}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <SortFunnelButton
            onClick={() => setShowSortDropdown((prev) => !prev)}
            aria-label="Sort options"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 4 21 4 14 14 14 20 10 20 10 14 3 4"></polygon></svg>
          </SortFunnelButton>
          {showSortDropdown && (
            <SortDropdown>
              <SortDropdownOption
                selected={sortMode === "importance"}
                onClick={() => { setSortMode("importance"); setShowSortDropdown(false); }}
              >
                Most important first
              </SortDropdownOption>
              <SortDropdownOption
                selected={sortMode === "recent"}
                onClick={() => { setSortMode("recent"); setShowSortDropdown(false); }}
              >
                More recent first
              </SortDropdownOption>
            </SortDropdown>
          )}
        </div>
        {[...tags].sort((a, b) => {
      const aNum = !isNaN(Number(a));
      const bNum = !isNaN(Number(b));
      if (aNum && bNum) {
        // Both numbers: sort descending
        return Number(b) - Number(a);
      }
      if (aNum) return -1; // Numbers before strings
      if (bNum) return 1;
      // Both strings: sort alphabetically
      return a.localeCompare(b);
    }).map((tag) => (
          <StyledFilterButton
            key={tag}
            isSelected={selectedTags.includes(tag)}
            onClick={() => {
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag) // Remove if already selected
                  : [...prev, tag]                // Add if not selected
              );
            }}
          >
            {tag} <span>{tagCounts[tag]}</span>
          </StyledFilterButton>
        ))}
        <StyledFilterButton
          isSelected={selectedTags.length === 0}
          onClick={() => setSelectedTags([])}
        >
          See all <span>{projectList.length}</span>
        </StyledFilterButton>
      </FilterContainer>
      {filteredProjects.length === 0 ? (
        <div style={{ color: 'red', fontSize: '22px', margin: '32px 0', textAlign: 'center' }}>
          No projects found for the selected tag combination.
        </div>
      ) : (
        filteredProjects.map((project) => (
          <StyledCard key={project.id}>
            <ListRow
              onClick={() => toggleExpand(project.id)}
              isexpanded={expandedProject === project.id}
            >
              <p>{project.name}</p>
              {expandedProject !== project.id && (
                <p1>{project.description}</p1>
              )}

              <TagContainer>

                {[...project.tags].sort().map((tag) => (
                  <StyledFilterButton
                    key={tag}
                    isSelected={selectedTags.includes(tag)}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the dropdown toggle
                      setSelectedTags((prev) =>
                        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </StyledFilterButton>
                ))}
              </TagContainer>

            </ListRow>
            {expandedProject === project.id && (
              <DropdownRow>
                <p>{project.description}</p>
                <DetailsColumn>
                  <ReactMarkdown>{projectContent[project.id]}</ReactMarkdown>
                  <MediaContainer>
                    {projectMedia[project.id] && projectMedia[project.id].length > 0 && (
                      <SplideWrapper>
                      <Splide
                        style={{
                          width: "100%", // Ensure it spans the full width of the parent
                          maxWidth: "100%",
                          overflow: "hidden", // Prevent content overflow
                          margin: "0 auto",
                        }}
                        options={{
                          type: "slide",
                          perPage: 3,
                          perMove: 1,
                          autoplay: !isVideoPlaying,
                          interval: 3000,
                          pauseOnHover: true,
                          focus: "center",
                          gap: "16px",
                          autoWidth: true,
                          height: "25rem",
                          breakpoints: {
                            1024: {
                              perPage: 2,
                            },
                            600: {
                              perPage: 1,
                            },
                          },
                        }}
                        onMove={(splide) => {
                          const activeSlide = splide.Components.Elements.slides[splide.index];
                          if (activeSlide) {
                            activeSlide.focus();
                          }
                        }}
                      >
                        {projectMedia[project.id].map((media, index) => {
  if (media.type === "video") {
    // media.url is a YouTube URL from youtubeVideoMap
    return (
      <SplideSlide key={index}>
        <iframe
          width="100%"
          height="400"
          src={media.url}
          title={`YouTube video ${index + 1}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            borderRadius: "10px",
          }}
        />
      </SplideSlide>
    );
  } else {
    // media.type === "image"
    const fullUrl = media.url.startsWith("http") ? media.url : urlPrefix + media.url;
    return (
      <SplideSlide key={index}>
        <img
          src={fullUrl}
          alt={`Media ${index + 1}`}
          style={{
            width: "auto",
            height: "400px",
            borderRadius: "10px",
            objectFit: "contain",
            cursor: "pointer",
          }}
          onClick={() => setPreviewState({ isOpen: true, projectId: project.id, mediaIndex: index })}
        />
      </SplideSlide>
    );
  }
})}
                      </Splide>
                      </SplideWrapper>
                    )}
                  </MediaContainer>
                </DetailsColumn>
              </DropdownRow>
            )}
          </StyledCard>
        ))
      )}

      {/* Image Preview Modal (desktop only) */}
      <ImagePreviewOverlay
        isOpen={previewState.isOpen}
        onClick={() => setPreviewState({ isOpen: false, projectId: null, mediaIndex: 0 })}
      >
        <PreviewCloseButton
          onClick={() => setPreviewState({ isOpen: false, projectId: null, mediaIndex: 0 })}
        >
          ✕
        </PreviewCloseButton>

        {previewState.isOpen && projectMedia[previewState.projectId] && (
          <ImagePreviewContent onClick={(e) => e.stopPropagation()}>
            {projectMedia[previewState.projectId][previewState.mediaIndex].type === "image" && (
              <>
                <img
                  src={
                    projectMedia[previewState.projectId][previewState.mediaIndex].url.startsWith("http")
                      ? projectMedia[previewState.projectId][previewState.mediaIndex].url
                      : urlPrefix + projectMedia[previewState.projectId][previewState.mediaIndex].url
                  }
                  alt={"Preview " + (previewState.mediaIndex + 1)}
                />
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <PreviewNavigationButton
                    onClick={() => {
                      setPreviewState((prev) => ({
                        ...prev,
                        mediaIndex: prev.mediaIndex === 0
                          ? projectMedia[prev.projectId].length - 1
                          : prev.mediaIndex - 1,
                      }));
                    }}
                  >
                    ←
                  </PreviewNavigationButton>
                  <PreviewCounter>
                    {previewState.mediaIndex + 1} / {projectMedia[previewState.projectId].length}
                  </PreviewCounter>
                  <PreviewNavigationButton
                    onClick={() => {
                      setPreviewState((prev) => ({
                        ...prev,
                        mediaIndex: (prev.mediaIndex + 1) % projectMedia[prev.projectId].length,
                      }));
                    }}
                  >
                    →
                  </PreviewNavigationButton>
                </div>
              </>
            )}
          </ImagePreviewContent>
        )}
      </ImagePreviewOverlay>

    </Section>
  );
}

const DesktopLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileLayout = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
  
  > div {
    margin-bottom: 30px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 16px;
    text-align: justify;
  }
`;

const AboutImagesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 900px;
  overflow: visible;
`;

const AboutTextContainer = styled.div`
  h2 {
    font-size: 35px;
    margin-top: 2px;
    margin-bottom: 2px;
  }
  
  p {
    font-size: 26px;
    margin-top: 5px;
    margin-bottom: 30px;
    text-align: justify;
  }
`;

const DraggableAboutImage = styled.div`
  position: absolute;
  width: 300px;
  height: 400px;
  cursor: grab;
  user-select: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.background === '#121212' 
    ? '0 10px 30px rgba(255, 255, 255, 0.2)' 
    : '0 10px 30px rgba(0, 0, 0, 0.3)'};
  transition: box-shadow 0.2s ease;

  &:active {
    cursor: grabbing;
    box-shadow: ${({ theme }) => theme.background === '#121212' 
      ? '0 15px 40px rgba(255, 255, 255, 0.3)' 
      : '0 15px 40px rgba(0, 0, 0, 0.5)'};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;



function About() {
  const images = [
    { id: 0, src: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/Dig.png", alt: "Digital Self", label: "DIGITAL SELF" },
    { id: 1, src: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/me.JPG", alt: "Analog Self", label: "ANALOG SELF" },
    
  ];

  const [aboutImages, setAboutImages] = useState(
    images.map((img, i) => ({
      ...img,
      x: 0,
      y: i * 420, // Stack vertically: 0, 420
      zIndex: i,
    }))
  );

  const containerRef = useRef(null);
  const dragState = useRef({ isDragging: false, imageId: null, offsetX: 0, offsetY: 0 });

  const handleMouseDown = (e, imageId) => {
    e.preventDefault();
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const image = aboutImages.find(img => img.id === imageId);

    dragState.current = {
      isDragging: true,
      imageId,
      offsetX: e.clientX - (containerRect.left + image.x),
      offsetY: e.clientY - (containerRect.top + image.y),
    };

    // Bring image to front
    setAboutImages(prev =>
      prev.map(img =>
        img.id === imageId
          ? { ...img, zIndex: Math.max(...prev.map(x => x.zIndex)) + 1 }
          : img
      )
    );
  };

  const handleMouseMove = (e) => {
    if (!dragState.current.isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    setAboutImages(prev =>
      prev.map(img =>
        img.id === dragState.current.imageId
          ? {
            ...img,
            x: e.clientX - rect.left - dragState.current.offsetX,
            y: e.clientY - rect.top - dragState.current.offsetY,
          }
          : img
      )
    );
  };

  const handleMouseUp = () => {
    dragState.current.isDragging = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);
  const [aboutContent, setAboutContent] = useState("");

useEffect(() => {
  const fetchMarkdown = async () => {
    try {
      const response = await fetch("about.md");
      if (!response.ok) {
        console.error(`Failed to fetch about.md: ${response.status}`);
        return;
      }
      const text = await response.text();
      setAboutContent(text);
    } catch (error) {
      console.error("Error fetching about.md:", error);
    }
  };

  fetchMarkdown();
}, []);

const aboutSections = aboutContent
  ? aboutContent.split(/(?=^## )/m).map((section) => {
      const [title, ...content] = section.split("\n").filter((line) => line.trim() !== "");
      return {
        title: title ? title.replace("## ", "") : "",
        content: content.join("\n")
      };
    }).filter(section => section.title) // Remove empty sections
  : [];

  return (
  <Section id="about">
    <h1 onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })} style={{ cursor: 'pointer' }}>ABOUT ME</h1>
    
    {aboutSections.length === 0 ? (
      <p>Loading...</p>
    ) : (
      <>
    <DesktopLayout>
      <AboutImagesContainer ref={containerRef}>
        {aboutImages.map((img) => (
          <DraggableAboutImage
            key={img.id}
            style={{
              left: `${img.x}px`,
              top: `${img.y}px`,
              zIndex: img.zIndex,
            }}
            onMouseDown={(e) => handleMouseDown(e, img.id)}
          >
            <img src={img.src} alt={img.alt} />
          </DraggableAboutImage>
        ))}
      </AboutImagesContainer>

      <AboutTextContainer>
        {aboutSections.map((section, index) => (
              <div key={index}>
                <h2>{section.title}</h2>
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            ))}
      </AboutTextContainer>
    </DesktopLayout>

    {/* Mobile Layout - Single column, alternating */}
    <MobileLayout>
      {aboutSections.map((section, index) => (
            <div key={index}>
              <h2>{section.title}</h2>
              <img src={images[index].src} alt={images[index].alt} />
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          ))}
    </MobileLayout>
      </>
    )}
  </Section>
);

}

function Contact() {
  const theme = useTheme();
  const [hoveredCity, setHoveredCity] = useState(null); 
  const currentCity = citiesList.find((city) => city.isHome); 
  const previousCities = citiesList.filter((city) => !city.isHome);

  return (
    <Section id="contact">
      <h1 onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })} style={{ cursor: 'pointer' }}>CONTACT</h1>

      <div>
        <p1> Get in touch. Currently based in {" "}
          <CityRow
            onMouseEnter={() => setHoveredCity(currentCity)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <span style={{ color: hoveredCity === currentCity ? "red" : theme.color}}>
              {currentCity.city}
            </span>
            {hoveredCity === currentCity && (
              <HoverInfo>{currentCity.organization}</HoverInfo>
            )}
          </CityRow>
          . Previously in {" "}
          {previousCities.map((city, index) => (
            <CityRow
              key={index}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <span
                style={{
                  color: hoveredCity === city ? "red" : theme.color,
                  marginRight: "8px",
                }}
              >
                {city.city}
                {index < previousCities.length - 1 ? "," : "."}
              </span>
              {hoveredCity === city && <HoverInfo>{city.organization}</HoverInfo>}
            </CityRow>
          ))}</p1>
            </div>
              <div>
        <SocialLinksContainer>
          {socialLinks.map((link) => (
            <SocialLinkRow key={link.label}>
              <p>{link.descriptor}:</p> {}
              <SocialLink href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} {}
              </SocialLink>
            </SocialLinkRow>
          ))}
        </SocialLinksContainer>
      </div>
    </Section>
  );
}

function CV() {
  const [cvContent, setCvContent] = useState(""); // Store the markdown content

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch("cv.md"); // Path to the markdown file
        if (!response.ok) {
          console.error(`Failed to fetch CV: ${response.status}`);
          return;
        }
        const text = await response.text();
        setCvContent(text); // Set the fetched content
      } catch (error) {
        console.error("Error fetching CV:", error);
      }
    };

    fetchMarkdown(); // Fetch the markdown content on component mount
  }, []);

  // Split the markdown content into sections based on headings (e.g., # Title)
  const sections = cvContent
    ? cvContent.split(/(?=^# )/m).map((section) => {
      const [title, ...content] = section.split("\n").filter((line) => line.trim() !== "");
      return {
        title: title ? title.replace("# ", "") : "Untitled", // Fallback to "Untitled" if title is undefined
        content: content.join("\n") // Preserve spaces by joining with "\n"
      };
    })
    : [];

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/CV_2026.pdf';
    link.download = 'CV_2026.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Section id="cv">
      <h1 onClick={() => document.getElementById("cv").scrollIntoView({ behavior: "smooth" })} style={{ cursor: 'pointer' }}>CV</h1>
      <DownloadButton onClick={handleDownloadCV}>Download CV</DownloadButton>
      {sections.length > 0 ? (
        <CVContainer>
          {sections.map((section, index) => (
            <CVRow key={index}>
              <p1>{section.title}</p1>
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </CVRow>
          ))}
        </CVContainer>
      ) : (
        <p>Loading...</p> // Show a loading message while fetching
      )}
    </Section>
  );
}

function Publications() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(
          "https://pub.orcid.org/v3.0/0009-0002-1438-6461/works",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(`Failed to fetch publications: ${response.status}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const works = await Promise.all(
          data.group.map(async (work) => {
            const summary = work["work-summary"][0];
            const title = summary["title"]["title"]["value"];
            const doi = summary["external-ids"]["external-id"].find(
              (id) => id["external-id-type"] === "doi"
            )?.["external-id-value"];

            let additionalData = {};
            if (doi) {
              try {
                const crossRefResponse = await fetch(`https://api.crossref.org/works/${doi}`);
                if (crossRefResponse.ok) {
                  const crossRefData = await crossRefResponse.json();
                  additionalData = {
                    publisher: crossRefData.message.publisher || "Unknown Publisher",
                    type: crossRefData.message.type || "Unknown Type",
                    authors: crossRefData.message.author
                      ? crossRefData.message.author.map((author) => `${author.given} ${author.family}`).join(", ")
                      : "Unknown Authors",
                    venue: crossRefData.message["container-title"] ? crossRefData.message["container-title"].join(", ") : "Unknown Venue",
                    date: crossRefData.message["published-print"]?.["date-parts"][0][0] || crossRefData.message["published-online"]?.["date-parts"][0][0] || "Unknown Date",
                    abstract: crossRefData.message.abstract || "No abstract available",
                    event: crossRefData.message["event"]?.["name"] || "No event information available",
                    url: crossRefData.message.URL || "No URL available",

                  };
                }
              } catch (error) {
                console.error(`Error fetching CrossRef data for DOI ${doi}:`, error);
              }
            }

            return { title, doi, ...additionalData };
          })
        );

        setPublications(works);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching publications:", error);
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  return (
    <Section id="publications">
      <h1>PUBLICATIONS</h1>
      {loading ? (
        <p>Finding the latest publications...</p>
      ) : publications.length > 0 ? (

        <PublicationsList>

          <ul>
            {publications.map((pub, index) => (
              <li key={index} style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "18px", lineHeight: "1.5" }}>
                  <strong>{pub.title}</strong>. {pub.date}. <em>{pub.authors}</em>. {pub.event}.
                  {pub.doi && (
                    <>
                      {" "}
                      DOI:{" "}
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "red" }}
                      >
                        {pub.doi}
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </PublicationsList>
      ) : (
        <p>No publications found. Weird. I do have some, so maybe try searching for my name in Google Scholar</p>
      )}
    </Section>
  );
}

// const LMIcon = styled.img`
// position: fixed;
//   top: 20px;
//   left: 10px;
//   z-index: 2000;
//   background: transparent;
//   color: red;
//   width: 50px;
//   height: 50px;
//   font-size: 18px;
//   cursor: pointer;
//   transition: background 0.2s;
// r
//   &:hover {
//     background: red;
//     color: theme.color;
//   }
//     @media (max-width: 768px) {
//     display: none;
//   }
// `;


const ThemeToggleButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;  
  z-index: 2000;
  background: transparent;
  color: ${({ theme }) => theme.color};
  border: 2px solid ${({ theme }) => theme.color};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 28px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    border-color: red;
    color: red;
  }
    @media (max-width: 768px) {
    bottom: 4px;
    left: 4px;
    font-size: 28px;
  }
`;

const LogoLMContainer = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;



function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <ScrollToTopButton onClick={scrollToTop}>↑</ScrollToTopButton>;
}

function AnimatedLogo(){
    const [animationStage, setAnimationStage] = useState('initial');
    const [morphProgress, setMorphProgress] = useState(0);
    const logoRef = useRef(null);
    const theme = useTheme();
    const [isBlinking,setIsBlinking] = useState(false);


    const strokeColor = theme.color
  
  const startMain = [
    [30, 40, 30, 80],
    [30, 80, 60, 80],
    [60, 80, 60, 40],
    [60, 40, 75, 55],
    [75, 55, 90, 40],
    [90, 40, 90, 80]
  ];

  const endMain = [
    [30, 34, 34, 80],
    [34, 80, 34, 80],
    [34, 80, 70, 75],
    [70, 75, 50, 90],
    [50, 90, 70, 95],
    [70, 95, 38, 115]
  ];
  
    // Lerp function
    const lerp = (start, end, progress) => {
      return start + (end - start) * progress;
    };
  
    // Easing function for smooth animation
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
  
    useEffect(() => {
      const timer1 = setTimeout(() => setAnimationStage('morphing'), 500);
      const timer2 = setTimeout(() => setAnimationStage('moving'), 2500);
      const timer3 = setTimeout(() => setAnimationStage('complete'), 3500);
  
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }, []);
  
    // Morph animation using lerp
    useEffect(() => {
      if (animationStage === 'morphing') {
        const startTime = Date.now();
        const duration = 2000; // 2 seconds
  
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeInOutCubic(progress);
          
          setMorphProgress(easedProgress);
  
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
  
        requestAnimationFrame(animate);
      }
    }, [animationStage]);


    useEffect(() => {
    if (animationStage !== 'complete') return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 200); // Blink duration: 0.4 seconds
    }, 4000); // Blink every 4 seconds

    return () => clearInterval(blinkInterval);
  }, [animationStage]);
  
  
    const renderLines = () => {
      let lines;
      
      if (animationStage === 'initial') {
        lines = startMain;
      } else if (animationStage === 'morphing') {
        // Lerp between start and end based on progress
        lines = startMain.map((startLine, i) => {
          const endLine = endMain[i];
          return [
            lerp(startLine[0], endLine[0], morphProgress),
            lerp(startLine[1], endLine[1], morphProgress),
            lerp(startLine[2], endLine[2], morphProgress),
            lerp(startLine[3], endLine[3], morphProgress)
          ];
        });
      } else {
        lines = endMain;
      }
      
      return lines.map((line, i) => (
        <line
          key={i}
          x1={line[0]}
          y1={line[1]}
          x2={line[2]}
          y2={line[3]}
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
        />
      ));
    };
  
   const renderEyes = () => {
    if (animationStage !== 'complete' || isBlinking || !logoRef.current) return null;
 

    // Left eye center position (in viewBox coordinates)
      const leftEyeCenterX = 15;
      const leftEyeCenterY = 60;
      
      // Right eye center position
      const rightEyeCenterX = 60;
      const rightEyeCenterY = 50;


    return (
      <>
        <circle cx={leftEyeCenterX} cy={leftEyeCenterY} r="8" fill={strokeColor} />
        <circle cx={rightEyeCenterX} cy={rightEyeCenterY} r="8" fill={strokeColor} />
      </>
    );
  };
  
    const getContainerStyles = () => {
      const base = {
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
      };
  
      if (animationStage === 'initial' || animationStage === 'morphing') {
        return {
          ...base,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          zIndex: 10000,
        };
      } else if (animationStage === 'moving' || animationStage === 'complete') {
        return {
          ...base,
          position: 'fixed',
          top: '20px',
          left: '10px',
          width: '50px',
          height: '50px',
          zIndex: 10000,
          cursor: animationStage === 'complete' ? 'pointer' : 'default',
        };
      }
    };
  
    const getOverlayOpacity = () => {
      if (animationStage === 'initial' || animationStage === 'morphing') {
        return 1;
      } else if (animationStage === 'moving') {
        return 0;
      }
      return 0;
    };

     const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
    return (
      <LogoLMContainer>
        {/* Black overlay */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: getOverlayOpacity(),
            transition: 'opacity 1s ease-out',
            pointerEvents: animationStage === 'complete' ? 'none' : 'all',
            zIndex: 9999,
          }}
        />
  
        <div ref={logoRef} style={getContainerStyles()} onClick={animationStage === 'complete' ? handleClick : undefined}>
          <svg
            viewBox="0 0 120 120"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <g>
              {renderLines()}
            </g>
            {renderEyes()}
          </svg>
        </div>
  
        <style>{`
          .eye {
            transition: cx 0.1s ease-out, cy 0.1s ease-out;
          }
            /* Default: hide on all devices */
        .logo-container,
        .logo-overlay {
          display: none;
        }

        /* Show logo only on desktop (min-width: 768px) */
        @media (min-width: 768px) {
          .logo-container,
          .logo-overlay {
            display: block;
          }
        }
        `}</style>
      </LogoLMContainer>
    );
  };
  




//function ScrollToHome() {
  //const theme = useTheme();
  //const iconSrc = theme.color === "white" ? "/logo192_dark.png" : "/logo192_light.png";

  ////window.scrollTo({ top: 0, behavior: "smooth" });};

  //return <LMIcon id="lm-icon" src={iconSrc} alt="LM Icon" onClick={handleClick} />;
//}

function App() {
  const [theme, setTheme] = useState("dark");
  const themeObj = theme === "dark" ? darkTheme : lightTheme;
  const [expandedProject, setExpandedProject] = useState(null);
  //const [showOverlay, setShowOverlay] = useState(true);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  //const handleOverlayComplete = () => {
    //setShowOverlay(false);};

  return (
    <ThemeProvider theme={themeObj}>
      <GlobalStyle />
      <AnimatedLogo />
      <ContentWrapper>
        <Navigation/>
        <SectionsContainer>
          <Home setExpandedProject={setExpandedProject} /> 
          <About />
          <Projects expandedProject={expandedProject} setExpandedProject={setExpandedProject} />
          <Publications />
          <CV />
          <Contact />
        </SectionsContainer>
        <ThemeToggleButton onClick={toggleTheme} title="Toggle theme">
        {theme === "dark" ? "☀︎" : "⏾"}
      </ThemeToggleButton>
        <ScrollToTop />
      </ContentWrapper>
    </ThemeProvider>
  );
}

export default App;
