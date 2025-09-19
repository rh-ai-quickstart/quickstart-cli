export const generateSeparatorComponent = (): string => `import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "../../../lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }`;

export const generateSeparatorStory =
  (): string => `import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical'],
      },
      description: 'The orientation of the separator.',
    },
    decorative: {
      control: 'boolean',
      description: 'Whether the separator is decorative.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-40">
      <Separator {...args} />
    </div>
  ),
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  render: (args) => (
    <div className="h-20">
      <Separator {...args} />
    </div>
  ),
  args: {
    orientation: 'vertical',
  },
};

export const InCard: Story = {
  render: (args) => (
    <div className="w-64 border rounded-lg bg-card p-3 space-y-3">
      <div className="text-sm">Section A</div>
      <Separator {...args} />
      <div className="text-sm">Section B</div>
    </div>
  ),
  args: {
    orientation: 'horizontal',
  },
};`;
