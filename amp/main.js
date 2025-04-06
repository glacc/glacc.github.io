//Amiga module player by Glacc
//
//Unsupported effects :
//
//	E3x	Set glissando on/off
//	E4x Set vibrato waveform
//	E5x	Set finetune value
//	E7x Set tremolo waveform
//	EFx	Invert loop
//

var bufferSize = 1024;
var desiredFPS = 30;
var maxFPS = 60;
var patternDrawSpd = 2;

var stereomulAmiga = .5;
var stereomulnonAmiga = .75;
var stereomul = .5;
var volRampSpd = 10;
var volRampNewSmp = 10;
var stereo = false;

var amigaFreq = 7093790;//7093789.2;//7158728;
var interpolation = true;
var amigaFreqLimits = true;
var smoothScrolling = false;

var AudioContext;
var audioCtx;
var gainNode;
var scriptNode;
var smprate;
var audioContextCreated = false;

var songname_canvas,samples_canvas;
var pattern_canvas_a = document.createElement("canvas");
var pattern_canvas_b = document.createElement("canvas");
var pattern_canvas = pattern_canvas_a;
var pattern_swap = false;
var drawPos = 0;
var drawReq = false;
var fullRedrawed = false;
var redrawByFocus = false;

var a = 0;

var loaded = 0;
var targetfile = "";
var init = 0;
var playing = 0;
var filebuffer;
var numofchannels = 4;

var songname;

var numofpatterns;
var patterndata = [];
var patternorder = [];
var samples = [];
var channels = [];

var scopePos = 0;
var scopeData = [];

var volume = 0.2;
var volL = 0;
var volR = 0;

var currow = 0;
var curpos = 0;
var oldpos = 128;
var oldrow = 64;
var patbrk = -1;
var patjmp = -1;
var patdelay = 0;
var patrep = 0;
var reppos = 0;
var repto = -1;
var tick = 0;
var rstpos = 0;

var spd;
var tempo;

var init = 0;
var playing = 0;
var timer_0 = 0;
var timer_1 = 0;
var t0 = 0;

var logrow = false;
var logbuf = false;

//var periodTableFT2 = [1712,1616,1525,1440,1357,1281,1209,1141,1077,1017, 961, 907, 856, 808, 762, 720, 678, 640, 604, 570, 538, 508, 480, 453, 428, 404, 381, 360, 339, 320, 302, 285, 269, 254, 240, 226, 214, 202, 190, 180, 170, 160, 151, 143, 135, 127, 120, 113, 107, 101, 95, 90, 85, 80, 76, 71, 67, 64, 60, 57];

var noteText = ["Ｃ－","Ｃ＃","Ｄ－","Ｄ＃","Ｅ－","Ｆ－","Ｆ＃","Ｇ－","Ｇ＃","Ａ－","Ａ＃","Ｂ－"];
var hexTextA = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
var hexTextB = ["０","１","２","３","４","５","６","７","８","９","Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ"];
var decText = ["０","１","２","３","４","５","６","７","８","９"];
var pvrow = -1;
var pvdelay = 0;
var pvupdated = false;

var ftmul_amiga = 37;
var ftmul_ext = 85;
var finetunemul = ftmul_amiga;

var numofsamples = 31;

var formatTag = [
	"1CHN", "2CHN", "3CHN", "4CHN", "5CHN", "6CHN", "7CHN", "8CHN",
	"9CHN", "10CH", "11CH", "12CH", "13CH", "14CH", "15CH", "16CH",
	"17CH", "18CH", "19CH", "20CH", "21CH", "22CH", "23CH", "24CH",
	"25CH", "26CH", "27CH", "28CH", "29CH", "30CH", "31CH", "32CH"
	];

var periodTableMod = [
    856,808,762,720,678,640,604,570,538,508,480,453,
    428,404,381,360,339,320,302,285,269,254,240,226,
    214,202,190,180,170,160,151,143,135,127,120,113,0,
    850,802,757,715,674,637,601,567,535,505,477,450,
    425,401,379,357,337,318,300,284,268,253,239,225,
    213,201,189,179,169,159,150,142,134,126,119,113,0,
    844,796,752,709,670,632,597,563,532,502,474,447,
    422,398,376,355,335,316,298,282,266,251,237,224,
    211,199,188,177,167,158,149,141,133,125,118,112,0,
    838,791,746,704,665,628,592,559,528,498,470,444,
    419,395,373,352,332,314,296,280,264,249,235,222,
    209,198,187,176,166,157,148,140,132,125,118,111,0,
    832,785,741,699,660,623,588,555,524,495,467,441,
    416,392,370,350,330,312,294,278,262,247,233,220,
    208,196,185,175,165,156,147,139,131,124,117,110,0,
    826,779,736,694,655,619,584,551,520,491,463,437,
    413,390,368,347,328,309,292,276,260,245,232,219,
    206,195,184,174,164,155,146,138,130,123,116,109,0,
    820,774,730,689,651,614,580,547,516,487,460,434,
    410,387,365,345,325,307,290,274,258,244,230,217,
    205,193,183,172,163,154,145,137,129,122,115,109,0,
    814,768,725,684,646,610,575,543,513,484,457,431,
    407,384,363,342,323,305,288,272,256,242,228,216,
    204,192,181,171,161,152,144,136,128,121,114,108,0,
    907,856,808,762,720,678,640,604,570,538,508,480,
    453,428,404,381,360,339,320,302,285,269,254,240,
    226,214,202,190,180,170,160,151,143,135,127,120,0,
    900,850,802,757,715,675,636,601,567,535,505,477,
    450,425,401,379,357,337,318,300,284,268,253,238,
    225,212,200,189,179,169,159,150,142,134,126,119,0,
    894,844,796,752,709,670,632,597,563,532,502,474,
    447,422,398,376,355,335,316,298,282,266,251,237,
    223,211,199,188,177,167,158,149,141,133,125,118,0,
    887,838,791,746,704,665,628,592,559,528,498,470,
    444,419,395,373,352,332,314,296,280,264,249,235,
    222,209,198,187,176,166,157,148,140,132,125,118,0,
    881,832,785,741,699,660,623,588,555,524,494,467,
    441,416,392,370,350,330,312,294,278,262,247,233,
    220,208,196,185,175,165,156,147,139,131,123,117,0,
    875,826,779,736,694,655,619,584,551,520,491,463,
    437,413,390,368,347,328,309,292,276,260,245,232,
    219,206,195,184,174,164,155,146,138,130,123,116,0,
    868,820,774,730,689,651,614,580,547,516,487,460,
    434,410,387,365,345,325,307,290,274,258,244,230,
    217,205,193,183,172,163,154,145,137,129,122,115,0,
    862,814,768,725,684,646,610,575,543,513,484,457,
    431,407,384,363,342,323,305,288,272,256,242,228,
    216,203,192,181,171,161,152,144,136,128,121,114,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0
	];
	
