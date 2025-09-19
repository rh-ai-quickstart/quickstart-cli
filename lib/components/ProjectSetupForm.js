import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Text, Spacer, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { z } from 'zod';
import { PACKAGES } from '../types/features.js';
const projectNameSchema = z
    .string()
    .min(2, 'Project name must be at least 2 characters')
    .max(50, 'Project name must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed')
    .refine((name) => !name.startsWith('-') && !name.endsWith('-'), 'Cannot start or end with hyphen');
export function ProjectSetupForm({ initialName, initialDescription, cliFeatures, onSubmit, onCancel, }) {
    const [step, setStep] = useState(initialName && initialDescription && cliFeatures ? 'confirm' :
        initialName && initialDescription ? 'packageManager' :
            initialName && cliFeatures ? 'description' :
                initialName ? 'description' :
                    'name');
    const [formData, setFormData] = useState({
        name: initialName || '',
        description: initialDescription || '',
        packageManager: 'pnpm', // Default to pnpm (recommended)
        features: cliFeatures ||
            PACKAGES.reduce((acc, pkg) => ({
                ...acc,
                [pkg.id]: pkg.defaultEnabled,
            }), {}),
    });
    const [nameInput, setNameInput] = useState(initialName || '');
    const [descriptionInput, setDescriptionInput] = useState(initialDescription || '');
    const [nameError, setNameError] = useState(null);
    const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
    const validateName = (name) => {
        try {
            projectNameSchema.parse(name.trim().toLowerCase());
            return null;
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return error.errors[0].message;
            }
            return 'Invalid project name';
        }
    };
    const packageChoices = PACKAGES.map((pkg) => ({
        label: `${formData.features[pkg.id] ? '✓' : '○'} ${pkg.name} - ${pkg.description}`,
        value: pkg.id,
    }));
    useInput((input, key) => {
        if (key.escape) {
            onCancel();
            return;
        }
        if (step === 'packages') {
            if (input === ' ') {
                const selectedPackage = PACKAGES[selectedPackageIndex];
                setFormData({
                    ...formData,
                    features: {
                        ...formData.features,
                        [selectedPackage.id]: !formData.features[selectedPackage.id],
                    },
                });
            }
            else if (key.upArrow) {
                setSelectedPackageIndex(Math.max(0, selectedPackageIndex - 1));
            }
            else if (key.downArrow) {
                setSelectedPackageIndex(Math.min(PACKAGES.length - 1, selectedPackageIndex + 1));
            }
            else if (key.return) {
                setStep('confirm');
            }
        }
        else if (step === 'confirm') {
            if (input === 'y' || key.return) {
                onSubmit({
                    name: formData.name,
                    description: formData.description || undefined,
                    packageManager: formData.packageManager,
                    features: formData.features,
                });
            }
            else if (input === 'n') {
                setStep('name');
            }
            else if (input === 'e') {
                setStep('packages');
            }
        }
    });
    const renderHeader = () => (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { color: "cyan", bold: true, children: "\uD83D\uDE80 Create AI Kickstart Project" }), _jsx(Text, { color: "gray", children: "Use arrow keys to navigate \u2022 Space to select \u2022 Enter to continue \u2022 Esc to cancel" })] }));
    const renderNameStep = () => (_jsxs(Box, { flexDirection: "column", children: [renderHeader(), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { children: "Project Name:" }), _jsx(TextInput, { value: nameInput, onChange: (value) => {
                            setNameInput(value);
                            const error = validateName(value);
                            setNameError(error);
                        }, onSubmit: (value) => {
                            const cleanName = value.trim().toLowerCase();
                            const error = validateName(cleanName);
                            if (!error) {
                                setFormData({ ...formData, name: cleanName });
                                setStep(initialDescription && cliFeatures ? 'confirm' :
                                    initialDescription ? 'packageManager' :
                                        'description');
                            }
                        }, placeholder: "my-awesome-app" }), nameError && _jsxs(Text, { color: "red", children: ["\u26A0 ", nameError] })] })] }));
    const renderDescriptionStep = () => (_jsxs(Box, { flexDirection: "column", children: [renderHeader(), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { children: "Project Description (optional):" }), _jsx(TextInput, { value: descriptionInput, onChange: setDescriptionInput, onSubmit: (value) => {
                            setFormData({ ...formData, description: value.trim() });
                            setStep(cliFeatures ? 'confirm' : 'packageManager');
                        }, placeholder: "A cool AI-powered application" }), _jsx(Text, { color: "gray", children: "Press Enter to continue" })] })] }));
    const renderPackageManagerStep = () => {
        const packageManagers = [
            {
                value: 'pnpm',
                label: 'pnpm (Recommended)',
                description: 'Fast, disk space efficient, great for monorepos',
            },
            {
                value: 'yarn',
                label: 'Yarn',
                description: 'Fast, reliable, and secure dependency management',
            },
            {
                value: 'npm',
                label: 'npm',
                description: 'Default Node.js package manager',
            },
        ];
        return (_jsxs(Box, { flexDirection: "column", children: [renderHeader(), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { children: "Choose Package Manager:" }), _jsx(Box, { marginTop: 1, children: _jsx(SelectInput, { items: packageManagers.map((pm) => ({
                                    label: pm.label,
                                    value: pm.value,
                                })), onSelect: (item) => {
                                    setFormData({ ...formData, packageManager: item.value });
                                    setStep(cliFeatures ? 'confirm' : 'packages');
                                }, initialIndex: packageManagers.findIndex((pm) => pm.value === formData.packageManager) }) }), _jsx(Box, { marginTop: 1, flexDirection: "column", children: packageManagers.map((pm) => (_jsxs(Text, { color: "gray", dimColor: true, children: [pm.value, ": ", pm.description] }, pm.value))) })] })] }));
    };
    const renderPackagesStep = () => (_jsxs(Box, { flexDirection: "column", children: [renderHeader(), _jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { children: "Select Packages:" }), _jsx(Box, { flexDirection: "column", marginTop: 1, children: PACKAGES.map((pkg, index) => (_jsxs(Box, { flexDirection: "row", children: [_jsxs(Text, { color: index === selectedPackageIndex ? 'cyan' : 'white', children: [index === selectedPackageIndex ? '❯ ' : '  ', formData.features[pkg.id] ? '✓' : '○', " ", pkg.name] }), _jsxs(Text, { color: "gray", children: [" - ", pkg.description] })] }, pkg.id))) }), _jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "gray", children: "Space to toggle \u2022 Enter when done" }) })] })] }));
    const renderConfirmStep = () => {
        const selectedPackages = PACKAGES.filter((pkg) => formData.features[pkg.id]);
        return (_jsxs(Box, { flexDirection: "column", children: [renderHeader(), _jsxs(Box, { flexDirection: "column", borderStyle: "round", borderColor: "cyan", padding: 1, children: [_jsx(Text, { color: "cyan", bold: true, children: "\uD83D\uDCCB Configuration Summary" }), _jsx(Spacer, {}), _jsxs(Text, { children: ["\uD83D\uDCC1 Project:", ' ', _jsx(Text, { color: "white", bold: true, children: formData.name })] }), formData.description && (_jsxs(Text, { children: ["\uD83D\uDCDD Description: ", _jsx(Text, { color: "gray", children: formData.description })] })), _jsx(Spacer, {}), _jsxs(Text, { children: ["\uD83D\uDCE6 Package Manager:", ' ', _jsx(Text, { color: "white", bold: true, children: formData.packageManager })] }), _jsx(Spacer, {}), _jsx(Text, { color: "cyan", children: "\uD83D\uDCE6 Selected Packages:" }), selectedPackages.map((pkg) => (_jsxs(Text, { children: [" \u2713 ", pkg.name] }, pkg.id))), _jsx(Spacer, {}), _jsxs(Text, { children: ["\uD83D\uDCC1 Output: ", _jsxs(Text, { color: "gray", children: ["./", formData.name] })] })] }), _jsx(Box, { marginTop: 1, children: _jsxs(Text, { children: [_jsx(Text, { color: "green", children: "y" }), "es to create \u2022", _jsx(Text, { color: "red", children: "n" }), "o to restart \u2022", _jsx(Text, { color: "yellow", children: "e" }), "dit packages"] }) })] }));
    };
    if (step === 'name')
        return renderNameStep();
    if (step === 'description')
        return renderDescriptionStep();
    if (step === 'packageManager')
        return renderPackageManagerStep();
    if (step === 'packages')
        return renderPackagesStep();
    if (step === 'confirm')
        return renderConfirmStep();
    return null;
}
