export const generateStatCardComponent = (): string => `export function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "emerald" | "sky" | "violet";
}) {
  const line =
    tone === "emerald"
      ? "from-emerald-500/0 via-emerald-500/60 to-emerald-500/0"
      : tone === "sky"
      ? "from-sky-500/0 via-sky-500/60 to-sky-500/0"
      : "from-violet-500/0 via-violet-500/60 to-violet-500/0";

  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-4">
      <div
        className={\`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r \${line}\`}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {label}
        </span>
        <div className="h-2 w-2 rounded-full bg-muted" />
      </div>
      <div className="mt-2 text-lg font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}`;

export const generateStatCardStory =
  (): string => `import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './stat-card';

const meta: Meta<typeof StatCard> = {
  title: 'Components/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    tone: {
      control: {
        type: 'select',
        options: ['emerald', 'sky', 'violet'],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    tone: 'emerald',
  },
};

export const AllTones: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Emerald" value="42" tone="emerald" />
      <StatCard label="Sky" value="99" tone="sky" />
      <StatCard label="Violet" value="12" tone="violet" />
    </div>
  ),
};`;