//From OpenMPT source.
var ProTrackerTunedPeriods =
[
	1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,960,907,
	1700,1604,1514,1430,1348,1274,1202,1134,1070,1010,954,900,
	1688,1592,1504,1418,1340,1264,1194,1126,1064,1004,948,894,
	1676,1582,1492,1408,1330,1256,1184,1118,1056,996,940,888,
	1664,1570,1482,1398,1320,1246,1176,1110,1048,990,934,882,
	1652,1558,1472,1388,1310,1238,1168,1102,1040,982,926,874,
	1640,1548,1460,1378,1302,1228,1160,1094,1032,974,920,868,
	1628,1536,1450,1368,1292,1220,1150,1086,1026,968,914,862,
	1814,1712,1616,1524,1440,1356,1280,1208,1140,1076,1016,960,
	1800,1700,1604,1514,1430,1350,1272,1202,1134,1070,1010,954,
	1788,1688,1592,1504,1418,1340,1264,1194,1126,1064,1004,948,
	1774,1676,1582,1492,1408,1330,1256,1184,1118,1056,996,940,
	1762,1664,1570,1482,1398,1320,1246,1176,1110,1048,988,934,
	1750,1652,1558,1472,1388,1310,1238,1168,1102,1040,982,926,
	1736,1640,1548,1460,1378,1302,1228,1160,1094,1032,974,920,
	1724,1628,1536,1450,1368,1292,1220,1150,1086,1026,968,914
];
	
var periodTable = periodTableMod;
//from XM.TXT
/*PeriodTab = [
      907,900,894,887,881,875,868,862,856,850,844,838,832,826,820,814,
      808,802,796,791,785,779,774,768,762,757,752,746,741,736,730,725,
      720,715,709,704,699,694,689,684,678,675,670,665,660,655,651,646,
      640,636,632,628,623,619,614,610,604,601,597,592,588,584,580,575,
      570,567,563,559,555,551,547,543,538,535,532,528,524,520,516,513,
      508,505,502,498,494,491,487,484,480,477,474,470,467,463,460,457];
*/

function getstring(dv, offset, len) {
  var str = [];
  for (var i = offset; i < offset+len; i++) {
    var c = dv.getUint8(i);
    if (c === 0) break;
    str.push(String.fromCharCode(c));
  }
  return str.join('');
}

function initInfoView() {
	var context = songname_canvas.getContext("2d");
	context.fillStyle = "#000000";
    context.fillRect(0, 0, songname_canvas.width, songname_canvas.height);
	context = samples_canvas.getContext("2d");
	context.fillStyle = "#000000";
	context.fillRect(0, 0, samples_canvas.width, samples_canvas.height);
	context.fillStyle = "#ffffff";
	context.textBaseline = "middle";
	context.font = "12px bold Arial";
	context.textAlign = "left";
	context.fillText("Samples: ", 0, 6);
}

function load_module() {
	
	var context = songname_canvas.getContext("2d");
	context.fillStyle = "#ffffff";
	context.textBaseline = "middle";
	
	var cursor = new DataView(filebuffer);
	var offset = 0;
	
	//Read song name
	songname = getstring(cursor, 0, 20);
	console.log("Song name: "+songname);
	document.title = "Amiga mod player - "+songname;
	
	var i = 0;
	while (i<numofsamples) {
		offset = 20+i*30;
	/*	var finetune = cursor.getUint8(offset+24)&0xF;
		if (finetune>=8) finetune=14-finetune;
		var thissample = {
			'name':		getstring(cursor, offset, 22),
			'leng':		cursor.getUint16(offset+22)*2,
			'finetune':	finetune,
			'vol':		cursor.getUint8(offset+25),
			'repeatpoint':	cursor.getUint16(offset+26, false)*2,
			'repeatleng':	cursor.getUint16(offset+28, false)*2,
			'data':		[]
		};*/
	
		var thissample = {
			'name':		getstring(cursor, offset, 22),
			'leng':		cursor.getUint16(offset+22)*2,
			'finetune':	cursor.getUint8(offset+24)&0xF,
			'vol':		cursor.getUint8(offset+25),
			'repeatpoint':	cursor.getUint16(offset+26, false)*2,
			'repeatleng':	cursor.getUint16(offset+28, false)*2,
			'data':		[]
		};
		console.log("Sample "+(i+1)+":");
		console.log(thissample);
		samples[i] = thissample;
		i ++ ;
	}
	
	//Song info
	offset += 30;
	songleng = cursor.getUint8(offset);
	//Pattern order
	offset += 2 ;
	numofpatterns = 0;
	while (offset<150+30*numofsamples) {
		var patternno = cursor.getUint8(offset);
		if (patternno > numofpatterns) numofpatterns = patternno;
		patternorder[offset-(30*numofsamples+22)] = patternno;
		offset++;
	}
	console.log("Number of patterns: "+numofpatterns);
	console.log("Pattern order:");
	console.log(patternorder);
	var tag = getstring(cursor, 150+30*numofsamples, 4);
	console.log(tag);
	
	i = 0;
	numofchannels = 4;
	stereomul = stereomulAmiga;
	amigaFreqLimits = true;
	periodTable = periodTableMod;
	finetunemul = ftmul_amiga;
	while (i<32) {
		if (formatTag[i]==tag) {
			numofchannels = i+1;
			amigaFreqLimits = false;
			finetunemul = ftmul_ext;
			stereomul = stereomulnonAmiga;
			break;
		}
		i++;
	}
	if (tag=="CD81") {
		numofchannels = 8;
		amigaFreqLimits = false;
		finetunemul = ftmul_ext;
		stereomul = stereomulnonAmiga;
	}
	
	var scrwidth = 164+numofchannels*100;
	if (scrwidth<564) scrwidth=564;
	songname_canvas.width=samples_canvas.width=scrwidth;
	
	initInfoView();
	
	context.font = "24px bold Arial";
	context.fillStyle = "#ffffff";
	context.textAlign = "center";
	context.fillText(songname, songname_canvas.width/2, 24);
	
	//Pattern data
	patterndata = [];
	offset += (numofsamples == 31 ? 4 : 0);
	i = 0;
	var j, k;
	//Pattern
	while (i<=numofpatterns) {
		var currentpattern = [];
		j = 0;
		//Row
		while (j<64) {
			var currentrow = [];
			k = 0;
			//Note
			while (k<numofchannels) {
				var currentnote = {
					'sample': 	0,
					'period':	0,
					'effect':	0
				};
				var upper16 = cursor.getUint16(offset, false);
				var lower16 = cursor.getUint16(offset+2, false);
				currentnote.sample = ((upper16&0xF000)>>8)|((lower16&0xF000)>>12);
				currentnote.period = upper16&0x0FFF;
				if ((currentnote.period>856||currentnote.period<113)&&currentnote.period!=0&&amigaFreqLimits) {
					amigaFreqLimits = false;
					finetunemul = ftmul_ext;
					stereomul = stereomulnonAmiga;
				}
				currentnote.effect = lower16&0x0FFF;
				currentrow.push(currentnote);
				offset += 4;
				k++;
			}
			currentpattern.push(currentrow);
			j++;
		}
		patterndata[i] = currentpattern;
		i++;
	}
	console.log("Pattern data: ");
	console.log(patterndata);
	
	//Sample data
//	offset++;

	context = samples_canvas.getContext("2d");
	
	i = 0;
	context.strokeStyle = "#555599";
	while (i<numofsamples) {
		j = 0;
		context.beginPath();
		while (j<samples[i].leng) {
			samples[i].data[j++] = cursor.getInt8(offset);
			
			if (i>=15) context.lineTo((j/samples[i].leng)*282+282, (i-15)*12+(cursor.getInt8(offset)/21)+6);
			else  context.lineTo((j/samples[i].leng)*282, (i+1)*12+(cursor.getInt8(offset)/21)+6);
			
			offset++;
		}
		context.stroke();
		context.fillStyle = "#ffffff";
		
		context.textBaseline = "middle";
		context.font = "12px Arial";
		context.fillStyle = "#ffffff";
		context.textAlign = "left";
		
		if (i>=15) context.fillText((i+1)+" : "+samples[i].name, 282, (i-15)*12+6);
		else context.fillText((i+1)+" : "+samples[i].name, 0, (i+1)*12+6);
		i++;
	}
	console.log("Final sample data: ");
	console.log(samples);
	
	console.log("Using Amiga period table: " + amigaFreqLimits);
	
	
	scopeData = [];
	
	i = 0;
	while (i<numofchannels) {
		scopeData.push([]);
		j = 0;
		while (j<2048) {
			scopeData[i][j]=0;
			j++;
		}
		i++;
	}
	
	rstpos = 0;
	if (!amigaFreqLimits) {
		if (cursor.getUint8(951)!=127) rstpos=cursor.getUint8(951);
		console.log("Restart position: " + rstpos);
	}
	
	while (muteSelector.length)
		muteSelector.remove(0);
	
	i = 0;
	while (i < numofchannels) {	
		var opt = document.createElement("option");
		opt.text = "Ch " + (i+1);
		muteSelector.add(opt, null);
		i ++ ;
	}
	
	while (jmpSel.length)
		jmpSel.remove(0);
	
	i = 0;
	while (i<songleng)
	{
		var opt = document.createElement("option");
		opt.innerHTML = hexTextA[i>>4] + hexTextA[i&0xF] + " (" + hexTextA[patternorder[i]>>4] + hexTextA[patternorder[i]&0xF] + ")";
		jmpSel.add(opt, null);
		i ++ ;
	}
	
	loaded = 1;
}

