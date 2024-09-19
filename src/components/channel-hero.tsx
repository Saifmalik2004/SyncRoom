import {format } from'date-fns'

interface ChannelHeroProps{
    name:string;
    creationTime:number;
}

function ChannelHero({name,creationTime}:ChannelHeroProps) {
  return (
    <div className="mt-[88px] px-5 mb-4">
        <p className="text-2xl font-bold flex items-center mb-2">
            #{name}
        </p>
        <p className="font-normal text-slate-800 mb-4">
            This channel was created on {format(creationTime, "MMMM do, yyyy")}. This is very beginning of the <strong>{name}</strong> channel.
        </p>
    </div>
  )
}

export default ChannelHero