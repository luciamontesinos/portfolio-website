import { useState, useEffect } from "react";
//import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import styled, { createGlobalStyle } from "styled-components";
//import ProjectDetails from "./ProjectDetails";
import { projectList, socialLinks, citiesList } from "./data"; // Import the citiesList
import { HashRouter as Router } from "react-router-dom"; // Use BrowserRouter instead of Router
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import Slider from "react-slick";
import { Splide, SplideSlide } from "@splidejs/react-splide"; // Import Splide components
import "@splidejs/react-splide/css"; // Import Splide styles
import '@splidejs/splide/css';

const GlobalStyle = createGlobalStyle`
  @font-face {
  font-family: 'TerminalGrotesque';
  src: url('fonts/terminal-grotesque.ttf') format('truetype');
}
@font-face {
  font-family: 'StandardBook';
  src: url('fonts/standard-book-webfont.ttf') format('truetype');
}
  body {
    background: #121212;
    color: white;
    font-family: 'StandardBook', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
  }
  html {
    scroll-behavior: smooth; /* Enables smooth scrolling */
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'TerminalGrotesque', sans-serif;
  }
  h2 {
    font-size: 50px;
  }
  p {
    font-size: 30px;
  }

   p1 {
    font-size: 25px;
    vertical-align: bottom;
    display: inline-block; /* Ensure the element is inline-block */
  height: 100%;
  }

  li {
    font-size: 25px;
    margin-bottom: 16px;

  }
  a {
    color: white;
    text-decoration: none;
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
    background: white;
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
  justify-content: flex-start; /* Align content to the top */

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
    background: #121212;
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
  min-height: 100vh;
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
    display: flex; /* Always visible on larger screens */
  }
`;

const FilterToggleButton = styled.button`
  display: none;
  padding: 8px 16px;
  font-size: 14px;
 color: ${({ isSelected }) => (isSelected ? "red" : "white")};
  background: transparent;
  border: 1px solid ${({ isSelected }) => (isSelected ? "red" : "white")};
  border-radius: 24px;
  cursor: pointer;
  margin-bottom: 8px;
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

  @media (max-width: 768px) {
    display: block; /* Show the button only on small screens */
  }
`;

const StyledFilterButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ isSelected }) => (isSelected ? "red" : "white")};
  background: transparent;
  border: 1px solid ${({ isSelected }) => (isSelected ? "red" : "white")};
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

// const StyledButton = styled.button`
//   padding: 8px 12px;
//   margin-right: 5px;
//   border: none;
//   border-radius: 5px;
//   background: green;
//   color: white;
//   cursor: pointer;
//   transition: background 0.3s ease;
//   &:hover {
//     background: darkgreen;
//   }
// `;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column; 
  border-bottom: 1px solid white; 
  padding: 16px 0;
  color: white;

  p1 {      
`;

const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: white;
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
    font-size: 10px; /* Make the tags smaller */
    padding: 4px 8px; /* Adjust padding for smaller size */
  }

  @media (max-width: 768px) {
    display: none; /* Hide the filters on small screens */
  }
`;

// const TagContainerRow = styled.div`
//   display: flex;
//   flex-wrap: wrap; /* Allow tags to wrap if they exceed the width */
//   gap: 8px; /* Space between tags */
//   width: 100%; /* Make it span the full width of the parent */
//   margin-top: 8px;
//   justify-content: flex-start; /* Align tags to the left */
//   align-items: center;
// `;



// const DropdownContent = styled.div`
//   margin-top: 16px;
//   padding: 16px;
//   color: white;
//   font-size: 14px;
// `;

// const ArrowButton = styled.button`
//   background: transparent;
//   border: none;
//   color: white;
//   font-size: 40px;
//   cursor: pointer;
//   margin-right: 8px;
//   &:hover {
//     color: red;
//   }

//    @media (max-width: 768px) {
//     font-size: 28px; 
//     margin-right: 4px;
//   }

// `;

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
    color: ${({ isexpanded }) => (isexpanded ? "red" : "white")};
  }

  p {
    margin: 0 16px;
    flex: 1;
    white-space: nowrap;
    
     color: ${({ isexpanded }) => (isexpanded ? "red" : "white")}; 
  }
     p1 {
    margin: 0 16px;
    flex: 2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
     color: ${({ isexpanded }) => (isexpanded ? "red" : "white")}; 
  }
`;

const DropdownRow = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  padding: 16px;
  width: 100%; /* Ensure it spans the full width */
  box-sizing: border-box; /* Include padding in the width */
`;

// const ArrowColumn = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

