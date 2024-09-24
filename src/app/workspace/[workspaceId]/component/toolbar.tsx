'use client'
import { Button } from '@/components/ui/button'
import { useGetWorkspace } from '@/features/workspace/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Info, Search } from 'lucide-react'
import React from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import { useGetMembers } from '@/features/members/api/use-get-members'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DialogDescription, DialogTitle } from '@/components/ui/dialog'

const Toolbar=()=> {
  const router=useRouter()
  const [open, setOpen] = React.useState(false)
    const workspaceId=useWorkspaceId();
    const{data}=useGetWorkspace({id:workspaceId})
    const {data:channels,}=useGetChannels({workspaceId})
    const {data:members,}=useGetMembers({workspaceId})
 const onMemberClick=(memberId:string)=>{
  setOpen(false)
 router.push(`/workspace/${workspaceId}/member/${memberId}`)
 }
 const onChannelClick=(channelId:string)=>{
  setOpen(false)
 router.push(`/workspace/${workspaceId}/channel/${channelId}`)
 }
  return (
    <nav className='bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900 to-pink-900 flex items-center justify-between h-10 p-1.5'>
        <div className="flex-1"/>
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
               <Button onClick={()=> setOpen(true)} size='sm' className='bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2'>
                  <Search className='size-4 text-white mr-2'/>
                  <span className='text-white text-xs'>
                    Search {data?.name}
                  </span>
               </Button>
               <CommandDialog open={open} onOpenChange={setOpen}>
                <DialogTitle className='my-2 mx-2'>
                  Search
                </DialogTitle>
                <DialogDescription className="mx-2 mb-2">
    Search channels and members in this workspace.
  </DialogDescription>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Channels">
            
          {channels?.map((channel)=>(
               <CommandItem key={channel._id} onSelect={()=> onChannelClick(channel._id)}>
               
                
               {channel.name}
              
             </CommandItem>
            ))}
          
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Members">
            {members?.map((member)=>(
               <CommandItem key={member._id} onSelect={()=> onMemberClick(member._id)}>

               {member.user.name}
              
             </CommandItem>
            ))}
            
            
            
          </CommandGroup>
        </CommandList>
      </CommandDialog>
            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button variant='transparent' size='iconSm'>
                    <Info className='size-5 text-white'/>
                </Button>
            </div>
    </nav>
  )
}

export default Toolbar