interface Props {
  readonly children: string
  readonly variant?: 'error' | 'success'
}

export const Tooltip = ({ children, variant = 'error' }: Props) => {
  return <div className={`tooltip tooltip-${variant} tooltip-bottom tooltip-open`} data-tip={children} />
}
