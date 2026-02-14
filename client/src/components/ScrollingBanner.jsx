import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const ScrollingBanner = () => {
    const { axios, navigate } = useAppContext();
    const [banners, setBanners] = useState([]);

    const fetchBanners = async () => {
        try {
            const { data } = await axios.get('/api/banner');
            if (data.success) {
                setBanners(data.banners.filter(b => b.isActive));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    if (banners.length === 0) return null;

    return (
        <div className="w-full overflow-hidden bg-slate-50 py-4 mb-8">
            <div className="flex animate-scroll whitespace-nowrap">
                {/* Double the list for seamless loop */}
                {[...banners, ...banners].map((banner, index) => (
                    <div
                        key={index}
                        onClick={() => banner.link && navigate(banner.link)}
                        className={`inline-block px-4 cursor-pointer transition-transform hover:scale-105 ${banner.link ? 'active:scale-95' : ''}`}
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white">
                            <img
                                src={banner.image}
                                alt={banner.title || "Banner"}
                                className="h-40 md:h-64 object-cover w-auto min-w-[300px] md:min-w-[600px]"
                            />
                            {banner.title && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <p className="text-white font-bold text-sm md:text-lg">{banner.title}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}} />
        </div>
    );
};

export default ScrollingBanner;
