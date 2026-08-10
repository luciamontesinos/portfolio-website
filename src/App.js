import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme, GlobalStyle } from "./theme";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Publications from "./components/Publications";
import CV from "./components/CV";
import Contact from "./components/Contact";
import ScrollToTop from "./components/ScrollToTop";
import AnimatedLogo from "./components/AnimatedLogo";

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 80vw;
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-y: auto;
  margin-top: 5%;
`;

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

function App() {
  const [theme, setTheme] = useState("dark");
  const themeObj = theme === "dark" ? darkTheme : lightTheme;
  const [expandedProject, setExpandedProject] = useState(null);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

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
