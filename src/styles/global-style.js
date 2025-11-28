import { createGlobalStyle, css } from "styled-components";

export const GlobalStyle = createGlobalStyle`${css`
  @font-face {
    font-family: "Fredoka One";
    src: url("/fonts/FredokaOne-Regular.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Inter";
    src: url("/fonts/InterVariable.woff2") format("truetype");
    font-weight: 400 600 700 800;
    font-style: normal;
    font-display: swap;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    margin: 0;
    padding: 0;
  }

  :root {
    --font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
      Roboto, sans-serif;
  }

  body {
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul,
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`}`;
