import { useCurrentMember } from '@/features/members/api/use-cuurent-member'
import { useGetWorkspace } from '@/features/workspace/api/use-get-workspace'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, Loader, MessageSquareText, SendHorizontal } from 'lucide-react'
import React from 'react'
import WorkSpaceHeader from './workspace-header'
import { SidebarItem } from './sidebar-item'

const WorkspaceSidebar=()=> {
  const workspaceId=useWorkspaceId()

  const{data:member,isLoading:memberLoading}=useCurrentMember({workspaceId});
  const{data:workspace,isLoading:workspaceLoading}=useGetWorkspace({id:workspaceId});

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
        id='threads'
        />
        <SidebarItem
        label='Draft & Sent'
        icon={SendHorizontal}
        id='threads'
        />

      </div>
    </div>
  )
}

export default WorkspaceSidebar