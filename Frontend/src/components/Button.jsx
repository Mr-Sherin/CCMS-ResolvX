import { useContext } from 'react';
import { ActiveButtonContext } from '../context/ActiveButtonContext';

const Button = ({
  id,
  children,
  onClick,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
  ...props
}) => {
  const { activeButtonId, setActiveButtonId } = useContext(ActiveButtonContext);
  const isActive = activeButtonId === id && id !== undefined;

  const handleClick = (e) => {
    if (disabled || loading) return;
    if (id) {
      setActiveButtonId(id);
    }
    if (onClick) {
      onClick(e);
    }
  };

  // Base transition and interactive classes
  let btnClasses = 'relative inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 select-none outline-none border cursor-pointer';

  if (variant === 'primary') {
    btnClasses += ' glass-button';
  } else if (variant === 'secondary') {
    btnClasses += ' glass-button-secondary';
  } else if (variant === 'danger') {
    btnClasses += ' bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white';
  }

  if (disabled) {
    btnClasses += ' opacity-40 cursor-not-allowed pointer-events-none';
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`${btnClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
