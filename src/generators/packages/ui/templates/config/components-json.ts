import { ConfigTemplateParams } from './index.js';

export function generateComponentsJson(params: ConfigTemplateParams): string {
  const { config } = params;
  
  const componentsJson = {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": false,
    "tsx": true,
    "tailwind": {
      "config": "",
      "css": "src/styles/globals.css",
      "baseColor": "neutral",
      "cssVariables": true,
      "prefix": ""
    },
    "aliases": {
      "components": "@/components",
      "utils": "@/lib/utils",
      "ui": "@/components/atoms",
      "lib": "@/lib",
      "hooks": "@/hooks"
    },
    "iconLibrary": "lucide"
  };
  
  return JSON.stringify(componentsJson, null, 2);
}
