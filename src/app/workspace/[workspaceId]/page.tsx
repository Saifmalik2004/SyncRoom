'use client'

import { useGetWorkspace } from "@/features/workspace/api/use-get-workspace"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useParams } from "next/navigation"



function WorkspaceIdPage() {
  const workspaceId=useWorkspaceId()
  const {data}=useGetWorkspace({id:workspaceId})
  return (
    <div>ID:{JSON.stringify(data)}</div>
  )
}

export default WorkspaceIdPage