const DetailsColumn = styled.div`
  color: white;
  font-size: 14px;
 
  grid-template-columns: 4fr 8fr; /* Two columns: one for h2 and one for p */
  gap: 16px; /* Space between columns */
  text-align: justify;
  color: white;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;


  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack columns vertically on smaller screens */
  }

  h2 {
    font-size: 35px; /* Match the About section's h2 font size */
    margin: 0; /* Remove default margin */
  }

  p {
    font-size: 21px; /* Match the About section's p font size */
    margin: 0; /* Remove default margin */
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
  display: flex; /* Use flexbox to align items in a row */
  align-items: center; /* Vertically align items */
  gap: 8px; /* Add spacing between items */
  font-size: 18px;

  p {
    margin: 0px; /* Remove default margin */
    font-size: 18px;
    color: gray; /* Optional: Different color for the descriptor */
  }

  a {
    color: white;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: red;
    }
  }
`;

const SocialLink = styled.a`
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover {
    color: red;
  }
`;

const CityRow = styled.div`
  position: relative;
  display: inline-block; /* Ensure proper positioning for hover info */
  cursor: pointer;
`;

const HoverInfo = styled.div`
  position: absolute;
  top: -20px; /* Position above the city name */
  left: 0;
  background: transparent; /* Transparent background */
  color: white; /* White text for the organization */
  font-size: 14px;
  white-space: nowrap;
  z-index: 10;
`;

// const TimeBox = styled.div`
//   width: 40px; /* Fixed width for each box */
//   height: 50px; /* Fixed height for each box */
//   background: #000; /* Black background for retro look */
//   color: #00ff00; /* Green text for retro digital clock style */
//   font-family: 'TerminalGrotesque', monospace; /* Use the existing retro font */
//   font-size: 24px; /* Adjust font size for the clock */
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   text-align: center;
//   border-radius: 4px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

//   /* Create the split effect for the flip clock */
//   &::before,
//   &::after {
//     content: "";
//     position: absolute;
//     left: 0;
//     width: 100%;
//     height: 50%;
//     background: #000;
//     z-index: -1;
//   }

//   &::before {
//     top: 0;
//     border-bottom: 2px solid #333; /* Line separating the top and bottom sections */
//   }

//   &::after {
//     bottom: 0;
//     border-top: 2px solid #333; /* Line separating the top and bottom sections */
//   }
// `;

const CVContainer = styled.div`
  display: grid;
  gap: 16px; /* Space between rows */
`;

const CVRow = styled.div`
  display: grid;
  grid-template-columns: 4fr 8fr; /* Two columns: title and content */
  gap: 16px; /* Space between columns */
  align-items: start; /* Align items at the top of the row */
  text-align: justify;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack columns vertically on smaller screens */
  }

  h2 {
    
    margin: 0; /* Remove default margin */
  }

  div {
    font-size: 20px;
    color: white;
    text-align: justify;
}
    p {
      font-size: 20px;
      margin-bottom: 16px; /* Add space between paragraphs */
    }

    ul {
      font-size: 20px;
      margin: 16px 0; /* Add space above and below lists */
      padding-left: 20px; /* Indent list items */
    }

    li {
      font-size: 20px;
      margin-bottom: 8px; /* Add space between list items */
      list-style: none; /* Remove default bullet */
      position: relative;
    }

    li::before {
      content: "→"; /* Replace with your desired symbol */
      position: absolute;
      left: -40px; /* Adjust position */
      top: -12px;
      color: red; /* Customize color */
      font-size: 40px; /* Match font size */
    }
  
`;

const PublicationsList = styled.div`
   text-align: justify;

  div {
    font-size: 20px;
    color: white;
    text-align: justify;
}
    p {
      font-size: 20px;
      margin-bottom: 16px; /* Add space between paragraphs */
    }

    ul {
      font-size: 20px;
      margin: 16px 0; /* Add space above and below lists */
      padding-left: 20px; /* Indent list items */
    }

    li {
      font-size: 20px;
      margin-bottom: 8px; /* Add space between list items */
      list-style: none; /* Remove default bullet */
      position: relative;
    }

    li::before {
      content: "→"; /* Replace with your desired symbol */
      position: absolute;
      left: -40px; /* Adjust position */
      top: -12px;
      color: red; /* Customize color */
      font-size: 40px; /* Match font size */
    }
  
`;

