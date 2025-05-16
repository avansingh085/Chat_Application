import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiPost } from "../utils/apiClient"; 
import {setChat,setUser} from '../Redux/userSlice';
const AuthForm = () => {
    const [formType, setFormType] = useState("signUp");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state) => state.Chat.isLogin);

    const [userData, setUserData] = useState({
        userId: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
        setError(""); 
    };

    const handleSignUp = async () => {
        const { userId, email, password, confirmPassword } = userData;
      console.log(userData)
        if (!userId || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const data = await apiPost("/sign_up", { userId, email, password });
            if (data.success) {
                dispatch(setUser(data.User));
                dispatch(setChat(data.Chat));
                localStorage.setItem("token", data.token);
                navigate("/chat");
                setError("");
            } else {
                setError(data.message || "Sign-up failed.");
            }
            console.log(data)
        } catch (error) {
            setError("An error occurred during sign-up. Please try again.");
            console.error("Sign-Up Error:", error);
        }
    };

    const handleLogin = async () => {
        const { email, password } = userData;

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            const data =await apiPost(`/login`,
               { email, password });
           
            if (data.success) {
              dispatch(setUser(data.User));
              dispatch(setChat(data.Chat));
              localStorage.setItem("token", data.token);
              
              navigate("/chat");
                setError("");
            } else {
                setError(data.message || "Invalid email or password.");
            }
        } catch (error) {
            setError("An error occurred during login. Please try again.");
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
  <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/50">
    <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
      {formType === "signUp" ? "Create an Account" : "Welcome Back"}
    </h2>

    {error && (
      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium">
        {error}
      </div>
    )}

  
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formType === "signUp" ? handleSignUp() : handleLogin();
      }}
      className="space-y-4"
    >
      {formType === "signUp" && (
        <input
          type="text"
          name="userId"
          placeholder="Full Name"
          className="w-full h-12 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          onChange={handleInputChange}
          value={userData.userId}
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        className="w-full h-12 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        onChange={handleInputChange}
        value={userData.email}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full h-12 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        onChange={handleInputChange}
        value={userData.password}
      />

      {formType === "signUp" && (
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full h-12 px-4 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          onChange={handleInputChange}
          value={userData.confirmPassword}
        />
      )}

      <button
        type="submit"
        className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all font-semibold shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={
          formType === "signUp"
            ? !userData.userId ||
              !userData.email ||
              !userData.password ||
              !userData.confirmPassword
            : !userData.email || !userData.password
        }
      >
        {formType === "signUp" ? "Sign Up" : "Login"}
      </button>
    </form>

    
    <p className="text-center text-sm mt-6 text-gray-700">
      {formType === "signUp" ? "Already have an account?" : "Don't have an account?"}
      <button
        className="ml-1 text-blue-600 hover:underline font-semibold"
        onClick={() => {
          setFormType(formType === "signUp" ? "login" : "signUp");
          setError("");
          setUserData({ userId: "", email: "", password: "", confirmPassword: "" });
        }}
      >
        {formType === "signUp" ? "Login" : "Sign Up"}
      </button>
    </p>
  </div>
</div>

    );
};

export default AuthForm;