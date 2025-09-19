export const generateQuickStatsComponent =
  (): string => `import { StatCard } from "../stat-card/stat-card";

type Service = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "healthy" | "degraded" | "down" | "unknown";
  region?: string;
  endpoint?: string;
  port?: number;
  lastCheck?: Date;
  error?: string;
};

export function QuickStats({ services }: { services: Service[] }) {
  const healthyCount = services.filter(s => s.status === "healthy").length;
  const totalServices = services.length;
  const overallStatus = healthyCount === totalServices ? "Operational" : 
                       healthyCount > totalServices / 2 ? "Degraded" : "Down";
  const statusTone = healthyCount === totalServices ? "emerald" : 
                    healthyCount > totalServices / 2 ? "sky" : "violet";
  
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-3">
      <StatCard label="Overall Health" value={overallStatus} tone={statusTone} />
      <StatCard label="Services" value={\`\${totalServices} total\`} tone="sky" />
      <StatCard label="Healthy" value={\`\${healthyCount}/\${totalServices}\`} tone="emerald" />
    </section>
  );
}`;

export const generateQuickStatsStory =
  (): string => `import type { Meta, StoryObj } from '@storybook/react';
import { QuickStats } from './quick-stats';

const meta: Meta<typeof QuickStats> = {
  title: 'Components/QuickStats',
  component: QuickStats,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    services: [
      { id: '1', name: 'Service 1', status: 'healthy', description: '', icon: null },
      { id: '2', name: 'Service 2', status: 'healthy', description: '', icon: null },
      { id: '3', name: 'Service 3', status: 'degraded', description: '', icon: null },
    ],
  },
};

export const InDashboard: Story = {
  render: () => (
    <div className="p-6 bg-card border rounded-xl w-full max-w-3xl">
      <QuickStats services={[
        { id: '1', name: 'Service 1', status: 'healthy', description: '', icon: null },
        { id: '2', name: 'Service 2', status: 'healthy', description: '', icon: null },
        { id: '3', name: 'Service 3', status: 'degraded', description: '', icon: null },
      ]} />
    </div>
  ),
};`;
