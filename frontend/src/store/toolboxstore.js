import { create } from 'zustand';
import { COLORS, TOOL_ITEMS } from '../constants';

const initialToolboxState = {
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
  },
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 32,
  },
};

const useToolboxStore = create((set) => ({
  // Global state object to hold styles for each tool
  toolboxState: initialToolboxState,

  // Update stroke color for a tool
  changeStroke: (tool, stroke) =>
    set((state) => {
      const updated = { ...state.toolboxState };
      updated[tool] = {
        ...updated[tool],
        stroke,
      };
      return { toolboxState: updated };
    }),

  // Update fill color for a tool
  changeFill: (tool, fill) =>
    set((state) => {
      const updated = { ...state.toolboxState };
      updated[tool] = {
        ...updated[tool],
        fill,
      };
      return { toolboxState: updated };
    }),

  changesize: (tool, size) =>
    set((state) => {
      const updated = { ...state.toolboxState };
      updated[tool] = {
        ...updated[tool],
        size,
      };
      return { toolboxState: updated };
    }),

  resetToolStyles: () => set({ toolboxState: initialToolboxState }),
}));

export default useToolboxStore;
