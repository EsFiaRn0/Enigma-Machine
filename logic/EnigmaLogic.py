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

# Reflector is pinned
Reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT"

# Function to create a mapping dictionary for a given rotor or reflector
def mapping(string):
    return {Alphabet[i]: string[i] for i in range(len(Alphabet))}

# Class for a single rotor
class Rotor:
    def __init__(self, type, start_position):
        # Validate rotor type and start position
        if type not in Rotors:
            raise ValueError(f"Invalid rotor type: {type}")
        if start_position not in Alphabet:
            raise ValueError(f"Invalid start position: {start_position}")

        self.mapping = mapping(Rotors[type])  # Forward mapping for the rotor
        self.reverse = {v: k for k, v in self.mapping.items()}  # Reverse mapping for the rotor
        self.position = deque(Alphabet)  # Initialize rotor position
        self.position.rotate(-Alphabet.index(start_position))  # Set initial position

    def cypher(self, letter, reverse=False):
        # Calculate the relative index within the rotor
        index = (Alphabet.index(letter) + self.position.index('A')) % len(Alphabet)
        intermediate_letter = self.position[index]

        # Use forward or reverse mapping
        if reverse:
            cypher_letter = self.reverse[intermediate_letter]
        else:
            cypher_letter = self.mapping[intermediate_letter]

        # Return the resulting letter adjusted to the rotor position
        index = self.position.index(cypher_letter)
        return Alphabet[(index - self.position.index('A')) % len(Alphabet)]

    def rotate(self):
        # Rotate the rotor one position and return True if a full rotation is completed
        self.position.rotate(-1)
        return self.position[0] == 'A'

# Class for the Enigma Machine
class Enigma:
    def __init__(self, rotors, start_position, connections=None):
        # Validate input lengths
        if len(rotors) != 3 or len(start_position) != 3:
            raise ValueError("You must provide exactly 3 rotors and 3 start positions.")

        self.rotors = [Rotor(type, pos) for type, pos in zip(rotors, start_position)]
        self.reflector = mapping(Reflector)  # Fixed reflector mapping
        self.connections = self.parse_connections(connections) if connections else {}

    def parse_connections(self, connections):
        # Parse plugboard connections and validate them
        connection_dict = {}
        pairs = connections.split()
        for pair in pairs:
            if len(pair) != 2 or pair[0] == pair[1] or pair[0] not in Alphabet or pair[1] not in Alphabet:
                raise ValueError(f"Invalid connection pair: {pair}")
            connection_dict[pair[0]] = pair[1]
            connection_dict[pair[1]] = pair[0]
        return connection_dict

    def swap(self, letter):
        # Swap letters using plugboard connections
        return self.connections.get(letter, letter)

    def cypher_letter(self, letter):
        # Pass the letter through the plugboard, rotors, reflector, and back
        letter = self.swap(letter)

        for rotor in self.rotors:
            letter = rotor.cypher(letter)

        letter = self.reflector[letter]

        for rotor in reversed(self.rotors):
            letter = rotor.cypher(letter, reverse=True)

        letter = self.swap(letter)

        # Rotate the first rotor and potentially others if necessary
        rotate_next = True
        for rotor in self.rotors:
            if rotate_next:
                rotate_next = rotor.rotate()
            else:
                break

        return letter

    def cypher_message(self, message):
        # Encrypt or decrypt the entire message
        return ''.join(self.cypher_letter(letter) for letter in message.upper() if letter in Alphabet)

# Function to configure the Enigma machine
def configure_machine():
    print("Available rotors: I, II, III")
    rotors = input("Choose the order of the 3 rotors separated by spaces (example: I III II):").split()
    start_positions = input("Choose the initial position for each rotor (example: A B C):").split()
    connections = input("Define the board connections (example: AT BS DE FG HI, or press Enter to skip):").strip()
    return rotors, start_positions, connections

if __name__ == "__main__":
    rotors, start_positions, connections = configure_machine()

    try:
        enigma = Enigma(
            rotors=rotors,
            start_position=start_positions,
            connections=connections
        )
        message = input("Enter the message to be encrypted: ").strip().upper()

        cypher = enigma.cypher_message(message)

        print(f"Encrypted message: {cypher}")
    except Exception as e:
        print(f"Error: {e}")