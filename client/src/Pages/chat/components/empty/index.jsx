import { animation } from "@/lib/utils"
import Lottie from "react-lottie"

const Empty = () => {
  return (
    <div className='flex-1 md:bg-[#8AF4BC] md:flex flex-col justify-center items-center  duration-1000 transition-all' >
      <Lottie isClickToPauseDisabled={true} height={200} width={200} options={animation}/>
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="playwrite-ar-thin ">
          Hi <span className="text-purple-600"> !</span> Welcome To <span> </span>
          <span className="text-purple-600">MINT </span> Chat App <span className="text-purple-500">.</span>
        </h3>
      </div>
      </div>
  )
}

export default Empty