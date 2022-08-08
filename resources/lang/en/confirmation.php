<?php
	return [
		"thankYouHeader" => "Thank you for booking with :site!",
		"confirmationNumber" => 'Confirmation Number',
                                   "referenceNumber" => 'Reference Number',
		"vacationConfirmed" => "Your vacation package is",
                                   "pending" => 'Your vacation package is currently <span class="orange" style="color:#FC571F;" >processing</span>',
                                   "activityPending" => 'Your activity is currently <span class="orange" style="color:#FC571F;" >processing</span>',
                                   "insuranceConfirmed" => 'Your travel insurance is',
		"hotelConfirmed" => "Your hotel is",
                                   "activityConfirmed" => "Your activity is",
        		"rateAvailabilityMessage" => "Rates and availability are subject to change and are not guaranteed until payment has been processed. Call us at 1-866-873-3824 if you have any questions.",
                                  "confirmationHotelMessage" => "This confirmation is your document to check in to the hotel. Please ensure you present a valid credit card and proper identification upon check in for any incidentals incurred during your stay.",
		"confirmationFlightMessage" => "This confirmation is not your travel document. Tickets are issued electronically and we will email them to you within two weeks of departure, or within 48 hours for last minute reservations.",
                                   "confirmationPassport" => "Please ensure that all your bookings details are correct and verify that all passenger names are exactly as they appear on your valid passport(s).",
		"confirmationActivityMessage" => "This confirmation is not your travel document. Please ensure you present a valid credit card and proper identification for any incidentals incurred during your trip.",
                                   "confirmationPassport" => "Please ensure that all your bookings details are correct and verify that all passenger names are exactly as they appear on your valid passport(s).",
		
                                  "bookingSummary" => "Booking Summary",
		'insuranceMessage' => 'You will receive a separate email outlining your full insurance policy from Manulife. Please check your inbox or spam folder for this information from confirmations@igoinsured.com',
		'paymentSummary' => 'Payment Summary',
		'packageTotal' => 'Package Total',
		'insuranceTotal' => 'Insurance Total',
		'billingDetails' => 'Billing Details',
		'insuranceErrorWarningMessage' => 'Please note that your attempt to purchase travel insurance has <span class="red" style="color:#e60b0b;">FAILED</span> to process. A travel consultant will contact you as soon as possible (within our regular business hours) to process your insurance. you can call us at :phone or email <a href="mailto::email">:email</a> to process your insurance.',
  		'insuranceDeclinedMessage' => 'You have declined travel Insurance. It is strongly recommended that you purchase travel insurance before you depart for your trip.<br/>
                                     Emergencies can occur anywhere. Travel insurance protects you against unforeseen circumstances, offering you a worry free travel experience.<br/>
                                     For more information on insurance options please contact us at :phone or via email at <a href="mailto::email">:email</a>.',
		'insuranceErrorMessage' => 'Your travel insurance booking is currently processing.<br/>
                                     You can call us at :phone or email <a href="mailto::email">:email</a> to resolve the issue.',
        'dreamMilesSummary' => 'Dream Miles Summary',
        'airMilesCollectorNumber' => 'Air Miles Collector Number',
        'airMilesEarned' => 'Total Air Miles Earned',
        'petroPointSummary' => "Petro-Point Summary",
        'petroAccount' => 'Petro-Points Account',
        'regularPointsEarned' => 'Regular Points Earned',
        'bonusPointsEarned' => 'Bonus Points Earned',
        'petroPointsUsed'=>'Petro-Points used',
        'subTotal' => 'Sub Total',
        'redeemedTravelRewards' => "Redeemed Travel Rewards",
        'needHelp' => 'Need Help',
        'customerCareMessage' => 'If there are any issues please contact our Customer Care team at',
        'cancellationPolicy' => 'Cancellation Policy',
        'mandatoryInformation' => 'Mandatory Information',
        'refundableSummary' => 'This confirmation is not your travel document. Tickets are issued electronically and we will email them to you within two weeks or departure, or within 48 hours for last minute reservations.',
        'refundableTerms' => 'Click here for: <a href="'.str_replace(':locale:', App::getLocale(), config('site.refundable_terms_link')).'" target="_blank">Book with Confidence Terms and Conditions</a>',
        'refundableDeposit' => 'We have received your deposit.',
        'refundableBalance' => 'Outstanding Balance',
        'refundableDepositAmount' => 'Your remaining balance of $',
        'refundableDepositDate' => 'is due before',

        'cardColorBlue' => "BLUE",
        'cardColorGold' => "Gold",
        'cardColorOnyx' => "Onyx<sup>®</sup>",
        'useTowards' => 'Use towards your flight, hotel and car rental',
        '909UseYour' => 'You have $265.00 CAD to use towards your flight, hotel and car rental.',
        'travelRestrictions' => 'TRAVEL RESTRICTIONS AND E-VISA REQUIREMENTS',
        'travelRestrictionsText' => '
            <p>USE THIS HELPFUL TOOL TO DETERMINE WHAT ENTRY REQUIREMENTS AND TRAVEL RESTRICTIONS MAY BE IN PLACE FOR YOUR UPCOMING TRIP.</p><br />
            <p>With the ongoing changes in travel due to COVID-19, and the rapidness at which things are changing around us, we are continually adapting to serve the needs of our customers. Some countries only permit fully vaccinated travellers, while others require additional screening/testing upon arrival and/or prior to exiting their country. Additionally, the rules for returning home to Canada or the USA from international travel are also changing and can vary based on what destinations you have visited abroad. </p><br />
            <p>Another benefit of using the Sherpa tool is the ease of applying for an eVisa. Sherpa has partnered with many countries around the world to allow travellers the ability to apply and obtain an electronic Visa where required. <a href="'.str_replace(':locale:', App::getLocale(), config('site.travel_requirements')).'" target=\"_blank\" rel=\"noopener noreferrer\">Click here</a> for details</p>',
	];

