from flask import Flask, render_template, request, jsonify
from logic.EnigmaLogic import Enigma

app = Flask(__name__)

rotors = ['I', 'II', 'III'] 
start_positions = ['A', 'B', 'C']  
connections = ""  

enigma = Enigma(rotors, start_positions, connections)

@app.route('/')
def index():
    return render_template('keyboard.html')

@app.route('/log-key', methods=['POST'])
def log_key():
    data = request.json
    letter = data.get('letter') 
    if letter:
        encrypted_letter = enigma.cypher_message(letter)
        return jsonify({"status": "success", "encrypted_letter": encrypted_letter})
    return jsonify({"status": "error", "message": "No letter provided"}), 400

if __name__ == '__main__':
    app.run(debug=True)
