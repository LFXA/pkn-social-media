import 'styled-components';
import { Theme } from './theme'; // adjust this path to where your theme.ts is

declare module 'styled-components' {
  // tell styled-components that your DefaultTheme is your Theme interface
  export interface DefaultTheme extends Theme {}
}