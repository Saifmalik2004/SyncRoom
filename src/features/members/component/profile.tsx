import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMemberById } from "../api/use-get-member";
import { AlertTriangle, ChevronDownIcon, Loader, MailIcon, XIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProfileProps{
    memberId:Id<"members">;
    onClose:()=> void
}

export const Profile=({memberId,onClose}:ProfileProps)=>{
    const workspaceId=useWorkspaceId()
    
    const [LeaveDialog,confirmLeave]=useConfirm(
        'Leave workspaces',
        'Are you sure you want to leave this workspace? This cannot be undone.'
      );
      const [RemoveDialog,confirmfRemove]=useConfirm(
        'Remove member',
        'Are you sure you want to remove this member.'
      );
      const [UpdateDialog,confirmfUpdate]=useConfirm(
        'Change role',
        'Are you sure you want to change this member role.'
      );

    const {data:member,isLoading:isLoadingMember}=useGetMemberById({id:memberId});
    const {data:currentMember,isLoading:isLoadingCurrentMember}=useCurrentMember({workspaceId});
   

    const {mutate:updateMember,isPending:isUpdatingMember}=useUpdateMember();
    const {mutate:removeMember,isPending:isremovingMember}=useRemoveMember();
    const router=useRouter()
    const onRemove=async()=>{
        const ok = await confirmfRemove()
        if(!ok) return 
        removeMember({id:memberId},{
            onSuccess:()=>{
                toast.success("Member removed")
                onClose();
            },
            onError:()=>{
                toast.error("Failed to removed")
            }
        })
    }
    const onLeave=async()=>{
        const ok = await confirmLeave()
        if(!ok) return
        removeMember({id:memberId},{
            onSuccess:()=>{
                router.replace("/")
                toast.success("You left the workspace ")
                onClose();
            },
            onError:()=>{
                toast.error("Failed to leave the workspace")
            }
        })
    }

    const onUpdate=async(role:"admin"|"member")=>{
        const ok = await confirmfUpdate()
        if(!ok) return
        updateMember({id:memberId,role,workspaceId},{
            onSuccess:()=>{
                toast.success("Role changed")
                onClose();
            },
            onError:()=>{
                toast.error("Failed to change role")
            }
        })
    }
    const avatarFallback=member?.user.name?.charAt(0).toUpperCase()

    if(isLoadingMember || isLoadingCurrentMember ){
        return (
            <div className="h-full flex flex-col">
                <div className=" h-[49px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size='iconSm' variant='ghost'>
                        <XIcon className=" size-5 stroke-[1.5]"/>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                  <Loader className="size-5 animate-spin"/>
                
                </div>
            </div>
          )
      }  
      if(!member){
        return (
            <div className="h-full flex flex-col">
                <div className=" h-[49px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size='iconSm' variant='ghost'>
                        <XIcon className=" size-5 stroke-[1.5]"/>
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                  <AlertTriangle className="size-5"/>
                  <p className="text-sm text-muted-foreground">
                    Profile not found
                  </p>
                </div>
            </div>
          )
      }
    return (
    <>
    <LeaveDialog/>
    <UpdateDialog/>
    <RemoveDialog/>
        <div className="h-full flex flex-col">
                <div className=" h-[49px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size='iconSm' variant='ghost'>
                        <XIcon className=" size-5 stroke-[1.5]"/>
                    </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-4">
                <Avatar className="max-w-[256px] max-h-[256px] size-full  ">
                <AvatarImage  src={member?.user?.image}/>
                <AvatarFallback className="aspect-square text-8xl">
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
                </div>
                <div className="felx flex-col p-4">
                    <p className="text-2xl font-bold">{member.user.name}</p>
                </div>
                <Separator/>
                <div className="felx flex-col p-4">
                    <p className="text-sm font-bold mb-4">Contact information</p>
                    {currentMember?.role === "admin" && 
                    currentMember?._id !== memberId?(
                        <div className="flex items-center gap-2 mt-4 mb-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                            <Button variant="outline" className="w-full capitalize">
                            {member.role} <ChevronDownIcon className="size-4 ml-4"/>
                             </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuRadioGroup
                                value={member.role}
                                onValueChange={(role)=> onUpdate(role as "admin" | 'member')}
                                 >
                                    <DropdownMenuRadioItem value="admin">
                                        Admin
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="member">
                                        Member
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>

                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                        onClick={onRemove}
                        variant="outline"
                        className="w-full"
                        >
                            remove
                        </Button>
                        </div>
                    ): currentMember?._id === memberId &&
                    currentMember?.role !== "admin"?(
                        <div className="mt-4">
                            <Button onClick={onLeave} variant='outline' className="w-full">
                            Leave
                            </Button>
                        </div>
                    ):null
                    
                    }
                    <div className="flex items-center gap-2">
                        <div className="size-9 rounded-md bg-muted flex items-center justify-center">
                            <MailIcon className="size-4"/>

                        </div>
                        <div className="flex flex-col">
                            <p className="text-[13px] font-semibold text-muted-foreground">
                                Email Address
                            </p>
                            <Link 
                            className="text-sm hover:underline text-[#1264a3]"
                            href={`mailto:${member.user.email}`}>
                            {member.user.email}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            </>
    )
}