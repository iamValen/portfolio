package dev.valen.wall;

import java.util.List;

// A point is [x, y] on the wire, so a plain double[] keeps that shape through
// jackson instead of turning into an object.
record Stroke(String color, double width, List<double[]> points) {
}

record NoteInput(String author, String color, List<Stroke> strokes) {
}

record Note(String id, String createdAt, String author, String color, List<Stroke> strokes) {
}
