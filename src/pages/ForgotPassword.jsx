import React, { useState } from 'react';
import { Mail, Lock, Key, ArrowRight, CheckCircle, Loader2, ChevronLeft } from 'lucide-react';

const mockApiService = {
  sendOtp: (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email.includes('@')) {
          console.log(`[API] OTP sent to ${email}: 123456`); 
          resolve({ success: true, message: "OTP sent to your email." });
        } else {
          reject({ success: false, message: "Please enter a valid email address." });
        }
      }, 1500);
    });
  },

  verifyOtp: (otp) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        
        if (otp === '123456') {
          resolve({ success: true, message: "OTP verified successfully." });
        } else {
          reject({ success: false, message: "Invalid OTP. Try '123456'." });
        }
      }, 1500);
    });
  },

  resetPassword: (newPassword) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[API] Password changed to: ${newPassword}`);
        resolve({ success: true, message: "Password reset successfully." });
      }, 1500);
    });
  }
};

const ForgotPasswordFlow = () => {
 
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const clearError = () => setError('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await mockApiService.sendOtp(email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await mockApiService.verifyOtp(otp);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await mockApiService.resetPassword(newPassword);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  
  const ActionButton = ({ text, onClick }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>{text} <ArrowRight className="ml-2 h-4 w-4" /></>}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center  p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            {step === 1 && <Mail className="h-6 w-6" />}
            {step === 2 && <Lock className="h-6 w-6" />}
            {step === 3 && <Key className="h-6 w-6" />}
            {step === 4 && <CheckCircle className="h-6 w-6" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Reset Password"}
            {step === 4 && "All Done!"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {step === 1 && "Enter your email to receive a verification code."}
            {step === 2 && `We sent a code to ${email}. (Try 123456)`}
            {step === 3 && "Create a secure new password for your account."}
            {step === 4 && "Your password has been successfully reset."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  className={inputClass}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <ActionButton text="Send Code" />
            <button 
              type="button" 
              className="w-full text-sm text-gray-500 hover:text-gray-800 flex items-center justify-center mt-4"
              onClick={() => alert("Go back to Login")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Login
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className={labelClass}>One-Time Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); clearError(); }}
                  className={`${inputClass} tracking-widest text-center text-lg`}
                  placeholder="1 2 3 4 5 6"
                  maxLength={6}
                  required
                />
              </div>
            </div>
            <ActionButton text="Verify Code" />
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-sm text-blue-600 hover:underline"
              >
                Change Email?
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className={labelClass}>New Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); clearError(); }}
                  className={inputClass}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                  className={inputClass}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <ActionButton text="Reset Password" />
          </form>
        )}

       
        {step === 4 && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
             <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-green-800 font-medium mb-2">Success!</h3>
                <p className="text-green-600 text-sm">You can now use your new password to log in to your account.</p>
             </div>
             <button
               onClick={() => {
                
                 setStep(1); 
                 setEmail(''); 
                 setOtp(''); 
                 setNewPassword(''); 
                 setConfirmPassword('');
               }}
               className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white font-semibold rounded-lg shadow-md transition-all"
             >
               Back to Login
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordFlow;