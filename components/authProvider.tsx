"use client";
import React, {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import nookies from "nookies";
import { User } from "firebase/auth";
import { fireAuth } from "./provider";

interface Props {
  children: React.ReactNode;
}

const AuthContext = createContext({
  user: null,
});

export const AuthProvider: FC<Props> = ({ children }) => {
  //

  const [user, setUser] = useState<User | any>(null);

  useEffect(() => {
    return fireAuth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.destroy(null, "token");
      } else {
        setUser(user);
        const token = await user.getIdToken();
        nookies.set(null, "token", token);
      }
    });
  }, []);

  const refreshToken = async () => {
    if (user) await user.getIdToken(true);
  };

  useEffect(() => {
    const intID = setInterval(refreshToken, 5 * 60 * 1000);
    return () => clearInterval(intID);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};