import { RouteTemplateParams } from '.';

export const generateIndexRoute = (params: RouteTemplateParams): string => {
  const { features } = params;
  const serviceIcons = [];
  if (features.api) serviceIcons.push('Server');
  if (features.db) serviceIcons.push('Database');

  return `import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '../components/hero/hero';
import { QuickStats } from '../components/quick-stats/quick-stats';
import { StatusPanel } from '../components/status-panel/status-panel';
import { Footer } from '../components/footer/footer';
import { useHealth } from '../hooks/health';
import { ${serviceIcons.join(', ')} } from 'lucide-react';

export const Route = createFileRoute('/' as any)({
  component: Index,
});

function Index() {
  const { data: healthData, isLoading } = useHealth();
  const services = [
    ${
      features.api
        ? `{
          id: 'api',
          name: 'API Service',
          description: 'Handles all API requests and business logic.',
          icon: <Server />,
          status: healthData?.find(s => s.name === 'API')?.status || 'unknown',
          region: 'us-east-1',
          lastCheck: new Date(),
        },`
        : ''
    }
    ${
      features.db
        ? `{
          id: 'db',
          name: 'Database',
          description: 'Stores and retrieves all application data.',
          icon: <Database />,
          status: healthData?.find(s => s.name === 'Database')?.status || 'unknown',
          region: 'us-east-1',
          lastCheck: new Date(),
        },`
        : ''
    }
  ];
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <main className="mx-auto max-w-7xl">
        <Hero />
        <QuickStats services={services} />
        <div className="mt-6">
          <StatusPanel services={services} isLoading={isLoading} />
        </div>
        <Footer />
      </main>
    </div>
  );
}`;
};
