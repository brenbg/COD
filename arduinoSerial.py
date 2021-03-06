
import os
import serial
import serial.tools.list_ports# for viewing serialports
import time
import sys


class Arduino:

	def __init__(self,baudrate,esc,auto):
		self.baud=baudrate
		self.connected=False
		self.connection=serial.Serial()
		if auto==False:
			self.__getcomPort()
		if auto==True:
			self.__autoComPort()
		self.escChar=esc

	def __getcomPort(self):
		print("Searching for Arduino...")
		ports = list(serial.tools.list_ports.comports())
		for p in ports:
			print(p)
		loop=True
		while loop==True:
			comPort=input("Please enter the serial port number: ")
			if comPort=='q':
				print("Stopped by user...")
				time.sleep(2)
				sys.exit()
			if os.name=='posix':
				if self.__connect(comPort)==True:
					loop=False
			if os.name=='nt':
				if self.__connect("COM"+str(comPort))==True:
					loop=False

	def __autoComPort(self):
		ports = list(serial.tools.list_ports.comports())
		k=0
		port=0
		for i in ports:
			j=str(i)
			if j.find('Arduino')!=-1 or j.find('arduino')!=-1:
				print(j)
				port=j[0:j.find(' ')]
				if self.__autoConnect(port):
					self.connected=True
					break

	def __autoConnect(self,comPort):
		try:
			self.connection.baudrate=self.baud
			self.connection.timeout=1
			self.connection.port=comPort
			self.connection.open()
			time.sleep(2)
			if self.connection.is_open:
				time.sleep(2)
				return True
		except serial.SerialException:
			return False

	def __connect(self,comPort):
		try:
			self.connection.baudrate=self.baud
			self.connection.timeout=1
			self.connection.port=comPort
			self.connection.open()
			time.sleep(2)
			if self.connection.is_open:
				print ("Arduino is connected !")
				self.connected=True
				time.sleep(2)
				return True
		except serial.SerialException:
			print("Please enter a valid port")
			return False

	def serWrite(self,data):
		try:
			self.connection.write((data+self.escChar).encode())
		except serial.SerialException:
			print("Error on writting data !!!")

	def serRead(self):
		rsp=self.connection.readline()
		strRsp=""
		for i in rsp:
			strRsp=strRsp+chr(i)
		return strRsp[0:len(strRsp)-2]

	def getConnStatus(self):
		if self.connection.is_open:
			return True
		return False

	def closePort(self):
		if self.connection.is_open:
			self.connection.close()


#bibi= Arduino(57600,'*',False)
#print(bibi.connected)

#bibi.closePort()




















