import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/splide/css";
import { Section, SplideWrapper } from "../styles/shared";

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
  perspective: 1200px;
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    width: 280px;
    height: 350px;
  }
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ flipped }) => (flipped ? "rotateY(180deg)" : "rotateY(0deg)")};
`;

const CardFace = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: ${({ theme }) => theme.background === '#121212'
    ? '0 10px 30px rgba(255, 255, 255, 0.06)'
    : '0 10px 30px rgba(0, 0, 0, 0.12)'};
`;

const CardFront = styled(CardFace)`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
  background-color: ${({ theme }) => theme.background === '#121212' ? '#1c1a17' : '#ffffff'};
  color: ${({ theme }) => theme.color};

  /* Tiled texture, built from the site's tile motif. A red-on-dark tile reads
     best against the dark theme's near-black card back; red-on-light for the
     light theme, so the tile's own background nearly matches the card. */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url(${({ theme }) => theme.background === '#121212' ? '/tile6.png' : '/tile5.png'});
    background-repeat: repeat;
    background-size: 180px 180px;
  }

  /* Blur over the texture so the text on top stays legible, plus the card's edge frame */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: ${({ theme }) => theme.background === '#121212' ? 'rgba(28, 26, 23, 0.35)' : 'rgba(255, 255, 255, 0.4)'};
    -webkit-backdrop-filter: blur(1.5px);
    backdrop-filter: blur(1.5px);
    box-shadow: inset 0 0 0 1.5px ${({ theme }) => theme.background === '#121212' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.15)'},
      inset 0 0 0 8px ${({ theme }) => theme.background === '#121212' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'};
  }
`;

const CardBackContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;

  h3 {
    font-family: 'TerminalGrotesque', sans-serif;
    font-size: 30px;
    margin: 0 0 5px 0;
  }

  @media (max-width: 768px) {
    padding: 18px;

    h3 {
      font-size: 25px;
    }
  }
`;

const CardSubtitle = styled.p`
  font-style: italic;
  font-size: 18px;
  color: gray;
  margin: 0 0 15px 0;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const CardDescription = styled.p`
  font-size: 19px;
  line-height: 1.5;
  margin: 0;
  flex: 1;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CardBackFooter = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 12px;
`;

const CardYear = styled.span`
  font-size: 18px;
  color: gray;
`;

const CardArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: ${({ theme }) => theme.color};
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: red;
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

// How far each card sits from the container's center, and how much it tilts.
const spreadLayout = [
  { x: -230, y: -40, rotation: -9 },
  { x: -70, y: 55, rotation: 6 },
  { x: 90, y: -55, rotation: -6 },
  { x: 230, y: 35, rotation: 9 },
];

const CLICK_DRAG_THRESHOLD = 6; // px of movement before a press counts as a drag rather than a click

function Home({ setExpandedProject }) {
  // Left to right on desktop: Picnic, Tubularium, Kinetip, Conversational User Interface
  const highlights = [
    {
      image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/picnic4.png",
      projectId: 10,
      title: "Picnic",
      subtitle: "Musicking Artifact II",
      description: "Picnic is an interactive musical installation that turns everyday objects inside a picnic basket into an opportunity for engaging in music making.",
      year: 2025,
    },
    {
      image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/tubularium1.png",
      projectId: 9,
      title: "Tubularium",
      subtitle: "Musicking Artifact I",
      description: "Tubularium is a tangible music interface designed to support non-musicians in music making.",
      year: 2024,
    },
    {
      image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/kinetip.png",
      projectId: 3,
      title: "Kinetip",
      subtitle: "a word puzzle game with gestures",
      description: "Kinetip is anInteractive virtual game based on gesture and handwriting recognition, designed for post-surgery recovery.",
      year: 2022,
    },
    {
      image: "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev/images/ericophone1.jpg",
      projectId: 1,
      title: "Conversational User Interface",
      subtitle: "Exploring CUIs in a 60s phone",
      description: "An AI assistant capable of engaging in conversations and document work embodied in an old Ericofon 700",
      year: 2023,
    },
  ];

  const [cards, setCards] = useState(
    highlights.map((h, i) => {
      const layout = spreadLayout[i] || { x: 0, y: 0, rotation: 0 };
      return {
        ...h,
        id: i,
        x: layout.x,
        y: layout.y,
        rotation: layout.rotation,
        zIndex: i,
        flipped: false,
      };
    })
  );

  const containerRef = useRef(null);
  const dragState = useRef({ isDragging: false, cardId: null, offsetX: 0, offsetY: 0, startX: 0, startY: 0, moved: false });
  const [isHovered, setIsHovered] = useState(false);

  const goToProject = (projectId) => {
    setExpandedProject(projectId);
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
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

    if (!dragState.current.moved) {
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      if (Math.hypot(dx, dy) > CLICK_DRAG_THRESHOLD) {
        dragState.current.moved = true;
      }
    }

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
      if (dragState.current.moved) {
        // Apply random rotation only when released after an actual drag
        setCards(prev =>
          prev.map(c =>
            c.id === dragState.current.cardId
              ? { ...c, rotation: Math.random() * 8 - 4 }
              : c
          )
        );
      } else {
        // A press without movement is a click: flip the card
        setCards(prev =>
          prev.map(c =>
            c.id === dragState.current.cardId
              ? { ...c, flipped: !c.flipped }
              : c
          )
        );
      }
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

    {/* Desktop: Flippable Cards */}
    <CoverflowContainer
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && !dragState.current.isDragging && (
        <DragHint>(CLICK TO FLIP · DRAG TO MOVE)</DragHint>
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
            <CardInner flipped={card.flipped}>
              <CardFront>
                <img src={card.image} alt={card.title} />
              </CardFront>
              <CardBack>
                <CardBackContent>
                  <h3>{card.title}</h3>
                  <CardSubtitle>{card.subtitle}</CardSubtitle>
                  <CardDescription>{card.description}</CardDescription>
                  <CardBackFooter>
                    <CardYear>{card.year}</CardYear>
                    <CardArrowButton
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToProject(card.projectId);
                      }}
                      aria-label={`Open ${card.title}`}
                    >
                      →
                    </CardArrowButton>
                  </CardBackFooter>
                </CardBackContent>
              </CardBack>
            </CardInner>
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
                  alt={highlight.title}
                />
                <CarouselOverlay>
                  <CarouselText>{highlight.title}</CarouselText>
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

export default Home;
