# Database Schema Documentation

This document serves as the single source of truth for the Sweet Dreams Music database schema. It tracks existing tables, their purpose, and planned additions.

## 1. Identity & Profiles

### `auth.users` (Supabase System Table)
-   **Purpose**: Manages user authentication and identity.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `email` (Text)
    -   `encrypted_password` (Text)
    -   `email_confirmed_at` (Timestamp)
    -   `invited_at` (Timestamp)
    -   `confirmation_token` (Text)
    -   `recovery_token` (Text)
    -   `email_change_token_new` (Text)
    -   `email_change` (Text)
    -   `last_sign_in_at` (Timestamp)
    -   `raw_app_meta_data` (JSONB)
    -   `raw_user_meta_data` (JSONB)
    -   `is_super_admin` (Boolean)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)
    -   `phone` (Text)
    -   `phone_confirmed_at` (Timestamp)
    -   `phone_change` (Text)
    -   `phone_change_token` (Text)
    -   `email_change_token_current` (Text)
    -   `email_change_confirm_status` (Int)
    -   `banned_until` (Timestamp)
    -   `reauthentication_token` (Text)
    -   `reauthentication_sent_at` (Timestamp)
    -   `is_sso_user` (Boolean)
    -   `deleted_at` (Timestamp)

### `profiles`
-   **Purpose**: Public and private user profile data. Extends `auth.users`.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `user_id` (UUID, FK)
    -   `display_name` (Text)
    -   `public_profile_slug` (Text)
    -   `bio` (Text)
    -   `profile_picture_url` (Text)
    -   `photo_1_url` (Text)
    -   `photo_2_url` (Text)
    -   `photo_3_url` (Text)
    -   `social_links` (JSONB)
    -   `level` (Int)
    -   `xp` (Int)
    -   `posting_streak` (Int)
    -   `onboarding_completed` (Boolean)
    -   `connected_platforms` (JSONB)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `oauth_tokens`
-   **Purpose**: Securely stores OAuth tokens for connected platforms.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `user_id` (UUID, FK)
    -   `platform` (Text)
    -   `platform_user_id` (Text)
    -   `platform_username` (Text)
    -   `access_token` (Text)
    -   `refresh_token` (Text)
    -   `token_type` (Text)
    -   `expires_at` (Timestamp)
    -   `refresh_token_expires_at` (Timestamp)
    -   `scopes` (Text[])
    -   `metadata` (JSONB)
    -   `is_active` (Boolean)
    -   `last_used_at` (Timestamp)
    -   `last_refresh_at` (Timestamp)
    -   `error_count` (Int)
    -   `last_error` (Text)
    -   `last_error_at` (Timestamp)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `admin_users`
-   **Purpose**: Manages admin access and credentials.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `email` (Text)
    -   `password_hash` (Text)
    -   `role` (Text)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

## 2. Booking System

### `bookings`
-   **Purpose**: Manages studio session bookings.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `user_id` (UUID, FK)
    -   `first_name` (Text)
    -   `last_name` (Text)
    -   `artist_name` (Text)
    -   `customer_name` (Text)
    -   `customer_email` (Text)
    -   `customer_phone` (Text)
    -   `start_time` (Timestamp)
    -   `end_time` (Timestamp)
    -   `duration` (Int)
    -   `status` (Text)
    -   `deposit_amount` (Int)
    -   `total_amount` (Int)
    -   `remainder_amount` (Int)
    -   `stripe_session_id` (Text)
    -   `stripe_customer_id` (Text)
    -   `stripe_payment_intent_id` (Text)
    -   `coupon_code` (Text)
    -   `discount_amount` (Int)
    -   `actual_deposit_paid` (Int)
    -   `same_day_fee` (Boolean)
    -   `after_hours_fee` (Boolean)
    -   `same_day_fee_amount` (Int)
    -   `after_hours_fee_amount` (Int)
    -   `admin_notes` (Text)
    -   `approved_at` (Timestamp)
    -   `rejected_at` (Timestamp)
    -   `rejected_reason` (Text)
    -   `cancellation_email_sent_at` (Timestamp)
    -   `deleted_at` (Timestamp)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `booking_audit_log`
-   **Purpose**: Tracks all changes to bookings for admin review.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `booking_id` (UUID, FK)
    -   `action` (Text)
    -   `performed_by` (Text)
    -   `details` (JSONB)
    -   `created_at` (Timestamp)

### `blocked_availability`
-   **Purpose**: Admin-managed blocked time slots.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `blocked_date` (Date)
    -   `start_time` (Int)
    -   `end_time` (Int)
    -   `reason` (Text)
    -   `block_entire_day` (Boolean)
    -   `created_by` (Text)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `webhook_failures`
