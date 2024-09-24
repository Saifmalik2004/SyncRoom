'use client'
import Sidebar from './component/sidebar';
import Toolbar from './component/toolbar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import WorkspaceSidebar from './component/workspace-sidebar';
import { usePanel } from '@/hooks/use-panel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import Thread from '@/features/messages/components/thread';
import { Profile } from '@/features/members/component/profile';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, profileMemberId, onCloseMessage } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  // Adjust the default sizes
  const mainPanelSize = showPanel ? 70 : 80; 
  const sidePanelSize = showPanel ? 30 : 20; 

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />

        <ResizablePanelGroup autoSaveId="cs-workspace-layout" direction="horizontal">
          <ResizablePanel 
            defaultSize={20} 
            minSize={2} 
            className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900 to-pink-800" 
            id="workspace-sidebar" // Provide unique ID
            order={1} // Order of panel
          >
            <WorkspaceSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel 
            minSize={2} 
            defaultSize={mainPanelSize} 
            id="main-content-panel" // Provide unique ID
            order={2} // Order of panel
          >
            {children}
          </ResizablePanel>

          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel 
                minSize={2} 
                defaultSize={sidePanelSize} 
                id="thread-or-profile-panel" // Provide unique ID
                order={3} // Order of panel
              >
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onCloseMessage}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<'members'>}
                    onClose={onCloseMessage}
                  />
                ) : (
                  <div className="flex h-full items-center justify-start">
                    <Loader className="size-5 animate-spin" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdLayout;