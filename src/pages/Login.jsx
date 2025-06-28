import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiPost } from "../utils/apiClient";
import { fetchUser } from '../Redux/userSlice';
import { FaSpinner } from "react-icons/fa";

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formType, setFormType] = useState("signUp");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('ChatsToken', token);

      // Clean the URL (remove the token from the query params)
      const cleanUrl = window.location.origin + '/chat';
      window.history.replaceState({}, document.title, cleanUrl);

      // Navigate or load next page
      dispatch(fetchUser())
      navigate('/chat');
    }
  }, [navigate]);

  const isLogin = formType === "login";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    const { userId, email, password, confirmPassword } = userData;
    if (!email || !password || (!isLogin && (!userId || !confirmPassword))) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = isLogin
        ? { email: userData.email, password: userData.password }
        : { userId: userData.userId, email: userData.email, password: userData.password };

      const endpoint = isLogin ? "/auth/login" : "/auth/signup";

      const data = await apiPost(endpoint, payload);

      localStorage.setItem("ChatsToken", data.token);
      await dispatch(fetchUser());
      navigate("/chat");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-yellow-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/50">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-green-400 tracking-tight">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="userId"
              placeholder="Full Name"
              value={userData.userId}
              onChange={handleInputChange}
              className="w-full h-12 px-4 border border-b-blue-600 outline-none rounded-md bg-white"
              disabled={loading}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={userData.email}
            onChange={handleInputChange}
            className="w-full h-12 px-4 border border-b-blue-600 outline-none rounded-md bg-white"
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleInputChange}
            className="w-full h-12 px-4 border border-b-blue-600 outline-none rounded-md bg-white"
            disabled={loading}
          />

          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              className="w-full h-12 px-4 border border-b-blue-600 outline-none rounded-md bg-white"
              disabled={loading}
            />
          )}

          <button
            type="submit"
            className="w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-semibold shadow-lg disabled:bg-gray-400 flex items-center justify-center"
            disabled={
              loading ||
              (isLogin
                ? !userData.email || !userData.password
                : !userData.userId || !userData.email || !userData.password || !userData.confirmPassword)
            }
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-700">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => {
              setFormType(isLogin ? "signUp" : "login");
              setError("");
              setUserData({ userId: "", email: "", password: "", confirmPassword: "" });
            }}
            className="ml-1 text-blue-600 hover:underline font-semibold"
            disabled={loading}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
        <div className="w-full mt-4 grid items-start justify-center"> <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}> <button class="flex items-center gap-2 border px-4 py-2 rounded shadow">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" width="20" />
          <span>Continue with Google</span>
        </button></a>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
