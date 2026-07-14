package dev.valen.wall;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

// Check whatever came off the wire before it gets anywhere near the db.
// Everything is bounded: colours from fixed lists, counts capped, points
// rounded so we don't store junk precision.
@Component
class Validation {

    NoteInput validate(NoteInput body) {
        if (body == null) {
            throw new ValidationException("bad body");
        }
        if (body.color() == null || !Wall.PAPER_COLORS.contains(body.color())) {
            throw new ValidationException("unknown paper colour");
        }

        String author = body.author();
        if (author != null) {
            author = author.replaceAll("[\\u0000-\\u001f\\u007f]", "").trim();
            if (author.length() > Wall.MAX_AUTHOR_LEN) {
                author = author.substring(0, Wall.MAX_AUTHOR_LEN);
            }
            if (author.isEmpty()) {
                author = null;
            }
        }

        List<Stroke> strokes = body.strokes();
        if (strokes == null) {
            throw new ValidationException("missing strokes");
        }
        if (strokes.isEmpty()) {
            throw new ValidationException("draw something first");
        }
        if (strokes.size() > Wall.MAX_STROKES) {
            throw new ValidationException("too many strokes");
        }

        int total = 0;
        List<Stroke> clean = new ArrayList<>();
        for (Stroke s : strokes) {
            if (s.color() == null || !Wall.PEN_COLORS.contains(s.color())) {
                throw new ValidationException("bad stroke colour");
            }
            double width = s.width();
            if (!Double.isFinite(width) || width <= 0 || width > Wall.MAX_STROKE_WIDTH) {
                throw new ValidationException("bad stroke width");
            }
            List<double[]> points = s.points();
            if (points == null || points.isEmpty()) {
                throw new ValidationException("empty stroke");
            }
            if (points.size() > Wall.MAX_POINTS_PER_STROKE) {
                throw new ValidationException("stroke too long");
            }

            List<double[]> rounded = new ArrayList<>();
            for (double[] p : points) {
                if (p == null || p.length != 2 || !Double.isFinite(p[0]) || !Double.isFinite(p[1])) {
                    throw new ValidationException("bad point");
                }
                rounded.add(new double[] { Math.round(p[0] * 10) / 10.0, Math.round(p[1] * 10) / 10.0 });
            }

            total += rounded.size();
            clean.add(new Stroke(s.color(), width, rounded));
        }

        if (total > Wall.MAX_TOTAL_POINTS) {
            throw new ValidationException("drawing too detailed");
        }

        return new NoteInput(author, body.color(), clean);
    }
}
