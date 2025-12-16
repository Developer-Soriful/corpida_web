import { Navigate } from "react-router";
import { useAuth } from "../context/UseAuth";
import Spinner from "../Components/Spinner";

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner text="Admin Loading....." />
    }

    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default AdminProtectedRoute
