import styled from "styled-components";

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

function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return <ScrollToTopButton onClick={scrollToTop}>↑</ScrollToTopButton>;
}

export default ScrollToTop;