function clamp(num, min, max) {
	return Math.max(Math.min(num, max), min);
}

function mixChannels() {
	a = 0;
	var outL = 0;
	var outR = 0;
	var outM = 0;
	while (a<numofchannels) {
		var res = 0;
		var ch = channels[a];
		if (ch.sample != 32 && ch.period != 0 && samples[ch.sample].leng > 0) {
			var smp = samples[ch.sample];
/*			if (!ch.active) {
				ch.active = true;
				if (ch.effect!=12) {
					if (!ch.notechg) ch.volume=smp.vol;
				} else ch.volume=ch.para;
				if (ch.effect!=9&&!ch.notechg) ch.pos=0;
				else ch.pos=ch.para*256;
				ch.notechg = false;
			}*/
			
		/*	var fineperiod = (((60-ch.note)/8)*smp.finetune)/2;
			if (ch.arpeggioperiod!=0) ch.pos += amigaFreq/(ch.arpeggioperiod+ch.vibamp*Math.sin(ch.vibpos/32*Math.PI)/64-fineperiod)/2/smprate;
			else ch.pos += amigaFreq/(ch.period+ch.vibamp*Math.sin(ch.vibpos/32*Math.PI)/64-fineperiod)/2/smprate;
		*/
		
			ch.volfinal -= (ch.volfinal - ch.voltarget)/volRampSpd;
		
			//if (ch.arpeggioperiod!=0) ch.pos += amigaFreq/(ch.arpeggioperiod+ch.vibamp*Math.sin(ch.vibpos/32*Math.PI)*2)/2/smprate;
			//else ch.pos += amigaFreq/(ch.period+ch.vibamp*Math.sin(ch.vibpos/32*Math.PI)*2)/2/smprate;
			if (ch.startcount > volRampNewSmp) ch.pos += ch.delta;
			
			if (smp.repeatleng>2) {
				if (ch.pos<smp.repeatpoint) ch.looping = false;
				while (ch.pos>=smp.repeatpoint+smp.repeatleng) {
					ch.pos -= smp.repeatleng;
					ch.looping = true;
				}
			} else if (ch.pos>=smp.leng) {
				ch.endsmp = smp.data[smp.leng - 1]/4096*ch.volfinal;
				ch.endcount = 0;
				ch.sample = 32;
			}
			
			if (ch.pos<=smp.leng) {
				if (ch.startcount > volRampNewSmp) {
					if (interpolation) {
						var prevdata = smp.data[Math.floor(ch.pos)-1];
						if (Math.floor(ch.pos)-1<0) prevdata=0;
						if ((Math.floor(ch.pos)<=smp.repeatpoint) && ch.looping) prevdata = smp.data[smp.repeatpoint + smp.repeatleng - 1];
						var dy = smp.data[Math.floor(ch.pos)]-prevdata;
						var ix = ch.pos-Math.floor(ch.pos);
						//res = (prevdata+dy*ix)/4096*((ch.volume+ch.treamp*Math.sin(ch.trepos/32*Math.PI)*4)/64);
						res = (prevdata+dy*ix)/4096*ch.volfinal;
					} else res=smp.data[Math.floor(ch.pos)]/4096*ch.volfinal;
					if (ch.startcount < volRampNewSmp << 1) res*=(ch.startcount - 10)/volRampNewSmp;
					ch.prevsmp = res;
				} else {
					res = ch.prevsmp * (volRampNewSmp - ch.startcount)/volRampNewSmp;
				}
				if (ch.startcount < volRampNewSmp << 1) ch.startcount ++ ;

				if (!ch.mute&&res!=undefined&&isNaN(res)) {
					if (ch.pan!=-1) {
						var panL = 1;
						var panR = 1;
						if (ch.pan<127) panR=ch.pan/127;
						else panL=1-(ch.pan-127)/128;
						outL += res*panL;
						outR += res*panR;
					} else {
						if (a%4==0||a%4==3) {
							outL += res;
							outR += res*(1-stereomul);
						} else {
							outR += res;
							outL += res*(1-stereomul);
						}
					}
					outM += res;
				}
			}
		} else {
			ch.pos = 0;
			ch.prevsmp = 0;
			if (ch.endcount < volRampNewSmp) {
				res = ch.endsmp*(volRampNewSmp - ch.endcount)/volRampNewSmp;
				if (ch.pan!=-1) {
					var panL = 1;
					var panR = 1;
					if (ch.pan<127) panR=ch.pan/127;
					else panL=1-(ch.pan-127)/128;
					outL += res*panL;
					outR += res*panR;
				} else {
					if (a%4==0||a%4==3) {
						outL += res;
						outR += res*(1-stereomul);
					} else {
						outR += res;
						outL += res*(1-stereomul);
					}
				}
				outM += res;

				ch.endcount ++ ;
			}
		//	ch.active = false;
		}
		scopeData[a][scopePos]=res;
		a ++ ;
	}
	scopePos++;
	if (scopePos>=bufferSize) scopePos=0;

	/*
	outL = clamp(outL, -1.0, 1.0);
	outR = clamp(outR, -1.0, 1.0);
	outM = clamp(outM, -1.0, 1.0);
	*/
	
	return [outL, outR, outM/1.4];
}