-   **Purpose**: Logs Stripe webhook failures for debugging.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `webhook_type` (Text)
    -   `stripe_event_id` (Text)
    -   `stripe_session_id` (Text)
    -   `booking_id` (UUID, FK)
    -   `error_message` (Text)
    -   `error_details` (JSONB)
    -   `resolved` (Boolean)
    -   `resolved_at` (Timestamp)
    -   `created_at` (Timestamp)

## 3. Website Content (CMS)

### `contact_submissions`
-   **Purpose**: Stores inquiries from the contact form.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `name` (Text)
    -   `email` (Text)
    -   `company` (Text)
    -   `phone` (Text)
    -   `project_type` (Text)
    -   `budget_range` (Text)
    -   `message` (Text)
    -   `status` (Text)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `blog_posts`
-   **Purpose**: Content for the blog section.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `title` (Text)
    -   `slug` (Text)
    -   `excerpt` (Text)
    -   `content` (Text)
    -   `featured_image_url` (Text)
    -   `published` (Boolean)
    -   `meta_title` (Text)
    -   `meta_description` (Text)
    -   `author_id` (UUID, FK)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `testimonials`
-   **Purpose**: Client testimonials displayed on the site.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `client_name` (Text)
    -   `role` (Text)
    -   `company` (Text)
    -   `content` (Text)
    -   `rating` (Int)
    -   `featured` (Boolean)
    -   `display_order` (Int)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `portfolio_projects`
-   **Purpose**: Main portfolio items for the website showcase.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `title` (Text)
    -   `client` (Text)
    -   `description` (Text)
    -   `video_url` (Text)
    -   `thumbnail_url` (Text)
    -   `category` (Text)
    -   `budget_range` (Text)
    -   `duration_minutes` (Int)
    -   `year` (Int)
    -   `featured` (Boolean)
    -   `published` (Boolean)
    -   `sort_order` (Int)
    -   `slug` (Text)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

## 4. Library & Artist Portfolio

### `deliverables` (My Library)
-   **Purpose**: Stores files delivered to clients.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `user_id` (UUID, FK)
    -   `file_name` (Text)
    -   `display_name` (Text)
    -   `file_path` (Text)
    -   `file_size` (BigInt)
    -   `file_type` (Text)
    -   `uploaded_by` (UUID, FK)
    -   `uploaded_by_name` (Text)
    -   `description` (Text)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `library_notes`
-   **Purpose**: Communication between engineers and clients.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `user_id` (UUID, FK)
    -   `admin_id` (UUID, FK)
    -   `admin_name` (Text)
    -   `note_content` (Text)
    -   `category` (Text)
    -   `created_at` (Timestamp)

### `profile_projects`
-   **Purpose**: Artist's personal discography (Albums, Singles) on their profile.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `user_id` (UUID, FK)
    -   `project_name` (Text)
    -   `project_type` (Text)
    -   `description` (Text)
    -   `cover_image_url` (Text)
    -   `release_date` (Date)
    -   `display_order` (Int)
    -   `is_public` (Boolean)
    -   `spotify_link` (Text)
    -   `apple_music_link` (Text)
    -   `youtube_link` (Text)
    -   `soundcloud_link` (Text)
    -   `bandcamp_link` (Text)
    -   `tidal_link` (Text)
    -   `amazon_music_link` (Text)
    -   `deezer_link` (Text)
    -   `custom_links` (JSONB)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

### `profile_audio_showcase`
-   **Purpose**: Selected library tracks displayed on public profile.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `user_id` (UUID, FK)
    -   `deliverable_id` (UUID, FK)
    -   `custom_title` (Text)
    -   `custom_description` (Text)
    -   `display_order` (Int)
    -   `created_at` (Timestamp)
    -   `updated_at` (Timestamp)

## 5. Dream Suite (AI & Analytics) - [PLANNED / IN PROGRESS]

### `daily_metrics`
-   **Purpose**: Time-series data for artist growth tracking.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `artist_id` (UUID, FK)
    -   `platform` (Text)
    -   `metric_type` (Text)
    -   `metric_value` (Numeric)
    -   `metadata` (JSONB)
    -   `collected_at` (Timestamp)

### `ai_insights`
-   **Purpose**: Stores strategic advice generated by AI agents.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `artist_id` (UUID, FK)
    -   `insight_type` (Text)
    -   `content` (JSONB)
    -   `is_read` (Boolean)
    -   `created_at` (Timestamp)

### `artist_memory` (Vector Store)
-   **Purpose**: Long-term semantic memory for the AI.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `artist_id` (UUID, FK)
    -   `content` (Text)
    -   `embedding` (vector)
    -   `metadata` (JSONB)
    -   `created_at` (Timestamp)

### `chat_messages`
-   **Purpose**: History of conversations with the Career Agent.
-   **Columns**:
    -   `id` (UUID, PK)
    -   `artist_id` (UUID, FK)
    -   `role` (Text)
    -   `content` (Text)
    -   `created_at` (Timestamp)
