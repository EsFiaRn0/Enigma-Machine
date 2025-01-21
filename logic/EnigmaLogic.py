import string
from collections import deque

# All capital letters of the English alphabet
Alphabet = string.ascii_uppercase

# Rotor Configuration
Rotors = {
    "I": "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "II": "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "III": "BDFHJLCPRTXVZNYEIWGAKMUSQO",
}

# Reflector configuration
Reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT"

# Mapping function
def mapping(string):
    return {Alphabet[i]: string[i] for i in range(len(Alphabet))}

# Rotor class
class Rotor:
    def __init__(self, type, start_position):
        if type not in Rotors:
            raise ValueError(f"Invalid rotor type: {type}")
        if start_position not in Alphabet:
            raise ValueError(f"Invalid start position: {start_position}")

        self.mapping = mapping(Rotors[type])  # Forward mapping for the rotor
        self.reverse = {v: k for k, v in self.mapping.items()}  # Reverse mapping for the rotor
        self.position = deque(Alphabet)  # Initialize rotor position
        self.rotate_to(start_position)  # Set initial position

    def rotate_to(self, position):
        """Rotate the rotor to a specific start position."""
        self.position.rotate(-Alphabet.index(position))  # Set the rotor to the correct start position

    def cypher(self, letter, reverse=False):
        """Cipher a letter based on rotor's current position."""
        offset = Alphabet.index(self.position[0])
        index = (Alphabet.index(letter) + offset) % len(Alphabet)
        intermediate_letter = Alphabet[index]
        mapped_letter = self.reverse[intermediate_letter] if reverse else self.mapping[intermediate_letter]
        index = (Alphabet.index(mapped_letter) - offset) % len(Alphabet)
        return Alphabet[index]

    def rotate(self):
        """Rotate the rotor by one position."""
        self.position.rotate(-1)
        return self.position[0] == Alphabet[0]

# Enigma class
class Enigma:
    def __init__(self, rotors, start_position, connections=None):
        if len(rotors) != 3 or len(start_position) != 3:
            raise ValueError("Exactly 3 rotors and 3 positions are required.")
        
        self.rotors = [Rotor(type, pos) for type, pos in zip(rotors, start_position)]
        self.reflector = mapping(Reflector)  
        self.connections = self.parse_connections(connections) if connections else {}

    def parse_connections(self, connections):
        """Parse plugboard connections."""
        connection_dict = {}
        pairs = connections.split()
        for pair in pairs:
            if len(pair) != 2 or pair[0] == pair[1] or pair[0] not in Alphabet or pair[1] not in Alphabet:
                raise ValueError(f"Invalid connection: {pair}")
            connection_dict[pair[0]] = pair[1]
            connection_dict[pair[1]] = pair[0]
        return connection_dict

    def swap(self, letter):
        """Swap letters through the plugboard."""
        return self.connections.get(letter, letter)

    def cypher_letter(self, letter):
        """Cipher one letter with the current Enigma setup."""
        # First apply the plugboard swap before the rotors
        letter = self.swap(letter)

        # Pass through the rotors
        for rotor in self.rotors:
            letter = rotor.cypher(letter)

        # Reflect the letter
        letter = self.reflector[letter]

        # Pass back through the rotors in reverse
        for rotor in reversed(self.rotors):
            letter = rotor.cypher(letter, reverse=True)

        # Finally apply the plugboard swap again after the rotors
        letter = self.swap(letter)

        # Rotate the first rotor and others if necessary
        rotate_next = True
        for rotor in self.rotors:
            if rotate_next:
                rotate_next = rotor.rotate()
            else:
                break

        return letter

    def cypher_message(self, message):
        """Cipher the entire message."""
        return ''.join(self.cypher_letter(letter) for letter in message.upper() if letter in Alphabet)

# Configure the Enigma machine
def configure_machine():
    rotors = input("Choose 3 rotors (e.g., I II III): ").split()
    start_positions = input("Set initial rotor positions (e.g., A B C): ").split()
    connections = input("Enter board connections (e.g., AT BS), or press Enter to skip: ").strip()
    return rotors, start_positions, connections

if __name__ == "__main__":
    rotors, start_positions, connections = configure_machine()

    try:
        enigma = Enigma(rotors=rotors, start_position=start_positions, connections=connections)
        message = input("Enter the message to encrypt: ").strip().upper()
        cypher = enigma.cypher_message(message)
        print(f"Encrypted message: {cypher}")
    except Exception as e:
        print(f"Error: {e}")