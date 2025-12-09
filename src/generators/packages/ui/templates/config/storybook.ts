export const generateStorybookMain =
  (): string => /* typescript */ `import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-dark-mode"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;`;

export const generateStorybookManager =
  (): string => /* typescript */ `import { addons } from '@storybook/manager-api';
import { themes } from '@storybook/theming';

const darkTheme = { 
  ...themes.dark, 
  appBg: '#0a0a0a',
  appContentBg: '#0a0a0a',
  appBorderColor: '#27272a',
  textColor: '#fafafa',
  barBg: '#0a0a0a',
  barTextColor: '#fafafa',
  barSelectedColor: '#ffffff',
  inputBg: '#18181b',
  inputBorder: '#27272a',
  inputTextColor: '#fafafa',
  textMutedColor: '#a1a1aa',
  textInverseColor: '#09090b',
  brandTitleColor: '#fafafa',
  brandUrlColor: '#a1a1aa',
};

const lightTheme = { 
  ...themes.normal, 
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e4e4e7',
  textColor: '#09090b',
  barBg: '#ffffff',
  barTextColor: '#09090b',
  barSelectedColor: '#000000',
  inputBg: '#ffffff',
  inputBorder: '#e4e4e7',
  inputTextColor: '#09090b',
  textMutedColor: '#71717a',
  textInverseColor: '#ffffff',
  brandTitleColor: '#09090b',
  brandUrlColor: '#71717a',
};

// Function to update theme based on dark mode state
const updateTheme = () => {
  const stored = localStorage.getItem('sb-addon-themes-3');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const isDark = parsed.darkMode === true || parsed.darkMode === 'dark';
      addons.setConfig({
        theme: isDark ? darkTheme : lightTheme,
      });
    } catch {
      // Fallback to light theme if parsing fails
      addons.setConfig({ theme: lightTheme });
    }
  } else {
    addons.setConfig({ theme: lightTheme });
  }
};

// Set initial theme
updateTheme();

// Listen to dark mode changes from storybook-dark-mode addon
const channel = addons.getChannel();

// Listen for various events that might indicate theme changes
channel.on('storybook-dark-mode/update', updateTheme);
channel.on('DARK_MODE', updateTheme);
channel.on('UPDATE_DARK_MODE', updateTheme);

// Also watch for storage changes as a fallback
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'sb-addon-themes-3') {
      updateTheme();
    }
  });
  
  // Poll for changes as a fallback (check every 500ms)
  setInterval(updateTheme, 500);
}`;

export const generateStorybookPreview =
  (): string => /* typescript */ `import type { Preview } from "@storybook/react";
import React from 'react';
import '../src/styles/globals.css'
import { themes } from '@storybook/theming';
import { ThemeProvider } from '../src/components/theme-provider/theme-provider';

const darkTheme = { 
  ...themes.dark, 
  appBg: '#0a0a0a',
  appContentBg: '#0a0a0a',
  appBorderColor: '#27272a',
  textColor: '#fafafa',
  barBg: '#0a0a0a',
  barTextColor: '#fafafa',
  barSelectedColor: '#ffffff',
  inputBg: '#18181b',
  inputBorder: '#27272a',
  inputTextColor: '#fafafa',
  textMutedColor: '#a1a1aa',
  textInverseColor: '#09090b',
  brandTitleColor: '#fafafa',
  brandUrlColor: '#a1a1aa',
};

const lightTheme = { 
  ...themes.normal, 
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e4e4e7',
  textColor: '#09090b',
  barBg: '#ffffff',
  barTextColor: '#09090b',
  barSelectedColor: '#000000',
  inputBg: '#ffffff',
  inputBorder: '#e4e4e7',
  inputTextColor: '#09090b',
  textMutedColor: '#71717a',
  textInverseColor: '#ffffff',
  brandTitleColor: '#09090b',
  brandUrlColor: '#71717a',
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      dark: darkTheme,
      light: lightTheme,
      // Style both preview and docs UI
      stylePreview: true,
      darkClass: 'dark',
      lightClass: 'light',
      classTarget: 'html',
    },
    docs: {
      theme: lightTheme, // Initial theme, synced dynamically by manager.ts
    },
    backgrounds: {
      disable: true, // Disable the default backgrounds addon since we're using dark-mode
    },
  },
  decorators: [
    (Story, context) => {
      // Get the current theme from the storybook-dark-mode addon
      const darkModeGlobal = context.globals?.darkMode;
      const isDark = darkModeGlobal === true || darkModeGlobal === 'dark';
      
      // Apply theme class to document root for proper Tailwind dark mode
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
        document.documentElement.classList.toggle('light', !isDark);
      }


      return React.createElement(
        ThemeProvider,
        { defaultTheme: isDark ? 'dark' : 'light' },
        React.createElement(
          'div',
          { className: 'bg-background text-foreground p-4' },
          React.createElement(Story)
        )
      );
    },
  ],
};

export default preview;`;
