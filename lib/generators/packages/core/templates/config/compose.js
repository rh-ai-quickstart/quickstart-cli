import { normalizeServiceName } from '../../../../utils/name-normalize.js';
import { generateDbService, generateDbVolume, } from '../../../db/templates/config/podman-compose.js';
/**
 * Generates the root-level compose.yml file with all containerized services
 */
export const generateCompose = (params) => {
    const { config } = params;
    const services = [];
    const volumes = [];
    // Add database service if enabled
    if (config.features.db) {
        const dbServiceName = normalizeServiceName(config.name, 'db');
        const dbParams = {
            config,
            features: config.features,
        };
        services.push(generateDbService(dbParams, dbServiceName));
        volumes.push(generateDbVolume(dbParams));
    }
    // Future: Add API service if enabled
    // if (config.features.api) {
    //   const apiServiceName = normalizeServiceName(config.name, 'api');
    //   services.push(generateApiService(...));
    // }
    // Future: Add UI service if enabled
    // if (config.features.ui) {
    //   const uiServiceName = normalizeServiceName(config.name, 'ui');
    //   services.push(generateUiService(...));
    // }
    // Only generate compose file if there are services to include
    if (services.length === 0) {
        return '';
    }
    return /* yaml */ `services:
${services.join('\n')}

volumes:
${volumes.join('\n')}
`;
};
