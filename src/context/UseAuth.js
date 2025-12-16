import { AuthContext } from "./AuthContext"
import { useContext } from "react"

export const useAuth = () => {
    const authContext = useContext(AuthContext)
    return authContext
}