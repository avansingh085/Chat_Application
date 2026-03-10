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

      const cleanUrl = window.location.origin + '/chat';
      window.history.replaceState({}, document.title, cleanUrl);
      dispatch(fetchUser());
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
    <div className="flex w-full min-h-screen bg-white font-sans text-black">
      
     
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative z-10">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-black mb-3 tracking-tight">
              {isLogin ? "Welcome Back." : "Get Started."}
            </h2>
            <p className="text-gray-500 text-lg">
              {isLogin ? "Log in to pick up where you left off." : "Create a free account and start chatting."}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200 flex items-center gap-2"
              >
                <FiCheck className="flex-shrink-0 text-lg" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiUser className="text-lg" />
                </div>
                <input
                  type="text"
                  name="userId"
                  placeholder="Full Name"
                  value={userData.userId}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 text-black placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  disabled={loading}
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FiMail className="text-lg" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={userData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 text-black placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <FiLock className="text-lg" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 text-black placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                disabled={loading}
              />
              {!isLogin && userData.password && (
                <div className="mt-3">
                  <div className="flex gap-1.5 h-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full ${
                          passwordStrength >= i
                            ? i <= 2
                              ? "bg-black"
                              : i <= 4
                              ? "bg-gray-600"
                              : "bg-gray-900"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiLock className="text-lg" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 text-black placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none transition-all"
                  disabled={loading}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-gray-500 hover:text-black font-medium transition-colors hover:underline"
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
              className={`w-full py-4 px-4 mt-2 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                loading || (!isLogin && passwordStrength < 3)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin text-xl" />
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium tracking-widest text-xs">OR</span>
            </div>
          </div>

          <a 
            href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`} 
            className="w-full block"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white border border-gray-300 rounded-xl font-bold text-black hover:bg-gray-50 transition-all shadow-sm"
            >
              <FaGoogle className="text-black text-lg" />
              Continue with Google
            </motion.button>
          </a>

          <p className="text-center mt-8 text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={switchFormType}
              className="ml-2 text-black font-bold hover:underline transition-all"
              disabled={loading}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>

      
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden border-l border-gray-200">
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />

        <img
          src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop"
          alt="Abstract architecture background"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-90"
        />
        
        <div className="relative z-20 text-center px-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Connect. Create. Collaborate.
            </h2>
            <p className="text-gray-300 text-lg font-medium">
              Join a network of individuals experiencing seamless and secure communication.
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AuthForm;