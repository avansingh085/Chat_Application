import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiPost } from "../utils/apiClient";
import { fetchUser } from '../Redux/userSlice';
import { FiUser, FiMail, FiLock, FiLoader, FiArrowRight, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

const AuthForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formType, setFormType] = useState("signUp");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('ChatsToken', token);
      const cleanUrl = window.location.origin + '/chat';
      window.history.replaceState({}, document.title, cleanUrl);
      dispatch(fetchUser())
      navigate('/chat');
    }
  }, [navigate, dispatch]);

  useEffect(() => {
    
    if (userData.password) {
      let strength = 0;
      if (userData.password.length > 5) strength += 1;
      if (userData.password.length > 8) strength += 1;
      if (/[A-Z]/.test(userData.password)) strength += 1;
      if (/[0-9]/.test(userData.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(userData.password)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [userData.password]);

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

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!isLogin && passwordStrength < 3) {
      setError("Password is too weak. Please use a stronger password.");
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
      setSuccess(isLogin ? "Login successful!" : "Account created successfully!");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await dispatch(fetchUser());
      navigate("/chat");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchFormType = () => {
    setFormType(isLogin ? "signUp" : "login");
    setError("");
    setSuccess("");
    setUserData({ userId: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? "Welcome Back" : "Join Us Today"}
          </h2>
          <p className="text-gray-500">
            {isLogin ? "Sign in to continue" : "Create your account to get started"}
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-100 flex items-center gap-2"
            >
              <FiCheck className="flex-shrink-0" />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiUser />
              </div>
              <input
                type="text"
                name="userId"
                placeholder="Full Name"
                value={userData.userId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={loading}
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiMail />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FiLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              disabled={loading}
            />
            {!isLogin && userData.password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        passwordStrength >= i
                          ? i <= 2
                            ? "bg-red-400"
                            : i <= 4
                            ? "bg-yellow-400"
                            : "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {passwordStrength < 3
                    ? "Weak password"
                    : passwordStrength < 5
                    ? "Moderate password"
                    : "Strong password"}
                </p>
              </div>
            )}
          </div>

          {!isLogin && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiLock />
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={userData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                disabled={loading}
              />
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={
              loading ||
              (isLogin
                ? !userData.email || !userData.password
                : !userData.userId || !userData.email || !userData.password || !userData.confirmPassword)
            }
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <FiArrowRight />
              </>
            )}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid gap-3">
          <a 
            href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`} 
            className="w-full"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              <FaGoogle className="text-red-500" />
              Google
            </motion.button>
          </a>
        </div>

        <p className="text-center text-sm mt-6 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={switchFormType}
            className="ml-1.5 text-blue-600 hover:text-blue-700 font-medium hover:underline"
            disabled={loading}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthForm;