declare module 'ink-progress-bar' {
  import { FC } from 'react';

  interface ProgressBarProps {
    value: number;
    color?: string;
    character?: string;
    width?: number;
  }

  const ProgressBar: FC<ProgressBarProps>;
  export default ProgressBar;
}
