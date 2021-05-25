const reducer = (state, action) => {
  if (action.type === "LOGIN") {
    return { user: action.payload, loginerror: null };
  }
  if (action.type === "LOGOUT") {
    return { user: null };
  }
  if (action.type === "LOGINERROR") {
    return {
      ...state,
      loginerror: "Something went wrong during login please retry",
    };
  }
  return state;
};

export default reducer;
