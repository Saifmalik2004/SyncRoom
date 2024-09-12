'use client'
import Sidebar from "./component/sidebar";
import Toolbar from "./component/toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import WorkspaceSidebar from "./component/workspace-sidebar";

interface WorkspaceIdLayoutProps{
    children:React.ReactNode
}

 const WorkspaceIdLayout=({children}:WorkspaceIdLayoutProps)=> {
  return (
    <div className=" h-full">
      <Toolbar/>
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar/>
  
       <ResizablePanelGroup
        autoSaveId="cs-workspace-layout"
        direction="horizontal">
       <ResizablePanel defaultSize={20} minSize={11} className="bg-[#5E2C5F]">
      < WorkspaceSidebar/>
        
      </ResizablePanel>
      <ResizableHandle  withHandle/>
       <ResizablePanel minSize={20}>
       {children}
       </ResizablePanel>
      </ResizablePanelGroup>

      </div>
        
    </div>

  );
}
export default WorkspaceIdLayout
