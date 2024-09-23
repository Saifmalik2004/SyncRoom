import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspace/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizontal } from 'lucide-react'
import React from 'react'
import WorkSpaceHeader from './workspace-header'
import { SidebarItem } from './sidebar-item'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import WorkspaceSection from './workspace-section'
import { useGetMembers } from '@/features/members/api/use-get-members'
import { UserItem } from './user-item'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useChannelId } from '@/hooks/use-channel-id'
import { useMemberId } from '@/hooks/use-memberId-id'
import { useParams, useSearchParams } from 'next/navigation'


const WorkspaceSidebar=()=> {
  const params = useSearchParams()
  const parentMessageId=params.get("parentMessageId")
  const workspaceId=useWorkspaceId()
  const channelId=useChannelId()
  const memberId=useMemberId();



  const [_open,setOpen]=useCreateChannelModal()
  const{data:member,isLoading:memberLoading}=useCurrentMember({workspaceId});
  const{data:workspace,isLoading:workspaceLoading}=useGetWorkspace({id:workspaceId});
  const{data:channels,isLoading:channelsLoading}=useGetChannels({workspaceId});
  const{data:members,isLoading:membersLoading}=useGetMembers({workspaceId});
 
  if(workspaceLoading|| memberLoading){
    return(
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className='size-5 animate-spin text-white'/>
      </div>
    )
  }
  if(!workspace|| !member){
    return(
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className='size-5  text-white'/>
        <p className='text-white text-sm'>
          Workspace not found
        </p>
      </div>
    )
  }


  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full ">
     <WorkSpaceHeader isAdmin={member.role==='admin'} workspace={workspace}/>
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
        label='Threads'
        icon={MessageSquareText}
        variant={parentMessageId?'active':"default"}
        />
        <SidebarItem
        label='Draft & Sent'
        icon={SendHorizontal}
        />

      </div>
      <WorkspaceSection
       label="channels"
       hint='New channels'
       onNew={()=>setOpen(true)}
       >
        {channels?.map((item)=>(
         <SidebarItem
         key={item._id}
         label={item.name}
         icon={HashIcon}
         id={item._id}
         variant={channelId === item._id ?'active':"default"}
         />
       ))}
       </WorkspaceSection>
       <WorkspaceSection
       label="Direct Messages"
       hint='new Direct messages'
       onNew={()=>{}}
       >
       {members?.map((item)=> (
        <UserItem
        key={item._id}
        id={item._id}
        label={item.user.name}
        image={item.user.image}
        variant={item._id === memberId?"active" : "default"}
        />
       ))}
      </WorkspaceSection>
       
    </div>
  )
}

export default WorkspaceSidebar