package dev.valen.wall;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/api")
class NoteController {

    private final NoteRepository notes;
    private final RateLimiter rateLimiter;
    private final Validation validation;

    // We never store raw ips. A salted hash is enough to rate limit without
    // keeping personal data around.
    private final String salt;

    NoteController(NoteRepository notes, RateLimiter rateLimiter, Validation validation,
                   @Value("${IP_SALT:dev-salt}") String salt) {
        this.notes = notes;
        this.rateLimiter = rateLimiter;
        this.validation = validation;
        this.salt = salt;
    }

    @GetMapping("/health")
    Map<String, Object> health() {
        return Map.of("ok", true);
    }

    @GetMapping("/notes")
    Map<String, Object> list(@RequestParam(required = false) String before,
                             @RequestParam(required = false) Integer limit) {
        int capped = Math.min(100, Math.max(1, limit == null ? 60 : limit));
        return Map.of("notes", notes.list(before, capped));
    }

    @PostMapping("/notes")
    ResponseEntity<?> post(@RequestBody NoteInput body, HttpServletRequest req) {
        String ipHash = hash(salt + req.getRemoteAddr());
        if (rateLimiter.limited(ipHash)) {
            return error(HttpStatus.TOO_MANY_REQUESTS, "too many notes for now, come back in a bit");
        }
        Note note = notes.insert(validation.validate(body), ipHash);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("note", note));
    }

    @ExceptionHandler(ValidationException.class)
    ResponseEntity<?> onInvalid(ValidationException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<?> onUnreadable(HttpMessageNotReadableException e) {
        return error(HttpStatus.BAD_REQUEST, "bad body");
    }

    private static ResponseEntity<Object> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }

    private static String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.substring(0, 16);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
