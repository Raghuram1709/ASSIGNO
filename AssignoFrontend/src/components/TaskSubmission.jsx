
import React, { useRef, useState, useEffect } from "react";
import "../styles/TaskSubmission.css";
import { GiTireIronCross } from "react-icons/gi";
import { MdDeleteOutline } from "react-icons/md";
import CustomSelect from "./CustomSelect";

const TaskSubmission = ({ tasks = [], closeModel, onSubmit }) => {

   const fileInputRef = useRef(null);

   const [selectedTask, setSelectedTask] = useState("");
   const [note, setNote] = useState("");
   const [files, setFiles] = useState([]);
   const [links, setLinks] = useState([""]);
   const [isDragging, setIsDragging] = useState(false);
   const [closing, setClosing] =
   useState(false);


   const handleFiles = (incomingFiles) => {

      const newFiles = Array.from(incomingFiles);

      setFiles(prev => [
         ...prev,
         ...newFiles
      ]);
   };

   const handleFileSelect = (e) => {

      if (e.target.files?.length) {
         handleFiles(e.target.files);
      }
   };

   const handleDrop = (e) => {

      e.preventDefault();

      setIsDragging(false);

      if (e.dataTransfer.files?.length) {
         handleFiles(e.dataTransfer.files);
      }
   };

   const removeFile = (index) => {

      setFiles(
         files.filter(
            (_, i) => i !== index
         )
      );
   };

   const addLink = () => {

      setLinks(prev => [
         ...prev,
         ""
      ]);
   };

   const updateLink = (
      index,
      value
   ) => {

      const updatedLinks = [...links];

      updatedLinks[index] = value;

      setLinks(updatedLinks);
   };

   const removeLink = (index) => {

      if (links.length === 1) {
         return;
      }

      setLinks(
         links.filter(
            (_, i) => i !== index
         )
      );
   };

   const handleSubmit = (e) => {

      e.preventDefault();

      const payload = {

         taskId: selectedTask,

         note,

         links: links.filter(
            link => link.trim()
         ),

         files
      };

      onSubmit(payload);
      handleClose();

   };

   const handleClose = () => {

      setClosing(true);

      setTimeout(() => {

         closeModel();

      }, 300);
   };

    return (

       <div className={`task-submission ${
          closing? "modal-exit" :
          "modal-enter"
       }`}>

          <h2 className="task-submission-title">
             Submit Task
          </h2>

          <form
             onSubmit={handleSubmit}
             className="task-form"
          >

             <div className="form-group">

                <label>
                   Select Task
                </label>

                <CustomSelect
                   options={tasks}
                   value={
                      tasks.find(
                         task => task.taskId === selectedTask
                      )
                   }
                   onChange={(task) =>{
                      setSelectedTask(task.taskId)

                   }
                   }
                   placeholder="Select Task"
                   labelKey="title"
                />

            </div>

            <div className="form-group">

               <label>
                  Submission Note
               </label>

               <textarea
                  rows={5}
                  value={note}
                  onChange={(e) =>
                     setNote(
                        e.target.value
                     )
                  }
                  placeholder="Describe your work..."
                  required
               />

            </div>

            <div className="form-group">

               <div className="links-header">

                  <label>
                     Reference Links
                  </label>

                  <button
                     type="button"
                     className="add-link-btn"
                     onClick={addLink}
                  >
                     Add Link
                  </button>

               </div>

               {
                  links.map(
                     (
                        link,
                        index
                     ) => (

                        <div
                           key={index}
                           className="link-row"
                        >

                           <input
                              type="url"
                              placeholder="https://..."
                              value={link}
                              onChange={(e) =>
                                 updateLink(
                                    index,
                                    e.target.value
                                 )
                              }
                           />

                           {
                              links.length > 1 && (

                                 <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() =>
                                       removeLink(
                                          index
                                       )
                                    }
                                 >
                                  <MdDeleteOutline size="25px" />
                                 </button>

                              )
                           }

                        </div>

                     )
                  )
               }

            </div>

            <div className="form-group">

               <label>
                  Proof Files
               </label>

               <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden-input"
                  onChange={
                     handleFileSelect
                  }
                  
               />

               <div

                  className={`drop-zone ${
                     isDragging
                        ? "dragging"
                        : ""
                  }`}

                  onDragOver={(e) => {

                     e.preventDefault();

                     setIsDragging(true);
                  }}

                  onDragLeave={() =>
                     setIsDragging(false)
                  }

                  onDrop={handleDrop}
               >

                  <p>
                     Drag & Drop Files Here
                  </p>

                  <p>
                     Images, PDFs,
                     Documents, ZIP Files
                  </p>

                  <button
                     type="button"
                     className="browse-btn"
                     onClick={() =>
                        fileInputRef
                           .current
                           ?.click()
                     }
                  >
                     Add Files
                  </button>

               </div>

            </div>

            {
               files.length > 0 && (

                  <div className="files-list">

                     <h3>
                        Selected Files
                     </h3>

                     {
                        files.map(
                           (
                              file,
                              index
                           ) => (

                              <div
                                 key={index}
                                 className="file-item"
                              >

                                 <div className="file-info">

                                    {
                                       file.type.startsWith(
                                          "image/"
                                       ) && (

                                          <img
                                             src={URL.createObjectURL(
                                                file
                                             )}
                                             alt=""
                                             className="file-preview"
                                          />

                                       )
                                    }

                                    <div>

                                       <p>
                                          {
                                             file.name
                                          }
                                       </p>

                                       <small>
                                          {(
                                             file.size /
                                             1024
                                          ).toFixed(
                                             2
                                          )}
                                          {" "}
                                          KB
                                       </small>

                                    </div>

                                 </div>

                                 <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() =>
                                       removeFile(
                                          index
                                       )
                                    }
                                 >
                                    Remove
                                 </button>

                              </div>

                           )
                        )
                     }

                  </div>

               )
            }

            <button
               type="submit"
               className="submit-btn"
            >
               Submit Task
            </button>

         </form>
            <div className="close-btn">
               <button onClick={handleClose}>
                  <GiTireIronCross size="20px"/>
               </button>
            </div>
      </div>

   );
};

export default TaskSubmission;

