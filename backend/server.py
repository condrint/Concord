
from flask import Flask, render_template, request, send_from_directory, make_response, jsonify
import os

app = Flask(__name__, static_folder='templates')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['GET', 'POST'])
def router(path):
    if 'api' in path:
        pass

    #for static files 
    elif path and os.path.exists('../frontend/build/' + path):
        return send_from_directory('../frontend/build', path)

    #getting root
    else:
        return send_from_directory('../frontend/build', 'index.html')

if __name__ == '__main__':
    app.run()