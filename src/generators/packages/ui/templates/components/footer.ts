import { RouteTemplateParams } from '../routes';

export const generateFooterComponent = (params: RouteTemplateParams): string => {
  const { config } = params;
  return `import { Logo } from "../logo/logo";

export function Footer() {
  return (
    <footer className="mt-10">
      <div className="rounded-2xl border bg-card/60 p-4 text-xs text-muted-foreground backdrop-blur sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-medium text-foreground">
            Built with the <span className="font-bold">AI Kickstart CLI</span>
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 sm:mt-0">
          <a className="hover:underline" href="#">
            Docs
          </a>
          <a className="hover:underline" href="#">
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
