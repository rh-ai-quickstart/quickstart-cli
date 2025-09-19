import { generateBadgeComponent, generateBadgeStory, generateButtonComponent, generateButtonStory, generateCardComponent, generateCardStory, generateDropdownMenuComponent, generateDropdownMenuStory, generateFooterComponent, generateFooterStory, generateHeroComponent, generateHeroStory, generateLogoComponent, generateLogoStory, generateModeToggle, generateModeToggleStory, generateQuickStatsComponent, generateQuickStatsStory, generateSeparatorComponent, generateSeparatorStory, generateServiceCardComponent, generateServiceCardStory, generateServiceListComponent, generateStatCardComponent, generateStatCardStory, generateStatusPanelComponent, generateThemeProvider, generateTooltipComponent, generateTooltipStory, } from './templates/components/index.js';
export const baseDirectories = [
    'src',
    'src/components',
    'src/lib',
    'src/routes',
    'src/schemas',
    'src/services',
    'src/hooks',
    'src/styles',
    'public',
    '.storybook',
];
export const components = [
    // Atoms
    {
        dir: 'atoms/card',
        file: 'card',
        generator: generateCardComponent,
        story: { generator: generateCardStory },
    },
    {
        dir: 'atoms/badge',
        file: 'badge',
        generator: generateBadgeComponent,
        story: { generator: generateBadgeStory },
    },
    {
        dir: 'atoms/button',
        file: 'button',
        generator: generateButtonComponent,
        story: { generator: generateButtonStory },
    },
    {
        dir: 'atoms/separator',
        file: 'separator',
        generator: generateSeparatorComponent,
        story: { generator: generateSeparatorStory },
    },
    {
        dir: 'atoms/tooltip',
        file: 'tooltip',
        generator: generateTooltipComponent,
        story: { generator: generateTooltipStory },
    },
    {
        dir: 'atoms/dropdown-menu',
        file: 'dropdown-menu',
        generator: generateDropdownMenuComponent,
        story: { generator: generateDropdownMenuStory },
    },
    // Molecules & Organisms
    {
        dir: 'logo',
        file: 'logo',
        generator: generateLogoComponent,
        story: { generator: generateLogoStory },
    },
    {
        dir: 'hero',
        file: 'hero',
        generator: generateHeroComponent,
        passParams: true,
        story: { generator: generateHeroStory },
    },
    {
        dir: 'quick-stats',
        file: 'quick-stats',
        generator: generateQuickStatsComponent,
        story: { generator: generateQuickStatsStory },
    },
    {
        dir: 'stat-card',
        file: 'stat-card',
        generator: generateStatCardComponent,
        story: { generator: generateStatCardStory },
    },
    {
        dir: 'status-panel',
        file: 'status-panel',
        generator: generateStatusPanelComponent,
        // story removed: rendered via cards elsewhere
    },
    {
        dir: 'service-card',
        file: 'service-card',
        generator: generateServiceCardComponent,
        story: { generator: generateServiceCardStory },
    },
    {
        dir: 'service-list',
        file: 'service-list',
        generator: generateServiceListComponent,
        // story removed: rendered via cards elsewhere
    },
    {
        dir: 'footer',
        file: 'footer',
        generator: generateFooterComponent,
        passParams: true,
        story: { generator: generateFooterStory },
    },
    {
        dir: 'theme-provider',
        file: 'theme-provider',
        generator: generateThemeProvider,
    },
    {
        dir: 'mode-toggle',
        file: 'mode-toggle',
        generator: generateModeToggle,
        story: { generator: generateModeToggleStory },
    },
];
