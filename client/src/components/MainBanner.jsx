import React from 'react'
import { Link } from 'react-router-dom'
import bannerCard from '../assets/anbu.jpg'

const MainBanner = () => {
  return (
    <div className='relative py-8 md:py-16 overflow-hidden'>
      {/* Background Subtle Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl -z-10 opacity-60"></div>

      <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-20'>
        {/* Left Content */}
        <div className='flex-1 text-center lg:text-left space-y-12 animate-in slide-in-from-left duration-700'>
          <div className="flex flex-col items-center lg:items-start space-y-10">
            {/* Requested Banner Image */}
            <div className="animate-in fade-in slide-in-from-top-10 duration-1000">
              <img src={bannerCard} alt="Business Card" className="rounded-3xl shadow-2xl border-4 border-white h-48 md:h-64 object-contain hover:scale-105 transition-transform duration-500" />
            </div>



          </div>
        </div>

        {/* Right Cards Visual (Matches reference image) */}
        <div className='flex-1 relative animate-in slide-in-from-right duration-700 w-full lg:max-w-[600px]'>
          <div className="relative z-10 p-0 md:p-4 bg-transparent lg:bg-slate-50/50 rounded-[40px] border-none lg:border-white/60">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Category 1: Black & White */}
              <Link to="/print" className="group bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 space-y-4 hover:shadow-[0_20px_50px_rgb(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-2 active:scale-95 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-slate-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-slate-500/10 transition-colors"></div>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform relative z-10">📄</div>
                <div className="relative z-10">
                  <h3 className="font-bold font-outfit text-slate-900 text-sm mb-1">B&W</h3>

                  <div className="flex flex-col">
                    <p className="text-slate-900 font-black text-xl leading-none">₹2 <span className="text-[10px] font-bold text-slate-400">/pg</span></p>
                  </div>
                </div>
              </Link>

              {/* Category 2: Color Printing */}
              <Link to="/print" className="group bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 space-y-4 hover:shadow-[0_20px_50px_rgb(249,115,22,0.15)] transition-all duration-500 hover:-translate-y-2 active:scale-95 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform relative z-10">🌈</div>
                <div className="relative z-10">
                  <h3 className="font-bold font-outfit text-slate-900 text-sm mb-1">Color</h3>

                  <div className="flex flex-col">
                    <p className="text-blue-700 font-black text-xl leading-none">₹10 <span className="text-[10px] font-bold text-slate-400">/pg</span></p>
                  </div>
                </div>
              </Link>

              {/* Category 3: Spiral Binding */}
              <Link to="/print" className="group bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 space-y-4 hover:shadow-[0_20px_50px_rgb(234,88,12,0.15)] transition-all duration-500 hover:-translate-y-2 active:scale-95 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-colors"></div>
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform relative z-10">📚</div>
                <div className="relative z-10">
                  <h3 className="font-bold font-outfit text-slate-900 text-sm mb-1">Spiral</h3>

                  <div className="flex flex-col">
                    <p className="text-orange-600 font-black text-xl leading-none">₹50 <span className="text-[10px] font-bold text-slate-400">/book</span></p>
                  </div>
                </div>
              </Link>

              {/* Category 4: Chart Binding */}
              <Link to="/print" className="group bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 space-y-4 hover:shadow-[0_20px_50px_rgb(147,51,234,0.15)] transition-all duration-500 hover:-translate-y-2 active:scale-95 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/10 transition-colors"></div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform relative z-10">📊</div>
                <div className="relative z-10">
                  <h3 className="font-bold font-outfit text-slate-900 text-sm mb-1">Chart Binding</h3>

                  <div className="flex flex-col">
                    <p className="text-purple-600 font-black text-xl leading-none">₹150 <span className="text-[10px] font-bold text-slate-400">/unit</span></p>
                  </div>
                </div>
              </Link>
            </div>
            <br />

            <div className='flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full'>
              <Link to="/print" className='w-full sm:w-auto px-10 py-5 bg-blue-700 hover:bg-black text-white rounded-2xl text-xl font-bold transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-2 group transform hover:-translate-y-1'>
                🚀 Start Printing
              </Link>
              <Link to="/vouchers" className='w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 hover:border-blue-200 text-slate-700 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1'>
                🎟️ View Offers
              </Link>
              <a
                href="https://wa.me/919894957422?text=Hello,%20I%20would%20like%20to%20place%20a%20bulk%20order."
                target="_blank"
                rel="noopener noreferrer"
                className='w-full sm:w-auto px-10 py-5 bg-orange-50 border-2 border-orange-100 hover:bg-orange-600 hover:border-orange-600 hover:text-white text-orange-700 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-2 shadow-2xl shadow-orange-100/50 transform hover:-translate-y-1'
              >
                📦 Bulk Order
              </a>
            </div>


            {/* Starting price badge (Matches image exactly) */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
