import '../assets/fonts/Ilisarniq/index.css';
import './theme.css';

import {
  createGlobalStyle,
  DefaultTheme,
  GlobalStyleComponent
} from 'styled-components/macro';
import { reset } from 'styled-reset';

export const GlobalStyles: GlobalStyleComponent<
  {},
  DefaultTheme
> = createGlobalStyle`
  ${reset}
  
  * {
    box-sizing: border-box;
  }
  
  a {
    text-decoration: none;
  }
  
  html {
    margin: 0;
    font-family: Ilisarniq, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.25;
    color: var(--text-main-color);
    min-width: 420px;
  }
  
  html body {
    line-height: 1.25;
  }

    
  @-webkit-keyframes autofill {
    to {
      color: inherit;
      background: transparent;
    }
  }
  
  input, textarea, select, button {
    font-size: 100%;
    font-family: inherit;
    margin: 0;
    appearance: none;
    line-height: 1.25;
    border-radius: 0;
    background: transparent;
    padding: 0.5rem 1rem 0.6rem;
    color: var(--text-main-color-light);
    border: 2px solid #edf2f7;
    height: 40px;

    &:focus {
      outline: none;
      background-color: #fff;
      border-color: var(--brand-teal);
    }
  }
    
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-animation-name: autofill;
    -webkit-animation-fill-mode: both;
    font-size: 100%;
    font-family: inherit;
    margin: 0;
  }
`;
