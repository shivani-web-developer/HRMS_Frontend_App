import { useForm } from 'react-hook-form';
import { useSignupMutation } from '../../redux/auth/authApi';

type SignupInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default function SignupForm() {
  const { register, handleSubmit } = useForm<SignupInputs>();
  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit = async (data: SignupInputs) => {
    try {
      await signup(data).unwrap();
      alert('Account created successfully');
    } catch (err: any) {
      alert(err?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('firstName')} placeholder="First Name" className="input" />
      <input {...register('lastName')} placeholder="Last Name" className="input" />
      <input {...register('email')} placeholder="Email" className="input" />
      <input {...register('password')} type="password" placeholder="Password" className="input" />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-500 text-white py-2 rounded-md font-semibold"
      >
        {isLoading ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  );
}
