module prediction_markets ::core {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    
    // Error codes
    const ERR_INVALID_AMOUNT: u64 = 1;
    const ERR_MARKET_CLOSED: u64 = 2;
    const ERR_UNAUTHORIZED: u64 = 3;
    const ERR_ALREADY_SETTLED: u64 = 4;
    const ERR_INVALID_OUTCOME: u64 = 5;
    
    struct Market has key {
        creator: address,
        title: vector<u8>,
        description: vector<u8>,
        total_pool: u64,
        end_time: u64,
        is_settled: bool,
        winning_outcome: u8,
        outcomes: vector<Outcome>,
        is_private: bool,
        allowed_participants: vector<address>,
        platform_fee: u64, // In basis points (e.g., 250 = 2.5%)
    }
    
    struct Outcome has store {
        id: u8,
        pool_amount: u64,
        total_bets: u64,
    }
    
    struct UserBet has store {
        market_id: u64,
        outcome_id: u8,
        amount: u64,
        timestamp: u64,
    }
    
    struct UserProfile has key {
        bets: vector<UserBet>,
        xp_points: u64,
        wins: u64,
        losses: u64,
    }
    
    // Market creation
    public entry fun create_market(
        creator: &signer,
        title: vector<u8>,
        description: vector<u8>,
        duration: u64,
        outcomes_count: u8,
        is_private: bool,
        allowed_participants: vector<address>,
        platform_fee: u64,
    ) {
        let creator_addr = signer::address_of(creator);
        let current_time = timestamp::now_seconds();
        
        let outcomes = vector::empty<Outcome>();
        let i = 0;
        while (i < outcomes_count) {
            vector::push_back(&mut outcomes, Outcome {
                id: i,
                pool_amount: 0,
                total_bets: 0,
            });
            i = i + 1;
        };
        
        move_to(creator, Market {
            creator: creator_addr,
            title,                                                                                                                                      
            description,
            total_pool: 0,
            end_time: current_time + duration,
            is_settled: false,
            winning_outcome: 0,
            outcomes,
            is_private,
            allowed_participants,
            platform_fee,
        });
    }
    
    // Place bet
    public entry fun place_bet(
        bettor: &signer,
        market_addr: address,
        outcome_id: u8,
        amount: u64,
    ) acquires Market {
        let market = borrow_global_mut<Market>(market_addr);
        let current_time = timestamp::now_seconds();
        
        // Validations
        assert!(current_time < market.end_time, ERR_MARKET_CLOSED);
        assert!(!market.is_settled, ERR_MARKET_CLOSED);
        assert!(amount > 0, ERR_INVALID_AMOUNT);
        
        // Check if private market
        if (market.is_private) {
            let bettor_addr = signer::address_of(bettor);
            let is_allowed = vector::contains(&market.allowed_participants, &bettor_addr);
            assert!(is_allowed, ERR_UNAUTHORIZED);
        };
        
        // Update market state
        market.total_pool = market.total_pool + amount;
        
        let outcome = vector::borrow_mut(&mut market.outcomes, (outcome_id as u64));
        outcome.pool_amount = outcome.pool_amount + amount;
        outcome.total_bets = outcome.total_bets + 1;
        
        // Record bet in user profile
        if (!exists<UserProfile>(signer::address_of(bettor))) {
            move_to(bettor, UserProfile {
                bets: vector::empty(),
                xp_points: 0,
                wins: 0,
                losses: 0,
            });
        };
        
        let profile = borrow_global_mut<UserProfile>(signer::address_of(bettor));
        vector::push_back(&mut profile.bets, UserBet {
            market_id: 0, // TODO: Implement market ID system
            outcome_id,
            amount,
            timestamp: current_time,
        });
    }
    
    // Settle market
    public entry fun settle_market(
        settler: &signer,
        market_addr: address,
        winning_outcome: u8,
    ) acquires Market {
        let market = borrow_global_mut<Market>(market_addr);
        
        // Only creator can settle
        assert!(signer::address_of(settler) == market.creator, ERR_UNAUTHORIZED);
        assert!(!market.is_settled, ERR_ALREADY_SETTLED);
        assert!(winning_outcome < vector::length(&market.outcomes), ERR_INVALID_OUTCOME);
        
        market.is_settled = true;
        market.winning_outcome = winning_outcome;
        
        // TODO: Implement payout distribution
    }
    
    // Claim winnings
    public entry fun claim_winnings(
        winner: &signer,
        market_addr: address,
    ) acquires Market, UserProfile {
        let market = borrow_global<Market>(market_addr);
        assert!(market.is_settled, ERR_MARKET_CLOSED);
        
        let winner_addr = signer::address_of(winner);
        let profile = borrow_global_mut<UserProfile>(winner_addr);
        
        // TODO: Calculate and distribute winnings
        // TODO: Update XP points and win/loss record
    }
}

// NFT Module for Gamification
module prediction_markets::nft_rewards {
    use std::signer;
    use aptos_framework::account;
    
    struct NFTCollection has key {
        badge_tokens: vector<BadgeNFT>,
    }
    
    struct BadgeNFT has store {
        id: u64,
        badge_type: u8, // 0 = winner, 1 = streak, 2 = volume
        metadata_uri: vector<u8>,
    }
    
    public fun mint_winner_badge(
        recipient: &signer,
        market_addr: address,
    ) {
        // TODO: Implement NFT minting logic
    }
}

// Oracle Module for External Data
module prediction_markets::oracle {
    use std::signer;
    
    struct OracleData has key {
        source: address,
        data_type: vector<u8>,
        value: vector<u8>,
        timestamp: u64,
    }
    
    public fun update_oracle_data(
        oracle: &signer,
        data_type: vector<u8>,
        value: vector<u8>,
    ) {
        // TODO: Implement oracle data update logic
    }
}

// DAO Module for Group Governance
module prediction_markets::dao {
    use std::signer;
    use std::vector;
    
    struct GroupDAO has key {
        members: vector<address>,
        voting_power: vector<u64>,
        proposals: vector<Proposal>,
    }
    
    struct Proposal has store {
        id: u64,
        proposer: address,
        description: vector<u8>,
        votes_for: u64,
        votes_against: u64,
        status: u8, // 0 = active, 1 = passed, 2 = failed
    }
    
    public fun create_group(
        creator: &signer,
        initial_members: vector<address>,
    ) {
        // TODO: Implement group creation logic
    }
    
    public fun submit_proposal(
        proposer: &signer,
        group_addr: address,
        description: vector<u8>,
    ) {
        // TODO: Implement proposal submission logic
    }
}