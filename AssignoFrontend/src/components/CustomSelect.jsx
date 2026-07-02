
import React, {
   useEffect,
   useRef,
   useState
} from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import '../styles/customselect.css'

const CustomSelect = ({
   options = [],
   value = null,
   onChange,
   placeholder = "Select",
   labelKey = "title",
   variant = ""
}) => {
   const [open, setOpen] =
      useState(false);

   const selectRef =
      useRef(null);

   useEffect(() => {

      const handleClickOutside =
         (event) => {

            if (
               selectRef.current &&
               !selectRef.current.contains(
                  event.target
               )
            ) {

               setOpen(false);
            }
         };

      document.addEventListener(
         "mousedown",
         handleClickOutside
      );

      return () => {

         document.removeEventListener(
            "mousedown",
            handleClickOutside
         );
      };

   }, []);

   const getDisplayValue = (
      option
   ) => {

      if (!option) {
         return placeholder;
      }

      return typeof option ===
         "object"
         ? option[labelKey]
         : option;
   };

   return (

      <div
         className={`custom-select ${
            variant
               ? `custom-select-${variant}`
               : ""
         }`}
         ref={selectRef}
      >
         <button
            type="button"
            className="
               custom-select-trigger
            "
            onClick={() =>
               setOpen(
                  prev => !prev
               )
            }
         >

            <span className="placeholder">
               {
                  getDisplayValue(
                     value
                  )
               }
            </span>

            <span
               className={`custom-select-arrow ${open? "open": ""}`}
            >
           <IoMdArrowDropdown size="25px" color="var(--text-primary)" />
            </span>

         </button>

         {
            open && (

               <div
                  className="
                     custom-select-dropdown
                  "
               >

                  {
                     options.map(
                        (
                           option,
                           index
                        ) => (

                           <div

                              key={
                                 typeof option ===
                                 "object"
                                    ? option.taskId ||
                                      index
                                    : option
                              }

                              className="
                                 custom-select-option
                              "

                              onClick={() => {
                                 onChange(
                                    option
                                 );

                                 setOpen(
                                    false
                                 );
                              }}
                           >

                              {
                                 getDisplayValue(
                                    option
                                 )
                              }

                           </div>

                        )
                     )
                  }

               </div>

            )
         }

      </div>

   );
};

export default CustomSelect;

