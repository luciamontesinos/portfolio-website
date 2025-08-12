import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { projectList } from "./data";

const Section = styled.div`
  padding: 40px;
  min-height: 100vh;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const StyledFilterButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background: transparent;
  border: 1px solid white;
  border-radius: 24px;
  cursor: pointer;
  &:hover {
    color: red;
    border-color: red;
  }
`;

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const project = projectList.find((p) => p.id === parseInt(id));

  useEffect(() => {
    if (project) {
      fetch(`/projects/${project.file}`)
        .then((response) => response.text())
        .then((text) => setContent(text));
    }
  }, [project]);

  if (!project) {
    return <Section>Project not found</Section>;
  }

  return (
    <Section>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{project.name}</h1>
      <ReactMarkdown>{content}</ReactMarkdown>
      <h3>Tags:</h3>
      <FilterContainer>
        {project.tags.map((tag) => (
          <StyledFilterButton key={tag} onClick={() => navigate(`/?tag=${tag}`)}>
            {tag}
          </StyledFilterButton>
        ))}
      </FilterContainer>
    </Section>
  );
}

export default ProjectDetails;