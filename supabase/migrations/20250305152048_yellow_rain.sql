/*
  # Create posts table for social media application

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `content` (text, required)
      - `user_id` (uuid, required, references auth.users)
      - `user_email` (text, required)
      - `created_at` (timestamp with time zone)
      - `likes` (integer, default 0)

  2. Security
    - Enable RLS on posts table
    - Add policies for:
      - Anyone can read posts
      - Authenticated users can create posts
      - Users can only update/delete their own posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  user_email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  likes integer DEFAULT 0
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  USING (true);

-- Allow authenticated users to create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);