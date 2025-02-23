module betting_contract::bet_nft {
    use std::error;
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_std::table::{Self, Table};
    use aptos_framework::event::{Self, EventHandle};

    // Error codes
    const ENO_PERMISSIONS: u64 = 1;
    const EBET_NOT_FOUND: u64 = 2;
    const EBET_ALREADY_EXISTS: u64 = 3;
    const EINVALID_AMOUNT: u64 = 4;
    const EBET_EXPIRED: u64 = 5;
    const ERISK_LIMIT_EXCEEDED: u64 = 6;
    const EBET_NOT_ACTIVE: u64 = 7;
    const EINVALID_NFT: u64 = 8;
    const EINVALID_MARKET: u64 = 9;
    const EINVALID_ODDS: u64 = 10;

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
    }

    public fun initialize(account: &signer) {
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
        });
    }

    public fun place_bet(
        account: &signer,
        market_id: u64,
        amount: u64,
        predicted_outcome: u8,
        odds: u64,
        expiry_timestamp: u64,
    ) acquires BettingContract {
        let user = signer::address_of(account);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);

        // Validate inputs
        assert!(amount > 0, error::invalid_argument(EINVALID_AMOUNT));
        assert!(expiry_timestamp > timestamp::now_seconds(), error::invalid_argument(EBET_EXPIRED));
        assert!(table::contains(&betting_contract.markets, market_id), error::not_found(EINVALID_MARKET));
        assert!(odds > 0, error::invalid_argument(EINVALID_ODDS));

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

    public fun modify_bet(
        account: &signer,
        bet_id: u64,
        new_amount: u64,
        new_outcome: u8,
    ) acquires BettingContract {
        let user = signer::address_of(account);
        let betting_contract = borrow_global_mut<BettingContract>(@betting_contract);
        
        assert!(table::contains(&betting_contract.bets, bet_id), error::not_found(EBET_NOT_FOUND));
        let bet = table::borrow_mut(&mut betting_contract.bets, bet_id);

        // Validate ownership and status
        assert!(bet.user == user, error::permission_denied(ENO_PERMISSIONS));
        assert!(bet.status == BET_STATUS_ACTIVE, error::invalid_state(EBET_NOT_ACTIVE));
        assert!(new_amount > 0, error::invalid_argument(EINVALID_AMOUNT));

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
        assert!(table::contains(&betting_contract.user_risks, user), error::not_found(ENO_PERMISSIONS));
        
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
        price: u64,
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