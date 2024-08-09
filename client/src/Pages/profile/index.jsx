import { useAppStore } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { FaTrash, FaPlus} from "react-icons/fa"
import { colors  } from '@/Utils/colors';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { ADD_PROFILE_IMAGE_ROUTE, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE, HOST } from '@/Utils/constants';


function Profile() {
  const navigate = useNavigate();
  const {userInfo, setUserInfo}=useAppStore();
  const [firstName, setFirstName]=useState(userInfo.firstName || "");
  const [lastName, setLastName]=useState(userInfo.lastName || "");
  const [image, setImage] = useState(null);
  const [hover, setHover] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo.color || colors[0]);  
  const fileInputRef = useRef(null);


  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color || colors[0]);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  const validateProfile = ()=>{
    if(!firstName){
      toast.error("First Name is required"); 
      return false
    }
    if(!lastName){
      toast.error("Last Name is required"); 
      return false
    }
    return true;
  };

  const saveChanges=async()=>{
    if(validateProfile()){
      try{
        const res = await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName, lastName, color: selectedColor},{withCredentials:true});
        if(res.status===200&&res.data){
          setUserInfo({...res.data, profileSetup: true });
          toast.success("Profile Updated!");
          navigate("/chat");
        }
      }catch(err){
        console.log(err)
      }
    }
  };

  const handleNavigate=()=>{
    if(userInfo.profileSetup){
      navigate("/chat")
    }else{
      toast.error("Please Set Up Your Profile!")
    }
  };

  const handleFileInput=()=>{
    fileInputRef.current.click();
  }

  const handleImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      try {
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.image) {
          setUserInfo({ ...userInfo, image: res.data.image });
          setImage(`${HOST}/${res.data.image}`);
          toast.success("Image Updated Successfully");
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        toast.error("Error uploading image");
      }
    }
  };

const handleDeleteImage = async () => {
  try { 
    const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
      withCredentials: true,
    });
    if (res.status === 200) {
      setUserInfo({...userInfo, image: null});
      setImage(null);
      toast.success("Image Removed Successfully");
    }
  } catch (err) {
    console.error("Error deleting image:", err);
    toast.error("Failed to delete image");
  }
};

  return (
    <>
    <div className='bg-[#8be69a] h-[100vh] flex items-center justify-center flex-col gap-10'>
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <div onClick={handleNavigate}>
            <IoArrowBackCircleOutline size={40} className='text-4x1 lg:text-9x1 text-white/90 cursor-pointer ' />
        </div>
          <div className='grid grid-col-2'>
            <div className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center ml-11 md:ml-5'
              onMouseEnter={()=>setHover(true)}
              onMouseLeave={()=>setHover(false)}
            >
<Avatar className={`h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden ${selectedColor}`}>                
                  { image ? <AvatarImage src={image} alt="profile" className='object-cover w-full h-full bg-black' /> : 
                  <div className='uppercase h-32 w-32 md:w-48 md:h-48 text-5x1 border-[1px] flex items-center justify-center rounded-full   text-[#12527a] text-4xl font-bold relative md:mb-[-4px]'>
                  {firstName ? firstName.split("").shift():userInfo.email.split("").shift()}
                  </div> 
                }
              </Avatar>
              {
                hover && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-300 rounded-full ' onClick={image? handleDeleteImage : handleFileInput}>
                    {
                      image? (<FaTrash className='text-white cursor-pointer text-3x1'/>):(<FaPlus className='text-white cursor-pointer text-3x1'/>)
                    }
                  </div>

                )
              }
              <input type="file" ref={fileInputRef} className='hidden' onChange={handleImage} name="profile-image" accept='.png, .jpg, .jpeg'/>
            </div>
            <div className='md:mt-[32px] mt-[8px]  '>
            <div className='flex min-w-32 md:min-w-64 flex-col gap-5 items-center justify-center '>
              <div className='w-full'>
                <input placeholder='Email' type="email" disabled value={userInfo.email} className='rounded-lg p-6 border-none text-white '/>
              </div>
              <div className='w-full'>
                <input placeholder='First Name' type="text" onChange={e=>setFirstName(e.target.value)} value={firstName} className='rounded-lg p-6 border-none '/>
              </div>
              <div className='w-full'>
                <input placeholder='Last Name' type="text"  onChange={e=>setLastName(e.target.value)} value={lastName} className='rounded-lg p-6 border-none '/>
              </div>
              <div className="w-full overflow-x-hidden">
                {/*}
                <div className="w-full flex gap-5 mr-6 ml-[18px]">
                  {colors.map((color, index) => (
                    <div
                      className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-50 
                        ${selectedColor ===color?"outline outline-white/80 outline-1":""}
                      `}
                      key={index}
                      onClick={()=>setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
                  */}
              </div>
              </div>
            </div>
            <div className='w-full mt-[20px]'>
                  <button className='h-16 w-[39%] md:w-[95%] md:-ml-2 bg-pink-400 hover:bg-pink-500 transition-all duration-300 font-bold text-white rounded-3xl ' onClick={saveChanges}>Save</button>
            </div>
          </div>
      </div>
    </div>
    </>
  );
};

export default Profile