export default function Button({
    title,
    theme = {},
    onClick,
    variant = 'squared',
    children,
    style = {},
    component: Component = 'button',
    ...rest
  }) {
    const buttonStyle = {
      borderRadius: 3,
      padding: '5px 20px',
      fontSize: 15,
      fontWeight: 'bold',
      ...theme?.[theme.mode],
      ...style,
    };
  
    switch (variant) {
      case 'rounded':
        buttonStyle.borderRadius = 100;
        break;
      case 'squared':
        buttonStyle.borderRadius = 0;
        break;
      case 'circle':
        buttonStyle.borderRadius = '50%';
        buttonStyle.width = 50;
        buttonStyle.height = 50;
        title = title[0] || '';
        break;
      case 'icon':
        buttonStyle.backgroundColor = 'white';
        buttonStyle.padding = 7;
        buttonStyle.borderRadius = 150;
        break;
      default:
        break;
    }
  
    return (
      <Component onClick={onClick} style={buttonStyle} {...rest}>
        {title || children}
      </Component>
    );
  }