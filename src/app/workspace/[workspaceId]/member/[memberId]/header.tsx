import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FaChevronDown } from 'react-icons/fa'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TrashIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useChannelId } from '@/hooks/use-channel-id'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useConfirm } from '@/hooks/use-confirm'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentMember } from '@/features/members/api/use-cuurent-member'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


interface HeaderProps{
    memberName?:string;
    memberImage?:string;
    onCLick?:()=> void
}
const Header=({memberImage,memberName,onCLick}:HeaderProps)=> {
    const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'This action connot be undone'
    )
    const workspaceId=useWorkspaceId();
    const channelId=useChannelId()
    const avatarFallback=memberName?.charAt(0).toUpperCase()
   
  return (
    
    
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
       <Button 
       variant='ghost'
       size='sm'
       onClick={onCLick}
       className='text-lg font-semibold px-2 overflow-hidden w-[200px] flex items-center justify-between'
       >
         <Avatar className="size-8  ">
                <AvatarImage  src={memberImage}/>
                <AvatarFallback>
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className=" truncate">{memberName}</span>
            <FaChevronDown className='size-3'/>

       </Button>
    </div>
    
  )
}

export default Header