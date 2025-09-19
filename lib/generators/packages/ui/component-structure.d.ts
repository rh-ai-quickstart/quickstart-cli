import { ConfigTemplateParams } from './templates/config/index.js';
import { RouteTemplateParams } from './templates/routes/index.js';
import { ProjectConfig } from '../../../types/features';
export declare const baseDirectories: string[];
export interface ComponentDefinition {
    dir: string;
    file: string;
    generator: (params: ConfigTemplateParams & RouteTemplateParams) => string;
    passParams?: boolean;
    story?: {
        generator: (params: ConfigTemplateParams & RouteTemplateParams) => string;
        passParams?: boolean;
    };
    featureFlag?: keyof ProjectConfig['features'];
}
export declare const components: ComponentDefinition[];
