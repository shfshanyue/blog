from json import loads
from logging import info
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/beacon', methods=['POST'])
def beacon():
    data = loads(request.data.decode('utf-8')) 
    info(data.get('click'))
    return 'beacon'

if __name__ == '__main__':
    app.run(debug=True)
