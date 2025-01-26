from flask import Flask, render_template, request, jsonify
from logic.EnigmaLogic import Alphabet, Enigma
from collections import deque

app = Flask(__name__)

rotors = ['I', 'II', 'III'] 
start_positions = ['A', 'B', 'C']  
connections = ""  

enigma = Enigma(rotors, start_positions, connections)

@app.route('/')
def index():
    enigma.connections = enigma.parse_connections("")
    return render_template('keyboard.html')

@app.route('/log-key', methods=['POST'])
def log_key():
    data = request.json
    letter = data.get('letter') 
    rotor_positions = data.get('rotor_positions')  

    if letter and rotor_positions:
        try:
            for i, rotor in enumerate(rotor_positions):
                enigma.rotors[i].position = deque(Alphabet)
                enigma.rotors[i].position.rotate(-Alphabet.index(rotor)) 
            encrypted_letter = enigma.cypher_message(letter)
            return jsonify({"status": "success", "encrypted_letter": encrypted_letter})
        except Exception as e:
            return jsonify({"status": "error", "message": "An error occurred during encryption."}), 500
    
    return jsonify({"status": "error", "message": "Missing data"}), 400

@app.route('/update-plugboard', methods=['POST'])
def update_plugboard():
    data = request.json
    connections = data.get('connections')
    
    if connections:
        try:
            enigma.connections = enigma.parse_connections(connections)
            return jsonify({"status": "success"})
        except ValueError as e:
            return jsonify({"status": "error", "message": str(e)}), 400
        except Exception as e:
            return jsonify({"status": "error", "message": "An unexpected error occurred."}), 400
    return jsonify({"status": "error", "message": "Missing connections"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
