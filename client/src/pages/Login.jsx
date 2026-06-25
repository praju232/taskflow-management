import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';

const inputClass =
  'w-full px-2.5 py-2 text-sm rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [type, setType] = useState("password");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Signed in', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Sign in failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    
     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-6 py-10 relative overflow-hidden">     
     <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>

<div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl"></div> 

     <div className="w-full max-w-sm">
        <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Welcome Back!
        </h1>
        <p className="mt-3 text-slate-500">
Sign in to continue managing your tasks.
</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-3"
        >
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={type}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={inputClass + " pr-16"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 text-xs font-medium focus:outline-none"
                onClick={() => setType(type === "password" ? "text" : "password")}
                tabIndex={-1}
              >
                  {type === "password" ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.953 9.953 0 012.212-3.324M6.7 6.7a9.948 9.948 0 015.3-1.7c4.477 0 8.267 2.943 9.541 7a9.955 9.955 0 01-4.303 5.255M15 12a3 3 0 01-3 3m0-6a3 3 0 013 3m-7.5 7.5l15-15" />
                      </svg>
                    </>
                  )}
             
              </button>
            </div>
      
         
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-xs font-medium rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Continue'}
          </button>
          <div className="flex items-center my-6">

<div className="flex-1 border-t"></div>

<span className="px-3 text-xs text-slate-400">

OR

</span>

<div className="flex-1 border-t"></div>

</div>
  
        <p className="text-center text-xs text-zinc-500 mt-4">
        Don't have an account?{' '}
          <Link to="/register" className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline">
            Create one
          </Link>
        </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
