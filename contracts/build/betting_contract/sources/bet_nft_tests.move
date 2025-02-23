#[test_only]
module betting_contract::bet_nft_tests {
    use std::signer;
    use std::string;
    use aptos_framework::account;
    use aptos_framework::timestamp;
    use betting_contract::bet_nft;
    use aptos_framework::genesis;

    // Test constants
    const MARKET_ID: u64 = 1;
    const BET_AMOUNT: u64 = 100;
    const ODDS: u64 = 200;
    const EXPIRY_TIME: u64 = 1000000000;

    // Helper function to create test accounts
    fun create_test_account(): signer {
        account::create_account_for_test(@0x42)
    }

    // Helper function to setup basic test environment
    fun setup(): signer {
        // Create framework account
        let framework_signer = account::create_account_for_test(@aptos_framework);
        
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(&framework_signer);
        
        // Create and setup admin account
        let admin = create_test_account();
        bet_nft::initialize(&admin);
        
        // Set current timestamp
        timestamp::update_global_time_for_test_secs(1000000);
        
        admin
    }

    #[test]
    fun test_initialize() {
        let admin = create_test_account();
        bet_nft::initialize(&admin);
        assert!(bet_nft::get_bet_count() == 0, 1);
    }

    #[test]
    fun test_place_bet() {
        let admin = setup();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        assert!(bet_nft::get_bet_count() == 1, 1);
    }

    #[test]
    fun test_modify_bet() {
        let admin = setup();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        let new_amount = 200;
        bet_nft::modify_bet(
            &admin,
            1, // bet_id
            new_amount,
            bet_nft::get_outcome_no()
        );

        assert!(bet_nft::get_bet_amount(1) == new_amount, 1);
    }

    #[test]
    fun test_check_bet_outcome() {
        let admin = setup();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        let is_winner = bet_nft::check_bet_outcome(1, bet_nft::get_outcome_yes());
        assert!(is_winner, 1);
    }

    #[test]
    fun test_process_payout() {
        let admin = setup();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        bet_nft::process_payout(&admin, 1, BET_AMOUNT * 2);
        
        assert!(bet_nft::get_bet_status(1) == bet_nft::get_status_completed(), 1);
    }

    #[test]
    fun test_enforce_risk_limits() {
        let admin = setup();
        let addr = signer::address_of(&admin);
        
        assert!(bet_nft::enforce_risk_limits(addr, 500000, 1000000), 1);
        assert!(!bet_nft::enforce_risk_limits(addr, 1500000, 1000000), 1);
    }

    #[test]
    fun test_convert_bet_to_nft() {
        let admin = setup();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        bet_nft::convert_bet_to_nft(
            &admin,
            1,
            string::utf8(b"https://metadata.uri"),
            EXPIRY_TIME
        );

        assert!(bet_nft::get_nft_count() == 1, 1);
    }

    #[test]
    fun test_transfer_ownership() {
        let admin = setup();
        let new_owner = create_test_account();
        let new_owner_addr = signer::address_of(&new_owner);
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        bet_nft::convert_bet_to_nft(
            &admin,
            1,
            string::utf8(b"https://metadata.uri"),
            EXPIRY_TIME
        );

        bet_nft::transfer_ownership(&admin, new_owner_addr, 1);
        assert!(bet_nft::get_nft_owner(1) == new_owner_addr, 1);
    }

    #[test]
    fun test_buy_nft_bet() {
        let admin = setup();
        let buyer = create_test_account();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        bet_nft::convert_bet_to_nft(
            &admin,
            1,
            string::utf8(b"https://metadata.uri"),
            EXPIRY_TIME
        );

        bet_nft::buy_nft_bet(&buyer, 1, BET_AMOUNT);
        assert!(bet_nft::get_nft_owner(1) == signer::address_of(&buyer), 1);
    }

    #[test]
    #[expected_failure(abort_code = bet_nft::ENO_PERMISSIONS)]
    fun test_unauthorized_bet_modification() {
        let admin = setup();
        let other_user = create_test_account();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            BET_AMOUNT,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );

        bet_nft::modify_bet(
            &other_user,
            1,
            200,
            bet_nft::get_outcome_no()
        );
    }

    #[test]
    #[expected_failure(abort_code = bet_nft::EINVALID_AMOUNT)]
    fun test_invalid_bet_amount() {
        let admin = setup();
        
        bet_nft::place_bet(
            &admin,
            MARKET_ID,
            0,
            bet_nft::get_outcome_yes(),
            ODDS,
            EXPIRY_TIME
        );
    }
}