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
    font-family: Ilisarniq;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.25;
    color: var(--text-main-color);
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
    
    :focus {
      outline: none;
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
