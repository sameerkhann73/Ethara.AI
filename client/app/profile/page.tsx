'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useUser, useUpdateUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Navbar } from '@/components/Layout/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const { data: profile, isLoading: isProfileLoading } = useUser();
    const updateMutation = useUpdateUser();
    const router = useRouter();

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: '',
            avatar_url: ''
        }
    });

    useEffect(() => {
        if (profile) {
            setValue('name', profile.name || '');
            setValue('avatar_url', profile.avatar_url || '');
        }
    }, [profile, setValue]);

    if (loading || isProfileLoading) return <div className="flex min-h-screen items-center justify-center text-slate-900 font-bold">Loading...</div>;

    if (!user) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const onSubmit = (data: any) => {
        updateMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Sidebar />
            <main className="pt-20 lg:pl-[270px] pr-6 pb-6">
                <div className="max-w-xl mx-auto p-8 border-2 border-gray-200 rounded-xl bg-white shadow-sm">
                    <h1 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight italic underline decoration-4 decoration-primary/20">USER PROFILE</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</Label>
                            <Input id="email" value={user.email} disabled className="bg-gray-100 border-2 font-bold text-slate-900" />
                            <p className="text-[10px] text-gray-400 font-medium">Your email is managed by your account provider.</p>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500">Display Name</Label>
                            <Input id="name" {...register('name')} placeholder="Your Full Name" className="border-2 font-bold text-slate-900" />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="avatar_url" className="text-xs font-bold uppercase tracking-widest text-gray-500">Avatar URL</Label>
                            <Input id="avatar_url" {...register('avatar_url')} placeholder="https://example.com/photo.jpg" className="border-2 font-bold text-slate-900" />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" disabled={updateMutation.isPending} className="w-full font-bold uppercase tracking-widest">
                                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                        {updateMutation.isSuccess && (
                            <div className="p-4 border-2 border-green-200 bg-green-50 text-green-700 rounded text-xs font-bold uppercase tracking-widest text-center">
                                Profile updated successfully!
                            </div>
                        )}
                        {updateMutation.isError && (
                            <div className="p-4 border-2 border-red-200 bg-red-50 text-red-700 rounded text-xs font-bold uppercase tracking-widest text-center">
                                Failed to update profile.
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
