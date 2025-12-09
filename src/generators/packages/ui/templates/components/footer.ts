import { RouteTemplateParams } from '../routes';

export const generateFooterComponent = (params: RouteTemplateParams): string => {
  const { config } = params;
  return `import { Logo } from "../logo/logo";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <div className="flex items-center gap-0">
          <Logo />
          <span className="font-medium text-foreground">
            Built with the <span className="font-bold">AI QuickStart CLI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">·</span>
          <a className="hover:underline" href="https://github.com/TheiaSurette/quickstart-cli" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}`;
};

export const generateFooterStory =
  (): string => `import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FullWidth: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  render: () => (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p className="mt-2 text-muted-foreground">This is the main content area.</p>
      </div>
      <Footer />
    </div>
  ),
};`;
