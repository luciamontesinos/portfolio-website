import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Section } from "../styles/shared";

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

export default About;