const SplideWrapper = styled.div`
  width: 100%; /* Full width of the parent */
  max-width: 100%; /* Prevent it from exceeding the parent's width */
  overflow: hidden; /* Prevent content overflow */
 
  box-sizing: border-box; /* Include padding and border in the width */

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
        <h3>PhD Fellow | Creative Technologist</h3>
      </NameContainer>
      <BurgerMenu onClick={toggleMenu} isMenuOpen={isMenuOpen}>
        <div />
        <div />
        <div />
      </BurgerMenu>
      <NavLinks isMenuOpen={isMenuOpen}>
        {/* <a href="#home" onClick={closeMenu}>Home</a> */}

        <a href="#projects" onClick={closeMenu}>Projects</a>
        <a href="#about" onClick={closeMenu}>About Me</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
        <a href="#cv" onClick={closeMenu}>CV</a>
        <a href="#publications" onClick={closeMenu}>Publications</a>
      </NavLinks>
    </Navbar>
  );
}

// function Home() {
//   const images = [
//     { src: "/images/tubularium1.png", projectId: "1" }, // Replace with your project IDs
//     { src: "/images/ericophone1.jpg", projectId: "2" },
//   ];
//   const urlPrefix = "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev";

//   return (
//     <Section id="home">
//       <h1>Highlights</h1>
//       <Splide
//         options={{
//           type: "loop",
//           perPage: 1,
//           perMove: 1,
//           autoplay: true,
//           interval: 3000,
//           pauseOnHover: true,
//           arrows: true,
//           pagination: true,
//           gap: "16px",
//           height: "25rem",
//           updateOnMove: true,
//           breakpoints: {
//             1024: {
//               perPage: 2,
//             },
//             768: {
//               perPage: 1,
//             },
//           },
//         }}
//         onMove={(splide) => {
//           // Move focus to the active slide
//           const activeSlide = splide.Components.Elements.slides[splide.index];
//           if (activeSlide) {
//             activeSlide.focus();
//           }
//         }}
//       >
//         {images.map((image, index) => (
//           <SplideSlide key={index}>
//             {/* <a href={`#projects?project=${image.projectId}`} style={{ textDecoration: "none" }}> */}
//             <img

//               src={image.src}
//               alt={`Slide ${index + 1}`}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 borderRadius: "10px",
//                 objectFit: "contain",
//                 cursor: "pointer",
//               }}
//             />
//             {/* </a> */}
//           </SplideSlide>
//         ))}
//       </Splide>
//     </Section>
//   );
// }

function Projects() {
  const [selectedTag, setSelectedTag] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null); // Track which project is expanded
  const [projectContent, setProjectContent] = useState({}); // Store content of each project
  const [projectMedia, setProjectMedia] = useState({}); // Store media URLs for each project
  const [isFilterVisible, setIsFilterVisible] = useState(false); // Track filter visibility
  const [isVideoPlaying] = useState(false); // Track if a video is playing



  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const projectId = new URLSearchParams(hash.replace("#", "")).get("project");
      if (projectId) {
        setExpandedProject(projectId); // Automatically expand the project
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" }); // Scroll to the Projects section
        }
      }
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Check the hash on initial load
    handleHashChange();

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = projectList.filter((project) => project.tags.includes(tag)).length;
    return acc;
  }, {});

  const filteredProjects = selectedTag
    ? projectList
      .filter((p) => p.tags.includes(selectedTag))
      .sort((a, b) => b.year - a.year) // Sort by year descending
    : projectList.sort((a, b) => b.year - a.year); // Sort by year descending

  const toggleExpand = async (projectId, file) => {
    if (expandedProject === projectId) {
      setExpandedProject(null); // Collapse if already expanded
      window.history.replaceState({}, "", window.location.pathname);

    } else {
      // Fetch the markdown content if not already loaded
      if (!projectContent[projectId]) {
        try {
          const response = await fetch(file);

          if (!response.ok) {
            return;
          }

          const text = await response.text();

          // Extract media URLs from the "## Media" section
          const mediaSection = text.split("## Media")[1];
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

          // Remove the "## Media" section from the markdown content
          const filteredContent = text.replace(/## Media[\s\S]*/m, "").trim();

          setProjectContent((prev) => ({ ...prev, [projectId]: filteredContent }));
          setProjectMedia((prev) => ({ ...prev, [projectId]: mediaUrls }));
          console.log(mediaUrls);
        } catch (error) {
          console.error(`Error fetching file: ${file}`, error);
        }
      }
      setExpandedProject(projectId); // Expand the selected project
      window.history.pushState({}, "", `#projects?project=${projectId}`); // Update the URL


    }
  };
  const urlPrefix = "https://pub-5ceae6c59ca74b43a15bb310c05194ab.r2.dev";
  const youtubeVideoMap = {
  "/images/Tubularium__Demo.mp4": "https://www.youtube.com/embed/X0vxTOJO0Us",
  "/images/ericophone.mp4": "https://www.youtube.com/embed/BpvtZOfE--s",
  "/images/livevisuals.mov": "https://www.youtube.com/embed/dIBtaVdXCPE",
  "/images/recommender.mp4": "https://www.youtube.com/embed/Gi7HCa44ZLw",
};

  return (
    <Section id="projects">
      <h1>Projects</h1>
      <FilterToggleButton onClick={() => setIsFilterVisible((prev) => !prev)}>
        {isFilterVisible ? "Hide Filters" : "Filter"}
      </FilterToggleButton>
      <FilterContainer isVisible={isFilterVisible}>
        {[...tags].sort().map((tag) => (
          <StyledFilterButton
            key={tag}
            isSelected={selectedTag === tag}
            onClick={() => setSelectedTag(tag)}
          >
            {tag} <span>{tagCounts[tag]}</span>
          </StyledFilterButton>
        ))}
        <StyledFilterButton
          isSelected={!selectedTag}
          onClick={() => setSelectedTag(null)}
        >
          See all <span>{projectList.length}</span>
        </StyledFilterButton>
      </FilterContainer>
      {filteredProjects.map((project) => (
        <StyledCard key={project.id}>
          <ListRow
            onClick={() => toggleExpand(project.id, project.file)}
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
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the dropdown toggle
                    setSelectedTag(tag);
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
                <h2>Media</h2>
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
                        type: "loop",
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
          }}
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
      ))}
    </Section>
  );
}

