
import {atom,useAtom}from 'jotai'

const modalstate=atom(false)

export const useCreateWOrkspaceModal=()=>{
    return useAtom(modalstate)
}