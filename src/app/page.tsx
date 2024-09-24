'use client'


import { useCreateWOrkspaceModal } from "@/features/workspace/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspace/api/use-get-workspaces";
import { useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";


export default function Home() {
 const {data,isLoading}=useGetWorkspaces()
 const workspaceId=useMemo(()=> data?.[0]?._id,[data])
 const [open,setOpen]=useCreateWOrkspaceModal()
 const router=useRouter()
 useEffect(() => {
   if(isLoading){
    return
   }
   if(workspaceId){
    router.replace(`/workspace/${workspaceId}`)
  
   }else if(!open){
    setOpen(true)
   }
 }, [workspaceId,isLoading,open,setOpen,router])
 
 if(isLoading || workspaceId){
  return(
    <div className="h-full flex flex-1 items-center justify-center  gap-2">
      <Loader className="size-6 animate-spin text-muted-foreground"/>
    </div>
  )
 
}
}


