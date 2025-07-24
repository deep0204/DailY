import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { IContextType } from '@/types'
import { IUser } from '@/types'
import { getCurrentUser } from '@/lib/appwrite/api'
import { useNavigate } from 'react-router-dom'
import { set } from 'zod'

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: '',
}
const INITIAL_STATE = {
    user: INITIAL_USER,
    isAuthenticated: false,
    isLoading: false,
    setUser : ()=> {},
    setIsAuthenticated : ()=> {},
    checkAuthUser : async ()=> false as boolean,
}
const AuthContext = createContext<IContextType>(INITIAL_STATE)
const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<IUser>(INITIAL_USER)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();
            if(currentAccount){
                setUser({
                    id: currentAccount.$id,
                    name: currentAccount.name,
                    username: currentAccount.username,
                    email: currentAccount.email,
                    imageUrl: currentAccount.imageUrl,
                    bio: currentAccount.bio || '',
                });
                setIsAuthenticated(true);
                return true;
            }
            navigate('/sign-in');
            return false;
        } catch (error) {
            console.error("Error checking authentication:", error);
            return false;
        } finally{
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if(
            localStorage.getItem('cookieFallback')==='[]'
        ){
            navigate('/sign-in');
        }
        checkAuthUser();
    },[]);
    const value = {
        user,setUser,isAuthenticated,isLoading,setIsAuthenticated,checkAuthUser,
    }
  return (
    
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    
  )
}

export default AuthProvider
export const useAuthContext = () => useContext(AuthContext);