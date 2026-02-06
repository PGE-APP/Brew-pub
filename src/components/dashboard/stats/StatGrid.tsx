import { Droplets, Fuel, Scale, Wallet } from 'lucide-react'
import { StatCard } from './StatCard'
import { cn } from '../../../lib/utils'

const stats = [
  {
    title: 'ปริมาณทั้งหมด',
    value: '8,200',
    icon: Droplets,
  },
  {
    title: 'ปริมาณที่ใช้แล้ว',
    value: '2,800',
    icon: Fuel,
  },
  {
    title: 'ปริมาณคงเหลือ',
    value: '5,400',
    icon: Scale,
  },
  {
    title: 'มูลค่าภาษีรวม',
    value: '1,200,00',
    helper: 'รายการใหม่วันนี้ 3',
    icon: Wallet,
  },
]

export type StatGridProps = {
  className?: string
}

/**
 * Grid layout for KPI cards.
 */
export function StatGrid({ className }: StatGridProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 xl:grid-cols-4', className)}>
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
