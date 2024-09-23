import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {FcGoogle} from 'react-icons/fc'
import {FaGithub} from 'react-icons/fa'
import { SignInFlow } from "../types"
import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react"

export const SignInCard=()=>{
    const { signIn } = useAuthActions();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
   const [pending, setPending] = useState(false)
   const onProviderSignIn =(value:"github"|"google")=>{
    setPending(true)
    signIn(value)
    .finally(()=>{
        setPending(false)
    })
   }
   
    return(
        <Card className="w-full h-full p-8 ">
                <CardHeader className="px-0 pt-0">
                    <CardTitle>
                    Login to continue
                    </CardTitle>
                    <CardDescription>
                    Use your google email or github to login
                   </CardDescription>
                </CardHeader>
                {!!error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                         <TriangleAlert className="size-4"/>
                         <p>{error}</p>
                    </div>
                )}
                
                <CardContent className="space-y-5 px-0 pb-0">
                    
                    <Separator/>
                    <div className="flex flex-col gap-y-2.5">
                         <Button
                         disabled={pending}
                         onClick={()=>onProviderSignIn('google')}
                         variant='outline'
                         size='lg'
                         className="w-full relative" 
                         >
                            <FcGoogle className="size-5 absolute  left-2.5"/>
                            Continue with Google
                         </Button>
                         <Button
                         disabled={pending}
                         onClick={() =>  onProviderSignIn("github")}
                         variant='outline'
                         size='lg'
                         className="w-full relative" 
                         >
                            <FaGithub className="size-5 absolute left-2.5"/>
                            Continue with Github
                         </Button>
                    </div>
                   
                </CardContent>
        </Card>
    )
}