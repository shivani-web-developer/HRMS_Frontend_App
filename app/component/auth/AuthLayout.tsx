import Image from 'next/image';
import LoginForm from './LoginFor';
import SignupForm from './SignupForm';

export default function AuthLayout({
  children,
  mode,
  setMode,
}: {
  children: React.ReactNode;
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
}) {
  return (
    <div className="min-h-screen flex bg-[#FFF4E5]">
      
      {/* LEFT FORM PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
        <div className="w-full max-w-md px-8">
          <h1 className="text-3xl font-bold text-orange-500 mb-2">HRMS</h1>

          <div className="flex gap-6 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`font-semibold ${
                mode === 'login'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400'
              }`}
            >
              Sign In
            </button>
            {/* <button
              onClick={() => setMode('signup')}
              className={`font-semibold ${
                mode === 'signup'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400'
              }`}
            >
              Sign Up
            </button> */}
          </div>
          {/* 🔥 CONDITIONAL RENDERING */}
          {mode === 'login' && <LoginForm />}
          {mode === 'signup' && <SignupForm />}
        </div>
      </div>

      {/* RIGHT ILLUSTRATION */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#FFE0B2] relative">
        <Image
          src="/home/homePic.png" // put your image here
          alt="HRMS Illustration"
          fill
        />
      </div>
    </div>
  );
}
