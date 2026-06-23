/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export const ActiveButtonContext = createContext();

export const ActiveButtonProvider = ({ children }) => {
  const [activeButtonId, setActiveButtonId] = useState(null);

  return (
    <ActiveButtonContext.Provider value={{ activeButtonId, setActiveButtonId }}>
      {children}
    </ActiveButtonContext.Provider>
  );
};
export default ActiveButtonContext;
