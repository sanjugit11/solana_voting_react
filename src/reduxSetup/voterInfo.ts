import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Pool {
    signer: string;
    pool_id: number;
}
interface Candidate {
    signer: string;
    pool_id: number;
    candidatePda:string;
}
interface Vote {
    signer: string;
    pool_id: number;
    candidatePda:string;
}

const initialState: any = {
    pools: [],
    candidate: [],
    vote:[],
};


const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    initializpolls: (state, action: PayloadAction<Pool>) => {
        console.log('Payload received:', action.payload); // Log the action payload
        state.pools.push(action.payload);
        console.log('Updated state:', JSON.parse(JSON.stringify(state.pools)));
    },
    initializCandidates: (state, action: PayloadAction<Candidate>) => {
        console.log('candidates received:==>', action.payload); // Log the action payload
        state.candidate.push(action.payload);
        console.log('candidates state:==>', JSON.parse(JSON.stringify(state.candidate)));
    },
    initializVotes: (state, action: PayloadAction<Vote>) => {
        console.log('vote received:==>', action.payload); // Log the action payload
        state.vote.push(action.payload);
        console.log('vote state:==>', JSON.parse(JSON.stringify(state.vote)));
    },
    resetState :()=> initialState
  },
});

export const { initializpolls,initializCandidates,initializVotes,resetState } = counterSlice.actions;
export default counterSlice.reducer;
