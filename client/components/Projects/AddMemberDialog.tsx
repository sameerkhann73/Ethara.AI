import { useState } from 'react';
import { useAddMember } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function AddMemberDialog({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [role, setRole] = useState('MEMBER');
    
    const addMember = useAddMember();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMember.mutateAsync({ projectId, data: { userId, role } });
            setOpen(false);
            setUserId('');
            setRole('MEMBER');
        } catch (error) {
            console.error(error);
            alert("Failed to add member. Ensure the user ID is correct and you have Admin rights.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
                <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">User ID</label>
                        <Input 
                            required 
                            value={userId} 
                            onChange={e => setUserId(e.target.value)} 
                            placeholder="Enter user UUID" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <select 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="MEMBER">Member</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={addMember.isPending}>
                            {addMember.isPending ? 'Adding...' : 'Add Member'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
