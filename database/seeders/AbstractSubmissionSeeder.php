<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AbstractSubmission;
use App\Models\SubmissionPayment;
use App\Models\SubmissionContributor;
use App\Models\User;
use App\Models\Country;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AbstractSubmissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and countries
        $users = User::all();
        $countries = Country::all();
        
        if ($users->isEmpty()) {
            $this->command->error('No users found. Please run UserSeeder first.');
            return;
        }
        
        if ($countries->isEmpty()) {
            $this->command->error('No countries found. Please run CountrySeeder first.');
            return;
        }

        // Sample abstract titles and content
        $abstractTitles = [
            'Sustainable Agriculture Practices in Rural Communities',
            'Digital Transformation in Small-Scale Farming',
            'Climate Change Impact on Rice Production',
            'Integrated Pest Management for Sustainable Farming',
            'Water Conservation Techniques in Agriculture',
            'Organic Farming: Benefits and Challenges',
            'Smart Irrigation Systems for Water Efficiency',
            'Post-Harvest Technology for Rural Farmers',
            'Renewable Energy Applications in Agriculture',
            'Food Security and Sustainable Development',
            'Precision Agriculture Using IoT Technology',
            'Community-Based Natural Resource Management',
            'Sustainable Livestock Management Practices',
            'Agroforestry Systems for Climate Resilience',
            'Rural Economic Development Through Agriculture',
            'Women Empowerment in Agricultural Development',
            'Youth Participation in Rural Agriculture',
            'Biotechnology Applications in Crop Production',
            'Soil Health Management for Sustainable Farming',
            'Market Access Strategies for Small Farmers',
            'Agricultural Extension Services Effectiveness',
            'Crop Diversification for Risk Management',
            'Integrated Farming Systems Approach',
            'Climate-Smart Agriculture Practices',
            'Rural Tourism and Agricultural Development',
            'Microfinance Impact on Rural Communities',
            'Agricultural Value Chain Development',
            'Sustainable Fisheries Management',
            'Rural Infrastructure Development',
            'Agricultural Innovation and Technology Transfer'
        ];

        $abstractContents = [
            'This study examines the implementation and effectiveness of sustainable agriculture practices in rural communities. The research focuses on environmentally friendly farming methods that promote long-term agricultural productivity while preserving natural resources.',
            'The digital revolution has transformed various sectors, and agriculture is no exception. This research investigates how digital technologies can be implemented in small-scale farming operations to improve efficiency and productivity.',
            'Climate change poses significant challenges to agricultural production worldwide. This study analyzes the specific impacts of changing weather patterns on rice cultivation and proposes adaptation strategies.',
            'Integrated Pest Management (IPM) represents a holistic approach to pest control that minimizes environmental impact while maintaining crop yields. This research evaluates IPM strategies suitable for developing countries.',
            'Water scarcity is a growing concern in agricultural regions. This study explores innovative water conservation techniques that can be adopted by farmers to ensure sustainable water use in agriculture.',
        ];

        $keywords = [
            ['sustainable agriculture', 'rural development', 'environmental conservation'],
            ['digital transformation', 'smart farming', 'technology adoption'],
            ['climate change', 'rice production', 'adaptation strategies'],
            ['pest management', 'integrated approach', 'sustainable farming'],
            ['water conservation', 'irrigation efficiency', 'drought management']
        ];

        $statuses = ['pending', 'approved', 'rejected'];
        $paymentStatuses = ['pending', 'approved', 'rejected'];

        for ($i = 0; $i < 30; $i++) {
            $user = $users->random();
            $country = $countries->random();
            $titleIndex = $i % count($abstractTitles);
            $contentIndex = $i % count($abstractContents);
            $keywordIndex = $i % count($keywords);
            
            // Generate phone number
            $phoneNumber = '+62' . rand(8000000000, 8999999999);
            
            // Create submission
            $submission = AbstractSubmission::create([
                'id' => Str::ulid(),
                'user_id' => $user->id,
                'country_id' => $country->id,
                'title' => $abstractTitles[$titleIndex],
                'abstract' => $abstractContents[$contentIndex] . ' This research aims to provide valuable insights and practical solutions for addressing challenges in rural agricultural development.',
                'keywords' => $keywords[$keywordIndex],
                'author_first_name' => $user->name ? explode(' ', $user->name)[0] : 'John',
                'author_last_name' => $user->name && count(explode(' ', $user->name)) > 1 ? explode(' ', $user->name)[1] : 'Doe',
                'author_email' => $user->email,
                'author_affiliation' => 'University of ' . $country->name,
                'author_phone_number' => $phoneNumber,
                'status' => $statuses[array_rand($statuses)],
                'submitted_at' => Carbon::now()->subDays(rand(1, 30)),
                'created_at' => Carbon::now()->subDays(rand(1, 30)),
                'updated_at' => Carbon::now(),
            ]);

            // Add random contributors (0-3 contributors)
            $contributorCount = rand(0, 3);
            for ($j = 0; $j < $contributorCount; $j++) {
                $contributorUser = $users->random();
                $contributorCountry = $countries->random();
                
                SubmissionContributor::create([
                    'id' => Str::ulid(),
                    'submission_id' => $submission->id,
                    'first_name' => 'Contributor' . ($j + 1),
                    'last_name' => 'Name' . rand(100, 999),
                    'email' => 'contributor' . ($j + 1) . rand(100, 999) . '@example.com',
                    'phone_number' => '+62' . rand(8000000000, 8999999999),
                    'affiliation' => 'Research Institute ' . $contributorCountry->name,
                    'country_id' => $contributorCountry->id,
                    'is_primary_contact' => $j === 0,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }

            // Create payment if submission is approved or has payment status
            if ($submission->status === 'approved' || rand(1, 100) > 30) {
                $totalParticipants = 1 + $contributorCount; // Main author + contributors
                $feePerParticipant = 150000; // IDR 150,000
                $totalAmount = $totalParticipants * $feePerParticipant;
                
                $payment = SubmissionPayment::create([
                    'id' => Str::ulid(),
                    'submission_id' => $submission->id,
                    'amount' => $totalAmount,
                    'expected_amount' => $totalAmount,
                    'status' => $paymentStatuses[array_rand($paymentStatuses)],
                    'payment_proof' => rand(1, 100) > 30 ? '/storage/payment-proofs/sample-payment-' . $i . '.jpg' : null,
                    'admin_notes' => rand(1, 100) > 70 ? 'Payment verified and approved.' : null,
                    'uploaded_at' => rand(1, 100) > 20 ? Carbon::now()->subDays(rand(1, 15)) : null,
                    'created_at' => Carbon::now()->subDays(rand(1, 20)),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }

        $this->command->info('Created 30 abstract submissions with contributors and payments.');
    }
}
