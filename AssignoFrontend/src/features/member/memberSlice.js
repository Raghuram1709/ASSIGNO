import { createSlice } from "@reduxjs/toolkit";

const mapMember = (member) => ({
    memberId: member._id || member.id,
    userId:
        member.user?._id ||
        member.user ||
        member.userId ||
        null,
    email:
        member.user?.email ||
        member.email ||
        null,
    name:
        member.user?.name ||
        member.name ||
        null,
    role: member.role,
    progress: member.progress
});

const initialState = {
    members: [],
    loading: false,
    error: null,
    message: null
};

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
        memberStart: (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        addMemberSuccess: (state, action) => {
            state.loading = false;
            state.message = "Members added successfully";
            state.members.push(...action.payload.map(mapMember));
        },
        setMembers: (state, action) => {
            state.loading = false;
            state.members = action.payload.map(mapMember);
        },
        memberFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        }
    }
});

export const {
    memberStart,
    addMemberSuccess,
    setMembers,
    memberFailure
} = memberSlice.actions;

export default memberSlice.reducer;
