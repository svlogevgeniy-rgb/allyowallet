use anchor_lang::prelude::*;

#[program]
mod allyo_smart_account {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, owner: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.owner = owner;
        state.timelock_seconds = 60;
        state.daily_limit = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = payer, space = 8 + AllyoState::LEN)]
    pub state: Account<'info, AllyoState>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct AllyoState {
    pub owner: Pubkey,
    pub timelock_seconds: u64,
    pub daily_limit: u64,
}

impl AllyoState {
    pub const LEN: usize = 32 + 8 + 8;
}