function modmain(ac) {
	
	pvupdated = false;
	t0 = 2.5/tempo;
	var bufferlen = ac.outputBuffer.length;
	var bufferL = ac.outputBuffer.getChannelData(0);
	var bufferR = ac.outputBuffer.getChannelData(1);
	
	//Clearup
	for (i = 0; i < bufferlen; i ++) {
		bufferR[i] = bufferL[i] = 0;
	}
	
	//Mixing
	if (playing) {
		for (i = 0; i < bufferlen; i ++) {
			//Timing
			timer_0 += 1/smprate;
			
			var output = mixChannels();
			
			if (stereo) {
				bufferL[i] = output[0]
				bufferR[i] = output[1];
			} else bufferL[i]=bufferR[i]=output[2];
			
			if (timer_0 >= t0) nextTick();

		}
	}
	
	if (logbuf) {
		console.log(bufferL);
		console.log(bufferR);
		logbuf = false;
	}
}

function updateChannelInfo()
{
	var a = 0;
	while (a<numofchannels) {
		
		var channel = channels[a];
		var effect = channel.effect;
		var para = channel.para;
		
		if (effect==0&&para!=0) {
		//	var arpeggio = [0, para>>4, para&0xF];
		//	var finetune = 0;
		//	if (samples[channel.sample]!=undefined) finetune=samples[channel.sample].finetune;
		//	var fineperiod = (((59-(channel.note+arpeggio[(tick+1)%3]))/16)*finetune);
			if (amigaFreqLimits) {
				var arpeggio = [0, para>>4, para&0xF];
				channel.arpeggioperiod = Math.max(108, Math.min(907, periodTable[channel.periodOfs+arpeggio[tick%3]]));
			} else {
				var arpeggio = [0, para&0xF, para>>4];
			//	var arpeggionote = (channel.note+arpeggio[(tick+1)%3]);
				var arpeggionote = (channel.note+arpeggio[tick%3]);
				channel.arpeggioperiod=(ProTrackerTunedPeriods[samples[channel.sample].finetune*12+arpeggionote%12]<<1)>>(Math.floor(arpeggionote/12)+(amigaFreqLimits ? 1 : 0));
			}
		//	channel.arpeggioperiod = periodTableFT2[channel.note+arpeggio[(tick+1)%3]]-fineperiod;
		} else {
			channel.arpeggioperiod = 0;
		}
		
		var ch = channels[a];
		if (ch.arpeggioperiod!=0) ch.delta = amigaFreq/(ch.arpeggioperiod+ch.vibamp*Math.sin(ch.vibpos/32*Math.PI)*2)/2/smprate;
		else ch.delta = amigaFreq/(ch.period+ch.vibamp*Math.sin(ch.vibpos/32*Math.PI)*2)/2/smprate;
		ch.voltarget = ((ch.volume+ch.treamp*Math.sin(ch.trepos/32*Math.PI)*4)/64);
		a ++ ;
	}
}

