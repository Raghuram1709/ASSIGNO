import { useState } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../app/reduxHooks";

import {
  createCommunication,
} from "../features/commincations/communicationThunk";

import CustomSelect from "../components/CustomSelect";
import Loader from "./Loader";
import { toast } from "react-toastify";

const CommunicationPanel = ({
  projectCode,
}) => {

  const dispatch =
    useAppDispatch();

  const { token } =
    useAppSelector(
      state => state.auth
    );

  const { members } =
    useAppSelector(
      state => state.member
    );

  const [
    scope,
    setScope,
  ] = useState("project");

  const [
    recipientId,
    setRecipientId,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    sending,
    setSending,
  ] = useState(false);

  // CustomSelect options
  const memberOptions =
    members
      .filter(
        member =>
          member.role !== "lead"
      )
      .map(member => ({
        id: member.userId,
        name: member.name,
      }));

  const selectedMember =
    memberOptions.find(
      member =>
        member.id === recipientId
    ) || null;

  const handleSubmit =
    async () => {

      if (
        !message.trim()
      ) {
        toast.warning("Message is required");
        return;
      }

      if (
        scope === "member" &&
        !recipientId
      ) {
        toast.warning("Please select a member");
        return;
      }

      try {

        setSending(true);

        await dispatch(
          createCommunication({
            projectCode,
            scope,
            recipientId,
            message,
            token,
          })
        );

        toast.success("Message sent successfully");

        setMessage("");
        setRecipientId("");

      } catch (error) {

        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
          "Failed to send message"
        );

      } finally {

        setSending(false);

      }
    };

  return (

    <div className="communication-panel">

      <h3>
        Communication
      </h3>

      <div className="communication-scope">


        <div className="communication-input">
          <input
            type="radio"
            value="project"
            checked={
              scope ===
              "project"
            }
            onChange={() =>
              setScope(
                "project"
              )
            }
            id="project"
          />
          <label for="project">Project Message</label>
        </div>
        <div className="communication-input">
          <input
            type="radio"
            value="member"
            checked={
              scope ===
              "member"
            }
            onChange={() =>
              setScope(
                "member"
              )
            }
            id="member"
          />
          <label for="member">Member Message</label>
        </div>

      </div>

      {scope ===
        "member" && (

          <CustomSelect
            options={
              memberOptions
            }
            value={
              selectedMember
            }
            onChange={member =>
              setRecipientId(
                member.id
              )
            }
            placeholder="Select Member"
            labelKey="name"
            variant="communication"
          />

        )}
      <div className="response">
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={e =>
            setMessage(
              e.target.value
            )
          }
        />

        <button 
          className="send-msg-btn"
          onClick={handleSubmit}
          disabled={sending}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          {sending ? (
            <>
              <Loader variant="sweep" size="small" />
              <span>Sending...</span>
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </div>


    </div>
  );
};

export default CommunicationPanel;