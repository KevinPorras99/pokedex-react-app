import React, { createContext, useState, useContext } from 'react';

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [lastPage, setLastPage] = useState(1);

  return (
    <PaginationContext.Provider value={{ lastPage, setLastPage }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePaginationContext = () => useContext(PaginationContext);