function nextTick() {
	while (timer_0 >= t0) timer_0 -= t0;
	tick ++ ;
	
	if (tick >= spd) {
		nextRow();
		updateChannelInfo();
		tick = 0;
		return;
	}
	
	a = 0;
	while (a<numofchannels) {
		var channel = channels[a];
		var effect = channel.effect;
		var para = channel.para;
		if (channel.delay<=-1) {
			
			/*
			if (effect==0&&para!=0) {
			//	var arpeggio = [0, para>>4, para&0xF];
			//	var finetune = 0;
			//	if (samples[channel.sample]!=undefined) finetune=samples[channel.sample].finetune;
			//	var fineperiod = (((59-(channel.note+arpeggio[(tick+1)%3]))/16)*finetune);
				if (amigaFreqLimits) {
					var arpeggio = [0, para>>4, para&0xF];
					channel.arpeggioperiod = Math.max(108, Math.min(907, periodTable[channel.periodOfs+arpeggio[tick%3]]));
				} else {
					var arpeggio = [0, para&0xF, para>>4];
				//	var arpeggionote = (channel.note+arpeggio[(tick+1)%3]);
					var arpeggionote = (channel.note+arpeggio[tick%3]);
					channel.arpeggioperiod=(ProTrackerTunedPeriods[samples[channel.sample].finetune*12+arpeggionote%12]<<1)>>(Math.floor(arpeggionote/12)+(amigaFreqLimits ? 1 : 0));
				}
			//	channel.arpeggioperiod = periodTableFT2[channel.note+arpeggio[(tick+1)%3]]-fineperiod;
			} else {
				channel.arpeggioperiod = 0;
			}*/
			
			if (effect==1) {
				channel.period -= para;
			} else if (effect==2) {
				channel.period += para;
			} else if (effect==3||effect==5) {
				channel.slid = true;
				if (channel.period>channel.targetperiod) channel.period-=channel.paraslide;
				else if (channel.period<channel.targetperiod) channel.period+=channel.paraslide;
				if (Math.abs(channel.period-channel.targetperiod)<channel.paraslide) {
					channel.period = channel.targetperiod;
					channel.slid = false;
				}
			}
			if (effect==4||effect==6) {
				channel.vibamp = channel.paravib&0xF;
				channel.vibpos += (channel.paravib&0xF0)>>4;
			} else channel.vibpos=0;
			if (effect==5||effect==6||effect==10) {
				if (para<16) channel.volume=Math.max(0, channel.volume-para);
				else channel.volume=Math.min(64, channel.volume+(para>>4));
			}
			if (effect==7) {
				channel.treamp = channel.paratre&0xF;
				channel.trepos += (channel.paratre&0xF0)>>4;
			} else channel.trepos=0;
			if (effect==12) channel.volume=para;
			if (effect==14) {
				var effect2 = para>>4;
				var para2 = para&0xF;
				if (tick==1) {
					if (effect2==1) channel.period-=para2;
					if (effect2==2) channel.period+=para2;
					if (effect2==10) channel.volume=Math.min(64, channel.volume+para2);
					if (effect2==11) channel.volume=Math.max(0, channel.volume-para2);
				}
				if (effect2==12&&tick==para2) channel.volume=0;
			}
			if (amigaFreqLimits) channel.period = Math.max(108, Math.min(907, channel.period));
		} else {
			if (channel.delay > -1) channel.delay--;
			if (channel.delay<1) {
				var note = patterndata[patternorder[curpos]][currow][a];
				effect = channel.delayeffect;
				para = channel.delaypara;
				if (channel.delaysample!=0) {
					channel.ofs = 0;
					channel.volume=samples[channel.delaysample-1].vol;
					if (channel.delaysample-1!=channel.sample&&effect!=3&&effect!=4&&effect!=9) channel.pos=channel.startcount=0;
					if (effect!=3) channel.sampleold=channel.delaysample-1;
					if (effect!=3&&effect!=5&&effect!=9&&!channel.slid) channel.sample=channel.sampleold;
				}
				if (channel.delayperiod!=0) {
					var finetune = 0;
					if (effect!=3&&effect!=5) channel.sample = channel.sampleold;
					if (samples[channel.sample]!=undefined) finetune=samples[channel.sample].finetune;
				//	var fineperiod = (((59-channel.note)/16)*finetune);
					if (amigaFreqLimits) {
						channel.periodOfs = channel.delaynote+finetune*finetunemul;
						channel.targetperiod=periodTable[channel.periodOfs];
					} else channel.targetperiod=(ProTrackerTunedPeriods[channel.delaynote%12+finetune*12]<<1)>>(Math.floor(channel.delaynote/12)+(amigaFreqLimits ? 1 : 0));
				//	channel.targetperiod=Math.ceil(periodTableFT2[channel.note]-fineperiod);
				//	channel.targetperiod=((PeriodTab[Math.floor((channel.note%12)*8 + finetune/16)]*(1-(finetune/16-Math.floor(finetune/16)))+PeriodTab[Math.floor((channel.note%12)*8 + finetune/16)]*(finetune/16-Math.floor(finetune/16)))*16/2^Math.floor(channel.note/12));
					if (effect!=9&&effect!=3&&effect!=5) {
						channel.pos = channel.ofs;
						channel.startcount = 0;
					}
					if (effect!=3&&effect!=5) {
						channel.slid = false;
						if (effect==0&&para!=0) channel.arpeggioperiod=channel.period=channel.targetperiod;
						else {
							channel.period = channel.targetperiod;
							channel.arpeggioperiod = 0;
						}
					}
				}
				if ((channel.effect == 14) && (((channel.para&0xF0)>>4) == 9))
                    channel.delay = channel.lastpara&0xF;
                else
                    channel.delay = -1;
			}
		}
		
		a++;
	}
	
	updateChannelInfo();
}

