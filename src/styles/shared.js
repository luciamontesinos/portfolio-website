import styled from "styled-components";

export const Section = styled.div`
    width: 100%;
  padding: 5%;
  margin-top: 0%;
`;

export const SplideWrapper = styled.div`
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
