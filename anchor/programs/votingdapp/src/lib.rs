use anchor_lang::prelude::*;

declare_id!("Dvr7cy9KKAtxKtTz4eSqYG9dwvEVzvLSViEFE7DerSSS");

#[program]
pub mod voting {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>,
                           poll_id: u64,
                           description: String,
                           poll_start: i64,
                           poll_end: i64) -> Result<()> {
        require!(poll_start < poll_end, CustomError::InvalidPollDuration);
        require!(description.len() <= 280, CustomError::DescriptionTooLong);

        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;

        msg!("Poll initialized: {{ \"poll_id\": {}, \"description\": \"{}\", \"poll_start\": {}, \"poll_end\": {} }}", poll_id, poll.description, poll_start, poll_end);
        
        Ok(())
    }

    pub fn initialize_candidate(ctx: Context<InitializeCandidate>,
                                candidate_name: String,
                                _poll_id: u64) -> Result<()> {
        require!(ctx.accounts.poll.poll_start > Clock::get()?.unix_timestamp, CustomError::PollAlreadyStarted);
        require!(!candidate_name.trim().is_empty(), CustomError::InvalidCandidateName);

        let candidate = &mut ctx.accounts.candidate;
        let poll = &mut ctx.accounts.poll;
        const MAX_CANDIDATES: u64 = 100;
        require!(poll.candidate_amount < MAX_CANDIDATES, CustomError::MaxCandidatesReached);
        
        poll.candidate_amount += 1;
        candidate.candidate_name = candidate_name;
        candidate.candidate_votes = 0;

        msg!("Candidate initialized: {{ \"candidate_name\": \"{}\", \"poll_id\": {} }}", candidate.candidate_name, _poll_id);

        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, _candidate_name: String, _poll_id: u64) -> Result<()> {
        let current_time = Clock::get()?.unix_timestamp;
        let poll = &ctx.accounts.poll;

        require!(current_time >= poll.poll_start && current_time <= poll.poll_end, CustomError::PollNotActive);

        let voter_record = &mut ctx.accounts.voter_record;
        require!(!voter_record.has_voted, CustomError::AlreadyVoted);

        voter_record.has_voted = true;
        voter_record.vote_timestamp = current_time; // Record the voting time

        let candidate = &mut ctx.accounts.candidate;
        candidate.candidate_votes += 1;   
        
        msg!("Vote recorded: {{ \"poll_id\": {}, \"candidate_name\": \"{}\", \"voter\": \"{}\", \"timestamp\": {} }}", _poll_id, _candidate_name, ctx.accounts.signer.key(), current_time);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct Vote<'info> {
    #[account(mut)] // Marked as mutable to satisfy the payer constraint
    pub signer: Signer<'info>,
    #[account(
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + VoterRecord::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref(), signer.key().as_ref()],
        bump,
    )]
    pub voter_record: Account<'info, VoterRecord>,
    pub system_program: Program<'info, System>
}

    #[derive(Accounts)]
    #[instruction(candidate_name: String, poll_id: u64)]
    pub struct InitializeCandidate<'info> {
        #[account(mut)]
        pub signer: Signer<'info>,
        #[account(
            mut,
            seeds = [poll_id.to_le_bytes().as_ref()],
            bump,
        )]
        pub poll: Account<'info, Poll>,
        #[account(
            init,
            payer = signer,
            space = 8 + Candidate::INIT_SPACE,
            seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
            bump,
        )]
        pub candidate: Account<'info, Candidate>,
        pub system_program: Program<'info, System>
    }

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    pub system_program: Program<'info, System>
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(280)]
    pub description: String,
    pub poll_start: i64, // Changed to i64 for Unix timestamp compatibility
    pub poll_end: i64,
    pub candidate_amount: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(32)]
    pub candidate_name: String,
    pub candidate_votes: u64,
}

#[account]
#[derive(InitSpace)]
pub struct VoterRecord {
    pub has_voted: bool,
    pub vote_timestamp: i64, // Added to prevent replay attacks
}

#[error_code]
pub enum CustomError {
    #[msg("Poll duration is invalid. Start time must be less than end time.")]
    InvalidPollDuration,
    #[msg("The poll has already started. Candidates cannot be added.")]
    PollAlreadyStarted,
    #[msg("Poll is not active.")]
    PollNotActive,
    #[msg("You have already voted in this poll.")]
    AlreadyVoted,
    #[msg("Candidate name is invalid.")]
    InvalidCandidateName,
    #[msg("Description exceeds the maximum allowed length.")]
    DescriptionTooLong,
    #[msg("The maximum number of candidates for this poll has been reached.")]
    MaxCandidatesReached,
}
