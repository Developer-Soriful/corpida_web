import { Navigate } from "react-router";
import { useAuth } from "../context/UseAuth";
import Spinner from "../Components/Spinner";

const TutorProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    // this is for when user not comming this time showing loading spinner 
    if (loading) {
        return <Spinner text="Teacher Loading....." />
    }
    // if teacher not login after that not allow access 
    if (!user || user.role !== 'teacher') {
        return <Navigate to="/login" replace />
    }
    // this is for user permission 
    return children;
}

export default TutorProtectedRoute