function nextRow() {
	a = 0;
	if (patdelay==0) {
		if (!pvupdated) pvdelay = 0;
		currow ++ ;
		if (patbrk>=0) {
            drawPos = -1;
			currow = patbrk;
			patbrk=repto=-1;
			patrep=reppos=0;
			curpos++;
		} else if (patjmp>=0) {
			drawPos = -1;
			curpos = patjmp;
			currow=patrep=reppos=0;
			repto=patjmp=-1;
		} else if (repto>=0) {
			currow = repto;
			repto = -1;
		} else if (currow>=64) {
			currow=patrep=reppos=0;
			repto = -1;
			curpos++;
		}
		if (curpos>=songleng) curpos=rstpos;
		if (logrow) {
			console.log("Pos "+curpos+" Row "+currow+": ");
			console.log(patterndata[patternorder[curpos]][currow]);
		}
		while (a<numofchannels) {
			var channel = channels[a];
			var note = patterndata[patternorder[curpos]][currow][a];
			var effect = (note.effect&0xF00)>>8;
			var para = note.effect&0xFF;
			
			var i = 0;
			while (i<finetunemul) {
		//	while (i<periodTableFT2.length) {
				if (note.period>=periodTable[i] && amigaFreqLimits) {
			//	if (note.period==periodTableFT2[i]) {
					channel.note = i;
					break;
				} else if (note.period>=(ProTrackerTunedPeriods[i%12]<<1)>>(Math.floor(i/12)+(amigaFreqLimits ? 1 : 0)) && !amigaFreqLimits) {
			//	if (note.period==periodTableFT2[i]) {
					channel.note = i;
					break;
				}
				i++;
			}
			
			if (effect != 0 || para != 0) {
                channel.lasteffect = effect;
                channel.lastpara = para;
			}
			
			channel.effect = effect;
			channel.para = para;

			if (!(channel.lasteffect == 14 && ((channel.lastpara&0xF0) >> 4) == 13))
                channel.delay = -1;
			
		/*	if (note.sample!=0) {
				if (effect!=3&&channel.sample!=note.sample-1&&note.period!=0) channel.active = false;
				channel.volume=samples[note.sample-1].vol;
				channel.sample = channel.sampleold = note.sample-1;
			}
			if (note.period!=0) {
				channel.targetperiod=note.period;
				if (channel.active) channel.notechg=true;
				if (effect!=3) channel.active = false;
				channel.sample = channel.sampleold;
			}*/
			if (effect!=14||(effect==14&&((para&0xF0)>>4)!=13)) {
				if (note.sample!=0) {
					channel.ofs = 0;
					channel.volume=samples[note.sample-1].vol;
				//	if (note.sample-1!=channel.sample&&effect!=3&&effect!=4&&effect!=9) channel.pos=channel.startcount=0;
					if (effect!=3&&effect!=5) channel.sampleold=note.sample-1;
					if (effect!=3&&effect!=5&&effect!=9&&!channel.slid) channel.sample=channel.sampleold;
				}
				if (note.period!=0) {
					var finetune = 0;
					if (effect!=3&&effect!=5) channel.sample=channel.sampleold;
					if (samples[channel.sample]!=undefined) finetune=samples[channel.sample].finetune;
				//	var fineperiod = (((59-channel.note)/16)*finetune);
					if (amigaFreqLimits) {
						channel.periodOfs = channel.note+finetune*finetunemul;
						channel.targetperiod=periodTable[channel.periodOfs];
					} else channel.targetperiod=(ProTrackerTunedPeriods[channel.note%12+finetune*12]<<1)>>(Math.floor(channel.note/12)+(amigaFreqLimits ? 1 : 0));
				//	channel.targetperiod=Math.ceil(periodTableFT2[channel.note]-fineperiod);
				//	channel.targetperiod=((PeriodTab[Math.floor((channel.note%12)*8 + finetune/16)]*(1-(finetune/16-Math.floor(finetune/16)))+PeriodTab[Math.floor((channel.note%12)*8 + finetune/16)]*(finetune/16-Math.floor(finetune/16)))*16/2^Math.floor(channel.note/12));
					if (effect!=9&&effect!=3&&effect!=5)
					{
						channel.startcount = 0;
						channel.pos = channel.ofs;
					}
					if (effect!=3&&effect!=5) {
						channel.slid = false;
						if (effect==0&&para!=0) channel.arpeggioperiod=channel.period=channel.targetperiod;
						else {
							channel.period = channel.targetperiod;
							channel.arpeggioperiod = 0;
						}
					}
				}
				if ((note.sample!=0||note.period!=0)&&effect==9) {
					channel.ofs=para*256;
					if (channel.ofs!=0) channel.ofsold=channel.ofs;
					if (note.period!=0)
					{
						channel.startcount = 0;
						channel.pos = channel.ofsold;
					}
				}
			} else {
				channel.delay = para&0xF;
				channel.delaynote = channel.note;
				channel.delaysample = note.sample;
				channel.delayperiod = note.period;
				channel.delayeffect = effect;
				channel.delaypara = para;
			}
			if (effect!=0||para==0) channel.arpeggioperiod=0;
			if (effect==3&&para!=0) channel.paraslide=para;
			if (effect==4) {
				if ((para&0xF)>0) channel.paravib=(channel.paravib&0xF0)+(para&0xF);
				if (((para&0xF0)>>4)>0) channel.paravib=(channel.paravib&0xF)+(para&0xF0);
			}
			if (effect==7) {
				if ((para&0xF)>0) channel.paratre=(channel.paratre&0xF0)+(para&0xF);
				if (((para&0xF0)>>4)>0) channel.paratre=(channel.paratre&0xF)+(para&0xF0);
			}
			if (effect==8&&!amigaFreqLimits) channel.pan=para<<1;
			if (effect==11) patjmp=para;
			if (effect==12) channel.volume=para;
			if (effect==13) patbrk=(para>>4)*10+para%0xF;
			if (effect==14&&((para&0xF0)>>4)==6) {
				if ((para&0xF)==0&&reppos<currow) {
					reppos = currow;
					patrep = 0;
				} else if (patrep<(para&0xF)) {
					patrep++;
					repto = reppos;
				}
			}
			if (effect==14&&((para&0xF0)>>4)==9) {
				channel.delay = para&0xF;
				channel.delaynote = channel.note;
				channel.delaysample = note.sample;
				channel.delayperiod = note.period;
				channel.delayeffect = effect;
				channel.delaypara = para;
			}
			if (effect==14&&((para&0xF0)>>4)==14) pvdelay=patdelay=para&0x0F;
			if (effect==15) {
				if (para<32) spd=para;
				else tempo=para;
			}
			
			if (channel.delay > -1)
				channel.delay -- ;
			
			a++;
		}
	} else {
		patdelay--;
	}
	if (!pvupdated) pvrow=currow;
	pvupdated = true;
}

function resetChannels() {
	a = 0;
	channels = [];
	while (a<numofchannels) {
		channels.push({
			'note':		0,
			'period':	428,
			'targetperiod':	428,
			'delta':	0,
			'slid':		false,
			'periodOfs':	0,
			'arpeggio':	0,
			'sample':	32,
			'sampleold':	32,
			'pos':		0,
			'startcount':	0,
			'endcount':	0,
			'prevsmp':	0,
			'endsmp':	0,
			'looping':	false,
			'ofs':		0,
			'ofsold':	0,
			'volume':	0,
			'voltarget':	0,
			'volfinal':	0,
			'effect':	0,
			'lasteffect':	0,
			'para':		0,
			'lastpara':	0,
			'pan':		-1,
			'vibpos':	0,
			'vibamp':	0,
			'trepos':	0,
			'treamp':	0,
			'paraslide':	0,
			'paravib':	0,
			'paratre':	0,
			'delay':	-1,
			'cutdelay':	0,
			'delaynote':	0,
			'delaysample':	0,
			'delayperiod':	0,
			'delayeffect':	0,
			'delaypara':	0,
			'mute': false
		});
		a ++ ;
	}
}

function resetPlayerPatJmp()
{
	pattern_swap = false;
    oldpos = 128;
	oldrow = 64;
    drawPos = -1;

	currow = -1;
	curpos = 0;
	patbrk = -1;
	patjmp = -1;
	patdelay = 0;
	patrep = 0;
	reppos = 0;
	repto = -1;
	tick = 0;
	
	timer_0 = timer_1 = 0;
}

function initialize_player() {
	gainNode.connect(audioCtx.destination);
	scriptNode.connect(gainNode);
	scriptNode.onaudioprocess = modmain;
	
	volume = 1.0;
	
	tempo = 125;
	spd = 6;
	
    resetPlayerPatJmp();
	
	resetChannels();
	
	init = 1;
	playing = 1;
}

function posJmp(val) {
	resetPlayerPatJmp();
	curpos = val;
	
	resetChannels();
}

function muteAll(val) {
	var i = 0;
	while (i<numofchannels) {
		channels[i].mute = val;
		i++;
	}
}

function solo(ch) {
	var i = 0;
	while (i<numofchannels) {
		channels[i].mute = (ch!=i);
		i++;
	}
}

function mute(ch) {
    if (channels[ch] == undefined) return;
	channels[ch].mute = !channels[ch].mute;
}

