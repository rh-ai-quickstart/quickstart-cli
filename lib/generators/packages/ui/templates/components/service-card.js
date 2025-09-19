export const generateServiceCardComponent = () => `import React from "react";
import {
  CheckCircle2,
  CircleHelp,
  AlertTriangle,
} from "lucide-react";
import type { Service } from "../../schemas/health";
import { getUptime, formatTime } from "../../lib/utils";
import { useState, useEffect } from "react";

const STATUS_META: Record<
  Service["status"],
  { label: string; color: string; dot: string; icon: React.ReactNode }
> = {
  healthy: {
    label: "Healthy",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  },
  degraded: {
    label: "Degraded",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-500",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  },
  down: {
    label: "Down",
    color:
      "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
    dot: "bg-rose-500",
    icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
  },
  unknown: {
    label: "Unknown",
    color:
      "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300",
    dot: "bg-slate-400",
    icon: <CircleHelp className="h-4 w-4 text-slate-400" />,
  },
};

export function ServiceCard({ 
  service, 
  isLoading, 
  error 
}: { 
  service: Service; 
  isLoading: boolean;
  error?: Error | null;
}) {
  const meta = STATUS_META[service.status];
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(getUptime(new Date(service.start_time)));
    }, 1000);
    return () => clearInterval(interval);
  }, [service.start_time]);

  const uptimeString = formatTime(uptime);

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-500/0 via-sky-500/60 to-fuchsia-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted ring-1 ring-border">
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              STATUS_META[service.status].icon
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {service.name}
              </span>
              <span className="rounded-md text-sm bg-muted px-1.5 py-0.5">
                v{service.version}
              </span>
              {isLoading ? (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse"></div>
                  Checking...
                </span>
              ) : (
                <span
                  className={\`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium \${meta.color}\`}
                >
                  <span
                    className={\`h-1.5 w-1.5 rounded-full \${meta.dot}\`}
                  ></span>
                  {meta.label}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {service.message}
            </span>
            {error && !isLoading && (
              <span className="text-xs text-destructive mt-1">
                {error.message}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {uptimeString}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}`;
export const generateServiceCardStory = () => `import type { Meta, StoryObj } from '@storybook/react';
import { ServiceCard } from './service-card';
import { Database, Server, Globe, Lock } from 'lucide-react';
import type { Service } from '../../schemas/health';

const meta: Meta<typeof ServiceCard> = {
  title: 'Components/ServiceCard',
  component: ServiceCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Healthy: Story = {
  args: {
    service: {
      name: 'Database',
      status: 'healthy',
      message: 'Primary database',
      version: '0.0.0',
      start_time: new Date().toISOString(),
    } as Service,
    isLoading: false,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <ServiceCard
        service={{
          name: 'Database',
          status: 'healthy',
          message: 'Primary PostgreSQL database',
          version: '0.0.0',
          start_time: new Date().toISOString(),
        } as Service}
        isLoading={false}
      />
      <ServiceCard
        service={{
          name: 'API Gateway',
          status: 'degraded',
          message: 'Main API endpoint',
          version: '0.0.0',
          start_time: new Date(Date.now() - 60000).toISOString(),
        } as Service}
        isLoading={false}
      />
      <ServiceCard
        service={{
          name: 'CDN',
          status: 'down',
          message: 'Content delivery network',
          version: '0.0.0',
          start_time: new Date(Date.now() - 300000).toISOString(),
        } as Service}
        isLoading={false}
      />
      <ServiceCard
        service={{
          name: 'Auth Service',
          status: 'healthy',
          message: 'User authentication',
          version: '0.0.0',
          start_time: new Date(Date.now() - 30000).toISOString(),
        } as Service}
        isLoading={false}
      />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    service: {
      name: 'Loading Service',
      status: 'healthy',
      message: 'Checking status...',
      version: '0.0.0',
      start_time: new Date().toISOString(),
    } as Service,
    isLoading: true,
  },
};`;
