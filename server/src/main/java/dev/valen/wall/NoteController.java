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

    // One note per visitor, like signing a wall once. Best effort by ip, set
    // ONE_PER_IP=false in dev if you want to keep posting test notes.
    private final boolean onePerIp;

    // We never store raw ips. A salted hash is enough to rate limit and cap one
    // note per person without keeping personal data around.
    private final String salt;

    NoteController(NoteRepository notes, RateLimiter rateLimiter, Validation validation,
                   @Value("${ONE_PER_IP:true}") boolean onePerIp,
                   @Value("${IP_SALT:dev-salt}") String salt) {
        this.notes = notes;
        this.rateLimiter = rateLimiter;
        this.validation = validation;
        this.onePerIp = onePerIp;
        this.salt = salt;
    }

    @GetMapping("/health")
    Map<String, Object> health() {
        return Map.of("ok", true);
    }

    @GetMapping("/me")
    Map<String, Object> me(HttpServletRequest req) {
        return Map.of("hasPosted", onePerIp && notes.hasPostedFrom(visitorHash(req)));
    }

    @GetMapping("/notes")
    Map<String, Object> list(@RequestParam(required = false) String before,
                             @RequestParam(required = false) Integer limit) {
        int capped = Math.min(100, Math.max(1, limit == null ? 60 : limit));
        return Map.of("notes", notes.list(before, capped));
    }

    @PostMapping("/notes")
    ResponseEntity<?> post(@RequestBody NoteInput body, HttpServletRequest req) {
        String ipHash = visitorHash(req);

        if (onePerIp && notes.hasPostedFrom(ipHash)) {
            return error(HttpStatus.CONFLICT, "you've already signed the wall");
        }
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

    // Behind cloudflare the true visitor ip is in cf-connecting-ip. Fall back to
    // the forwarded ip nginx passes, then the socket.
    private String visitorHash(HttpServletRequest req) {
        String cf = req.getHeader("cf-connecting-ip");
        String ip = (cf != null && !cf.isBlank()) ? cf : req.getRemoteAddr();
        return hash(salt + ip);
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
