/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

//const tintColorLight = "#C65323";
//const tintColorDark = "#C65323";
const defaultColor = "#C65323";
const white = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: white,
    tint: defaultColor,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: defaultColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: defaultColor,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: defaultColor,
  },
};

export { defaultColor, white };
