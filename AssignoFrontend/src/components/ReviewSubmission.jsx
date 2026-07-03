import { useState } from "react";

import {
    useAppDispatch,
    useAppSelector,
} from "../app/reduxHooks";

import {
    approveSubmission,
    rejectSubmission,
} from "../features/submissions/submissionThunk";
import { toast } from "react-toastify";


const ReviewSubmission = ({ submission, onBack }) => {

    const dispatch = useAppDispatch();

    const { token } = useAppSelector(state => state.auth);

    const [showRejectForm, setShowRejectForm] = useState(false);

    const [comment, setComment] = useState("");

    const [showApproveConfirm, setShowApproveConfirm] = useState(false);

    const handleApprove = async () => {

        try {

            await dispatch(
                approveSubmission(
                    submission.submissionId,
                    token
                )
            );

            toast.success("Submission approved successfully!");

            setShowApproveConfirm(
                false
            );

            onBack();

        } catch (error) {

            console.error(error);
        }
    };

    const handleReject = async () => {

            toast.warning("Rejection reason required");
            return;

        try {

            await dispatch(
                rejectSubmission(
                    submission.submissionId,
                    comment,
                    token
                )
            );

            toast.success("Submission rejected successfully!");

            onBack();

        } catch (error) {

            console.error(error);
        }
    };


    return (
        <div className="review-details">

            <button className="review-detail-btn"
                onClick={onBack}
            >
                Back
            </button>

            <h3>Task{": "}
                {
                    submission.taskTitle
                }
            </h3>

            <p>
                Member:
                {" "}
                {
                    submission.submittedByName
                }
            </p>

            <p>
                Email:
                {" "}
                {
                    submission.submittedByEmail
                }
            </p>

            <p>
                Submitted On:{" "}
                {new Date(
                    submission.createdAt
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    }
                )}
            </p>
            <p>
                Deadline:{" "}
                {new Date(
                    submission.deadline
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    }
                )}
            </p>

            <p>
                Note:
                {" "}
                {
                    submission.note
                }
            </p>

            <div>

                <h4>Links</h4>

                {submission.links.map(
                    (
                        link,
                        index
                    ) => (
                        <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {link}
                        </a>
                    )
                )}

            </div>

            <div>

                <h4>Files</h4>

                {submission.files.map(
                    (
                        file,
                        index
                    ) => (
                        <a
                            key={index}
                            href={file}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View File
                        </a>
                    )
                )}

            </div>

            {showApproveConfirm ? (

                <div className="approve-confirm-card">

                    <h4>
                        Approve Submission?
                    </h4>

                    <p>
                        This task will be marked as
                        completed.
                    </p>

                    <div className="approve-handle">
                        <button className="confirm-approve-btn"
                            onClick={handleApprove}
                        >
                            Confirm Approve
                        </button>

                        <button className="approve-cancel-btn"
                            onClick={() =>
                                setShowApproveConfirm(
                                    false
                                )
                            }
                        >
                            Cancel
                        </button>
                    </div>

                </div>

            ) : showRejectForm ? (

                <div className="reject-reason-card">

                    <h4>
                        Reject Reason
                    </h4>

                    <textarea
                        value={comment}
                        onChange={e =>
                            setComment(
                                e.target.value
                            )
                        }
                        rows={4}
                        placeholder="Enter rejection reason..."
                    />
                    <div className="reject-handle">
                        <button className="confirm-reject-btn"
                            onClick={handleReject}
                        >
                            Confirm Reject
                        </button>

                        <button className="reject-cancel-btn"
                            onClick={() => {
                                setShowRejectForm(false);
                                setComment("");
                            }}
                        >
                            Cancel
                        </button>
                    </div>

                </div>

            ) : (

                <div className="approve-action-handle">

                    <button className="approve-btn"
                        onClick={() =>
                            setShowApproveConfirm(
                                true
                            )
                        }
                    >
                        Approve
                    </button>

                    <button className="reject-btn"
                        onClick={() =>
                            setShowRejectForm(
                                true
                            )
                        }
                    >
                        Reject
                    </button>

                </div>

            )}

        </div>
    );
};

export default ReviewSubmission;