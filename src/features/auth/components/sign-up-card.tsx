import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {FcGoogle} from 'react-icons/fc'
import {FaGithub} from 'react-icons/fa'
import { SignInFlow } from "../types"
import { useState } from "react"

interface SignUpCardProps{
    setState:(state:SignInFlow)=>void
}
export const SignUpCard=({setState}:SignUpCardProps)=>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    
    return(
        <Card className="w-full h-full p-8">
                <CardHeader>
                    <CardTitle>
                    Sign Up to continue
                    </CardTitle>
                    <CardDescription>
                    Use your email or another service to login
                   </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-5 px-0 pb-0">
                    <form className="space-y-2.5">
                            <Input 
                            value={email}
                            type="email"
                            placeholder="Email"
                            onChange={(e)=> setEmail(e.target.value)}
                            disabled={false}
                            required
                            />
                             <Input 
                            value={password}
                            type="password"
                            placeholder="Password"
                            onChange={(e)=> setPassword(e.target.value)}
                            disabled={false}
                            required
                            />
                            <Input 
                            value={confirmPassword}
                            type="password"
                            placeholder=" Confirm Password"
                            onChange={(e)=> setConfirmPassword(e.target.value)}
                            disabled={false}
                            required
                            />
                            <Button type="submit" className="w-full" size='lg' disabled={false}>
                                Continue
                            </Button>
                    </form>
                    <Separator/>
                    <div className="flex flex-col gap-y-2.5">
                         <Button
                         disabled={false}
                         onClick={()=>{}}
                         variant='outline'
                         size='lg'
                         className="w-full relative" 
                         >
                            <FcGoogle className="size-5 absolute top-2.5 left-2.5"/>
                            Continue with Google
                         </Button>
                         <Button
                         disabled={false}
                         onClick={()=>{}}
                         variant='outline'
                         size='lg'
                         className="w-full relative" 
                         >
                            <FaGithub className="size-5 absolute top-2.5 left-2.5"/>
                            Continue with Github
                         </Button>
                    </div>
                    <p className="text-sx text-muted-foreground">
                        Already have an account? <span onClick={()=>setState("signIn")} className="text-sky-700 hover:underline cursor-pointer"> Sign Up</span>
                    </p>
                </CardContent>
        </Card>
    )
}