<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Article;
use App\Models\Event;
use App\Models\OrganizingCommittee;
use App\Models\ScientificCommittee;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with real data from the database.
     */
    public function index()
    {
        // Calculate base stats
        $organizingCommittees = OrganizingCommittee::count();
        $scientificCommittees = ScientificCommittee::count();

        $totalArticles = Article::count();
        $publishedArticles = Article::where('published', true)->count();
        $draftArticles = Article::where('published', false)->count();

        $totalEvents = Event::count();
        $activeEvents = Event::where('is_active', true)->count();

        $users = User::count();

        // Calculate monthly data (last 6 months)
        $monthlyArticles = $this->getMonthlyArticles();
        $monthlyEvents = $this->getMonthlyEvents();

        // Get recent activity
        $recentActivities = $this->getRecentActivities();

        // Calculate trends (comparing current month with previous month)
        $trends = $this->calculateTrends();

        return Inertia::render('dashboard', [
            'stats' => [
                'organizing_committees' => $organizingCommittees,
                'scientific_committees' => $scientificCommittees,
                'total_articles' => $totalArticles,
                'published_articles' => $publishedArticles,
                'draft_articles' => $draftArticles,
                'total_events' => $totalEvents,
                'active_events' => $activeEvents,
                'users' => $users,
            ],
            'monthly_articles' => $monthlyArticles,
            'monthly_events' => $monthlyEvents,
            'recent_activities' => $recentActivities,
            'trends' => $trends,
        ]);
    }

    /**
     * Get monthly published and draft articles for the last 6 months
     */
    private function getMonthlyArticles()
    {
        $result = [];
        $currentDate = Carbon::now();

        // Get data for the last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $month = $currentDate->copy()->subMonths($i);
            $monthName = $month->format('M'); // Short month name (Jan, Feb, etc.)
            $startOfMonth = $month->copy()->startOfMonth();
            $endOfMonth = $month->copy()->endOfMonth();

            // Count published articles in this month
            $publishedCount = Article::where('published', true)
                ->whereBetween('published_at', [$startOfMonth, $endOfMonth])
                ->count();

            // Count draft articles created in this month
            $draftCount = Article::where('published', false)
                ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->count();

            $result[] = [
                'month' => $monthName,
                'published' => $publishedCount,
                'draft' => $draftCount,
            ];
        }

        return $result;
    }

    /**
     * Get monthly events for the last 6 months
     */
    private function getMonthlyEvents()
    {
        $result = [];
        $currentDate = Carbon::now();

        // Get data for the last 6 months
        for ($i = 5; $i >= 0; $i--) {
            $month = $currentDate->copy()->subMonths($i);
            $monthName = $month->format('M'); // Short month name (Jan, Feb, etc.)
            $startOfMonth = $month->copy()->startOfMonth();
            $endOfMonth = $month->copy()->endOfMonth();

            // Count events starting in this month
            $eventsCount = Event::whereBetween('start_date', [$startOfMonth, $endOfMonth])->count();

            $result[] = [
                'month' => $monthName,
                'events' => $eventsCount,
            ];
        }

        return $result;
    }

    /**
     * Get recent activities across the system
     */
    private function getRecentActivities()
    {
        $activities = [];

        // Get recent events (last 7 days)
        $recentEvents = Event::where('created_at', '>=', Carbon::now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        foreach ($recentEvents as $event) {
            $activities[] = [
                'type' => 'event',
                'title' => "New event created: \"{$event->title}\"",
                'time' => $this->formatActivityTime($event->created_at),
            ];
        }

        // Get recent articles (last 7 days)
        $recentArticles = Article::where('created_at', '>=', Carbon::now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        foreach ($recentArticles as $article) {
            $status = $article->published ? 'published' : 'drafted';
            $activities[] = [
                'type' => 'article',
                'title' => "Article {$status}: \"{$article->title}\"",
                'time' => $this->formatActivityTime($article->created_at),
            ];
        }

        // Get recent committee members (last 7 days)
        $recentOrgCommittees = OrganizingCommittee::where('created_at', '>=', Carbon::now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get();

        foreach ($recentOrgCommittees as $committee) {
            $activities[] = [
                'type' => 'committee',
                'title' => "New organizing committee member added: \"{$committee->name}\"",
                'time' => $this->formatActivityTime($committee->created_at),
            ];
        }

        $recentSciCommittees = ScientificCommittee::where('created_at', '>=', Carbon::now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get();

        foreach ($recentSciCommittees as $committee) {
            $activities[] = [
                'type' => 'committee',
                'title' => "New scientific committee member: \"{$committee->name}\"",
                'time' => $this->formatActivityTime($committee->created_at),
            ];
        }

        // Get recent users (last 7 days)
        $recentUsers = User::where('created_at', '>=', Carbon::now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get();

        foreach ($recentUsers as $user) {
            $activities[] = [
                'type' => 'user',
                'title' => "New user registered: \"{$user->name}\"",
                'time' => $this->formatActivityTime($user->created_at),
            ];
        }

        // Sort by created_at (most recent first) and limit to 5
        usort($activities, function ($a, $b) {
            return strtotime($b['time']) - strtotime($a['time']);
        });

        return array_slice($activities, 0, 5);
    }

    /**
     * Format activity time in a user-friendly way
     */
    private function formatActivityTime($time)
    {
        $carbon = Carbon::parse($time);
        $now = Carbon::now();

        if ($carbon->isToday()) {
            return "Today at " . $carbon->format('g:i A');
        } else if ($carbon->isYesterday()) {
            return "Yesterday at " . $carbon->format('g:i A');
        } else if ($carbon->diffInDays($now) < 7) {
            return $carbon->diffInDays($now) . " days ago";
        } else {
            return $carbon->format('M d, Y');
        }
    }

    /**
     * Calculate trends by comparing current month with previous month
     */
    private function calculateTrends()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        $previousMonth = Carbon::now()->subMonth()->startOfMonth();

        // Committees trend
        $currentCommittees = OrganizingCommittee::where('created_at', '>=', $currentMonth)->count()
            + ScientificCommittee::where('created_at', '>=', $currentMonth)->count();

        $previousCommittees = OrganizingCommittee::whereBetween('created_at', [$previousMonth, $currentMonth])->count()
            + ScientificCommittee::whereBetween('created_at', [$previousMonth, $currentMonth])->count();

        $committeesTrend = $this->calculatePercentageChange($previousCommittees, $currentCommittees);

        // Articles trend
        $currentArticles = Article::where('created_at', '>=', $currentMonth)->count();
        $previousArticles = Article::whereBetween('created_at', [$previousMonth, $currentMonth])->count();
        $articlesTrend = $this->calculatePercentageChange($previousArticles, $currentArticles);

        // Events trend
        $currentEvents = Event::where('created_at', '>=', $currentMonth)->count();
        $previousEvents = Event::whereBetween('created_at', [$previousMonth, $currentMonth])->count();
        $eventsTrend = $this->calculatePercentageChange($previousEvents, $currentEvents);

        // Users trend
        $currentUsers = User::where('created_at', '>=', $currentMonth)->count();
        $previousUsers = User::whereBetween('created_at', [$previousMonth, $currentMonth])->count();
        $usersTrend = $this->calculatePercentageChange($previousUsers, $currentUsers);

        return [
            'committees' => [
                'value' => abs($committeesTrend),
                'isPositive' => $committeesTrend >= 0
            ],
            'articles' => [
                'value' => abs($articlesTrend),
                'isPositive' => $articlesTrend >= 0
            ],
            'events' => [
                'value' => abs($eventsTrend),
                'isPositive' => $eventsTrend >= 0
            ],
            'users' => [
                'value' => abs($usersTrend),
                'isPositive' => $usersTrend >= 0
            ],
        ];
    }

    /**
     * Calculate percentage change between two values
     */
    private function calculatePercentageChange($oldValue, $newValue)
    {
        if ($oldValue == 0) {
            return $newValue > 0 ? 100 : 0;
        }

        return round((($newValue - $oldValue) / $oldValue) * 100);
    }
}
