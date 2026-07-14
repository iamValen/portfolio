package dev.valen.wall;

import java.util.Set;

// The wire contract, kept in step with shared/src on the web side. Guard rails
// so one note can't be enormous or used to hammer the server.
final class Wall {
    private Wall() {
    }

    static final Set<String> PAPER_COLORS = Set.of("#f4e9c1", "#e7d4f0", "#cfe8d7", "#d6e4f0", "#f0d9d3");
    static final Set<String> PEN_COLORS = Set.of("#1a1a1a", "#2f6fb0", "#b04a3f", "#3f7d4f");

    static final int MAX_STROKES = 400;
    static final int MAX_POINTS_PER_STROKE = 600;
    static final int MAX_TOTAL_POINTS = 5000;
    static final int MAX_AUTHOR_LEN = 40;
    static final double MAX_STROKE_WIDTH = 24;
}
