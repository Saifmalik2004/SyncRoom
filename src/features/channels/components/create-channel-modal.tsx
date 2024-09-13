
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useCreateChannel } from "../api/use-create-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const CreateChannelModal= ()=>{
  const workspaceId=useWorkspaceId()
    const [name, setName] = useState('')
    
    const [open,setOpen]=useCreateChannelModal();
    const router =useRouter()
    const {mutate,isPending}=useCreateChannel()

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
      const value =e.target.value.replace(/\s+/g, "-").toLowerCase()
      setName(value)
    }
    const handleClose=()=>{
        setOpen(false)
        setName('')
    }

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
      mutate({name,workspaceId},{
      onSuccess(id){
        toast.success("Channel created")
        // router.push(`/workspace/${id}`)
        handleClose()
      },

    });

  }
    return(

<Dialog open={open} onOpenChange={handleClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add a channel</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
        <Input
        value={name}
        placeholder="e.g. plan-budget "
        onChange={handleChange}
        disabled={isPending}
        required
        autoFocus
        minLength={3}
        maxLength={80}
        />
        <div className="flex justify-end">
            <Button disabled={isPending}>
              Create
            </Button>
        </div>

    </form>
  </DialogContent>
</Dialog>


    )
} 