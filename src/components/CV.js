import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { Section } from "../styles/shared";

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

export default CV;
