import React, { useState } from 'react';
import {
   useAppDispatch,
   useAppSelector
} from '../app/reduxHooks';

import { createProject }
from '../features/project/projectThunk';
import { toast } from 'react-toastify';

import { MdClose } from "react-icons/md";
import Loader from './Loader';

const RegisterProject = ({ closeModal }) => {

   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [company, setCompany] = useState("");
   const [deadline, setDeadline] = useState("");

   const dispatch = useAppDispatch();

   const { token } = useAppSelector(
      (state) => state.auth
   );

   const { loading, error } = useAppSelector(
      (state) => state.project
   );

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (loading) return;

      try {
         await dispatch(createProject({
            projectData: {
               title,
               description,
               company,
               deadline
            },
            token
         }));

         toast.success("Project created successfully!");

         setTitle("");
         setDescription("");
         setCompany("");
         setDeadline("");

         closeModal();

      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div
         className="modal-overlay"
         onClick={closeModal}
      >
         {loading && <Loader variant="orbit" fullscreen={true} />}
         <div
            className="project-register-modal"
            onClick={(e) => e.stopPropagation()}
         >
            <button
               onClick={closeModal}
               className="close-btn"
            >
               <MdClose size={29} />
            </button>

            <form
               onSubmit={handleSubmit}
               className="register-form"
            >
               <label htmlFor="pro-title">
                  Title
               </label>

               <input
                  placeholder="Assigno Management System"
                  type="text"
                  id="pro-title"
                  value={title}
                  onChange={(e) =>
                     setTitle(e.target.value)
                  }
                  required
               />

               <label htmlFor="pro-desc">
                  Description
               </label>

               <textarea
                  id="pro-desc"
                  value={description}
                  onChange={(e) =>
                     setDescription(e.target.value)
                  }
                  placeholder="A project management system to streamline task allocation and progress tracking."
                  required
               />

               <label htmlFor="company">
                  Company
               </label>

               <input
                  placeholder="Assigno Inc."
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) =>
                     setCompany(e.target.value)
                  }
               />

               <label htmlFor="pro-deadline">
                  Deadline
               </label>

               <input
                  type="date"
                  min={
                     new Date()
                        .toISOString()
                        .split("T")[0]
                  }
                  id="pro-deadline"
                  value={deadline}
                  onChange={(e) =>
                     setDeadline(e.target.value)
                  }
               />

               <button
                  type="submit"
                  disabled={loading}
                  className="register-submit-btn"
               >
                  {loading
                     ? "Creating..."
                     : "Create Project"}
               </button>

               {error && <p>{error}</p>}
            </form>
         </div>
      </div>
   );
};

export default RegisterProject;