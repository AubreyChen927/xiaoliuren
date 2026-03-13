import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, Compass, Info, RefreshCw } from 'lucide-react';
import { calculateXiaoLiuRen, SHICHEN_NAMES } from './utils/xiaoliuren';

export default function App() {
  const [now, setNow] = useState(new Date());
  const [divination, setDivination] = useState(calculateXiaoLiuRen(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setNow(date);
      setDivination(calculateXiaoLiuRen(date));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#f5f5f5]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-[#c0392b] tracking-widest"
          >
            小六壬实时占算
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-gray-500 italic"
          >
            大安起正月，月上起日，日上起时
          </motion.p>
        </header>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Time Display */}
          <div className="bg-[#c0392b] p-6 text-white text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm mb-1">
              <Clock size={14} />
              <span>当前时间</span>
            </div>
            <div className="text-2xl font-mono tracking-tighter">
              {formatDate(now)}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Lunar & Shichen Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 border border-gray-100">
                <Calendar size={20} className="text-[#c0392b] opacity-60" />
                <span className="text-xs text-gray-400 uppercase tracking-widest">农历日期</span>
                <span className="text-lg font-medium">{divination.fullLunar}</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-1 border border-gray-100">
                <Compass size={20} className="text-[#c0392b] opacity-60" />
                <span className="text-xs text-gray-400 uppercase tracking-widest">当前时辰</span>
                <span className="text-lg font-medium">{divination.shichen}时</span>
              </div>
            </div>

            {/* Result Display */}
            <div className="text-center space-y-4 py-4">
              <div className="inline-block relative">
                <motion.div
                  key={divination.result.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-32 h-32 rounded-full border-4 border-[#c0392b] flex items-center justify-center bg-white shadow-inner"
                >
                  <span className="text-5xl font-bold text-[#c0392b]">{divination.result.name}</span>
                </motion.div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#c0392b] text-white px-3 py-0.5 rounded-full text-[10px] tracking-widest">
                  实时占算
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={divination.result.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-2"
                >
                  <h2 className="text-xl font-bold text-gray-800">
                    {divination.result.name}
                  </h2>
                  <p className="text-gray-600 px-4 leading-relaxed">
                    {divination.result.meaning}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Info size={12} />
            <span>小六壬为传统术数，结果仅供参考</span>
          </div>
        </motion.div>

        {/* Quick Guide / Explanation */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">六神释义</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: '大安', m: '安泰、稳定' },
              { n: '留连', m: '拖延、纠缠' },
              { n: '速喜', m: '喜讯、快速' },
              { n: '赤口', m: '口舌、是非' },
              { n: '小吉', m: '微吉、顺利' },
              { n: '空亡', m: '虚无、落空' }
            ].map((item) => (
              <div key={item.n} className="bg-white/50 p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                <span className="font-bold text-[#c0392b]">{item.n}</span>
                <span className="text-xs text-gray-500">{item.m}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Refresh Hint */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 text-[10px] text-gray-400 animate-pulse">
            <RefreshCw size={10} />
            <span>数据每秒实时更新</span>
          </div>
        </div>
      </div>
    </div>
  );
}
