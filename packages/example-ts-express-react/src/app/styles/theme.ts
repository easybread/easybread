const COLORS = {
  darkGrey: '#1A202E',
  white: '#fff',
  brandTeal: '#4fd1c5'
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px'
};

export const THEME = {
  colors: {
    ...COLORS,
    nav: COLORS.darkGrey,
    textWhite: COLORS.white
  }
};

export const color = (key: string) => (props: any) => props.theme.colors[key];
