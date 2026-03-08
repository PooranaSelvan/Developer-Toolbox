import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { MagicCard } from '@/components/ui/magic-card';
import { Ripple } from '@/components/ui/ripple';
import { BorderBeam } from '@/components/ui/border-beam';
import { DotPattern } from '@/components/ui/dot-pattern';
import { NumberTicker } from '@/components/ui/number-ticker';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <MagicCard className="!rounded-2xl max-w-md w-full" gradientOpacity={0.08}>
        <div className="relative p-10 text-center overflow-hidden">
          {/* Background dot pattern */}
          <DotPattern
            width={24}
            height={24}
            cr={0.6}
            className="opacity-[0.06] text-error/40 [mask-image:radial-gradient(250px_circle_at_center,white,transparent)]"
          />

          {/* Animated 404 number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="relative z-10 mb-6"
          >
            <div className="relative w-20 h-20 mx-auto">
              {/* Ripple background */}
              <div className="absolute -inset-8 flex items-center justify-center pointer-events-none">
                <Ripple
                  mainCircleSize={50}
                  mainCircleOpacity={0.08}
                  numCircles={4}
                  className="[mask-image:none] opacity-40"
                />
              </div>
              <div className="relative w-20 h-20 rounded-2xl bg-error/10 flex items-center justify-center overflow-hidden border border-error/20">
                <AlertCircle size={36} className="text-error relative z-10" />
                <BorderBeam size={80} duration={4} colorFrom="var(--color-error)" colorTo="var(--color-warning)" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative z-10"
          >
            <h1 className="text-5xl font-extrabold mb-2 opacity-15">
              <NumberTicker value={404} className="text-error !opacity-20" />
            </h1>
            <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
            <p className="mb-8 opacity-60 text-sm">The page you're looking for doesn't exist or has been moved.</p>

            <div className="flex items-center justify-center gap-3">
              <Link to="/" className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
                <Home size={16} />
                Back to Dashboard
              </Link>
              <button onClick={() => window.history.back()} className="btn btn-ghost gap-2">
                <ArrowLeft size={16} />
                Go Back
              </button>
            </div>
          </motion.div>
        </div>
      </MagicCard>
    </div>
  );
}
