import arduinoSerial
import time
import atexit
from flask import Flask,request, redirect, url_for, send_from_directory
app = Flask(__name__,static_url_path='')

@app.before_first_request
def setupSerial():
	global arduino
	arduino=arduinoSerial.Arduino(57600,'*',0)
		
@app.route("/")
def page():
	if arduino.getConnStatus()==True:
		return app.send_static_file('dio.html')
	
@app.route('/state')	
def getState():
	arduino.serWrite('o*')
	a=arduino.serRead()
	return a

@app.route('/state_in')
def getStateIn():
	arduino.serWrite('i*')
	b=arduino.serRead()
	return b
	
@app.route('/change')
def change():
	arduino.serWrite('c'+request.args.get('change'))
	return ('OK')

@atexit.register
def disconnect():
	if arduino.getConnStatus()==True:
		arduino.closePort()
		print('Port closed !!!')
if __name__ == "__main__":
	app.run(debug=True,host='127.0.0.1')

	
