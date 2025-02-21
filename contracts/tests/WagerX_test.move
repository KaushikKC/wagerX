module prediction_markets::wagerx_test {
    #[test_only]

    use std::print;
    use std::vector;
    use signer;
    use timestamp;
    use prediction_markets::wagerx_core; // Import the core module
    use std::debug;
    
    #[test]
    public fun test_create_market() {
        let creator = signer::new_address(); // Create a new signer address
        let title = b"Test Market"; // Market title in bytes
        let description = b"Predict the outcome"; // Market description in bytes
        let duration = 3600; // 1 hour duration
        let outcomes_count = 2; // Two possible outcomes
        let is_private = false; // Public market
        let allowed_participants = vector::empty<address>(); // No restrictions
        let platform_fee = 100; // Example platform fee

        // Call the market creation function
        wagerx_core::create_market(
            &creator,
            title,
            description,
            duration,
            outcomes_count,
            is_private,
            allowed_participants,
            platform_fee
        );

        // Retrieve the created market details
        let market = wagerx_core::get_market(signer::address_of(&creator));

        // Assert the market details are correctly stored
        assert!(market.creator == signer::address_of(&creator), 1);
        assert!(market.title == title, 2);
        assert!(market.description == description, 3);
        assert!(market.total_pool == 0, 4);
        assert!(market.end_time == timestamp::now_seconds() + duration, 5);
        assert!(market.is_private == is_private, 6);
        assert!(market.platform_fee == platform_fee, 7);

        // Debug print for verification
        debug::print(&market);
    }
}
