import { createContext, useContext, useReducer } from "react";

import reducer from "../reducer/reducer";
const AppContext = createContext();

const initialstate = { user: null };

const Authcontext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialstate);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
const useGlobalContext = () => {
  return useContext(AppContext);
};
export { Authcontext, useGlobalContext };
