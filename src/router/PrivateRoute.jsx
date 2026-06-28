import React from "react";
import useUsersState from "../@libs/hook/useUserState";
import BaseLoader from "../@base/BaseLoader";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const {
    isAdmin,
    users,
    loading: usersLoading,
    error: usersError,
  } = useUsersState();
  if (usersLoading) {
    return <BaseLoader className={"flex items-center justify-center"} />;
  } else if (usersError) {
    return <div>Error: {usersError.message}</div>;
  } else if (isAdmin) {
    return children;
  } else if (!isAdmin && users?.length > 0) {
    return <Navigate to="/" replace />;
  } 
};

export default PrivateRoute;
