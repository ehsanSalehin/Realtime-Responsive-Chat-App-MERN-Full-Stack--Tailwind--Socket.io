import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Background from "../../assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {apiClient} from "../../lib/api-client"
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/Utils/constants"; // Added LOGIN_ROUTE
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

function Auth() {
  const navigate = useNavigate()
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("") 
  const [confirmPassword, setConfirmPassword] = useState("") 
  
  const validateSignUp = ()=>{
    if(!email.length){
      toast.error("Email is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password Is Required");
      return false;
    }
    if(password != confirmPassword){
      toast.error("Password Is Not The Same As Confirm Password");
      return false;
    }
    return true;
  }

  const validateLogin =()=>{
    if(!email.length){
      toast.error("Email is Required");
      return false;
    }
    if(!password.length){
      toast.error("Password Is Required");
      return false;
    }
    return true;
  }

  const handleLogin = async()=>{
    if(validateLogin()){
      const res = await apiClient.post(LOGIN_ROUTE,{email, password},{withCredentials:true});
      if(res.data.user.id){
        setUserInfo(res.data.user);
        if(res.data.user.profileSetup)navigate('/chat')
        else navigate("/profile"); 
      }
      console.log({res});
    }
  };
  
  const handleSignUp = async()=>{
    if(validateSignUp()){
      const res =  await apiClient.post(SIGNUP_ROUTE,{email, password},{withCredentials:true});
      if(res.status ===201){
        navigate("/profile");
      }
      console.log({res});
    }
  };

  return (
    <div className='h-screen w-screen flex items-center justify-center'>
      <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
        <div className='flex flex-col gap-10 items-center justify-center'>
          <div className='flex items-center justify-center flex-col'>
            <div className='flex items-center justify-center'>
              <h1 className='text-5xl font-bold md:text-6xl'>hello</h1>
              <img src={Victory} alt="emoji" className="h-[100px]"/>
            </div>
            <p className="font-medium text-center">
            Your Chat Awaits: Complete the Form to Dive In!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full flex flex-row">
                <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-teal-500 p-1 transition-all duration-300">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-teal-500  p-3  transition-all duration-300">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <input placeholder="Email" type="email" className="rounded-full p-3" value={email} onChange={e=>setEmail(e.target.value)}/>
                <input placeholder="Password" type="password" className="rounded-full p-3" value={password} onChange={e=>setPassword(e.target.value)}/>
                <Button className="rounded-full p-3" onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5 " value="signup">
                <input placeholder="Email" type="email" className="rounded-full p-2" value={email} onChange={e=>setEmail(e.target.value)}/>
                <input placeholder="Password" type="password" className="rounded-full p-2" value={password} onChange={e=>setPassword(e.target.value)}/>
                <input placeholder="Confirm Password" type="password" className="rounded-full p-2" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>
                <Button className="rounded-full p-2" onClick={handleSignUp}>Sign Up</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <img src={Background} alt="background" className="h-[700px]"/>
        </div>
      </div>
    </div>
  )
} // Removed extra closing brace here

export default Auth;