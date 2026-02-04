import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/utils'

/**
 * Modern login page with glassmorphism design and smooth animations.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(username, password)
      
      if (success) {
        // Redirect to intended destination or dashboard
        const from = (location.state as any)?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand/10 via-canvas to-accent/10">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-96 w-96 animate-pulse rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 animate-pulse rounded-full bg-accent/20 blur-3xl delay-1000" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-brand-soft/30 blur-3xl delay-500" />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="overflow-hidden rounded-3xl border border-border/50 bg-surface/80 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-border/30 bg-gradient-to-r from-brand/5 to-accent/5 px-8 py-8 text-center">
            <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-soft">
              <LogIn className="h-8 w-8" />
            </div>
            <h1 className="font-display text-2xl font-bold text-ink">
              ยินดีต้อนรับกลับ
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              เข้าสู่ระบบ Brew Pub Management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-8">
            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Username field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-ink">
                ชื่อผู้ใช้
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={cn(
                  'w-full rounded-xl border border-border/70 bg-surface px-4 py-3 text-ink',
                  'transition-all duration-200',
                  'placeholder:text-ink-muted/50',
                  'focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
                placeholder="กรอกชื่อผู้ใช้"
                disabled={isLoading}
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={cn(
                    'w-full rounded-xl border border-border/70 bg-surface px-4 py-3 pr-12 text-ink',
                    'transition-all duration-200',
                    'placeholder:text-ink-muted/50',
                    'focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                  placeholder="กรอกรหัสผ่าน"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-muted transition hover:bg-brand/10 hover:text-brand"
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Demo credentials hint */}
            <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-xs text-ink-muted">
              <p className="font-semibold text-ink">💡 สำหรับการทดสอบ</p>
              <p className="mt-1">
                ใช้ชื่อผู้ใช้และรหัสผ่านใดก็ได้เพื่อเข้าสู่ระบบ
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className={cn(
                'group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand to-brand/90 px-6 py-3.5 font-semibold text-brand-foreground shadow-lg',
                'transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-xl',
                'focus:outline-none focus:ring-4 focus:ring-brand/30',
                'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
                'active:scale-[0.98]'
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-foreground border-t-transparent" />
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>เข้าสู่ระบบ</span>
                  </>
                )}
              </span>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
          </form>

          {/* Footer */}
          <div className="border-t border-border/30 bg-gradient-to-r from-brand/5 to-accent/5 px-8 py-6 text-center">
            <p className="text-xs text-ink-muted">
              © 2026 Brew Pub Management System
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              ระบบจัดการโรงเบียร์คราฟท์
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 text-center">
          <p className="text-xs text-ink-muted">
            ต้องการความช่วยเหลือ?{' '}
            <button className="font-medium text-brand transition hover:underline">
              ติดต่อฝ่ายสนับสนุน
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
