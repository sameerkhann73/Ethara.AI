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

    console.log('ProfilePage rendering. User:', user, 'Loading:', loading, 'Profile:', profile);

    if (loading || isProfileLoading) return <div>Loading...</div>;
    // if (isError) return <div>Error loading profile</div>;

    if (!user) {
        if (typeof window !== 'undefined') router.push('/login');
        return null;
    }

    const onSubmit = (data: any) => {
        updateMutation.mutate(data);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Sidebar />
            <main className="pt-20 lg:pl-[270px] pr-6 pb-6">
                <div className="max-w-xl mx-auto p-6 bg-card rounded-lg shadow border border-border">
                    <h1 className="text-2xl font-bold mb-6">User Profile</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user.email} disabled />
                            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" {...register('name')} placeholder="John Doe" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatar_url">Avatar URL</Label>
                            <Input id="avatar_url" {...register('avatar_url')} placeholder="https://example.com/avatar.jpg" />
                        </div>

                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>

                        {updateMutation.isSuccess && <p className="text-green-500 text-sm">Profile updated successfully!</p>}
                        {updateMutation.isError && <p className="text-red-500 text-sm">Failed to update profile.</p>}
                    </form>
                </div>
            </main>
        </div>
    );
}
