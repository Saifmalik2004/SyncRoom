
import {atom,useAtom}from 'jotai'

const modalstate=atom(false)

export const useCreateChannelModal=()=>{
    return useAtom(modalstate)
}