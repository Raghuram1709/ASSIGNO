import React, {
  useState,
} from "react";
import { MdDeleteOutline } from "react-icons/md";
import { GiTireIronCross } from "react-icons/gi";
import CustomSelect from "./CustomSelect";

const roles = [
  "designer",
  "developer",
  "tester",
  "analyst",
  "architect",
];

const AddMembers = ({
  onSubmit,
  closeModel,
}) => {
  const [closing, setClosing] =
    useState(false);

  const [members, setMembers] =
    useState([
      {
        email: "",
        role: "developer",
      },
    ]);

  const handleChange = (
    index,
    field,
    value
  ) => {
    const updatedMembers = [
      ...members,
    ];

    updatedMembers[index][field] =
      value;

    setMembers(updatedMembers);
  };

  const addField = () => {
    setMembers([
      ...members,
      {
        email: "",
        role: "developer",
      },
    ]);
  };

  const removeField = (
    index
  ) => {
    const updatedMembers =
      members.filter(
        (_, i) => i !== index
      );

    setMembers(updatedMembers);
  };

  const handleSubmit = () => {
    const filteredMembers =
      members.filter(
        (member) =>
          member.email.trim()
      );

    if (
      filteredMembers.length === 0
    )
      return;

    onSubmit(filteredMembers);

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
      className={`add-members-container ${
        closing
          ? "modal-exit"
          : "modal-enter"
      }`}
    >
      <h2 className="add-members-title">
        Add Members
      </h2>

      {members.map(
        (member, index) => (
          <div
            key={index}
            className="member-input-group"
          >
            <input
              type="email"
              placeholder="Email"
              value={
                member.email
              }
              onChange={(e) =>
                handleChange(
                  index,
                  "email",
                  e.target.value
                )
              }
            />

            <CustomSelect
              options={roles}
              value={member.role}
              onChange={(role) =>
                handleChange(
                  index,
                  "role",
                  role
                )
              }
              placeholder="Select Role"
            />

            {members.length >
              1 && (
              <button
                className="delete-member-btn"
                type="button"
                onClick={() =>
                  removeField(
                    index
                  )
                }
              >
                <MdDeleteOutline size="25px" />
              </button>
            )}
          </div>
        )
      )}

      <div className="action-btns">
        <button
          type="button"
          className="add-member-btn"
          onClick={addField}
        >
          + Add Member
        </button>

        <button
          type="button"
          className="submit-members-btn"
          onClick={
            handleSubmit
          }
        >
          Proceed
        </button>
      </div>

      <div className="close-btn">
        <button
          onClick={
            handleClose
          }
        >
          <GiTireIronCross size="20px" />
        </button>
      </div>
    </div>
  );
};

export default AddMembers;