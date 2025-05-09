import { useState, useEffect } from "react";
import './Loader.css';
function Loader() {
    const [showLoading, setShowLoading] = useState(true);
    const showLoader = () => {
        setShowLoading(true);
        setTimeout(() => {
            setShowLoading(false);
        }, 1000);
    };
    useEffect(() => {
        showLoader();
    }, []);
    return (
        <div>
            {showLoading && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="overlay"></div>
                    <div className="spinner"></div>
                    {/* <img src="/trungduc.png" alt="Logo" className="w-10 h-24 z-10" style={{ borderRadius: '50%' }} /> */}
                </div>
            )}
        </div>
    );
}

export default Loader;