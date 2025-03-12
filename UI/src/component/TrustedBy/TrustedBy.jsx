const TrustedBy = () => {
  return (
    <div className="bg-gray-800 h-24 flex justify-center">
      <div className="w-11/12 flex flex-wrap items-center justify-center gap-4 md:gap-10 text-gray-400 font-medium">
        <span className="w-full text-center md:w-auto md:text-left">Trusted by:</span>
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/facebook2x.188a797.png"
          alt="Facebook"
          className="h-12 object-contain"
        />
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/google2x.06d74c8.png"
          alt="Google"
          className="h-12 object-contain"
        />
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/netflix2x.887e47e.png"
          alt="Netflix"
          className="h-12 object-contain"
        />
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/pandg2x.6dc32e4.png"
          alt="P&G"
          className="h-12 object-contain"
        />
        <img
          src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/paypal2x.22728be.png"
          alt="PayPal"
          className="h-12 object-contain"
        />
      </div>
    </div>
  );
};

export default TrustedBy;