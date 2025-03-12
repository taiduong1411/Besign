import React, { useEffect } from "react"
import Glide from "@glidejs/glide"

export default function CarouselControlsInside() {
    useEffect(() => {
        const slider = new Glide(".glide-01", {
            type: "carousel",
            focusAt: "center",
            perView: 2,
            autoplay: 3000,
            animationDuration: 700,
            gap: 24,
            classNames: {
                nav: {
                    active: "[&>*]:bg-wuiSlate-700",
                },
            },
            breakpoints: {
                1024: {
                    perView: 2,
                },
                640: {
                    perView: 1,
                },
            },
        }).mount()

        return () => {
            slider.destroy()
        }
    }, [])

    return (
        <>
            <div className="glide-01 relative w-full">
                <div className="overflow-hidden" data-glide-el="track">
                    <ul className="whitespace-no-wrap flex-no-wrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
                        <li>
                            <img
                                src="https://trangtrigiatiendep.com/upload/sanpham/backdrop-dam-cuoi-hoa-tuoi-gia-re-9585.jpg"
                                className="m-auto w-full h-96"
                            />
                        </li>
                        <li>
                            <img
                                src="https://cuoihoitrongoivenus.com/wp-content/uploads/2021/04/168394318_2845507532328227_4193208939669722502_n.jpg"
                                className="m-auto w-full h-96"

                            />
                        </li>
                        <li>
                            <img
                                src="https://lh3.googleusercontent.com/proxy/S3Zt9rtUaOyZxV7468nrsJbNygRryZexUUDn0icFa8p-9HpxqJhgByBhjz7zaw8KT40Z3YxcXUXL3VUMmX8iHKheW7DIUOA8GgWp4-j4Hqrm-7zqfg"
                                className="m-auto w-full h-96"
                            />
                        </li>
                        <li>
                            <img
                                src="https://banghieuminhkhang.com/upload/sanpham/Backdrop/backdrop-su-kien-ngoai-troi-1.jpg"
                                className="m-auto w-full h-96"
                            />
                        </li>
                        <li>
                            <img
                                src="https://lh4.googleusercontent.com/proxy/lfnBkuolRDlGcG-DIrour9z_srODGmz4LO8-TG56scV2RwEgUxa1L8nlle2b0V1arRgygYYW7FUczDms2kF4AxjowSE9bYS73u24RnahxVh-cGj24UQKLfBuWpH3loKADTGOXlDxM6mBYpHTqOhLQ0SaqnLLdA"
                                className="m-auto w-full h-96"
                            />
                        </li>
                    </ul>
                </div>

                <div
                    className="absolute left-0 top-1/2 flex h-0 w-full items-center justify-between px-4 "
                    data-glide-el="controls"
                >
                    <button
                        className="hover:bg-red-500 hover:text-white inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
                        data-glide-dir="<"
                        aria-label="prev slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <title>prev slide</title>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                            />
                        </svg>
                    </button>
                    <button
                        className="hover:bg-red-500 hover:text-white inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 focus-visible:outline-none lg:h-12 lg:w-12"
                        data-glide-dir=">"
                        aria-label="next slide"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <title>next slide</title>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/Glide.js/3.0.2/glide.js"></script>
            {/*<!-- End Carousel with controls inside --> */}
        </>
    )
}
