package dev.valen.wall;

// Thrown when a posted note doesn't pass the checks. The controller turns it
// into a 400 with the message.
class ValidationException extends RuntimeException {
    ValidationException(String message) {
        super(message);
    }
}
