package dev.valen.wall;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Repository
class NoteRepository {

    private final JdbcTemplate jdbc;
    private final ObjectMapper json;

    NoteRepository(JdbcTemplate jdbc, ObjectMapper json) {
        this.jdbc = jdbc;
        this.json = json;
        jdbc.execute("""
            CREATE TABLE IF NOT EXISTS notes (
                id         TEXT PRIMARY KEY,
                created_at TEXT NOT NULL,
                author     TEXT,
                color      TEXT NOT NULL,
                strokes    TEXT NOT NULL,
                status     TEXT NOT NULL DEFAULT 'approved',
                ip_hash    TEXT
            )
            """);
        jdbc.execute("CREATE INDEX IF NOT EXISTS idx_notes_created ON notes (created_at)");
    }

    Note insert(NoteInput input, String ipHash) {
        String id = UUID.randomUUID().toString();
        String createdAt = Instant.now().truncatedTo(ChronoUnit.MILLIS).toString();
        jdbc.update(
            "INSERT INTO notes (id, created_at, author, color, strokes, status, ip_hash) VALUES (?, ?, ?, ?, ?, 'approved', ?)",
            id, createdAt, input.author(), input.color(), write(input.strokes()), ipHash);
        return new Note(id, createdAt, input.author(), input.color(), input.strokes());
    }

    List<Note> list(String before, int limit) {
        if (before != null) {
            return jdbc.query(
                "SELECT id, created_at, author, color, strokes FROM notes WHERE status = 'approved' AND created_at < ? ORDER BY created_at DESC LIMIT ?",
                this::map, before, limit);
        }
        return jdbc.query(
            "SELECT id, created_at, author, color, strokes FROM notes WHERE status = 'approved' ORDER BY created_at DESC LIMIT ?",
            this::map, limit);
    }

    private Note map(ResultSet rs, int row) throws java.sql.SQLException {
        return new Note(
            rs.getString("id"),
            rs.getString("created_at"),
            rs.getString("author"),
            rs.getString("color"),
            read(rs.getString("strokes")));
    }

    private String write(List<Stroke> strokes) {
        try {
            return json.writeValueAsString(strokes);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<Stroke> read(String strokes) {
        try {
            return json.readValue(strokes, new TypeReference<List<Stroke>>() {
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
