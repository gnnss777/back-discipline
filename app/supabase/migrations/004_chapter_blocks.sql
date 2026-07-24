-- Add content_blocks column to chapters
ALTER TABLE chapters
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN chapters.content_blocks IS 'Structured block-based content for the visual editor. Falls back to content_markdown if empty.';
