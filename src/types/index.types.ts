export interface BaristaCardProps {
  name: string
  specialty: string
  location: string
  tags: string[]
  gradient: string
}

export interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export interface NavLink {
  label: string
  path: string
}
