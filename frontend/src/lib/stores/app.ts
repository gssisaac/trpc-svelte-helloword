import { writable } from 'svelte/store';

export interface Tool {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export interface Layer {
  id: string;
  name: string;
  type: 'frame' | 'rectangle' | 'circle' | 'text' | 'image' | 'input' | 'button';
  visible: boolean;
  locked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  placeholder?: string;
  borderRadius?: number;
  children?: Layer[];
}

export interface Page {
  id: string;
  name: string;
  layers: Layer[];
}

export interface AppState {
  selectedTool: string;
  selectedLayer: string | null;
  selectedLayers: string[];
  selectedPage: string;
  zoom: number;
  canvasOffset: { x: number; y: number };
  leftPanelWidth: number;
  rightPanelWidth: number;
  isDragging: boolean;
  isResizing: boolean;
  isSelecting: boolean;
  resizeDirection: string | null;
  dragStart: { x: number; y: number } | null;
  selectionStart: { x: number; y: number } | null;
  selectionEnd: { x: number; y: number } | null;
}

// App state store
export const appState = writable<AppState>({
  selectedTool: 'select',
  selectedLayer: null,
  selectedLayers: [],
  selectedPage: 'page-1',
  zoom: 1,
  canvasOffset: { x: 0, y: 0 },
  leftPanelWidth: 260,
  rightPanelWidth: 260,
  isDragging: false,
  isResizing: false,
  isSelecting: false,
  resizeDirection: null,
  dragStart: null,
  selectionStart: null,
  selectionEnd: null
});

// Tools store
export const tools = writable<Tool[]>([
  { id: 'select', name: 'Select', icon: 'MousePointer2', active: true },
  { id: 'frame', name: 'Frame', icon: 'Square', active: false },
  { id: 'rectangle', name: 'Rectangle', icon: 'RectangleHorizontal', active: false },
  { id: 'circle', name: 'Circle', icon: 'Circle', active: false },
  { id: 'text', name: 'Text', icon: 'Type', active: false },
  { id: 'input', name: 'Input', icon: 'AlignLeft', active: false },
  { id: 'button', name: 'Button', icon: 'RectangleHorizontal', active: false }
]);

// Pages store
export const pages = writable<Page[]>([
  {
    id: 'page-1',
    name: 'Login Form',
    layers: [
      // Background frame with all other layers as children
      {
        id: 'layer-1',
        name: 'Login Container',
        type: 'frame',
        visible: true,
        locked: false,
        x: 200,
        y: 100,
        width: 400,
        height: 500,
        fill: '#ffffff',
        stroke: '#e5e7eb',
        strokeWidth: 1,
        borderRadius: 12,
        children: [
          // Title (relative to container)
          {
            id: 'layer-2',
            name: 'Login Title',
            type: 'text',
            visible: true,
            locked: false,
            x: 100, // 300 - 200 (container x)
            y: 40,  // 140 - 100 (container y)
            width: 200,
            height: 40,
            text: 'Welcome Back',
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            fill: '#111827'
          },
          // Subtitle
          {
            id: 'layer-3',
            name: 'Login Subtitle',
            type: 'text',
            visible: true,
            locked: false,
            x: 60,  // 260 - 200
            y: 80,  // 180 - 100
            width: 280,
            height: 20,
            text: 'Please sign in to your account',
            fontSize: 14,
            textAlign: 'center',
            fill: '#6b7280'
          },
          // Email label
          {
            id: 'layer-4',
            name: 'Email Label',
            type: 'text',
            visible: true,
            locked: false,
            x: 40,  // 240 - 200
            y: 130, // 230 - 100
            width: 100,
            height: 20,
            text: 'Email',
            fontSize: 14,
            fontWeight: '500',
            fill: '#374151'
          },
          // Email input
          {
            id: 'layer-5',
            name: 'Email Input',
            type: 'input',
            visible: true,
            locked: false,
            x: 40,  // 240 - 200
            y: 155, // 255 - 100
            width: 320,
            height: 44,
            fill: '#ffffff',
            stroke: '#d1d5db',
            strokeWidth: 1,
            borderRadius: 6,
            placeholder: 'Enter your email'
          },
          // Password label
          {
            id: 'layer-6',
            name: 'Password Label',
            type: 'text',
            visible: true,
            locked: false,
            x: 40,  // 240 - 200
            y: 220, // 320 - 100
            width: 100,
            height: 20,
            text: 'Password',
            fontSize: 14,
            fontWeight: '500',
            fill: '#374151'
          },
          // Password input
          {
            id: 'layer-7',
            name: 'Password Input',
            type: 'input',
            visible: true,
            locked: false,
            x: 40,  // 240 - 200
            y: 245, // 345 - 100
            width: 320,
            height: 44,
            fill: '#ffffff',
            stroke: '#d1d5db',
            strokeWidth: 1,
            borderRadius: 6,
            placeholder: 'Enter your password'
          },
          // Forgot password link
          {
            id: 'layer-8',
            name: 'Forgot Password',
            type: 'text',
            visible: true,
            locked: false,
            x: 260, // 460 - 200
            y: 300, // 400 - 100
            width: 100,
            height: 20,
            text: 'Forgot password?',
            fontSize: 12,
            textAlign: 'right',
            fill: '#3b82f6'
          },
          // Login button
          {
            id: 'layer-9',
            name: 'Login Button',
            type: 'button',
            visible: true,
            locked: false,
            x: 40,  // 240 - 200
            y: 340, // 440 - 100
            width: 320,
            height: 44,
            fill: '#3b82f6',
            borderRadius: 6,
            text: 'Sign In',
            fontSize: 16,
            fontWeight: '500',
            textAlign: 'center'
          },
          // Sign up text
          {
            id: 'layer-10',
            name: 'Sign Up Text',
            type: 'text',
            visible: true,
            locked: false,
            x: 80,  // 280 - 200
            y: 410, // 510 - 100
            width: 240,
            height: 20,
            text: "Don't have an account? Sign up",
            fontSize: 14,
            textAlign: 'center',
            fill: '#6b7280'
          }
        ]
      }
    ]
  }
]);

// Computed store for current page layers
export const layers = writable<Layer[]>([]);

// Initialize layers with first page
pages.subscribe(pagesList => {
  if (pagesList.length > 0) {
    layers.set(pagesList[0].layers);
  }
});

// Helper functions
export const setSelectedTool = (toolId: string) => {
  tools.update(toolsList => 
    toolsList.map(tool => ({ ...tool, active: tool.id === toolId }))
  );
  appState.update(state => ({ ...state, selectedTool: toolId }));
};

export const setSelectedLayer = (layerId: string | null) => {
  appState.update(state => ({ ...state, selectedLayer: layerId, selectedLayers: layerId ? [layerId] : [] }));
};

export const setSelectedLayers = (layerIds: string[]) => {
  appState.update(state => ({ 
    ...state, 
    selectedLayers: layerIds,
    selectedLayer: layerIds.length === 1 ? layerIds[0] : null
  }));
};

export const addToSelection = (layerId: string) => {
  appState.update(state => {
    const newSelection = [...state.selectedLayers];
    if (!newSelection.includes(layerId)) {
      newSelection.push(layerId);
    }
    return {
      ...state,
      selectedLayers: newSelection,
      selectedLayer: newSelection.length === 1 ? newSelection[0] : null
    };
  });
};

export const removeFromSelection = (layerId: string) => {
  appState.update(state => {
    const newSelection = state.selectedLayers.filter(id => id !== layerId);
    return {
      ...state,
      selectedLayers: newSelection,
      selectedLayer: newSelection.length === 1 ? newSelection[0] : null
    };
  });
};

export const updateLayerPosition = (layerId: string, x: number, y: number) => {
  layers.update(layersList => 
    layersList.map(layer => 
      layer.id === layerId ? { ...layer, x, y } : layer
    )
  );
  
  // Also update in pages store
  pages.update(pagesList => 
    pagesList.map(page => ({
      ...page,
      layers: page.layers.map(layer => 
        layer.id === layerId ? { ...layer, x, y } : layer
      )
    }))
  );
};

export const updateLayerSize = (layerId: string, width: number, height: number) => {
  layers.update(layersList => 
    layersList.map(layer => 
      layer.id === layerId ? { ...layer, width, height } : layer
    )
  );
  
  // Also update in pages store
  pages.update(pagesList => 
    pagesList.map(page => ({
      ...page,
      layers: page.layers.map(layer => 
        layer.id === layerId ? { ...layer, width, height } : layer
      )
    }))
  );
};

export const setDragState = (isDragging: boolean, dragStart: { x: number; y: number } | null = null) => {
  appState.update(state => ({ ...state, isDragging, dragStart }));
};

export const setResizeState = (isResizing: boolean, resizeDirection: string | null = null, dragStart: { x: number; y: number } | null = null) => {
  appState.update(state => ({ ...state, isResizing, resizeDirection, dragStart }));
};

export const setSelectionState = (isSelecting: boolean, selectionStart: { x: number; y: number } | null = null, selectionEnd: { x: number; y: number } | null = null) => {
  appState.update(state => ({ ...state, isSelecting, selectionStart, selectionEnd }));
};

export const setZoom = (zoom: number) => {
  // Clamp zoom between 0.1x and 5x
  const clampedZoom = Math.max(0.1, Math.min(5, zoom));
  appState.update(state => ({ ...state, zoom: clampedZoom }));
};

export const setCanvasOffset = (x: number, y: number) => {
  appState.update(state => ({ ...state, canvasOffset: { x, y } }));
};

export const panCanvas = (deltaX: number, deltaY: number) => {
  appState.update(state => ({
    ...state,
    canvasOffset: {
      x: state.canvasOffset.x + deltaX,
      y: state.canvasOffset.y + deltaY
    }
  }));
};

// Convert screen coordinates to world coordinates
export const screenToWorld = (screenX: number, screenY: number, zoom: number, offset: { x: number; y: number }) => {
  return {
    x: (screenX - offset.x) / zoom,
    y: (screenY - offset.y) / zoom
  };
};

// Convert world coordinates to screen coordinates
export const worldToScreen = (worldX: number, worldY: number, zoom: number, offset: { x: number; y: number }) => {
  return {
    x: worldX * zoom + offset.x,
    y: worldY * zoom + offset.y
  };
};
