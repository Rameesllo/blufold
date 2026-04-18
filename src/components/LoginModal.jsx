import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Generates a deterministic secure password behind the scenes 
  const getHiddenPassword = (e) => `Blufold_Internal_${e.toLowerCase().trim()}_2026!`;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Initialize EmailJS with your public key one last time
    emailjs.init('l9N14ignaxDg72BK9');

    // Generate a random 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);

    const expiryTime = new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await emailjs.send(
        'service_js1gf4e',
        'template_k0okv27',
        {
          user_email: email, // This is the most common one
          to_email: email,   // Standard fallback
          email: email,      // General fallback
          passcode: code,
          time: expiryTime,
        }
      );
      setStep(2);
    } catch (err) {
      console.error('Email sending failed:', err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setError("Invalid OTP! Please check the code sent to your alert window.");
      return;
    }

    setIsLoading(true);
    setError('');

    const secretPassword = getHiddenPassword(email);

    try {
      // First attempt to log in normally
      await signInWithEmailAndPassword(auth, email.toLowerCase().trim(), secretPassword);
      handleSuccess();
    } catch (err) {
      // If the account does not exist, silently create it
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email.toLowerCase().trim(), secretPassword);
          handleSuccess();
        } catch (createErr) {
          console.error(createErr);
          setError('Failed to create account. Please try again.');
          setIsLoading(false);
        }
      } else {
        console.error(err);
        setError('Authentication failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      setIsLoading(false);
      setIsLoginModalOpen(false);
      navigate('/profile'); // Auto-redirect to the user page
      setTimeout(() => {
        setStep(1);
        setEmail('');
        setOtp('');
      }, 500);
    }, 500);
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setEmail('');
      setOtp('');
      setError('');
    }, 500);
  };

  if (!isLoginModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-brand-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#050810] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-blue/20 blur-[80px] pointer-events-none" />

          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-8 relative z-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
              {step === 1 ? 'Welcome Back' : 'Verify Identity'}
            </h2>
            <p className="text-brand-gray text-sm">
              {step === 1
                ? 'Enter your email address to securely log in or sign up.'
                : `We sent a security code to ${email}`}
            </p>
            {error && (
              <p className="mt-4 text-red-500 text-xs font-bold animate-pulse p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                ⚠ {error}
              </p>
            )}
          </div>

          <div className="relative z-10 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSendOtp}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white font-bold focus:outline-none focus:border-brand-blue transition-colors"
                        placeholder="you@email.com"
                        autoFocus
                      />
                      <Mail size={18} className="absolute left-4 text-white/20 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!email || isLoading}
                    className="w-full py-4 bg-brand-blue text-white font-black rounded-xl tracking-widest uppercase hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(41,98,255,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Sending OTP...</span>
                    ) : (
                      <>
                        Continue <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-brand-gray mt-4">
                    Passwordless secure entry powered by Blufold Engine.
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-[10px] font-black text-brand-gray uppercase tracking-widest mb-3">
                      One Time Password
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength="4"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black tracking-[0.5em] text-lg focus:outline-none focus:border-brand-blue transition-colors"
                        placeholder="••••"
                        autoFocus
                      />
                      <KeyRound size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otp.length < 4 || isLoading}
                    className="w-full py-4 bg-green-500 text-white font-black rounded-xl tracking-widest uppercase hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Verifying...</span>
                    ) : (
                      <>
                        <ShieldCheck size={18} /> Secure Login
                      </>
                    )}
                  </button>
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setError(''); }}
                      className="text-brand-blue text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Change Email Address
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
