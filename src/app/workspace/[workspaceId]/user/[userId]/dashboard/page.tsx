'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetWorkspaces } from '@/features/workspace/api/use-get-workspaces';
import { useCurrentUser } from '@/features/auth/api/useCurrentUser';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader } from 'lucide-react';
import { useUpdateUserName } from '@/features/auth/api/use-update-user-name';
import { toast } from 'sonner';
import { useGenerateUplaodUrl } from '@/features/uplaod/api/use-generate-upload-url';

// Define schema for validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const UserDashboard = () => {
  const { userId: paramUser } = useParams();
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const { data: channels, isLoading: channelLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: memberLoading } = useGetMembers({ workspaceId });
  const { data: workspaces, isLoading: workspaceLoading } = useGetWorkspaces();
  const avatarFallback = currentUser?.name!.charAt(0).toUpperCase();

  
  const imageElementRef = useRef<HTMLInputElement>(null);
  const { mutate: mutateName } = useUpdateUserName();
 

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentUser?.name || '',
    },
  });

  useEffect(() => {
    if (currentUser?.name) {
      form.setValue('name', currentUser.name);
    }
  }, [currentUser, form]);

  if (!currentUser || currentUser._id !== paramUser) {
    return <p>Unauthorized access</p>;
  }

  // Handle form submission for name update
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name } = values;
    mutateName({ name }, {
      onSuccess() {
        toast.success("User updated");
      },
      onError: () => {
        toast.error("Failed to update user");
      }
    });
  };



  

  if (channelLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-5 space-y-8 overflow-y-auto h-full messages-scrollbar">
      {/* Channels */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels?.map((channel) => (
            <div key={channel._id} className="p-4 border rounded-lg">
              <h3 className="text-lg font-bold">{channel.name}</h3>
            </div>
          ))}
        </div>
      </section>

      

      {/* Avatar and Change Image Button */}
      <Avatar className="rounded-md size-40 border hover:opacity-75 transition">
        <AvatarImage className="rounded-md" alt={currentUser.name} src={currentUser.image} />
        <AvatarFallback className="rounded-md bg-sky-500 text-white">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      
      {/* User Info */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="w-auto" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              Update name
            </Button>
          </form>
        </Form>
      </section>

      {/* Workspaces and Members Count */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Workspaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces?.map((workspace) => (
            <div key={workspace._id} className="p-4 border rounded-lg">
              <h3 className="text-lg font-bold">{workspace.name}</h3>
              <p>{members?.length} members</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
