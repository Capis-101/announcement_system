import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase"; // Adjust path if needed
import { doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext(); // ✅ Added export for AuthContext

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch role from Firestore
          const userRef = doc(db, "user", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            let role = userSnap.data().role;
            if (role) {
              role = role.toLowerCase().trim(); // Normalize to lowercase and trim
            }
            setUser({ ...firebaseUser, role }); // Merge Firebase user with role
            console.log("AuthContext: User role fetched and set to:", role);
          } else {
            setUser({ ...firebaseUser, role: null });
            console.log("AuthContext: No user data found in Firestore");
          }
        } catch (error) {
          console.error("AuthContext: Error fetching role:", error);
          setUser({ ...firebaseUser, role: null });
        }
      } else {
        setUser(null);
        console.log("AuthContext: No user logged in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Keep login/logout if needed for manual testing, but not required for Firebase flow
  const login = ({ email, role }) => {
    setUser({ email, role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);