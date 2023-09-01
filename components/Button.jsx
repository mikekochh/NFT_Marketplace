// minlg - option for devices that are extra large
// px/y is padding in x or y direction

const Button = ({ btnName, classStyles, handleClick }) => (
  <button type="button" className={`gray-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`} onClick={handleClick}>
    {btnName}
  </button>
);

export default Button;
