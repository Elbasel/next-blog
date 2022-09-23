const { createContext } = require("react");

export const AuthContext = createContext({ user: null, username: null });
