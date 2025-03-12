import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
function IntroCard() {
    useEffect(() => {
        AOS.init();
    }, []);
    return (
        <div className="xl:min-h-[90vh] lg:min-h-[90vh] flex justify-center items-center">
            <div className="w-11/12 m-auto max-[1200px]:mt-8 max-[1200px]:mb-8">
                <div className="mb-16">
                    <h1 className="text-center text-3xl font-Lexend-content text-red-500 max-[1200px]:text-xl" >
                        Our Design
                    </h1>
                    <p className="text-4xl max-[1200px]:text-3xl text-center pt-4 font-bold font-Lexend-content text-[#013A70]">Các Thiết Kế Của Chúng Tôi</p>
                </div>
                
            </div>
        </div>
    );
}

export default IntroCard;