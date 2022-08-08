<?php

namespace App\Services\Reviews;

use App\Models\TrustyouHotelReview;
use App\Models\TrustyouHotelReviewBadge;
use GuzzleHttp\Client as Guzzle;


class ReviewsService
{
    public function __construct()
    {

    }

    static public function getReviewsByHotels($hotels)
    {
        $data = TrustyouHotelReview::whereIn('UnicaID', $hotels)->whereNotNull('Score')->get();

        $reviews = [];
        foreach ($data as $review) {
            $reviews[$review->UnicaID] = [
                "reviews" => $review->ReviewsCount,
                "star" =>  $review->Score / 20,
                "scoreDescription" => $review->ScoreDescription,
            ];
        }

        return $reviews;
    }

    static public function getHotelReview($hotelID)
    {
        $data = TrustyouHotelReview::where('UnicaID', '=', $hotelID)->whereNotNull('Summary')->first();

        $review = null;
        if($data !== null) {
            $summary = json_decode($data->Summary, true);

            $ratings = [];
            foreach ($summary['reviews_distribution'] as $rating) {
                $ratings[] = [
                    "value" => $rating['stars'],
                    "percentage" => ($rating['reviews_count'] / $data->ReviewsCount) * 100,
                    "count" => $rating['reviews_count'],
                ];
            }
            $ratings = array_reverse($ratings);

            $badges = [];
            foreach ($data->badges as $index => $badge) {
                $badges[] = [
                    "text" => $badge->Text,
                    "subtext" => $badge->SubText
                ];

                if($index == 1) {
                    break;
                }
            }

            $review = [
                "summary" => $summary['text'],
                "trustyouID" => $data->TrustYouID,
                "ratings" => $ratings,
                "badges" => $badges,
                "cleanliness" => [],
            ];

            try {
                $client = new Guzzle([
                    'base_uri' => "http://api.trustyou.com/hotels/$review[trustyouID]/"
                ]);
                $response = $client->request('GET', "relevant_now.json", [
                    "query" => [
                        'key' => 'e322d37b-ae0d-4d1f-ace9-40ebd855b983',
                        'lang' => 'en'
                    ]
                ]);
            } catch (\Throwable $th) {
                return null;
            }

            try {
                $data = json_decode($response->getBody(), true);

                if (!empty($data['response'])) {
                    $cleanliness = $data['response']['relevant_now']['relevant_topics'];
                    $review['cleanliness']['cleanliness'] = number_format(($cleanliness['cleanliness']['score'] / 20), 1);
                    $review['cleanliness']['healthSafety'] = number_format(($cleanliness['health_safety']['score'] / 20), 1);

                    foreach ($cleanliness['health_safety']['sub_categories'] as $category) {
                        if($category['name'] == 'COVID-19') {
                            $review['cleanliness']['covid'] = number_format(($category['score'] / 20), 1);
                            break;
                        }
                    }
                }
            } catch (\Exception $e) {
                $review = null;
            }
        }

        return $review;
    }

}
