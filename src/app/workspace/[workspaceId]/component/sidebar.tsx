import { UserButton } from '@/features/auth/components/user.button'
import React from 'react'
import WorkspaceSwitcher from './Workspace-switcher'
import SidebarButton from './sidebar-button'
import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentUser } from '@/features/auth/api/useCurrentUser'
import { useGetMembers } from '@/features/members/api/use-get-members'

const Sidebar=()=> {
    const pathname=usePathname()
    const workspaceId=useWorkspaceId();
    const {data:members}=useGetMembers({workspaceId})
    const {data:user,}=useCurrentUser();
    const userId=user?._id
    const id = members?.[0]?._id;
  return (
    <aside className='w-[70px] h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900 to-pink-900 flex flex-col gap-y-4 items-center pt-[9px] pb-[4px]'>
        <WorkspaceSwitcher/>
        <SidebarButton icon={Home} label='Home' isActive={pathname.includes("/workspace")}/>
        <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <SidebarButton icon={MessagesSquare} label='Dms' isActive={pathname.includes("/member")} />
        </Link>
        <SidebarButton icon={Bell} label='Activity' />
        <Link href={`/workspace/${workspaceId}/user/${userId}/dashboard`}>
        <SidebarButton icon={MoreHorizontal} label='More' />
        </Link>
        <div className='
        flex flex-col items-center justify-center gap-y-1 mt-auto'>
            <UserButton/>
        </div>
    </aside>
  )
}

export default Sidebar