function drawScreen() {
	
	var draw = maxFPS < desiredFPS || drawReq;
	var modview = document.getElementById("pattern");
	if (draw) {
		var scope = document.getElementById("scope");
		var context = scope.getContext("2d");
		var scrwidth = 164+numofchannels*100;
		if (scrwidth<564) scrwidth=564;
		scope.width=scrwidth;
		context.fillStyle = "#000000";
		context.fillRect(0, 0, scope.width, scope.height);
		context.textBaseline = "middle";
		var i = 0;
		var j;
		while (i<numofchannels) {
			j = 0;
			context.strokeStyle = '#ccccff';
			if (init) {
				if (channels[i].mute) context.strokeStyle = '#cc0000';
			}

			context.beginPath();
			if (init) {
				var k = scopePos;
				while (j<bufferSize) {
					context.lineTo(100*i+j*(100/bufferSize), (scopeData[i][k]/0.03125)*39.5+40);
					k++;
					if (k>=bufferSize) k=0;
					j++;
				}
				context.stroke();
			}

			context.font = "16px bold Arial";
			context.fillStyle = "#ffffff";
			context.textAlign = "left";
			context.fillText((i+1), i*100, 8);

			i++;
		}

		if (init) {
			context.font = "12px Arial";
			context.textAlign = "right";
			context.fillText("Tempo: "+(tempo >= 100 ? decText[Math.floor(tempo/100)] : "　")+(tempo >= 10 ? decText[Math.floor(tempo%100/10)] : "　")+decText[tempo%10], scope.width, 6);
			context.fillText("Ticks per row: 　"+(spd >= 10 ? decText[Math.floor(spd/10)] : "　")+decText[spd%10], scope.width, 18);
			context.fillText("Pos: "+hexTextB[curpos>>4]+hexTextB[curpos&0xF]+"／"+(hexTextB[(songleng-1)>>4]+hexTextB[(songleng-1)&0xF]), scope.width, 30);
			context.fillText("Row: "+hexTextB[currow>>4]+hexTextB[currow&0xF]+"　　　", scope.width, 42);
			context.fillText("Pattern: "+hexTextB[patternorder[curpos]>>4]+hexTextB[patternorder[curpos]&0xF]+"　　　", scope.width, 54);
		}	
	}

	var fullRedraw = drawPos < 0;
	//if (init&&curpos!=oldpos&&!fullRedraw) pattern_swap = !pattern_swap;
	if (init&&curpos!=oldpos) pattern_swap = !pattern_swap;
		
	pattern_canvas = pattern_swap ? pattern_canvas_b : pattern_canvas_a;
	context = pattern_canvas.getContext("2d");
	if (init&&curpos!=oldpos) {
	//	/*
		pattern_canvas.width = 0;
		pattern_canvas.height = 0;
		pattern_canvas.width = 30+numofchannels*100;
		pattern_canvas.height = 780;
	//	*/
		drawPos = 0;
	}
	
/*
	var i = currow-12;
	if (i<0) i=0;
	var l = i+24;
	i = 0;
	while (i<l) {
		if (i>=64) break;
*/
	
	if (init) {
		var targetDrawPos = drawPos + patternDrawSpd;
		if (fullRedraw) {
			drawPos = 0;
			targetDrawPos = 64;
		}
		if (targetDrawPos > 64) targetDrawPos = 64;

	//	/*
		if (fullRedrawed) {
			pattern_canvas.width = 0;
			pattern_canvas.height = 0;
			pattern_canvas.width = 30+numofchannels*100;
			pattern_canvas.height = 780;
			drawPos = 0;
			fullRedrawed = false;
		}
	//	*/
		
		context.textBaseline = "bottom";
		context.font = "12px Arial";
		context.fillStyle = "#000000";
		
		if (drawPos < 64) {
			i = drawPos;
			var patPos = curpos + (fullRedraw ? 0 : 1);
			if (patPos>=songleng) patPos = 0;
			while (i<targetDrawPos) {
				j = 0;
				context.fillStyle = "#ffffff";
				context.textAlign = "left";
				context.fillText(hexTextB[i>>4]+hexTextB[i&0xF], 0, 24+i*12);
				while (j<numofchannels) {
					var note = patterndata[patternorder[patPos]][i][j];
					var notenum = 0;
					var k = 0;
					var txt = "";
					if (note.period!=0) {
						while (k<85) {
					//	while (k<periodTableFT2.length) {
							if (note.period>=(ProTrackerTunedPeriods[k%12]<<1)>>(Math.floor(k/12)+(amigaFreqLimits ? 1 : 0))) {
						//	if (note.period==periodTableFT2[k]) {
								notenum = k;
								break;
							}
							k++;
						}
						txt = noteText[notenum%12]+(Math.floor(notenum/12)+2);
					} else txt="－－－";
					context.fillStyle = "#ffffff";
					context.textAlign = "left";
					context.fillText(txt, 30+j*100, 24+i*12);
					var da,db,dc;
					if (note.sample!=0) {
						da = note.sample&0xF;
						db = note.sample>>4;
						txt = hexTextB[db]+hexTextB[da];
					} else txt="－－";
					context.fillStyle = "#ccccff";
					context.textAlign = "left";
					context.fillText(txt,66+j*100, 24+i*12);
					if (note.effect!=0) {
						da = note.effect&0xF;
						db = (note.effect&0xF0)>>4;
						if (((note.effect&0xF00)>>8)==8) {
							da = ((note.effect&0xFF)<<1)&0xF;
							db = ((note.effect&0xFF)<<1)>>4;
						}
						dc = (note.effect&0xF00)>>8;
						context.fillStyle = "#dddddd";
						//Too lazy to use switch (dc)
						if (dc==0) context.fillStyle = "#dddddd";
						else if (dc<=4) context.fillStyle = "#cc8822";
						else if (dc<=6) context.fillStyle = "#ccccff";
						else if (dc==7) context.fillStyle = "#cc8822";
						else if (dc<=9) context.fillStyle = "#888888";
						else if (dc<=10) context.fillStyle = "#00cc00";
						else if (dc==11) context.fillStyle = "#cc0000";
						else if (dc==12) context.fillStyle = "#00cc00";
						else if (dc==13) context.fillStyle = "#cc0000";
						else if (dc==14) context.fillStyle = "#999999";
						else if (dc==15) context.fillStyle = "#cc0000";
						txt = hexTextB[dc]+hexTextB[db]+hexTextB[da];
					} else {
						context.fillStyle = "#ccccff";
						txt="－－－";
					}
					context.textAlign = "left";
					context.fillText(txt, 90+j*100, 24+i*12);
					j++;
				}
				i++;
			}
		}
		if (drawPos<64) drawPos += patternDrawSpd;
	}

//	if (!fullRedraw) pattern_canvas = !pattern_swap ? pattern_canvas_b : pattern_canvas_a;
	pattern_canvas = !pattern_swap ? pattern_canvas_b : pattern_canvas_a;
	if (fullRedraw) {
		pattern_swap = !pattern_swap;
		fullRedrawed = true;
	}

	if (smoothScrolling || currow != oldrow || curpos != oldpos) { 
		pvrow = currow;
	//	pvdelay = patdelay;
		var patscroll = -6+(pvrow+1)*-12;
		if (smoothScrolling&&pvdelay==0) patscroll-=(tick/spd*12);
	//	if (smoothScrolling&&(!patbrk>=0&&!patjmp>=0&&pvdelay==0&&pvrow>0)) patscroll=-8+(pvrow+2)*-16-(tick/spd*16);
		if (smoothScrolling&&pvdelay!=0) patscroll-=(tick+spd*(pvdelay-patdelay))/(spd*(pvdelay+1))*12;
	/*	if (pvdelay==patdelay) patscroll+=16-(tick/spd*16);
			else
			patscroll+=16-(tick+spd*(pvdelay-patdelay))/(spd*(pvdelay))*16;
		}*/
		
		var drawPat = currow != oldrow;
		if (draw) {
			modview.width=scrwidth;
			context = modview.getContext("2d");
			context.fillStyle = "#000000";
			context.fillRect(0, 0, modview.width, modview.height);
			
			context.fillStyle = "#444444";
			if (init) {
				if (smoothScrolling) context.fillRect(0, Math.round(modview.height/2+patscroll+(pvrow+1)*12), modview.width, 12);
				else if (drawPat) context.fillRect(0, modview.height/2-6, modview.width, 12);
			}
		
			context.drawImage(pattern_canvas, Math.round(modview.width/2-pattern_canvas.width/2), Math.round(patscroll+modview.height/2));
		}
	}

	drawReq = false;
	oldpos = curpos;
	if (draw) {
		oldrow = currow;
	}
	if (playing) {
		window.requestAnimationFrame(drawScreen);
	}
}

