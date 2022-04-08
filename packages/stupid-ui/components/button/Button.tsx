export type ButtonProps = {
  type: 'primary' | 'link'
}

const Button: React.FC<ButtonProps> = (props) => {
  const {type, children} = props
  if (type === 'link') {
    return <a>{children}</a>
  }

  return <button>{children}</button>
}

Button.displayName = 'Button'

export default Button
