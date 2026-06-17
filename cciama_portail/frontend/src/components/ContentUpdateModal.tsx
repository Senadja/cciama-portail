import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { usePlatformSettings } from '@/hooks/useCms';

interface ContentUpdateModalProps {
  isOpen: boolean;
  progress: number;
  reason: string;
}

export function ContentUpdateModal({ isOpen, progress, reason }: ContentUpdateModalProps) {
  const { data: settings } = usePlatformSettings();
  const logoUrl = settings?.logo || '/cciama-logo.png';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10, 25, 47, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            pointerEvents: 'all',
            userSelect: 'none',
            padding: 24,
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: -15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              borderRadius: 24,
              padding: '48px 36px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Header / Watermark Icon */}
            <div style={{ position: 'relative', marginBottom: 28 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: -12,
                  border: '1px dashed rgba(212, 163, 89, 0.3)',
                  borderRadius: '50%',
                }}
              />
              <div
                style={{
                  width: 88,
                  height: 88,
                  background: 'var(--color-navy-deep, #0E2A5E)',
                  border: '2px solid rgba(212, 163, 89, 0.4)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  padding: 12,
                }}
              >
                <img
                  src={logoUrl}
                  alt="CCIAMA Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  background: 'var(--color-gold, #D4A359)',
                  color: '#0A192F',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                <RefreshCw size={11} className="animate-spin" style={{ animationDuration: '3s' }} />
              </motion.div>
            </div>

            {/* Typography */}
            <h3
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: 22,
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: 8,
                letterSpacing: '-0.01em',
              }}
            >
              Mise à jour en direct
            </h3>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: 1.5,
                minHeight: 42,
                marginBottom: 32,
              }}
            >
              {reason || 'Actualisation des contenus du portail…'}
            </p>

            {/* Premium Progress Bar */}
            <div
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                height: 10,
                borderRadius: 5,
                overflow: 'hidden',
                position: 'relative',
                marginBottom: 16,
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #C59B27, #E5C158, #C59B27)',
                  boxShadow: '0 0 12px rgba(229, 193, 88, 0.5)',
                  width: `${progress}%`,
                }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            {/* Counter percentage */}
            <div
              style={{
                fontSize: 13,
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--color-gold, #D4A359)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Loader2 size={13} className="animate-spin" />
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
