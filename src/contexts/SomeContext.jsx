import React, { createContext, useReducer } from 'react';

const SomeContext = createContext();

const initState = {
  clicked: false,
  progress: 0,
  targetOffset: 0,
  targetWidth: 0
};

function SomeContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <SomeContext.Provider value={{ state, actions, dispatch }}>
      {props.children}
    </SomeContext.Provider>
  );
}

const actions = {
  mouseDownProgress: (targetOffset, mouseOffset, targetWidth) => {
    return {
      type: 'MOUSE_DOWN_PROGRESS',
      payload: {
        targetOffset,
        mouseOffset,
        targetWidth
      }
    };
  },
  mouseUpProgress: () => {
    return {
      type: 'MOUSE_UP_PROGRESS'
    };
  },
  moveProgress: mouseOffset => {
    return {
      type: 'MOVE_PROGRESS',
      mouseOffset
    };
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'MOUSE_DOWN_PROGRESS':
      const { targetOffset, mouseOffset, targetWidth } = action.payload;
      return {
        ...state,
        clicked: true,
        targetOffset,
        targetWidth,
        progress: (Math.max(0, mouseOffset - targetOffset) / targetWidth) * 100
      };
    case 'MOUSE_UP_PROGRESS':
      if (state.clicked)
        return {
          ...state,
          clicked: false
        };

      return initState;
    case 'MOVE_PROGRESS':
      if (state.clicked) {
        const { mouseOffset } = action;
        return {
          ...state,
          progress:
            (Math.max(0, mouseOffset - state.targetOffset) /
              state.targetWidth) *
            100
        };
      }

      return initState;
  }
};

export { SomeContext };
export default SomeContextProvider;
