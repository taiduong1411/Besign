import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const TrustedBy = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  return (
    <div className="py-8 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <h3
            className="text-white uppercase tracking-wider text-sm font-medium mb-8"
            data-aos="fade-up">
            Được tin cậy bởi các thương hiệu hàng đầu
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center w-full max-w-5xl">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                className="w-full flex justify-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 md:h-12 object-contain opacity-85 hover:opacity-100 transition-opacity duration-300 hover:scale-105 transform"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const partners = [
  {
    name: "Facebook",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/800px-Facebook_f_logo_%282019%29.svg.png",
  },
  {
    name: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  },
  {
    name: "Netflix",
    logo: "https://1000logos.net/wp-content/uploads/2017/05/Netflix-Logo.png",
  },
  {
    name: "Microsoft",
    logo: "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31",
  },
];

export default TrustedBy;
