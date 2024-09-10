import React from 'react'
interface WorkspaceIdPageProps{
    params:{
        workspaceId:string
    }
}

function WorkspaceIdPage({params}:WorkspaceIdPageProps) {
  return (
    <div>ID:{params.workspaceId}</div>
  )
}

export default WorkspaceIdPage