var muteSelector;
var jmpSel;
var patTimer;
window.onload = function () {
	
	var play_btn = document.getElementById("playbtn");
	var load_btn = document.getElementById("loadbtn");
	var stereo_btn = document.getElementById("stereobtn");
	var interpolation_btn = document.getElementById("interpolationbtn");
	var smoothscroll_btn = document.getElementById("smoothscrollbtn");
	var desiredfps_num = document.getElementById("desiredfps");
	songname_canvas = document.getElementById("songname");
	samples_canvas = document.getElementById("samples");
	
	drawReq = true;
	drawScreen();
	initInfoView();
	
	interpolation_btn.onclick = function () {
		interpolation = !interpolation;
		if (!interpolation) {
			interpolation_btn.innerHTML = "Interpolation Off";
		} else {
			interpolation_btn.innerHTML = "Interpolation On";
		}
	}
	
	smoothscroll_btn.onclick = function () {
		smoothScrolling = !smoothScrolling;
		if (!smoothScrolling) {
			smoothscroll_btn.innerHTML = "Smooth Scrolling Off";
		} else {
			smoothscroll_btn.innerHTML = "Smooth Scrolling On";
		}
	}
	
	play_btn.onclick = function () {
		if (loaded) {
			if (!init) initialize_player(); else {
				playing = !playing;
			}
			if (!playing) {
				scriptNode.disconnect(audioCtx.destination);
				play_btn.innerHTML = "Play";
				
				clearInterval(patTimer);
				clearInterval(drawTimer);
			} else {
				scriptNode.connect(audioCtx.destination);
				play_btn.innerHTML = "Pause";

				//https://github.com/a1k0n/jsxm/
				// hack to get iOS to play anything
				var temp_osc = audioCtx.createOscillator();
				temp_osc.connect(audioCtx.destination);
				!!temp_osc.start ? temp_osc.start(0) : temp_osc.noteOn(0);
				!!temp_osc.stop ? temp_osc.stop(0) : temp_osc.noteOff(0);
				temp_osc.disconnect();
				
				desiredFPS = desiredfps_num.value;
				patTimer = setInterval(function() {jmpSel.selectedIndex = curpos;}, 100);
				drawTimer = setInterval(function() {
					drawReq = true;
				}, 1000 / desiredFPS);
				window.requestAnimationFrame(drawScreen);
			}
		}
	}
	
	load_btn.onclick = function () {
		if (playing) {
			clearInterval(patTimer);
			clearInterval(drawTimer);
		}
		
		if (!audioContextCreated) {
			AudioContext = window.AudioContext || window.webkitAudioContext;
			audioCtx = new AudioContext();
			gainNode = audioCtx.createGain();
			gainNode.gain.value = 5;
			gainNode.connect(audioCtx.destination);
			scriptNode = audioCtx.createScriptProcessor(bufferSize, 0, 2);
			smprate = audioCtx.sampleRate;
			maxFPS = smprate/bufferSize;
			console.log("Buffer size: " + scriptNode.bufferSize);
			console.log("Sample rate: " + audioCtx.sampleRate);
			console.log("Max FPS: " + maxFPS);
			
			audioContextCreated = true;
		}
		
		var selectedFile = document.getElementById('modfile').files[0];
		var reader = new FileReader();
		play_btn.innerHTML = "Play";
		reader.readAsArrayBuffer(selectedFile);
		reader.onload = function(e) {
			//load(e.target.result);
			filebuffer = e.target.result;
			console.log(filebuffer);
			if (playing) {
				scriptNode.disconnect(audioCtx.destination);
			}
			playing = 0;
			loaded = 0;
			init = 0;
			load_module();

			drawReq = true;
			drawScreen();
		}
	}
	
	stereo_btn.onclick = function () {
		stereo = !stereo;
		if (!stereo) {
			stereo_btn.innerHTML = "Mono";
		} else {
			stereo_btn.innerHTML = "Stereo";
		}
	}
	
	var fpsChange = function ()
	{
		desiredFPS = desiredfps_num.value;
		if (playing) {
			clearInterval(drawTimer);
			drawTimer = setInterval(function() {
				drawReq = true;
			}, 1000 / desiredFPS);
		}
	}
	
	desiredfps_num.onmousedown = function() {
		desiredfps_num.oninput = null;
	}
	
	desiredfps_num.onmouseup = function () {
		fpsChange();
		desiredfps_num.oninput = fpsChange
	}
	
	var muteall_btn = document.getElementById("muteallbtn");
	var umute_btn = document.getElementById("umutebtn");
	muteall_btn.onclick = function() {muteAll(true);}
	umute_btn.onclick = function() {muteAll(false);}
	
	var mute_btn = document.getElementById("mutebtn");
	var solo_btn = document.getElementById("solobtn");
	muteSelector = document.getElementById("mutesel");
	mute_btn.onclick = function () {
		if (init)
			mute(muteSelector.selectedIndex);
	}
	solo_btn.onclick = function () {
		if (init)
			solo(muteSelector.selectedIndex);
	}
	
	jmpSel = document.getElementById("posjump");
	jmpSel.onchange = function () {
		if (init)
			posJmp(jmpSel.selectedIndex);
	}
}

/*
window.onfocus = function () {
	redrawByFocus = true;
}
*/
