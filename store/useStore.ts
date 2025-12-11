import { create } from 'zustand';
import { AppPhase, GestureType } from '../types';

interface AppState {
  phase: AppPhase;
  gesture: GestureType;
  cameraEnabled: boolean;
  nebulaRotation: number;
  focusedPhotoIndex: number | null;
  
  setPhase: (phase: AppPhase) => void;
  setGesture: (gesture: GestureType) => void;
  toggleCamera: () => void;
  setNebulaRotation: (delta: number) => void;
  setFocusedPhoto: (index: number | null) => void;
}

export const useStore = create<AppState>((set) => ({
  phase: 'tree',
  gesture: 'None',
  cameraEnabled: false,
  nebulaRotation: 0,
  focusedPhotoIndex: null,

  setPhase: (phase) => set({ phase }),
  setGesture: (gesture) => set({ gesture }),
  toggleCamera: () => set((state) => ({ cameraEnabled: !state.cameraEnabled })),
  setNebulaRotation: (delta) => set((state) => ({ nebulaRotation: state.nebulaRotation + delta })),
  setFocusedPhoto: (index) => set({ focusedPhotoIndex: index }),
}));