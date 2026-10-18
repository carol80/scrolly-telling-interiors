import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { failed: boolean };

// A broken 3D scene should not blank the story. Without this,
// the whole page unmounts. The copy keeps working over a plain background.
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('3D scene failed to load; showing the story without it.', error);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
