declare module '*?as=srcset' {
    const srcset: string;
    export default srcset;
  }
  
  declare module '*?metadata' {
    const meta: { width: number; height: number; format: string };
    export default meta;
  }
  