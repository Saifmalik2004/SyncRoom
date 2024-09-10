
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useCreateWOrkspaceModal } from "../store/use-create-workspace-modal"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal= ()=>{
    const [name, setName] = useState('')
    
    const [open,setOpen]=useCreateWOrkspaceModal();
    const router =useRouter()
    const {mutate,isPending}=useCreateWorkspace()

    const handleClose=()=>{
        setOpen(false)
        setName('')
    }

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
      mutate({name},{
      onSuccess(id){
        toast.success("Workspace created")
        router.push(`/workspace/${id}`)
        handleClose()
      },

    });

  }
    return(

<Dialog open={open} onOpenChange={handleClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a workspace</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
        <Input
        value={name}
        placeholder="Workspace name e.g. 'Work', 'Personal', 'Home' "
        onChange={(e)=> setName(e.target.value)}
        disabled={isPending}
        required
        />
        <div className="flex justify-end">
            <Button disabled={false}>
              Create
            </Button>
        </div>

    </form>
  </DialogContent>
</Dialog>


    )
} 