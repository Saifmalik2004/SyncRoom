import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from "@/components/ui/dialog"
import { useNewJoinCode } from "@/features/workspace/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";


import { CopyIcon, RefreshCcw, TrashIcon } from "lucide-react";
import { toast } from "sonner";

  
  interface InviteModalProps{
    open:boolean;
    setOpen:(open:boolean)=> void;
    name:string;
    joinCode:string
  }

const InviteModal=({open,setOpen,joinCode,name}:InviteModalProps)=> {
  const {mutate,isPending}=useNewJoinCode()
  const workspaceId=useWorkspaceId()
  const [ConfirmDialog,confirm]=useConfirm(
    'Are you sure?',
    'This will deactivate the current invite code and generate new one'
  )

  const handleNewCode=async()=>{
    const ok=await confirm();
        if(!ok) return
    mutate({workspaceId},{
      onSuccess(){
        toast.success("Invite code regenerated")
       
      },
      onError:()=>{
        toast.error("Failed to regenerate invite code")
      }
    })
  }
   const handleCopy=()=>{
    const inviteLink=`${window.location.origin}/join/${workspaceId}`
   
    navigator.clipboard
    .writeText(inviteLink)
    .then(()=> toast.success("Invite link copied to clipboard"))
   }
  
  
  

    return (
    <>
   <ConfirmDialog/>
    <Dialog open={open} onOpenChange={setOpen}>
       <DialogContent className="p-0 bg-gray-50 overflow-hidden">
           <DialogHeader className="p-4 border-b bg-white">
              <DialogTitle>
                Invite people to {name}
              </DialogTitle>
              <DialogDescription>
                Use the code below to invite people to your workspace
              </DialogDescription>
           </DialogHeader>
              <div className=" flex flex-col gap-y-4 items-center justify-center py-10">
                 <p className="text-4xl font-bold tracking-widest uppercase">
                 {joinCode}
                 </p>
                 <Button onClick={handleCopy} variant='ghost' size='sm'>
                    Copy Link
                    <CopyIcon className="size-4 ml-2"/>
                 </Button>

               </div>
               <div className="flex items-center justify-between w-full ">
                  <Button disabled={isPending} onClick={handleNewCode} variant='outline' className="mb-2 ml-2">
                        New code
                        <RefreshCcw className="size-4 ml-2"/>
                  </Button>
                  <DialogClose className="mb-2 mr-2" asChild>
                        <Button>Close</Button>
                  </DialogClose>
               </div>
       </DialogContent>
    </Dialog>
    </>

  )
}

export default InviteModal