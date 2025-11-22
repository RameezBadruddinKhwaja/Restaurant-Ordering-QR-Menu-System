'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'RESTAURANT_OWNER']).default('CUSTOMER'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      toast.success('Registration successful!');

      if (response.user.role === 'RESTAURANT_OWNER') {
        router.push('/dashboard/restaurant');
      } else {
        router.push('/restaurants');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join us today and start your journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => register('role').onChange({ target: { value: 'CUSTOMER' } })}
              className={`p-4 border-2 rounded-lg text-center transition ${
                selectedRole === 'CUSTOMER'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">Customer</div>
              <div className="text-sm text-gray-600">Order food</div>
            </button>
            <button
              type="button"
              onClick={() => register('role').onChange({ target: { value: 'RESTAURANT_OWNER' } })}
              className={`p-4 border-2 rounded-lg text-center transition ${
                selectedRole === 'RESTAURANT_OWNER'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">Restaurant Owner</div>
              <div className="text-sm text-gray-600">Manage restaurant</div>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+92-300-1234567"
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-600">
              Must contain uppercase, lowercase, and number
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
