//SET DIGITAL OUTPUT TABLE

var proto='<span class="switch"><span class="switch-border1">'+
				'<span class="switch-border2"><input id="swid" type="checkbox" checked />'+
				'<label for="swid"></label><span class="switch-top"></span>'+
				'<span class="switch-shadow"></span><span class="switch-handle"></span>'+
				'<span class="switch-handle-left"></span><span class="switch-handle-right"></span>'+
				'<span class="switch-handle-top"></span><span class="switch-handle-bottom"></span>'+
				'<span class="switch-handle-base"></span><span class="switch-led switch-led-green">'+
				'<span class="switch-led-border"><span class="switch-led-light">'+
				'<span class="switch-led-glow"></span></span>'+
				'</span></span>'+
				'<span class="switch-led switch-led-red"><span class="switch-led-border">'+
				'<span class="switch-led-light"><span class="switch-led-glow"></span>'+
				'</span></span></span></span></span></span>';
//var proto='<input type="checkbox" id=swid  />';				

function doTable(a,_header,_colNames,func){
	var _table=a.table;
	var _toggleArray=a.toggleArray;
	$('#'+_table).append($('<tr id="hd"><td id="header" colspan='+(_toggleArray.length+1)+'>'+_header+'</td></tr>'));
	$('#'+_table).append($('<tr id="cn"></tr>'));
	$('#'+_table).append($('<tr id="sw"></tr>'));
	$('#'+_table).append($('<tr id="ld"></tr>'));
	
	for(i=0;i<_toggleArray.length;i++){
		$('#'+_table).find('tr:eq(1)').append('<td>'+_colNames[i]+'</td>');
		$('#'+_table).find('tr:eq(2)').append('<td style="font-size:6px">'+_toggleArray[i]+'</td>');
		$('#'+_table).find('tr:eq(3)').append('<td><div id='+(_table+'led'+i)+' class="ledRedOn"></div</td>');
		$(a.nameOfToggles[i]).click(function(){
			func($(this).attr('id'));
		});
	}
	$('#'+_table).find('tr:eq(1)').append('<td>Get Status</td>');		
	$('#'+_table).find('tr:eq(2)').append('<td style="font-size:6px">'+a.refresh+'</td>');
	$('#'+_table+'rfr').prop('checked',false);
	$('#'+_table+'rfr').click(function(){
		$(this).prop('checked',true);
		getStatus(a,'o');
		setTimeout(function(){$('#'+_table+'rfr').prop('checked',false)},250);
		
		});
	$('#'+_table).find('tr:eq(3)').append('<td id='+_table+'tx'+'>Waiting<br>for Pi..</td>');
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

//SET DIGITAL IN TABLE
function diTable(a,_header,_colNames){
	var _table=a.table;
	var _ledArray=a.ledArray;
	$('#'+_table).append($('<tr id="hd"><td id="header" colspan='+(_ledArray.length+1)+'>'+_header+'</td></tr>'));
	$('#'+_table).append($('<tr id="cn"></tr>'));
	$('#'+_table).append($('<tr id="ld"></tr>'));
	$('#'+_table).append($('<tr id="st"></tr>'));
	
	for(i=0;i<_ledArray.length;i++){
		$('#'+_table).find('tr:eq(1)').append('<td>'+_colNames[i]+'</td>');
		$('#'+_table).find('tr:eq(2)').append('<td>'+_ledArray[i]+'</td>');
		/*$(a.nameOfLeds[i]).click(function(){
			func($(this).attr('id'));
		});*/
	}
	$('#'+_table).find('tr:eq(1)').append('<td>Estado Semaforo</td>');		
	$('#'+_table).find('tr:eq(2)').append('<td style="font-size:6px">'+a.refresh+'</td>');
	$('#'+_table+'rfr').prop('checked',false);
	$('#'+_table+'rfr').click(function(){
		$(this).prop('checked',true);
		getStatus(a,'i');
		setTimeout(function(){$('#'+_table+'rfr').prop('checked',false)},250);
		
		});
	$('#'+_table).find('tr:eq(3)').append('<td colspan='+(a.numberOfLeds+1)+' id='+_table+'tx'+'>Waiting for Pi..</td>');
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

//GET DIGITAL IN/OUT DATA
function getStatus(a,dir){// this function returns the status of the digital otputs
	var table=a.table;
	var number;
	var color=[];
	var html =[];
	var _url;
	
	if(dir=='o'){
		number=a.numberOfToggles;
		color[0]='ledRedOn';
		color[1]='ledRedOff';
		html[0]="Waiting<br>for Pi..";
		html[1]="Transfer<br>complete!!";
		_url='/state'
	}
	else if(dir=='i'){
		number=a.numberOfLeds;
		color[0]='ledGreenOn';
		color[1]='ledGreenOff';
		html[0]="Waiting <br> for Pi..";
		html[1]="Transfer<br>complete!!";
		_url='/state_in'
	}
	table='#'+a.table;
	$(table+' td:last').html(html[0]);
	$.ajax({//jquery ajax variable
		type:'get', //type of query
		dataType:'text', //data expected from server
		url:_url, //the url od script
		data:{status:'state'} //data that it will be sent to the server
		
	})
	.done(function(status){// after a succesfull exchange this function it will be executed
		//status=status.substring(1); //remove the trailing newline char '\n'
		var k=status.split(':'); // make an array of data

		for(i=0;i<number;i++){
			$(a.nameOfLeds[i]).removeClass();
			if(k[i]=='0'){ //set the checkboxes
				if(dir=='o'){
					$(a.nameOfToggles[i]).prop('checked',false);
				}
				
				$(a.nameOfLeds[i]).addClass(color[1]);
			}
			else {
				if(dir=='o'){
					$(a.nameOfToggles[i]).prop('checked',true);
				}	
				$(a.nameOfLeds[i]).addClass(color[0]);
			}	
		}
		$(table+' td:last').html(html[1]);
	});
}

//THE SWITCH OBJECT
function toggleSwitch(_id){
	this.temp=proto;
	//this.temp='<input type="checkbox" id=swid  />';			
	this.html=function(){
		var k=this.temp.replace(/swid/g,_id);
		return k;
		
	}
	this.id=_id;
	this.table='';
	this.numberOfToggles=1;
	this.nameOfToggles=[];
	this.toggleArray=[];
	this.nameOfLeds=[];
	this.refresh='';			
}
toggleSwitch.prototype.arrayOfToggles=function(prefix,_numberOfToggles){
	this.numberOfToggles=_numberOfToggles;
	this.table=prefix;
	this.refresh=this.temp.replace(/swid/g,prefix+'rfr');
	var k=[];
	for(var i=0;i<_numberOfToggles;i++){
		this.nameOfToggles[i]='#'+prefix+'tg'+i;
		this.nameOfLeds[i]='#'+prefix+'led'+i;
		k[i]=this.temp.replace(/swid/g,prefix+'tg'+i);
	}
	this.toggleArray=k;
}
toggleSwitch.prototype.singleSwitch=function(func){
	func(this.id);
}
function toggleAlert(_id){
	$('#'+_id).click(function(){
		alert($('#'+_id).attr('id'));
	})
}
//THIS FUNCTION WILL BE EXECUTED ON SWITCH CLICK

function onclickTable(_switch){
	_switch='#'+_switch;
	var _table='#'+$(_switch).closest('table').attr('id');
	var _crt=$(_table+' input:checkbox').index($(_switch));
	_led=_table+'led'+_crt;
	var test;
	if($(_switch).is(':checked')){
		test=1;
		_crt=_crt+'1';
	}
	else{
		test=0;
		_crt=_crt+'0';
	}
	$(_table+' td:last').html("Waiting<br>for Pi..");
	$.ajax({
		type:'get',
		dataType:'text',
		url:'/change',
		data:{change:_crt+'*'} 
	})
	.done(function(k){
		$(_led).removeClass();
		if(test==1){
			$(_led).addClass('ledRedOn');
		}
		else{
			$(_led).addClass('ledRedOff');
		}
		$(_table+' td:last').html("Transfer<br>complete!!");
	});
}

///////////////////////////////////////////////////////////////////////////////////////
//DIGITAL INPUT///////////////////////////////////////////////////////////////////////
function inputLed(_id){
	this.id=_id;
	this.table='';
	this.numberOfLeds=1;
	this.ledArray=[];
	this.nameOfLeds=[];
	this.refresh=proto;
	
	this.temp='<div id=ledid class="ledGreenOff"></div';
	this.html=function(){
		var k=this.temp.replace(/ledid/g,_id);
		return k;
		}
}
inputLed.prototype.arrayOfLeds=function(_table,_numberOfLeds){
	this.numberOfLeds=_numberOfLeds;
	this.table=_table;
	this.refresh=this.refresh.replace(/swid/g,_table+'rfr')
	for(var i=0;i<_numberOfLeds;i++){
		this.ledArray[i]=this.temp.replace(/ledid/g,_table+'led'+i);
		this.nameOfLeds[i]='#'+_table+'led'+i;
	}
}



