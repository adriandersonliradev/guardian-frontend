// src/context/AuthContext.tsx
import { createContext, useState, ReactNode, useContext } from "react";

interface User {
  name: string;
  email: string;
  admin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (user: { nome: string; email: string; admin: boolean }) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? true : false;
  });

  const login = (user: { nome: string; email: string; admin: boolean }) => {
    const { nome, email, admin } = user;
    setUser(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({ name: nome, email, admin })
      );
      return { name: nome, email, admin };
    });
    setIsLoggedIn(user.email !== undefined || user.email !== "");
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
