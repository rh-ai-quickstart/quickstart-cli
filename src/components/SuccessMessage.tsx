import React from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

interface SuccessMessageProps {
  projectPath: string;
  projectName: string;
}

export function SuccessMessage({ projectPath, projectName }: SuccessMessageProps) {
  const { exit } = useApp();

  // Exit after render completes - message stays in terminal history
  React.useEffect(() => {
    exit();
  }, [exit]);

  return (
    <Box flexDirection="column" alignItems="center" paddingX={2}>
      <Gradient name="rainbow">
        <BigText text="Success!" font="block" />
      </Gradient>

      <Box flexDirection="column" borderStyle="round" borderColor="green" padding={1} width={60}>
        <Text color="gray">Your kickstart is ready!</Text>
        <Text>
          📁 Location: <Text color="cyan">{projectPath}</Text>
        </Text>

        <Box marginTop={1}>
          <Text color="green" bold>
            🚀 Next Steps:
          </Text>
        </Box>

        <Box flexDirection="column" marginTop={1}>
          <Box flexDirection="row" marginLeft={1}>
            <Text color="yellow">1.</Text>
            <Box marginLeft={1}>
              <Text>
                <Text color="cyan">cd</Text> <Text color="white">{projectName}</Text>
              </Text>
            </Box>
          </Box>
          <Box flexDirection="row" marginLeft={1}>
            <Text color="yellow">2.</Text>
            <Box marginLeft={1}>
              <Text>
                <Text color="cyan">pnpm</Text> <Text color="blue">dev</Text>
              </Text>
            </Box>
          </Box>
        </Box>

        <Box marginTop={1} borderStyle="single" borderColor="blue" paddingX={1}>
          <Box alignItems="flex-start" flexDirection="column">
            <Text color="blue" bold>
              💡 Quick Tips:
            </Text>
            <Text>
              • Check <Text color="cyan">README.md</Text>
            </Text>
            <Text>
              • <Text color="cyan">pnpm</Text> <Text color="blue">build</Text> for production
            </Text>
            <Text>
              • <Text color="cyan">pnpm</Text> <Text color="blue">test</Text> to run test suites
            </Text>
            <Text>
              • Customize in <Text color="cyan">packages/</Text>
            </Text>
          </Box>
        </Box>

        <Box marginTop={1}>
          <Text color="gray">
            Happy coding! 🚀 Visit https://github.com/your-org/ai-kickstart for docs.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
