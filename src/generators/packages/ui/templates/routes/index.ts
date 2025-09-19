import { ProjectConfig } from '../../../../../types/features';

export interface RouteTemplateParams {
  config: ProjectConfig;
  features: ProjectConfig['features'];
}

export * from './index-route.js';
export * from './root-route.js';
export * from './route-tree.js';
