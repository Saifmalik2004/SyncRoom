
import { Button } from '@/components/ui/button'
import { FaChevronDown } from 'react-icons/fa'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'


interface HeaderProps{
    memberName?:string;
    memberImage?:string;
    onCLick?:()=> void
}
const Header=({memberImage,memberName,onCLick}:HeaderProps)=> {
    
    
    const avatarFallback=memberName?.charAt(0).toUpperCase()
   
  return (
    
    
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
       <Button 
       variant='ghost'
       size='sm'
       onClick={onCLick}
       className='text-lg font-semibold px-2 overflow-hidden w-[200px] flex items-center justify-between'
       >
         <Avatar className="size-8  ">
                <AvatarImage  src={memberImage}/>
                <AvatarFallback>
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className=" truncate">{memberName}</span>
            <FaChevronDown className='size-3'/>

       </Button>
    </div>
    
  )
}

export default Header