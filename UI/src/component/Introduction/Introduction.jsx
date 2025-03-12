import { useEffect } from 'react';
import './Introduction.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Button } from 'antd';
function Introduction({ scrollToSection }) {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className="bg-scroll bg-cover bg-center text-white min-h-[90vh] lg:min-h-[60vh] xl:min-h-[88vh] flex justify-center items-center">
            <div className="area">
                <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <div className='w-5/6 m-auto'>
                <div className=''>
                    <h1 className='text-center text-[44px] font-Lexend-title pb-16 text-[#013A70] max-[1200px]:text-[30px] font-bold leading-tight'>
                        Tạo nên những <span className='text-red-500'>trải nghiệm</span> độc đáo, kết nối bằng sự <span className='text-red-500'>sáng tạo</span> và hiện thực hoá bằng <span className='text-red-500'>công nghệ</span>
                    </h1>
                    {/* <img src="/trungduc.png" alt="" width={110} height={110} className='m-auto mb-8 rounded' /> */}
                    <p className='text-center text-xl max-[1200px]:text-md font-Lexend-content pb-8 text-gray-700'>Công Ty TNHH Sự Kiện Quảng Cáo Giải Trí Trung Đức được thành lập năm 2024. Chúng tôi luôn đồng hành cùng bạn trong mọi lĩnh vực về sự kiện - quảng cáo - giải trí - công nghệ, mang đến giải pháp sáng tạo, trải nghiệm độc đáo và hiệu quả cho mỗi dự án. Hãy để chúng tôi biến ý tưởng của bạn thành hiện thực đầy ấn tượng.</p>
                    {/* <div className="font-Lexend-title pb-8 w-fit m-auto overflow-hidden">
                        <h1
                            className="animate-typing overflow-hidden whitespace-nowrap text-4xl">
                            Công Ty TNHH Sự Kiện Quảng Cáo Giải Trí Trung Đức
                        </h1>
                    </div> */}
                    <div className="mt-10 mb-10 w-fit m-auto" onClick={() => scrollToSection()}>
                        <Button type="primary" shape="round" size='large' className="flex items-center bg-[#007bff]">
                            Khám Phá Ngay
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)" className="ml-2 flex items-center"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg>
                        </Button>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default Introduction;