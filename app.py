from flask import Flask, request, Response, render_template, jsonify
import json
import string
from os import listdir
import os
import logging
from logging.handlers import RotatingFileHandler
import pyodbc


class Chatbot:
    def __init__(self):
        self.jsonData = None
        self.clueData = None
        self.conditionData = None
      
    def getJson(self):
        #fileName = os.getcwd()+'\\static\\tutorial\\content.json'
        fileName = os.getcwd()+'/static/tutorial/content.json'
        with open(fileName) as json_data:
            self.jsonData = json.load(json_data)

        fileName = os.getcwd()+'\\static\\tutorial\\clues.json'
        with open(fileName) as json_data:
            self.clueData = json.load(json_data)

        fileName = os.getcwd()+'\\static\\tutorial\\conditions.json'
        with open(fileName) as json_data:
            self.conditionData = json.load(json_data)

    def getData(self,condition,topic,index):
        topics = ['Introduction','Tutorial','Task Reminder','Clue_Ins','Clue','Redundant_Ins','Redundant','Submit','Conclusion']
        data = ''

        #check notepad++ for old code

        if(topic != 'Clue' and topic != 'Redundant'):
            if( (str(int(index)+1) not in self.jsonData[condition][topic]) ):
                topic = topics[topics.index(topic)+1]
                index = "0"
        else:
            topic = topics[topics.index(topic)+1]
            index = "0"

        if(topic == 'Clue'):
            data = [self.clueData['main']]
        elif(topic == 'Redundant'):
            data = [self.clueData['redundant']]
        else:
            index = str(int(index)+1)
            data = [self.jsonData[condition][topic][index]]

        return (topic,index,data)

    def insertTransaction(self,sessionId,conditionId,clueId,Response,timeTaken,gridAction):
        #print("Transaction")
        server = 'chatbot-study1.database.windows.net'
        database = 'chatbot'
        username = 'chatbot-study'
        password = '123$Welcome'
        driver= '{ODBC Driver 17 for SQL Server}'
        #sessionId = ''
        conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = conn.cursor()
        try:
            if sessionId == None or sessionId == '':
                cursor.execute('''SELECT MAX(sessionId) FROM Transactions''')
                sessionId = cursor.fetchone()[0]+1
            elif sessionId == 0:
                sessionId = 1
            
            insertValues = (sessionId,conditionId,clueId,Response,round(float(timeTaken)),gridAction)
            print(insertValues)
            cursor.execute('''INSERT INTO Transactions VALUES (?,?,?,?,?,?)''',insertValues)
            conn.commit()
            conn.close()
        except:
            print(error)
            conn.close()
        return sessionId


    def insertMatrixResult(self,sessionId,conditionId,matrixDict):
        print("Transaction")
        server = 'chatbot-study1.database.windows.net'
        database = 'chatbot'
        username = 'chatbot-study'
        password = '123$Welcome'
        driver= '{ODBC Driver 17 for SQL Server}'
        #sessionId = ''
        conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = conn.cursor()
        try:
            
            insertValues = (sessionId,conditionId,matrixDict)
            print(insertValues)
            cursor.execute('''INSERT INTO MatrixResult VALUES (?,?,?)''',insertValues)
            conn.commit()
            conn.close()
        except:
            print('error')
            conn.close()
        return sessionId

    def getClue(self,clueId):
        server = 'DESKTOP-MA7ED8M'
        database = 'chatbot'
        username = 'chatbot-study'
        password = '123Welcome'
        driver= '{ODBC Driver 17 for SQL Server}'
        #sessionId = ''
        conn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)
        cursor = conn.cursor()
        try:
            cursor.execute('''SELECT * FROM Clues WHERE clueId = (?)''',(clueId))
            row = cursor.fetchone()
            conn.commit()
            conn.close()
        except:
            conn.close()
        return row


app = Flask(__name__)
chatbot = Chatbot()

@app.route('/')
def home():
    chatbot.getJson()
    return render_template("index.html")


@app.route('/getResponse',methods=['GET'])
def getResponse():
    condition = ''
    topic = ''
    index = ''
    sessionId = ''
    response = ''
    timeTaken=''
    gridAction = ''
    if 'condition' in request.args:
        condition = request.args['condition']
        print(condition)
    if 'topic' in request.args:
        topic = request.args['topic']
        print(topic)
    if 'index' in request.args:
        index = request.args['index']
        print(index)
    if 'sessionId' in request.args:
        sessionId = request.args['sessionId']
        print(sessionId)
    if 'response' in request.args:
        response = request.args['response']
        print(response)
    if 'timeTaken' in request.args:
        timeTaken = request.args['timeTaken']
        print(timeTaken)
    if 'gridAction' in request.args:
        gridAction = request.args['gridAction']
        print(gridAction)

    if(topic == 'Clue'):
        print("Insert Data")
        sessionId = chatbot.insertTransaction(sessionId,chatbot.conditionData[condition],index,response,timeTaken,gridAction)
        print(sessionId)
    topic,index,data = chatbot.getData(condition,topic,index)
    
    return jsonify({"botResponse":data,'topic':topic,'index':index,'sessionId':sessionId,'condition':condition})


@app.route('/storeMatrixResult',methods=['GET'])
def storeMatrixResult():
    condition = ''
    sessionId = ''
    matrixDict = ''
    
    if 'sessionId' in request.args:
        sessionId = request.args['sessionId']
        print(sessionId)
    if 'condition' in request.args:
        condition = request.args['condition']
        print(condition)
    if 'matrixDict' in request.args:
        matrixDict = request.args['matrixDict']
        print(matrixDict)

    chatbot.insertMatrixResult(sessionId,chatbot.conditionData[condition],matrixDict)

    return jsonify({"result":"success"});
    


#@app.route('/getResponse',methods=['GET'])
#def getResponse():
#    userMessage = ''
#    if 'userMessage' in request.args:
#        userMessage = request.args['userMessage']
#    print(userMessage)
#    botResponse = userMessage
#    return jsonify({"botResponse":botResponse})

#@app.route('/getJson',methods=['GET'])
#def getJson():
#    fileName = os.getcwd()+'\\static\\tutorial\\content.json'
#    with open(fileName) as json_data:
#        content= json.load(json_data)
#        return jsonify({"jsonContent":content})



if __name__ == "__main__":
    try:
        app.run(host='0.0.0.0',port=5001)
    finally:
        print("Exit")
