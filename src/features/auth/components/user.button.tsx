'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "../api/useCurrentUser"
import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

export const UserButton=()=>{
     const {signOut}=useAuthActions()
    const {data,isLoading}=useCurrentUser();
    if(isLoading){
        return<Loader className="size-4 animate-spin text-muted-foreground"/>
    }

    if(!data){
        return null;
    }

    const{image,name}=data;
    const avatarFallback=name!.charAt(0).toUpperCase();
    

    return(
        <DropdownMenu>
  <DropdownMenuTrigger className="outline-none relative">
    <Avatar className=" rounded-md size-10 hover:opacity-75 transition">
        <AvatarImage className="rounded-md" alt={name} src={image} />
        <AvatarFallback className="rounded-md bg-sky-500 text-white">
                {avatarFallback}
        </AvatarFallback>
    </Avatar>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="center" side="right" className="w-60">
    <DropdownMenuItem className="h-10" onClick={()=>signOut() }>
        <LogOut className="size-4 mr-2"/>
        Log Out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

      
    )
}