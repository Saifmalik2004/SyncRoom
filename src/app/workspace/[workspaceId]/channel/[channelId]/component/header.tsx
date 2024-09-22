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
import { useCurrentMember } from '@/features/members/api/use-current-member'


interface HeaderProps{
    name:string
}
const Header=({name}:HeaderProps)=> {
    const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirm(
        'Are you sure?',
        'This action connot be undone'
    )
    const workspaceId=useWorkspaceId();
    const channelId=useChannelId()
    const [value, setValue] = useState(name)
    const [editOpen, setEditOpen] = useState(false)

    const{data:member}=useCurrentMember({workspaceId});
    const {mutate:updateChannel,isPending:isUpdateChannel}=useUpdateChannel()
    
    const {mutate:removeChannel,isPending:isRemoveChannel}=useRemoveChannel()
  

    const handleEditOpen=(value:boolean)=>{

   if( member?.role !== "admin") return

   setEditOpen(value)
    };
  
    const handleRemove=async()=>{
    const ok=await confirm()

    if(!ok) return

    removeChannel({
        id:channelId
       
    },{
        onSuccess(){
            router.replace(`/workspace/${workspaceId}`)
            toast.success("Channel remove")

            
          },
          onError:()=>{
            toast.error("Failed to remove channel")
          }
    })

  }
  const handleEdit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    updateChannel({
        id:channelId,
        name:value
    },{
        onSuccess(){
            toast.success("Channel updated")
            setEditOpen(false)
          },
          onError:()=>{
            toast.error("Failed to update channel")
          }
    })

  }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const value =e.target.value.replace(/\s+/g, "-").toLowerCase()
        setValue(value)
      }
  return (
    <>
    <ConfirmDialog/>
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
        <Dialog>
            <DialogTrigger asChild>
            <Button
              variant='ghost'
              className='text-lg font-semibold px-2 overflow-hidden w-auto'
              >
            <span className='truncate'># {name}</span>
            <FaChevronDown className='size-2.5 ml-2'/>
        </Button>
            </DialogTrigger>
            <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                <DialogHeader className='p-4 border-b bg-white'>
                    <DialogTitle>
                        # {name}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col px-4 pb-4 gap-y-2">
                     <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                     <DialogTrigger asChild>
                     <div className="px-5 py-4 bg-white  rounded-lg cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm  font-semibold">
                                Channel name
                            </p>
                            {member?.role === "admin" && (
                                <p className="text-sm  text-[#1264a3] hover:underline font-semibold">
                                  Edit
                                </p>
                            )}
                            

                        </div>
                        <p className='text-sm'> # {name}</p>

                     </div>
                     </DialogTrigger>
                     <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Rename this channel
                </DialogTitle>
            </DialogHeader>
            <form className="space-y-4 " onSubmit={handleEdit}>
                <Input
                value={value}
                disabled={isUpdateChannel}
                onChange={handleChange}
                required
                autoFocus
                minLength={3}
                maxLength={80}
                placeholder="Chennel name e.g. 'plan-budget'"

                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline' disabled={isUpdateChannel}>
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={isUpdateChannel}>
                        Save
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
                     </Dialog>
                     {member?.role === "admin" && (
                                <button
                                disabled={isRemoveChannel}
                                onClick={handleRemove}
                               className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-600'
                               >
                                  <TrashIcon className='size-4'/>
                                  <p className="text-sm font-semibold">
                                      Delete channel
                                  </p>
                               </button>
                            )}
                     
                </div>

            </DialogContent>
        </Dialog>
    </div>
    </>
  )
}

export default Header