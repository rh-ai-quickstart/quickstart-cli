import { RouteTemplateParams } from '../routes';

export const generateHeaderComponent = (params: RouteTemplateParams): string => {
  const { config } = params;
  return `import { Link } from '@tanstack/react-router';
import { Logo } from '../logo/logo';
import { ModeToggle } from '../mode-toggle/mode-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-bold">${config.name}</span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
`;
};

export const generateHeaderStory = (): string => `import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  render: () => (
    <div>
      <Header />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p className="mt-2 text-muted-foreground">This is the main content area below the header.</p>
      </div>
    </div>
  ),
};
`;

