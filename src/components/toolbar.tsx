interface ToolbarProps{
    isAuthor:boolean;
    isPending:boolean;
    handleEdit:()=> void;
    handleThread:()=> void;
    handleDelete:()=> void;
    handleReaction:(value:string)=> void
    hideThreadButton?:boolean
}

import React from 'react'
import { Button } from './ui/button';
import { MessageSquareTextIcon, Pencil, Smile, Trash } from 'lucide-react';
import Hint from './hint';
import { EmojiPopover } from './emoji-popover';

const Toolbar=({
    isAuthor,
    isPending,
    handleEdit,
    handleThread,
    handleDelete,
    handleReaction,
    hideThreadButton, 
}:ToolbarProps)=> {
  return (
    <div className="absolute top-0 right-5">
        <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white">
           <EmojiPopover
           hint='Add reaction'
           onEmojiSelect={(emoji)=>handleReaction(emoji.native)}
           >
            <Button
            variant='ghost'
            size="iconSm"
            disabled={isPending}
            >
                <Smile className='size-4'/>
            </Button>
            </EmojiPopover>
            {!hideThreadButton && (
                <Hint label='Message in Thread'>
                <Button
                variant='ghost'
                size="iconSm"
                disabled={isPending}
                >
                    <MessageSquareTextIcon className='size-4'/>
                </Button>
                </Hint>
            )}
            {isAuthor&&(
                <>
                <Hint label='Edit'>
                <Button
                variant='ghost'
                size="iconSm"
                disabled={isPending}
                >
                    <Pencil className='size-4'/>
                </Button>
                </Hint>
                <Hint label='Remove'>
                <Button
                variant='ghost'
                size="iconSm"
                disabled={isPending}
                >
                    <Trash className='size-4'/>
                </Button>
                </Hint>
                </>
            )}
        </div>
    </div>
  )
}

export default Toolbar