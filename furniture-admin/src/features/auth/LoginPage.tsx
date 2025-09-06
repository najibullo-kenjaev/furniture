// src/features/auth/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { login, type LoginDto } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function LoginPage() {
  const nav = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginDto>();
  const [showPwd, setShowPwd] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      localStorage.setItem('token', data.token);
      nav('/');
    },
    onError: () => toast.error('Неверные e-mail или пароль'),
  });

  return (
    <div className="min-h-screen grid place-items-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* subtle animated blobs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-300/30 rounded-full blur-3xl animate-pulse animation-delay-4000" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-black/5 p-8 md:p-10">
          <div className="flex flex-col items-center">
            {/* logo circle */}
            <div className="w-20 h-20 gradient-bg rounded-2xl grid place-items-center mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">Furniture</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit((d) => mutate(d))} className="mt-8 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
              <input
                {...register('email', { required: 'Укажите e-mail' })}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Пароль</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Введите пароль' })}
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pr-12 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                  {showPwd ? 'Скрыть' : 'Показать'}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl font-semibold text-white shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                
                </svg></span>
              ) : 'Войти'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">© Furniture Shop</p>
        </div>
      </div>
    </div>
  );
}