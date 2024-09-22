import React, { useState } from 'react';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { cn } from '@/lib/utils';
import Hint from './hint';
import { EmojiPopover } from './emoji-popover';
import { MdOutlineAddReaction } from 'react-icons/md';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage,AvatarFallback } from './ui/avatar';

import { useGetReactionsByMessageId } from '@/features/reactions/api/use-get-reaction-by-message-id';
import { Button } from './ui/button';

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  onChange: (value: string) => void;
  id: Id<'messages'>
}

function Reactions({ data, onChange, id }: ReactionsProps) {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: reactionsByMessageId } = useGetReactionsByMessageId({ messageId: id });

  const currentMemberId = currentMember?._id;
  
  // State to control dialog visibility
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className='flex items-center gap-1 mt-1 mb-1'>
      {data.map((reaction) => (
        <Hint key={reaction._id} label={`${reaction.count} ${reaction.count === 1 ? "person" : "people"} reacted with ${reaction.value}`}>
          <button
            onClick={() => setIsDialogOpen(true)} // Open dialog when button is clicked
            className={cn(
              "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex text-center gap-x-1",
              reaction.memberIds.includes(currentMemberId) && "bg-blue-100/70 border-blue-500 text-white"
            )}
          >
            {reaction.value}
            <span
              className={cn(
                "text-xs font-semibold text-muted-foreground",
                reaction.memberIds.includes(currentMemberId) && "text-blue-500"
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}

      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className='h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-800 flex items-center gap-x-1'>
          <MdOutlineAddReaction className='size-4' />
        </button>
      </EmojiPopover>

      {/* Dialog for displaying info */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reaction info</DialogTitle>
          </DialogHeader>
          <div className='h-32 flex flex-col  items-start gap-y-2 justify-center'>
            {reactionsByMessageId?.reactions?.map((reaction) => {
              const { user, value } = reaction; // Destructure user from reaction
              const avatarFallback = user?.name?.charAt(0).toUpperCase(); // Get the first letter of the user's name
              
              return (
                <button key={user.id} className='flex w-full border-2 p-1 border-black rounded-sm'>
                    
                    <Avatar>
                      <AvatarImage src={user.image} />
                      <AvatarFallback>
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" className='w-full flex  items-center justify-between'>
                        {user.name} <span className=''> {value} </span>
                    </Button>
                  
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Reactions;
