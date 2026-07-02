import {
    memberStart,
    addMemberSuccess,
    setMembers,
    memberFailure
} from "./memberSlice";

import {
    addMembersAPI,
    getProjectMembersAPI
} from "./memberAPI";

export const addMembers = ({ projectCode, membersData, token }) => async (dispatch) => {
    try {
        dispatch(memberStart());

        const response = await addMembersAPI({ projectCode, membersData, token });

        dispatch(addMemberSuccess(response.members));

        return response;
    } catch (error) {
        dispatch(
            memberFailure(
                error.response?.data?.message || "Add members failed"
            )
        );

        throw error;
    }
};

export const fetchProjectMembers = ({ projectCode, token }) => async (dispatch) => {
    try {
        dispatch(memberStart());

        const response = await getProjectMembersAPI({ projectCode, token });
        dispatch(setMembers(response.members));
    } catch (error) {
        dispatch(
            memberFailure(
                error.response?.data?.message || "Failed to load members"
            )
        );
    }
};
