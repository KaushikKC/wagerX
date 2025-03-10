module betting_contract::bet_nft_v3 {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};
    use aptos_framework::event::{Self, EventHandle};

    // Error codes
   const ENO_PERMISSIONS: u64 = 0x10001; // 65537
    const EBET_NOT_FOUND: u64 = 0x10002;
    const EBET_ALREADY_EXISTS: u64 = 0x10003;
    const EINVALID_AMOUNT: u64 = 4; // Keep this as 4 to match test expectation
    const EBET_EXPIRED: u64 = 0x10005;
    const ERISK_LIMIT_EXCEEDED: u64 = 0x10006;
    const EBET_NOT_ACTIVE: u64 = 0x10007;
    const EINVALID_NFT: u64 = 0x10008;
    const EINVALID_MARKET: u64 = 0x10009;
    const EINVALID_ODDS: u64 = 0x1000A;
    const EUNAUTHORIZED_AGENT: u64 = 0x1000B; // New error code for unauthorized agents


    // Bet status
    const BET_STATUS_ACTIVE: u8 = 0;
    const BET_STATUS_COMPLETED: u8 = 1;
    const BET_STATUS_CANCELLED: u8 = 2;
    const BET_STATUS_LIQUIDATED: u8 = 3;

    // Bet outcome
    const OUTCOME_YES: u8 = 1;
    const OUTCOME_NO: u8 = 2;

    struct Bet has store {
        id: u64,
        market_id: u64,
        user: address,
        amount: u64,
        predicted_outcome: u8,
        odds: u64,
        expiry_timestamp: u64,
        status: u8,
        risk_level: u8,
        locked_funds: u64,
        created_at: u64,
    }

    struct BetNFT has key, store {
        nft_id: u64,
        bet_id: u64,
        owner: address,
        metadata_uri: String,
        expiry_timestamp: u64,
    }

    struct Market has store {
        id: u64,
        result: u8,
        is_settled: bool,
    }

    struct UserRiskProfile has store {
        total_exposure: u64,
        max_risk_limit: u64,
    }

    // Events
    struct BetPlacedEvent has drop, store {
        bet_id: u64,
        market_id: u64,
        user: address,
        amount: u64,
        odds: u64,
    }

    struct BetSettledEvent has drop, store {
        bet_id: u64,
        user: address,
        payout_amount: u64,
    }

    struct NFTMintedEvent has drop, store {
        nft_id: u64,
        bet_id: u64,
        owner: address,
    }

    struct BettingContract has key {
        bets: Table<u64, Bet>,
        markets: Table<u64, Market>,
        user_risks: Table<address, UserRiskProfile>,
        nfts: Table<u64, BetNFT>,
        bet_count: u64,
        nft_count: u64,
        bet_placed_events: EventHandle<BetPlacedEvent>,
        bet_settled_events: EventHandle<BetSettledEvent>,
        nft_minted_events: EventHandle<NFTMintedEvent>,
        // New field to track authorized agents for each user
        authorized_agents: Table<address, Table<address, AuthorizedAgent>>,
        agent_authorized_events: EventHandle<AgentAuthorizedEvent>,
    }

    struct AgentAuthorizedEvent has drop, store {
        owner: address,
        agent: address,
        is_authorized: bool,

    }

        // New struct to track authorized agents
    struct AuthorizedAgent has store {
        is_authorized: bool,
    }

   public fun init_betting_contract(account: &signer) acquires BettingContract {
        let account_addr = signer::address_of(account);
        if (!exists<BettingContract>(account_addr)) {
            move_to(account, BettingContract {
                bets: table::new(),
                markets: table::new(),
                user_risks: table::new(),
                nfts: table::new(),
                bet_count: 0,
                nft_count: 0,
                bet_placed_events: account::new_event_handle<BetPlacedEvent>(account),
                bet_settled_events: account::new_event_handle<BetSettledEvent>(account),
                nft_minted_events: account::new_event_handle<NFTMintedEvent>(account),
                 authorized_agents: table::new(),
                agent_authorized_events: account::new_event_handle<AgentAuthorizedEvent>(account),
            });
            
            // Initialize first market
            let betting_contract = borrow_global_mut<BettingContract>(account_addr);
            table::add(&mut betting_contract.markets, 1, Market {
                id: 1,
                result: 0,
                is_settled: false,
            });

            // Initialize default risk profile
            table::add(&mut betting_contract.user_risks, account_addr, UserRiskProfile {
                total_exposure: 0,
                max_risk_limit: 1000000,
            });
        };
    }


    fun init_module(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<BettingContract>(account_addr), error::already_exists(EBET_ALREADY_EXISTS));

        move_to(account, BettingContract {
            bets: table::new(),
            markets: table::new(),
            user_risks: table::new(),
            nfts: table::new(),
            bet_count: 0,
            nft_count: 0,
            bet_placed_events: account::new_event_handle<BetPlacedEvent>(account),
            bet_settled_events: account::new_event_handle<BetSettledEvent>(account),
            nft_minted_events: account::new_event_handle<NFTMintedEvent>(account),
             authorized_agents: table::new(),
            agent_authorized_events: account::new_event_handle<AgentAuthorizedEvent>(account),
    
        });
    }

    public fun get_outcome_yes(): u8 { OUTCOME_YES }
    public fun get_outcome_no(): u8 { OUTCOME_NO }
    public fun get_status_completed(): u8 { BET_STATUS_COMPLETED }

    public fun get_bet_count(): u64 acquires BettingContract {
        borrow_global<BettingContract>(@betting_contract).bet_count
    }

    public fun get_bet_amount(bet_id: u64): u64 acquires BettingContract {
        let betting_contract = borrow_global<BettingContract>(@betting_contract);
        let bet = table::borrow(&betting_contract.bets, bet_id);
        bet.amount
    }

    public fun get_bet_status(bet_id: u64): u8 acquires BettingContract {
        let betting_contract = borrow_global<BettingContract>(@betting_contract);
        let bet = table::borrow(&betting_contract.bets, bet_id);
        bet.status
    }

    public fun get_nft_count(): u64 acquires BettingContract {
        borrow_global<BettingContract>(@betting_contract).nft_count
    }

    public fun get_nft_owner(nft_id: u64): address acquires BettingContract {
        let betting_contract = borrow_global<BettingContract>(@betting_contract);
        let nft = table::borrow(&betting_contract.nfts, nft_id);
        nft.owner
    }


    public entry fun place_bet(
        account: &signer,
        market_id: u64,
        amount: u64,
        predicted_outcome: u8,
        odds: u64,
        expiry_timestamp: u64,
    ) acquires BettingContract {
        let user = signer::address_of(account);
        
        // Move amount validation before accessing any resources
        if (amount == 0) {
            abort EINVALID_AMOUNT
        };

        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);

        // Other validations
        assert!(expiry_timestamp > timestamp::now_seconds(), EBET_EXPIRED);
        assert!(table::contains(&betting_contract.markets, market_id), EINVALID_MARKET);
        assert!(odds > 0, EINVALID_ODDS);

        // Create new bet
        let bet_id = betting_contract.bet_count + 1;
        let bet = Bet {
            id: bet_id,
            market_id,
            user,
            amount,
            predicted_outcome,
            odds,
            expiry_timestamp,
            status: BET_STATUS_ACTIVE,
            risk_level: 0,
            locked_funds: amount,
            created_at: timestamp::now_seconds(),
        };

        // Update user risk profile
        if (!table::contains(&betting_contract.user_risks, user)) {
            table::add(&mut betting_contract.user_risks, user, UserRiskProfile {
                total_exposure: 0,
                max_risk_limit: 1000000, // Default limit
            });
        };
        let user_risk = table::borrow_mut(&mut betting_contract.user_risks, user);
        user_risk.total_exposure = user_risk.total_exposure + amount;

        // Store bet and update counter
        table::add(&mut betting_contract.bets, bet_id, bet);
        betting_contract.bet_count = bet_id;

        // Emit event
        event::emit_event(&mut betting_contract.bet_placed_events, BetPlacedEvent {
            bet_id,
            market_id,
            user,
            amount,
            odds,
        });
    }

        // Multi-signer version - agent places bet on behalf of the owner
    public entry fun place_bet_with_agent(
        agent: &signer,
        owner: &signer,
        market_id: u64,
        amount: u64,
        predicted_outcome: u8,
        odds: u64,
        expiry_timestamp: u64,
    ) acquires BettingContract {
        let agent_addr = signer::address_of(agent);
        let owner_addr = signer::address_of(owner);
        
        // Move amount validation before accessing any resources
        if (amount == 0) {
            abort EINVALID_AMOUNT
        };

        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        
        // Verify agent is authorized
        assert!(
            table::contains(&betting_contract.authorized_agents, owner_addr) && 
            table::contains(table::borrow(&betting_contract.authorized_agents, owner_addr), agent_addr) &&
            table::borrow(table::borrow(&betting_contract.authorized_agents, owner_addr), agent_addr).is_authorized,
            EUNAUTHORIZED_AGENT
        );

        // Other validations
        assert!(expiry_timestamp > timestamp::now_seconds(), EBET_EXPIRED);
        // assert!(table::contains(&betting_contract.markets, market_id), EINVALID_MARKET);
        assert!(odds > 0, EINVALID_ODDS);

        // Create and store bet using the owner's address
        create_and_store_bet(
            betting_contract,
            market_id,
            owner_addr,
            amount,
            predicted_outcome,
            odds,
            expiry_timestamp
        );
    }


    fun create_and_store_bet(
        betting_contract: &mut BettingContract,
        market_id: u64,
        user: address,
        amount: u64,
        predicted_outcome: u8,
        odds: u64,
        expiry_timestamp: u64,
    ) {
        // Create new bet
        let bet_id = betting_contract.bet_count + 1;
        let bet = Bet {
            id: bet_id,
            market_id,
            user,
            amount,
            predicted_outcome,
            odds,
            expiry_timestamp,
            status: BET_STATUS_ACTIVE,
            risk_level: 0,
            locked_funds: amount,
            created_at: timestamp::now_seconds(),
        };

        // Update user risk profile
        if (!table::contains(&betting_contract.user_risks, user)) {
            table::add(&mut betting_contract.user_risks, user, UserRiskProfile {
                total_exposure: 0,
                max_risk_limit: 1000000, // Default limit
            });
        };
        let user_risk = table::borrow_mut(&mut betting_contract.user_risks, user);
        user_risk.total_exposure = user_risk.total_exposure + amount;

        // Store bet and update counter
        table::add(&mut betting_contract.bets, bet_id, bet);
        betting_contract.bet_count = bet_id;

        // Emit event
        event::emit_event(&mut betting_contract.bet_placed_events, BetPlacedEvent {
            bet_id,
            market_id,
            user,
            amount,
            odds,
        });
    }

     public entry fun authorize_agent(
        owner: &signer,
        agent_addr: address,
        is_authorized: bool
    ) acquires BettingContract {
        let owner_addr = signer::address_of(owner);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        
        // Initialize the agent table for this owner if it doesn't exist
        if (!table::contains(&betting_contract.authorized_agents, owner_addr)) {
            table::add(&mut betting_contract.authorized_agents, owner_addr, table::new<address, AuthorizedAgent>());
        };
        
        let owner_agents = table::borrow_mut(&mut betting_contract.authorized_agents, owner_addr);
        
        // Add or update agent authorization
        if (!table::contains(owner_agents, agent_addr)) {
            table::add(owner_agents, agent_addr, AuthorizedAgent { is_authorized });
        } else {
            let agent = table::borrow_mut(owner_agents, agent_addr);
            agent.is_authorized = is_authorized;
        };
        
        // Emit event
        event::emit_event(&mut betting_contract.agent_authorized_events, AgentAuthorizedEvent {
            owner: owner_addr,
            agent: agent_addr,
            is_authorized,
        });
    }


    public fun modify_bet(
        account: &signer,
        bet_id: u64,
        new_amount: u64,
        new_outcome: u8,
    ) acquires BettingContract {
        let user = signer::address_of(account);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        
        assert!(table::contains(&betting_contract.bets, bet_id), EBET_NOT_FOUND);
        let bet = table::borrow(&betting_contract.bets, bet_id);
        
        if (bet.user != user) {
            abort ENO_PERMISSIONS
        };

        let bet = table::borrow_mut(&mut betting_contract.bets, bet_id);
        assert!(bet.status == BET_STATUS_ACTIVE, EBET_NOT_ACTIVE);
        assert!(new_amount > 0, EINVALID_AMOUNT);

        // Update risk profile
        let user_risk = table::borrow_mut(&mut betting_contract.user_risks, user);
        user_risk.total_exposure = user_risk.total_exposure - bet.amount + new_amount;

        // Update bet
        bet.amount = new_amount;
        bet.predicted_outcome = new_outcome;
        bet.locked_funds = new_amount;
    }

    public fun check_bet_outcome(
        bet_id: u64,
        market_result: u8,
    ): bool acquires BettingContract {
        let betting_contract = borrow_global<BettingContract>(@betting_contract);
        let bet = table::borrow(&betting_contract.bets, bet_id);
        
        bet.predicted_outcome == market_result
    }

    public fun process_payout(
        account: &signer,
        bet_id: u64,
        payout_amount: u64,
    ) acquires BettingContract {
        let user = signer::address_of(account);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        let bet = table::borrow_mut(&mut betting_contract.bets, bet_id);

        assert!(bet.user == user, error::permission_denied(ENO_PERMISSIONS));
        assert!(bet.status == BET_STATUS_ACTIVE, error::invalid_state(EBET_NOT_ACTIVE));

        // Update bet status and process payout
        bet.status = BET_STATUS_COMPLETED;
        
        // Update risk profile
        let user_risk = table::borrow_mut(&mut betting_contract.user_risks, user);
        user_risk.total_exposure = user_risk.total_exposure - bet.amount;

        // Emit settlement event
        event::emit_event(&mut betting_contract.bet_settled_events, BetSettledEvent {
            bet_id,
            user,
            payout_amount,
        });
    }

    public fun enforce_risk_limits(
        user: address,
        total_exposure: u64,
        max_risk_limit: u64,
    ): bool acquires BettingContract {
        let betting_contract = borrow_global<BettingContract>(@betting_contract);
        
        // If user doesn't have a risk profile, return false
        if (!table::contains(&betting_contract.user_risks, user)) {
            return false
        };
        
        let user_risk = table::borrow(&betting_contract.user_risks, user);
        total_exposure <= max_risk_limit
    }


    public fun liquidate_bet(
        account: &signer,
        bet_id: u64,
        liquidation_reason: String,
    ) acquires BettingContract {
        let user = signer::address_of(account);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        let bet = table::borrow_mut(&mut betting_contract.bets, bet_id);

        assert!(bet.user == user, error::permission_denied(ENO_PERMISSIONS));
        assert!(bet.status == BET_STATUS_ACTIVE, error::invalid_state(EBET_NOT_ACTIVE));

        // Update bet status
        bet.status = BET_STATUS_LIQUIDATED;

        // Update risk profile
        let user_risk = table::borrow_mut(&mut betting_contract.user_risks, user);
        user_risk.total_exposure = user_risk.total_exposure - bet.amount;
    }

    public fun convert_bet_to_nft(
        account: &signer,
        bet_id: u64,
        metadata_uri: String,
        expiry_timestamp: u64,
    ) acquires BettingContract {
        let user = signer::address_of(account);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        
        assert!(table::contains(&betting_contract.bets, bet_id), error::not_found(EBET_NOT_FOUND));
        let bet = table::borrow(&betting_contract.bets, bet_id);
        assert!(bet.user == user, error::permission_denied(ENO_PERMISSIONS));

        // Create NFT
        let nft_id = betting_contract.nft_count + 1;
        let nft = BetNFT {
            nft_id,
            bet_id,
            owner: user,
            metadata_uri,
            expiry_timestamp,
        };

        // Store NFT
        table::add(&mut betting_contract.nfts, nft_id, nft);
        betting_contract.nft_count = nft_id;

        // Emit NFT minted event
        event::emit_event(&mut betting_contract.nft_minted_events, NFTMintedEvent {
            nft_id,
            bet_id,
            owner: user,
        });
    }

    public fun transfer_ownership(
        from: &signer,
        to: address,
        bet_nft_id: u64,
    ) acquires BettingContract {
        let from_addr = signer::address_of(from);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        
        assert!(table::contains(&betting_contract.nfts, bet_nft_id), error::not_found(EINVALID_NFT));
        let nft = table::borrow_mut(&mut betting_contract.nfts, bet_nft_id);
        assert!(nft.owner == from_addr, error::permission_denied(ENO_PERMISSIONS));

        // Update NFT ownership
        nft.owner = to;

        // Update bet ownership
        let bet = table::borrow_mut(&mut betting_contract.bets, nft.bet_id);
        bet.user = to;
    }

    public fun buy_nft_bet(
        buyer: &signer,
        bet_nft_id: u64,
        _price: u64,
    ) acquires BettingContract {
        let buyer_addr = signer::address_of(buyer);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        
        assert!(table::contains(&betting_contract.nfts, bet_nft_id), error::not_found(EINVALID_NFT));
        let nft = table::borrow_mut(&mut betting_contract.nfts, bet_nft_id);

        // Transfer ownership
        let previous_owner = nft.owner;
        nft.owner = buyer_addr;

        // Update bet ownership
        let bet = table::borrow_mut(&mut betting_contract.bets, nft.bet_id);
        bet.user = buyer_addr;

        // Update risk profiles
        let seller_risk = table::borrow_mut(&mut betting_contract.user_risks, previous_owner);
        seller_risk.total_exposure = seller_risk.total_exposure - bet.amount;

        if (!table::contains(&betting_contract.user_risks, buyer_addr)) {
            table::add(&mut betting_contract.user_risks, buyer_addr, UserRiskProfile {
                total_exposure: bet.amount,
                max_risk_limit: 1000000, // Default limit
            });
        } else {
            let buyer_risk = table::borrow_mut(&mut betting_contract.user_risks, buyer_addr);
            buyer_risk.total_exposure = buyer_risk.total_exposure + bet.amount;
        };
    }
}