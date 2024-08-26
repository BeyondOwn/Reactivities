const Color = require("color");
export default function generateColorVariants(color:any) {
  return {
    DEFAULT: color,
    50: Color(color).lighten(0.5).hex(),
    100: Color(color).lighten(0.4).hex(),
    200: Color(color).lighten(0.3).hex(),
    300: Color(color).lighten(0.2).hex(),
    400: Color(color).lighten(0.1).hex(),
    500: color,
    600: Color(color).darken(0.1).hex(),
    700: Color(color).darken(0.2).hex(),
    800: Color(color).darken(0.3).hex(),
    900: Color(color).darken(0.4).hex(),
  };
}