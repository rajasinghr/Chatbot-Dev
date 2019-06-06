from flask import Flask, request, Response, render_template, jsonify
import json
import string
from os import listdir
import os
import logging
from logging.handlers import RotatingFileHandler



app = Flask(__name__)


@app.route('/')
def home():
    return render_template("index.html")

@app.route('/getResponse',methods=['GET'])
def getResponse():
    userMessage = ''
    if 'userMessage' in request.args:
        userMessage = request.args['userMessage']
    print(userMessage)
    botResponse = userMessage
    return jsonify({"botResponse":botResponse})

@app.route('/getJson',methods=['GET'])
def getJson():
    fileName = os.getcwd()+'\\static\\tutorial\\content.json'
    with open(fileName) as json_data:
        content= json.load(json_data)
        return jsonify({"jsonContent":content})

if __name__ == "__main__":
    try:
        app.run(host='0.0.0.0',port=5001)
    finally:
        print("Exit")
