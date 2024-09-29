import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({
  adminRoute,
  children,
}: {
  adminRoute?: boolean;
  children: JSX.Element;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (adminRoute && !user.admin) {
    return <Navigate to="/documentos" />;
  }

  return children;
};

export default PrivateRoute;
