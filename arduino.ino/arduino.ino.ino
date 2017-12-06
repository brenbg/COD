int outputs[] = {8, 7,6, 5,4, 35, 37, 9};
int inputs[]={10,26,28,30,32};
int states[8];
void setup() {
  for (int i = 0; i < 8; i++) {
    pinMode(outputs[i], OUTPUT);
    states[i] = 0;
  }
  for (int i=0;i<5;i++){
    pinMode(inputs[i],INPUT);
    
  }
  Serial.begin(57600);
}

void readInputs(){
    String rsp="";
    for(int i=0;i<5;i++){
        if(digitalRead(inputs[i])){
            rsp=rsp+"1";
        }
        else{
           rsp=rsp+"0";
        }
        
    }
    Serial.println(rsp);
}

void sendData() {
  String buff = "";
  for (int i = 0; i < 8; i++) {
    buff = buff + String(states[i])+':';
  }
  Serial.println(buff);
}

void loop() {

  if (Serial.available() > 0) {
    String r = Serial.readStringUntil('*');
    if (r.indexOf('o') != -1) {
      sendData();
    }
    if(r.indexOf('i')!=-1){
        readInputs();
    }
    if (r.indexOf('c') != -1) {
      int arr = r.substring(1, 2).toInt();
      int v = r.substring(2).toInt();
      states[arr] = v;
      digitalWrite(outputs[arr], states[arr]);
    }
    inputs[0] = digitalRead (10);
    if(inputs[0]==LOW){
    digitalWrite(outputs[0], HIGH);
    digitalWrite(outputs[4], HIGH);
    delay(100);
  }
  
 else {

  digitalWrite(outputs[0], LOW);
  digitalWrite(outputs[1], HIGH);
  delay(500);
  digitalWrite(outputs[1], LOW);
  digitalWrite(outputs[2], HIGH);
  digitalWrite(outputs[4], LOW);
  digitalWrite(outputs[3], HIGH);
  delay(5000);
  digitalWrite(outputs[3], LOW);
  delay(200);
  digitalWrite(outputs[3], HIGH);
  delay(200);
  digitalWrite(outputs[3], LOW);
  delay(200);
  digitalWrite(outputs[3], HIGH);
  delay(200);
  digitalWrite(outputs[3], LOW);
  digitalWrite(outputs[2], LOW);
  }

    
  }
}