// const AboutContainer = styled.div`
//   display: grid;
//   grid-template-columns: 1fr; 
//   gap: 16px;

//   @media (min-width: 768px) {s
//     grid-template-columns: 4fr 8fr; 
//   }
// `;

const AboutRow = styled.div`
  display: contents;
  text-align: justify;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 4fr 8fr; 
    gap: 16px;
  }
`;

function About() {
  return (
    <Section id="about">
      <h1>About me</h1>
      <AboutRow>

        <h2>MY DIGITAL SELF</h2>
        <p>
          I am a creative technologist passionate about exploring innovative ways of interacting with digital and physical media.
          With a technical background and creative inclinations, I thrive in maker spaces and have created a range of interactive
          experiences for artistic and cultural applications. I am currently pursuing a PhD in Digital Design, driven by my endless
          curiosity and passion for interaction.
        </p>
      </AboutRow>
      <AboutRow>
        <h2>MY ANALOG SELF</h2>
        <p>
          I was born and raised in Madrid, but I am currently based in Copenhagen. I have always been passionate about music, and
          since I was 7, it has played a very important role in my life. Back then was when I started to play the drums. As part of
          that journey, I have been working as a drum teacher for kids, playing semi-professionally in a few bands, composing and
          recording an album, and playing it live in some venues and events. Nowadays, my music career is a bit calmer, but I still
          play the drums and I am learning to play the bass. A recent hobby I've been enjoying lately is solving jigsaw puzzles. I
          know, it doesn't sound as cool as being a rockstar but honestly, If there were such a thing as being a "puzzlestar", I
          would probably be one.
        </p>
      </AboutRow>
    </Section>
  );
}

function Contact() {
  const [hoveredCity, setHoveredCity] = useState(null); // Track the hovered city

  const currentCity = citiesList.find((city) => city.isHome); // Find the current city
  const previousCities = citiesList.filter((city) => !city.isHome); // Find previous cities

  return (
    <Section id="contact">
      <h1>Contact</h1>

      <div>
        <p> Get in touch </p>
        <SocialLinksContainer>
          {socialLinks.map((link) => (
            <SocialLinkRow key={link.label}>
              <p>{link.descriptor}:</p> {/* Descriptor */}
              <SocialLink href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label} {/* Link label */}
              </SocialLink>
            </SocialLinkRow>
          ))}
        </SocialLinksContainer>

        <p>
          Currently based in {" "}
          <CityRow
            onMouseEnter={() => setHoveredCity(currentCity)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <span style={{ color: hoveredCity === currentCity ? "red" : "white" }}>
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
                  color: hoveredCity === city ? "red" : "white",
                  marginRight: "8px",
                }}
              >
                {city.city}
                {index < previousCities.length - 1 ? "," : ""}
              </span>
              {hoveredCity === city && <HoverInfo>{city.organization}</HoverInfo>}
            </CityRow>
          ))}.</p>
      </div>
      <div>


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

  return (
    <Section id="cv">
      <h1>CV</h1>
      {sections.length > 0 ? (
        <CVContainer>
          {sections.map((section, index) => (
            <CVRow key={index}>
              <h2>{section.title}</h2>
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
      <h1>Publications</h1>
      {loading ? (
        <p>Loading...</p>
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
        <p>No publications found.</p>
      )}
    </Section>
  );
}

function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <ScrollToTopButton onClick={scrollToTop}>↑</ScrollToTopButton>;
}

function App() {
  return (
    <Router>
      <GlobalStyle />
      <ContentWrapper>
        <Navigation />
        <SectionsContainer>
          {/* <Home /> */}
          <Projects />
          <About />
          <Contact />
          <CV />
          <Publications />
        </SectionsContainer>
        <ScrollToTop />
      </ContentWrapper>
    </Router>
  );
}

export default App;
