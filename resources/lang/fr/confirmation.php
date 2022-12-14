<?php

return [
	"thankYouHeader" => "Thank you for booking with :site!",
	"confirmationNumber" =>'Numéro de confirmation',
	"vacationConfirmed" =>'Votre forfait vacances est',
	"pending" => 'Votre forfait de vacances est en cours <span class="orange" style="color:#FC571F;" >de traitement</span>',
	"activityPending" =>'Votre activité de vacances est en cours <span class="orange" style="color:#FC571F;" >de traitement</span>',
                  "insuranceConfirmed" =>'Votre assurance voyage',
	"hotelConfirmed" =>'Votre hôtel est',
                  "activityConfirmed" => 'Votre activité est',
	"rateAvailabilityMessage" =>"Les tarifs et la disponibilité sont sujets à changement et ne sont garantis qu'une fois le paiement effectué. Contactez-nous au 1-866-873-3824 si vous avez des questions",
	"confirmationHotelMessage" => "This confirmation is your document to check in to the hotel. Please ensure you present a valid credit card and proper identification upon check in for any incidentals incurred during your stay.",
	"confirmationFlightMessage" => "Cette confirmation n'est pas votre document de voyage. Les billets sont émis par voie électronique et nous vous les enverrons par courriel dans les deux semaines avant le départ, ou dans les 48 heures pour les réservations de dernière minute.",
	"confirmationActivityMessage" => "Cette confirmation n'est pas votre document de voyage. Veuillez vous assurer de présenter une carte de crédit valide et une pièce d'identité appropriée pour tout incident encouru pendant votre voyage.",
                   "confirmationPassport" => "Veuillez-vous assurer que tous les détails de vos réservations sont corrects et vérifiez que tous les noms des passagers sont exactement tels qu'ils apparaissent sur votre ou votre (vos) passeport (s) en cours de validité.",
	"bookingSummary" => "Résumé de la réservation",
	'insuranceMessage' => "Vous recevrez un courriel distinct décrivant votre police d'assurance complète de Manuvie. Veuillez vérifier votre boîte de réception ou votre dossier pourriel pour obtenir ces informations confirmations@igoinsured.com",
	'paymentSummary' => "Sommaire du paiement",
	'packageTotal' => "Total du forfait",
	'insuranceTotal' => "Total assurance",
	'billingDetails' => "Détails de la facturation",
	'insuranceErrorWarningMessage' => "Veuillez noter que votre tentative de souscrire une assurance voyage a <span class='red' style='color:#e60b0b;'>échoué</span>. Un conseiller en voyages vous contactera dans les plus brefs délais (pendant nos heures d'ouverture normales) pour traiter votre assurance. Vous pouvez nous contacter au: 000-000-0000 ou par courriel pour traiter votre assurance.",
	'insuranceDeclinedMessage' => "Vous avez refusé l'assurance voyage. Il est fortement recommandé de souscrire une assurance voyage avant de partir pour votre voyage.<br>Les urgences peuvent survenir n'importe où. L'assurance voyage vous protège contre des circonstances imprévues, vous offrant une expérience de voyage sans souci.<br>Pour plus d'informations sur les options d'assurance, veuillez nous contacter par téléphone au :phone ou par courriel à <a href=\"mailto::email\">:email</a>",
	'insuranceErrorMessage' => "Votre réservation d'assurance voyage est en cours de traitement.<br>Vous pouvez nous contacter au :phone ou nous envoyer un courriel à <a href=\"mailto::email\">:email</a> pour résoudre le problème.",
	'dreamMilesSummary' => "Sommaire Récompenses Rêves",
	'airMilesCollectorNumber' => "Numéro adhérent Air Miles",
	'airMilesEarned' => "Total Air Miles accumulés",
	'petroPointSummary' => "Sommaire Petro-Points",
	'petroAccount' => "Compte Petro-Points",
	'regularPointsEarned' => "Points de base accumulés",
	'bonusPointsEarned' => "Points en prime accumulés",
	'petroPointsUsed'=> "Petro-Points utilisés",
	'subTotal' => "Sous-total",
	'redeemedTravelRewards' => "Récompenses de voyage échangées",
	'needHelp' => "Besoin d’aide",
	'customerCareMessage' => "En cas de problème, veuillez contacter notre équipe du service à la clientèle au",
	'mandatoryInformation' => 'Renseignements obligatoires',
	'cancellationPolicy' => 'politique d\'annulation',
	'refundableSummary' => 'Cette confirmation n\'est pas votre document de voyage. Les billets sont émis électroniquement et nous vous les enverrons par courriel dans les deux semaines précédant le départ ou dans les 48 heures pour les réservations de dernière minute.',
	'refundableTerms' => 'Cliquez ici pour les <a href="'.str_replace(':locale:', App::getLocale(), config('site.refundable_terms_link')).'" target="_blank">Réserver en toute confiance modalités et conditions.</a>',
	'refundableDeposit' => 'Nous avons reçu votre dépôt.',
	'refundableBalance' => 'Solde impayé',
	'refundableDepositAmount' => 'Votre solde restant de',
    'refundableDepositDate' => '$ est dû avant le',

    'cardColorBlue' => "Bleu",
  	'cardColorGold' => "Or",
  	'cardColorOnyx' => "Onyx<sup>®</sup>",
    'useTowards' => 'Utilisez pour votre vol, hôtel et location de voiture',
  	'909UseYour' => 'Vous disposez de 265,00 $ CAD à utiliser pour votre vol, votre hôtel et votre location de voiture.',
  	'travelRestrictions' => 'RESTRICTIONS POUR LES VOYAGES ET EXIGENCES DU E-VISA',
	'travelRestrictionsText' => "
		<p>UTILISEZ CET OUTIL UTILE POUR DÉTERMINER LES CONDITIONS D'ENTRÉE ET LES RESTRICTIONS DE VOYAGE QUI PEUVENT ÊTRE EN VIGUEUR POUR VOTRE PROCHAIN VOYAGE.</p><br />
		<p>Avec les changements continus liés aux voyages dus à la COVID-19, et la rapidité avec laquelle les choses changent autour de nous, nous nous adaptons continuellement pour répondre aux besoins de nos clients. Certains pays n'autorisent que les voyageurs entièrement vaccinés, tandis que d'autres exigent un dépistage/test supplémentaire à l'arrivée et/ou avant la sortie du pays. En outre, les règles relatives au retour au Canada ou aux États-Unis après un voyage international évoluent également et peuvent varier selon les destinations que vous avez visitées à l'étranger.</p><br />
 		<p>Un autre avantage d'utiliser l'outil Sherpa est la facilité à demander un e-Visa. Sherpa s'est associé à de nombreux pays dans le monde pour permettre aux voyageurs de demander et d'obtenir un visa électronique lorsque cela est nécessaire. <a href=\"".str_replace(':locale:', App::getLocale(), config('site.travel_requirements'))."\" target=\"_blank\" rel=\"noopener noreferrer\">Cliquez ici</a> pour plus de détails</p>"
];
