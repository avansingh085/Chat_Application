import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiPost } from "../utils/apiClient"; 
import {setChat,setUser} from '../Redux/globalSlice';
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
            const data = apiPost(`/login`,
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
        <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
                    {formType === "signUp" ? "Sign Up" : "Login"}
                </h2>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Form Fields */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    formType === "signUp" ? handleSignUp() : handleLogin();
                }}>
                    {formType === "signUp" && (
                        <div className="mb-4">
                            <input
                                type="text"
                                name="userId"
                                placeholder="Enter your name"
                                className="w-full h-12 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                onChange={handleInputChange}
                                value={userData.userId}
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full h-12 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            onChange={handleInputChange}
                            value={userData.email}
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="w-full h-12 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            onChange={handleInputChange}
                            value={userData.password}
                        />
                    </div>

                    {formType === "signUp" && (
                        <div className="mb-4">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                className="w-full h-12 px-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                onChange={handleInputChange}
                                value={userData.confirmPassword}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={formType === "signUp" && (!userData.userId || !userData.email || !userData.password || !userData.confirmPassword) ||
                                  formType === "login" && (!userData.email || !userData.password)}
                    >
                        {formType === "signUp" ? "Sign Up" : "Login"}
                    </button>
                </form>

                {/* Toggle Form Type */}
                <button
                    className="w-full h-12 mt-4 bg-gray-200 text-blue-600 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    onClick={() => {
                        setFormType(formType === "signUp" ? "login" : "signUp");
                        setError("");
                        setUserData({ userId: "", email: "", password: "", confirmPassword: "" });
                    }}
                >
                    {formType === "signUp"
                        ? "Already have an account? Login"
                        : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;