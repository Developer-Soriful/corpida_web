import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import api from "../services/api"
import { toast } from "react-toastify"

const AuthProvider = ({ children }) => {
    // this is for state 
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check for existing token on mount and validate user
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (token) {
            // Validate token with server and get user data
            const validateToken = async () => {
                try {
                    const response = await api.get("/user/self/in")
                    // Handle nested response structure: {status, message, response: {data}}
                    const userData = response.response?.data || response.data
                    setUser(userData)
                } catch (error) {
                    // Token is invalid, remove it
                    localStorage.removeItem('authToken')
                    setUser(null)
                } finally {
                    setLoading(false)
                }
            }
            validateToken()
        } else {
            setLoading(false)
        }
    }, [])
    // this is for register user 
    const register = async (email, password, name, role) => {
        setLoading(true)
        // this is for user register pyload
        const payload = {
            email,
            password,
            name,
            role
        }
        try {
            const response = await api.post("/auth/register", payload)
            setUser(response.data)
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Registration failed")
            throw error
        } finally {
            setLoading(false)
        }
    }

    // this is for verify user
    const verifyUser = async (email, code) => {
        setLoading(true)
        try {
            const response = await api.post("/auth/verify-account", {
                email,
                code
            })
            toast.success("Account verified successfully!")
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed")
            throw error
        } finally {
            setLoading(false)
        }
    }
    // this is for signin user
    const signin = async (email, password) => {
        setLoading(true)
        try {
            const response = await api.post("/auth/login", {
                email,
                password
            })

            // API returns nested structure: {status, message, response: {data, tokens}}
            const userData = response.response?.data
            const tokens = response.response?.tokens

            if (!userData) {
                console.error("userData is undefined, response structure:", response)
                throw new Error("Invalid response structure from login API")
            }

            setUser(userData)

            // Store auth token from tokens object - correct path based on API structure
            if (tokens?.access?.token) {
                localStorage.setItem('authToken', tokens.access.token)
            }

            toast.success("Login successful!")
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed")
            throw error
        } finally {
            setLoading(false)
        }
    }
    // this is for refresh token 
    const refreshToken = async (refreshToken) => {
        setLoading(true)
        try {
            const response = await api.post("/auth/refresh-tokens", {
                refreshToken
            })
            toast.success("Token refreshed successfully!")
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Token refresh failed")
            throw error
        } finally {
            setLoading(false)
        }
    }
    // this is for forget password
    const forgetPassword = async (email) => {
        setLoading(true)
        try {
            const response = await api.post("/auth/forget-password", {
                email
            })
            toast.success("Password reset email sent!")
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send reset email")
            throw error
        } finally {
            setLoading(false)
        }
    }
    // this is for reset password 
    const resetPassword = async (email, otp, password) => {
        setLoading(true)
        try {
            const response = await api.post("/auth/reset-password", {
                email,
                otp,
                password
            })
            toast.success("Password reset successfully!")
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Password reset failed")
            throw error
        } finally {
            setLoading(false)
        }
    }
    // this is for change password 
    const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await api.post("/auth/change-password", {
                oldPassword,
                newPassword
            })
            toast.success("Password changed successfully!")
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Password change failed")
            throw error
        }
    }
    // this is for logout user 
    const logOut = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            // Only send refreshToken if it exists
            if (refreshToken) {
                await api.post("/auth/logout", {
                    refreshToken: refreshToken
                });
            }

            // Clear local storage regardless of API response
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            toast.success("Logged out successfully!");

            return { success: true };
        } catch (error) {
            // Still clear local storage on error to ensure user is logged out
            setUser(null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');

            // Show error but don't throw to prevent app crash
            toast.error(error?.response?.data?.message || "Logout completed");

            return { success: false, error: error.message };
        }
    }
    // this is for delete user 
    const deleteUser = async () => {
        try {
            const response = await api.delete("/auth/delete-me")
            setUser(null)
            localStorage.removeItem('authToken')
            localStorage.removeItem('refreshToken')
            toast.success("Account deleted successfully!")
            return response
        } catch (error) {
            toast.error(error?.response?.data?.message || "Account deletion failed")
            throw error
        }
    }
    const authContextValue = {
        register,
        verifyUser,
        signin,
        refreshToken,
        forgetPassword,
        resetPassword,
        changePassword,
        logOut,
        user,
        loading,
        deleteUser
    }
    return (
        <div>
            <AuthContext.Provider value={authContextValue}>
                {children}
            </AuthContext.Provider>
        </div>
    )
}

export default AuthProvider
