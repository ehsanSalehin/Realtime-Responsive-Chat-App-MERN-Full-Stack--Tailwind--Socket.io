import { AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/Utils/constants";
import { Avatar } from "@radix-ui/react-avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { LiaUserEditSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { apiClient } from "@/lib/api-client";
import { getColor } from "../../../../../../Utils/colors"; 

const ProfileInfo = () => {
    const userInfo = useAppStore((state) => state.userInfo);
    const setUserInfo = useAppStore((state) => state.setUserInfo);
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            const res = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
            if (res.status === 200) {
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    const avatarClass = `h-12 w-12 rounded-full overflow-hidden ${getColor(userInfo.color)}`;

    return (
        <div className="flex items-center p-4 bg-[#5ae7bf] rounded-tl-lg">
            <Avatar className={avatarClass}>
                {userInfo.image ? (
                    <AvatarImage
                        src={`${HOST}/${userInfo.image}`}
                        alt="profile"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="uppercase w-full h-full flex items-center justify-center rounded-full  text-[#12527a] text-lg font-bold">
                        {userInfo.firstName ? userInfo.firstName.charAt(0) : userInfo.email.charAt(0)}
                    </div>
                )}
            </Avatar>
            <div className="ml-3">
                <span className="font-semibold text-lg">
                    {userInfo.firstName && userInfo.lastName
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : userInfo.email}
                </span>
                <div className="text-sm text-gray-600">
                    {userInfo.email}
                </div>
            </div>
            <div className="flex gap-5 ml-auto">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <LiaUserEditSolid
                                className="text-purple-500 text-3xl font-medium ml-5 hover:text-white"
                                onClick={() => navigate('/profile')}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#9745ff] border-none rounded-sm mb-2 p-1">
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoMdLogOut
                                className="text-red-500 text-3xl font-medium hover:text-white"
                                onClick={logOut}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#9745ff] border-none rounded-sm mb-2 p-1">
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};

export default ProfileInfo;
