import { LucideProps } from 'lucide-react'

export const Icons = {
  logo: ({ className, ...props }: LucideProps) => (
    <img
      src='/icons/zonomo-logo.png'
      alt='Zonomo Logo'
      className={className}
      style={{ display: 'block' }}
      {...props}
    />
  ),
}
