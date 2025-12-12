export const generateIndexRoute = (params) => {
    const { features } = params;
    const serviceIcons = ['Monitor'];
    if (features.api)
        serviceIcons.push('Server');
    if (features.db)
        serviceIcons.push('Database');
    return /* tsx */ `import { createFileRoute } from '@tanstack/react-router';
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
  // Footer is imported for consistency but rendered in root route
  void Footer;
  const { data: healthData, isLoading } = useHealth();
  const services = [
    {
      id: 'ui',
      name: 'UI',
      description: 'Frontend application interface.',
      icon: <Monitor />,
      status: healthData?.find(s => s.name === 'UI')?.status || 'unknown',
      region: 'us-east-1',
      lastCheck: new Date(),
    },
    ${features.api
        ? `{
          id: 'api',
          name: 'API Service',
          description: 'Handles all API requests and business logic.',
          icon: <Server />,
          status: healthData?.find(s => s.name === 'API')?.status || 'unknown',
          region: 'us-east-1',
          lastCheck: new Date(),
        },`
        : ''}
    ${features.db
        ? `{
          id: 'db',
          name: 'Database',
          description: 'Stores and retrieves all application data.',
          icon: <Database />,
          status: healthData?.find(s => s.name === 'Database')?.status || 'unknown',
          region: 'us-east-1',
          lastCheck: new Date(),
        },`
        : ''}
  ];
  
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <Hero />
        <QuickStats services={services} />
        <div className="mt-6">
          <StatusPanel services={services} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}`;
};
