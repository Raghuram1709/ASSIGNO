import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { GiTireIronCross } from "react-icons/gi";
import { toast } from 'react-toastify';
const AssignTask = ({ onSubmit, closeModel }) => {

   const today = new Date().toISOString().split("T")[0];

   const [closing, setClosing] = useState(false);
   const [tasks, setTasks] = useState([
      {
         title: "",
         deadline: ""
      }
   ]);

   
   const handleChange = (index, field, value) => {
      const updatedTasks = [...tasks];
      updatedTasks[index][field] = value;
      setTasks(updatedTasks);
   };

   const addField = () => {
      setTasks([
         ...tasks,
         {
            title: "",
            deadline: ""
         }
      ]);
   };

   const removeField = (index) => {
      const updatedTasks = tasks.filter(
         (_, i) => i !== index
      );

      setTasks(updatedTasks);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      
      
      
      const filteredTasks = tasks.filter(
         (task) => task.title.trim()
      );
      
      const hasInvalidDate = filteredTasks.some(
         task => task.deadline < today
      );
      
      if (hasInvalidDate) {
         toast.error("Deadline cannot be before today.");
         return;
      }

      onSubmit(filteredTasks);
      handleClose();
   };

   const handleClose = () => {

      setClosing(true);

      setTimeout(() => {

         closeModel();

      }, 300);
   };

   return (
      <div
         className={`
            assign-task-container
            ${
               closing
                  ? "modal-exit"
                  : "modal-enter"
            }
         `}
      >
         <h2 className="assign-task-title">
            Assign Tasks
         </h2>

         {tasks.map((task, index) => (
            <div
               key={index}
               className="task-input-group"
            >
               <input
                  type="text"
                  placeholder="Task Title"
                  value={task.title}
                  onChange={(e) =>
                     handleChange(
                        index,
                        "title",
                        e.target.value
                     )
                  }
                  required
               />

               <input
                  type="date"
                  value={task.deadline}
                  min={today}
                  onChange={(e) =>
                     handleChange(
                        index,
                        "deadline",
                        e.target.value
                     )
                  }
                  required
               />

               {tasks.length > 1 && (
                  <button
                     type="button"
                     className="delete-task-btn"
                     onClick={() =>
                        removeField(index)
                     }
                  >
                    <MdDeleteOutline size ="25px"/>
                  </button>
               )}
            </div>
         ))}
         <div className="action-btns">

            <button
               type="button"
               className="add-task-btn"
               onClick={addField}
            >
               + Add Task
            </button>

            <button
               type="submit"
               className="submit-task-btn"
               onClick={handleSubmit}
            >
               Assign Tasks
            </button>

         </div>
         <div className="close-btn">
            <button onClick={handleClose}>
               <GiTireIronCross size="20px"/>
            </button>
         </div>
      </div>
      
   );
};

export default AssignTask;