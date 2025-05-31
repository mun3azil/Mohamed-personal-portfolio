declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    va: (...args: unknown[]) => void;
  }
}

export {}; // This line is needed to make the file a module