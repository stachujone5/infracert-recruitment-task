interface Props {
  readonly children: string
  readonly variant?: 'error' | 'success'
}

export const Tooltip = ({ children, variant = 'error' }: Props) => {
  return (
    <div
      className={`tooltip ${variant === 'error' ? 'tooltip-error' : 'tooltip-success'} tooltip-bottom tooltip-open`}
      data-tip={children}
    />
  )
}
