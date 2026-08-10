import { createGlobalStyle } from "styled-components";

export const darkTheme = {
  background: "#121212",
  color: "white",
  border: "white",
};
export const lightTheme = {
  background: "white",
  color: "#121212",
  border: "#121212",
};

export const GlobalStyle = createGlobalStyle`
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
