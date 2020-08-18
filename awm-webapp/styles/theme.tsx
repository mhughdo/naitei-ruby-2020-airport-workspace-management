export const theme = {
  breakpoints: ['640px', '768px', '1024px', '1280px'],
  space: [0, 4, 8, 12, 16, 24, 32, 64, 128, 256, 512],
  fonts: {
    body:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    heading: 'inherit',
    monospace: 'Menlo, monospace',
  },
  fontSizes: [12, 14, 16, 18, 20, 24, 32, 48, 64, 96],
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
    hairline: '100',
    thin: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    extrabold: '800',
    black: '900',
  },
  shadows: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
    none: 'none',
  },
  colors: {
    text: '#2d3748',
    background: '#fff',
    primary: '#07c',
    secondary: '#30c',
    muted: '#f6f6f6',
    success: '#9ae6b4',
    info: '#63b3ed',
    warning: '#faf089',
    danger: '#feb2b2',
    textMuted: '#718096',
    gray: [
      null,
      '#f7fafc',
      '#edf2f7',
      '#e2e8f0',
      '#cbd5e0',
      '#a0aec0',
      '#718096',
      '#4a5568',
      '#2d3748',
      '#1a202c',
    ],
    red: [
      null,
      '#fff5f5',
      '#fed7d7',
      '#feb2b2',
      '#fc8181',
      '#f56565',
      '#e53e3e',
      '#c53030',
      '#9b2c2c',
      '#742a2a',
    ],
    orange: [
      null,
      '#fffaf0',
      '#feebc8',
      '#fbd38d',
      '#f6ad55',
      '#ed8936',
      '#dd6b20',
      '#c05621',
      '#9c4221',
      '#7b341e',
    ],
    yellow: [
      null,
      '#fffff0',
      '#fefcbf',
      '#faf089',
      '#f6e05e',
      '#ecc94b',
      '#d69e2e',
      '#b7791f',
      '#975a16',
      '#744210',
    ],
    green: [
      null,
      '#f0fff4',
      '#c6f6d5',
      '#9ae6b4',
      '#68d391',
      '#48bb78',
      '#38a169',
      '#2f855a',
      '#276749',
      '#22543d',
    ],
    teal: [
      null,
      '#e6fffa',
      '#b2f5ea',
      '#81e6d9',
      '#4fd1c5',
      '#38b2ac',
      '#319795',
      '#2c7a7b',
      '#285e61',
      '#234e52',
    ],
    blue: [
      null,
      '#ebf8ff',
      '#bee3f8',
      '#90cdf4',
      '#63b3ed',
      '#4299e1',
      '#3182ce',
      '#2b6cb0',
      '#2c5282',
      '#2a4365',
      '#0c2556',
    ],
    indigo: [
      null,
      '#ebf4ff',
      '#c3dafe',
      '#a3bffa',
      '#7f9cf5',
      '#667eea',
      '#5a67d8',
      '#4c51bf',
      '#434190',
      '#3c366b',
    ],
    purple: [
      null,
      '#faf5ff',
      '#e9d8fd',
      '#d6bcfa',
      '#b794f4',
      '#9f7aea',
      '#805ad5',
      '#6b46c1',
      '#553c9a',
      '#44337a',
    ],
    pink: [
      null,
      '#fff5f7',
      '#fed7e2',
      '#fbb6ce',
      '#f687b3',
      '#ed64a6',
      '#d53f8c',
      '#b83280',
      '#97266d',
      '#702459',
    ],
  },
  buttons: {
    menuTrigger: {
      fontSize: 4,
      pt: 0,
      px: 5,
      lineHeight: '64px',
      cursor: 'pointer',
      transition: 'color 0.3s',
      ':hover': {
        color: 'primary',
      },
    },
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h1: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 5,
      m: 0,
      mb: 1,
      mt: 2,
    },
    h2: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 4,
      m: 0,
      mb: 1,
      mt: 2,
    },
    h3: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 3,
      m: 0,
      mb: 1,
      mt: 3,
    },
    h4: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 2,
      m: 0,
      mb: 1,
    },
    h5: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 1,
      m: 0,
      mb: 1,
    },
    h6: {
      color: 'text',
      fontFamily: 'heading',
      lineHeight: 'heading',
      fontWeight: 'heading',
      fontSize: 0,
      m: 0,
      mb: 2,
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body',
    },
    a: {
      color: 'primary',
    },
    pre: {
      fontFamily: 'monospace',
      overflowX: 'auto',
      code: {
        color: 'inherit',
      },
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid',
    },
    img: {
      maxWidth: '100%',
    },
  },
}
