import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Featured = () => {
    const [input, setInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const handleSubmit = () => {
        navigate(`/gigs?search=${input}`);
    };

    return (
        <div className="bg-gray-800 py-24 font-Lexend-content">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                    <h1 className="text-3xl md:text-5xl font-bold mb-12 text-white animate-typing overflow-hidden whitespace-nowrap border-r-4 border-white">
                        Hãy tìm cho mình một thiết kế
                    </h1>
                    <div className="flex items-center mb-8">
                        <div className="relative flex-grow">
                            <img
                                src="/search.png"
                                alt=""
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                            />
                            <input
                                type="text"
                                placeholder='Thử "trừu tượng"'
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="ml-4 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Search
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] md:text-sm">
                        <span className="font-semibold text-2xl text-white">Popular:</span>
                        <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white">
                            Con người
                        </button>
                        <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white">
                            Công trình
                        </button>
                        <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white">
                            Đồ họa
                        </button>
                        <button className="px-3 py-1 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white">
                            Cách điệu
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2" data-aos="fade-up">
                    <img
                        src="/graphic.png"
                        alt="Graphic"
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default Featured;