import "../styles/loader.css";

/**
 * Reusable Loader Component for Assigno
 * 
 * @param {Object} props
 * @param {'orbit' | 'sweep' | 'liquid'} [props.variant='orbit'] - The visual style of the loader spinner.
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - Sizing option for the loader.
 * @param {boolean} [props.fullscreen=false] - Whether loader should stretch to fill the viewport as an overlay.
 * @param {string} [props.className=''] - Additional custom CSS classes for the container.
 */
const Loader = ({ 
  variant = "orbit", 
  size = "medium", 
  fullscreen = false, 
  className = "" 
}) => {
  const containerClass = fullscreen ? "loader-fullscreen" : "loader-container";
  const sizeClass = `loader-size-${size}`;
  
  const getSpinnerClass = () => {
    switch (variant) {
      case "sweep":
        return "conic-sweep";
      case "liquid":
        return "liquid-orb";
      case "orbit":
      default:
        return "cosmic-orbit";
    }
  };

  return (
    <div className={`${containerClass} ${sizeClass} ${className}`}>
      <div className={getSpinnerClass()} aria-label="Loading..." role="status" />
    </div>
  );
};

export default Loader;
