export const colors = {
  darkBlue: "#17212E",
  obxBlue: "#1D4E89",
  frost: "#EEF3F6",
  white: "#FFFFFF",
  orange: "#C75300",
  gold: "#FFB703",
  deepBlue: "#033F63",
  slate: "#5C6C80",
  grey: "#747D85",
} as const;

export type ColorToken = keyof typeof colors;

export const semanticColors = {
  bg: {
    default: colors.white,
    muted: colors.frost,
    inverse: colors.darkBlue,
    inverseAlt: colors.deepBlue,
  },
  text: {
    default: colors.darkBlue,
    muted: colors.slate,
    inverse: colors.white,
    headingOnDark: colors.gold,
    accent: colors.orange,
  },
  border: {
    default: colors.frost,
    inputDark: colors.slate,
  },
  accent: {
    primary: colors.obxBlue,
    secondary: colors.orange,
    onDark: colors.gold,
  },
} as const;
