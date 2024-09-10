'use client'

import { UserButton } from "@/features/auth/components/user.button";
import { useCreateWOrkspaceModal } from "@/features/workspace/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { Modals } from "@/components/modal";
import { CreateWorkspaceModal } from "@/features/workspace/components/create-workspace-modal";
import { useRouter } from "next/navigation";


export default function Home() {
 const {data,isLoading}=useGetWorkspaces()
 const workspaceId=useMemo(()=> data?.[0]?._id,[data])
 const [open,setOpen]=useCreateWOrkspaceModal()
 const router=useRouter()
 useEffect(() => {
   if(isLoading) return ;
 
   if(workspaceId){
    router.replace(`/workspace/${data}`)
  
   }else if(!open){
    setOpen(true)
   }
 }, [workspaceId,isLoading,open,setOpen,router])
 
  return (
   <div>
   
    <UserButton/>

   </div>
  );
}
