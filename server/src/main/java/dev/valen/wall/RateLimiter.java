package dev.valen.wall;

import org.springframework.stereotype.Component;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

// Small in-memory rate limit: a handful of notes per hour per person. Resets on
// restart, which is fine at this scale.
@Component
class RateLimiter {

    private static final long WINDOW_MS = 60 * 60 * 1000;
    private static final int MAX_PER_WINDOW = 8;

    private final Map<String, Deque<Long>> hits = new HashMap<>();

    synchronized boolean limited(String key) {
        long now = System.currentTimeMillis();
        Deque<Long> recent = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        while (!recent.isEmpty() && now - recent.peekFirst() >= WINDOW_MS) {
            recent.pollFirst();
        }
        if (recent.size() >= MAX_PER_WINDOW) {
            return true;
        }
        recent.addLast(now);
        return false;
    }
}
