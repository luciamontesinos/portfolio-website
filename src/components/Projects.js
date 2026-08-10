import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "@splidejs/splide/css";
import { projectList } from "../data";
import { Section, SplideWrapper } from "../styles/shared";

const tags = [...new Set(projectList.flatMap(p => p.tags))];

// For sorting by importance
const importanceOrder = { high: 3, medium: 2, low: 1 };

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

export default Projects;
