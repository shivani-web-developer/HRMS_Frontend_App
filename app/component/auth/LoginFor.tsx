import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../redux/auth/authApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {toast} from 'react-toastify'
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/store/slice/userSlice';

type LoginInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginInputs>();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

 const onSubmit = async (data: LoginInputs) => {
    try {
      const res: any = await login(data).unwrap();
        console.log('res=',res)
      // ✅ store token
      document.cookie = `token=${res.accessToken}; path=/`;

      // ✅ dispatch user to redux store
      dispatch(
        setUser({
          empId:res.employee.id,
          firstName: res.employee.firstName,
          lastName: res.employee.lastName,
          email: res.employee.email,
          role: res.employee.role,
        })
      );

      toast.success('Login Successfully 🤗');

      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register('email', { required: true })}
        placeholder="Enter Email"
        className="w-full px-4 py-2 border rounded-md"
      />
      <div className='relative'>
      <input
        {...register('password', { required: true })}
        type={showPassword ? 'text': 'password'}
        placeholder="Enter Password"
        className="w-full px-4 py-2 border rounded-md"
      />
      <span
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </span>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-sm text-right text-gray-500 cursor-pointer">
        Forgot Password?
      </p>
    </form>
  );
}
