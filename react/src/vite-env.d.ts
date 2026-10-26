/// <reference types="vite/client" />
/// <reference types="jest" />

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
