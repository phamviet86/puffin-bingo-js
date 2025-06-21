-- FUNCTIONS
-- Tạo extension unaccent
SELECT extname
FROM pg_extension
WHERE extname = 'unaccent';
CREATE EXTENSION IF NOT EXISTS unaccent;
-- Tạo function dùng chung để cập nhật updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;