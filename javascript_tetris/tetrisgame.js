//Javascript Tetris Game
//Created at 2021-10-22 10:54 PM
//Glacc 2023-05-19

//Changelog
//
// 2023-05-19
//	- Renameing some variables accroding to Tetris glossary
//	- Combo
//	- T-spin
//	- Back-to-back
//  - Lock delay
//
// 2021-10-24
//	?
//

var keyMoveLeft = 37;		// Left
var keyMoveRight = 39;		// Right
var keyRotateLeft = 90;		// Z
var keyRotateRight = 88;	// X
var keySoftDrop = 40;		// Down
var keyHardDrop = 32;		// Spacebar
var keyHold = 67;			// C
var keyPause = 27;			// Escape
var keyInstruction = 72;	// H

var das = 7;			// DAS
var arr = 3;			// ARR
var softDropDelay = 1.8;

var lockDelay = 30;
var maxLockDelayRstCnt = 10;

var keyName = [
	"", "", "", "", "", "", "", "",																					// 0-7
	"Backspace", "Tab", "", "", "", "Enter", "", "", "Shift", "Ctrl", "Alt", "Pause/Break", "CapsLock",				// 8-20
	"", "", "", "", "", "",																							// 21-26
	"Escape", "", "", "", "",																						// 27-31
	"Spacebar",	"PgUp", "PgDn", "End", "Home",																		// 32-36
	"←", "↑", "→", "↓", "", "", "",																					// 37-43
	"PrtSc", "Insert", "Delete", "",																				// 44-47
	"0", "1", "2", "3", "4", "5", "6", "7", "8", "9",																// 48-57
	"", "", "", "", "", "", "",																						// 58-64
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",												// 65-77
	"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",												// 78-90
	"Left Windows",	"Right Windows", "Select", "", "",																// 91-95
	"Num 0", "Num 1", "Num 2", "Num 3", "Num 4", "Num 5", "Num 6", "Num 7", "Num 8", "Num 9",						// 96-105
	"Num *", "Num +", "Num -", "Num .", "Num /",																	// 106-111
	"F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",										// 112-123
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 								// 124-143
	"NumLock", "ScrLock", 																							// 144-145
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 	// 146-172
	"Mute", "Vol -", "Vol +", "", "", "", "", "", "unnamed", "unnamed", "unnamed", "", "", 							// 173-185
	";", "=", ",", "-", ".", "/", "`", 																				// 186-192
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",			// 193-218
	"[", "\\", "]", "'"																								// 219-222
];

var gameStat = 0;
var menuSelected = 0;
var level = 1;
var score = 0;
var lines = 0;
var tSpin = false;
var combo = -1;
var backToBack = -1;
var paused = 0;
var gameOver = 0;

var modeOld = 0;

var timer = 0;
var stepTime = 1000;
var lockTmr = 0;

var keyTimerHS = 0;
var keyTimerH = 0;
var keyTimerV = 0;
var keyDir = 0;

var startPosX = 2;
var startPosY = 2;
var posX = startPosX;
var posY = startPosY;
var previewX = posX;
var previewY = posY;
var curColour = 0;
var curTetrimino = 0;
var rstCnt = 0;
var holdCount = 0;
var holdTetrimino = -1;

var playfieldMsg = ["", "", "", ""];
var playfieldMsgDuration = 40;
var playfieldMsgTmr = playfieldMsgDuration;

var keyUp = 1;

var gameCanvas;
var interval;

var minoTable = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var tetriminoDataSize = 5;

var tetriminoData = [
	//J
	[
		[0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], 
	//L
	[
		[0, 0, 0, 0, 0],
		[0, 0, 0, 1, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0]
	],[
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 1, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	],
	//S
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	],
	//T
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 1, 1, 1, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	],
	//Z
	[
		[0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 1, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 1, 0, 0, 0],
		[0, 0, 0, 0, 0]
	],
	//I
	[
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 1, 1, 1, 1],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[1, 1, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 0, 0, 0]
	],
	//O
	[
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0]
	], [
		[0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 1, 1, 0, 0],
		[0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0]
	],
];

var kickTestIDs = [0, 0, 0, 0, 0, 1, 2];

var kickTestVectors = [
	[
		[[ 0,  0], [ 0,  0], [ 0,  0], [ 0,  0], [ 0,  0]], 
		[[ 0,  0], [ 1,  0], [ 1, -1], [ 0,  2], [ 1,  2]], 
		[[ 0,  0], [ 0,  0], [ 0,  0], [ 0,  0], [ 0,  0]], 
		[[ 0,  0], [-1,  0], [-1, -1], [ 0,  2], [-1,  2]]
	], [
		[[ 0,  0], [-1,  0], [ 2,  0], [-1,  0], [ 2,  0]], 
		[[-1,  0], [ 0,  0], [ 0,  0], [ 0,  1], [ 0, -2]], 
		[[-1,  1], [ 1,  1], [-2,  1], [ 1,  0], [-2,  0]], 
		[[ 0,  1], [ 0,  1], [ 0,  1], [ 0, -1], [ 0,  2]]
	], [
		[[ 0,  0]], 
		[[ 0, -1]], 
		[[-1, -1]], 
		[[-1,  0]]
	], 
]

var colorTable = ["#0000FF", "#FF9F00", "#00CF00", "#CF00CF", "#CF0000", "#009FFF", "#FFFF00"];

// Draw

var minoSpacing = 2;
var minoWidth = (256 + minoSpacing) / 10.0;
var minoHeight = (512 + minoSpacing) / 20.0;
var minoWidthInternal = minoWidth - minoSpacing;
var minoHeightInternal = minoHeight - minoSpacing;

function DrawScreen()
{
	var context = gameCanvas.getContext("2d");
	context.fillStyle = "#000000";
	context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

	// Border
	context.strokeStyle = "#00000000";
	context.fillStyle = "#FFFFFFFF";
//	context.fillStyle = "#FFFFFF7F";
	context.fillRect(60, 60 + 64, 263, 2);
//	context.fillStyle = "#FFFFFFFF";
	context.fillRect(60, 60 + 64, 263, 2);
	context.fillRect(60, 60 + 64, 2, 519);
	context.fillRect(322, 60 + 64, 2, 519);
	context.fillRect(60, 578 + 64, 263, 2);

	// Playfield
	var y = 1;
	while (y < 25)
	{
		var x = 0;
		while (x < 10)
		{
			if (minoTable[y][x])
			{
				context.fillStyle = colorTable[minoTable[y][x] - 1];
				context.fillRect(64 + x * minoWidth, 128 + (y - 5) * minoHeight, minoWidthInternal, minoHeightInternal);
			}

			x ++ ;
		}
		
		y ++ ;
	}

	// Current
	if (!gameOver)
	{
		y = 0;
		while (y < tetriminoDataSize)
		{
			var x = 0;
			while (x < tetriminoDataSize)
			{
				if (tetriminoData[curTetrimino][y][x])
				{
					context.fillStyle = colorTable[curColour];
					context.fillRect(64 + (posX + x) * minoWidth, 128 + (posY + y - 5) * minoHeight, minoWidthInternal, minoHeightInternal);
				}

				x ++ ;
			}

			y ++ ;
		}
	}

	// Preview
	if (posY != previewY)
	{
		y = 0;
		while (y < tetriminoDataSize)
		{
			var x = 0;
			while (x < tetriminoDataSize)
			{
				if (tetriminoData[curTetrimino][y][x])
				{
					context.fillStyle = colorTable[curColour] + "3F";
					context.fillRect(64 + (previewX + x) * minoWidth, 128 + (previewY + y - 5) * minoHeight, minoWidthInternal, minoHeightInternal);
				}

				x ++ ;
			}

			y ++ ;
		}
	}

	// Hold
	if (holdTetrimino >= 0)
	{
		var Hold = holdTetrimino << 2;

		y = 0;
		while (y < tetriminoDataSize)
		{
			var x = 0;
			while (x < tetriminoDataSize)
			{
				if (tetriminoData[Hold][y][x])
				{
					context.fillStyle = colorTable[Hold >> 2];
					context.fillRect(384 + (x - 2) * minoWidth, 128 + y * minoHeight, minoWidthInternal, minoHeightInternal);
				}

				x ++ ;
			}

			y ++ ;
		}
	}

	// Next
	var i = 0;
	while (i <= tetriminoQueueTop)
	{
		var QueuePiece = tetriminoQueue[i] << 2;

		y = 0;
		while (y < tetriminoDataSize)
		{
			var x = 0;
			while (x < tetriminoDataSize)
			{
				if (tetriminoData[QueuePiece][y][x])
				{
					context.fillStyle = colorTable[QueuePiece >> 2];
					context.fillRect(384 + (x - 2) * minoWidth, 160 + (y + (i + 1) * 3) * minoHeight, minoWidthInternal, minoHeightInternal);
				}

				x ++ ;
			}

			y ++ ;
		}

		i ++ ;
	}

	// Text
	context.fillStyle = "#FFFFFF";
	context.font = "16px Gadugi";
	context.textBaseline = "top";
	context.textAlign = "left";
	context.fillText("HOLD:", 352, 128);
	context.fillText("NEXT:", 352, 160 + minoHeight * 3);

	// Info
	if (playfieldMsgTmr < playfieldMsgDuration)
	{
		var alpha = Math.min(((playfieldMsgDuration - playfieldMsgTmr) / 10), 1);

		context.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
		context.font = "20px Gadugi";
		context.textBaseline = "middle";
		context.textAlign = "center";

		var i = 0;
		while (i < playfieldMsg.length)
		{
			context.fillText(playfieldMsg[i], 188, 316 + i * 30);
			i ++ ;
		}

		playfieldMsgTmr ++ ;
	}

	// Pause
	if (paused)
	{
		context.fillStyle = "#000000";
		context.fillRect(128, 273, 256, 96);
		context.fillStyle = "#FFFFFF";
		context.fillRect(128, 273, 256, 2);
		context.fillRect(128, 273, 2, 96);
		context.fillRect(382, 273, 2, 96);
		context.fillRect(128, 367, 256, 2);
		
		context.font = "24px Gadugi";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText("Paused", 256, 316);
		
		context.font = "10px Gadugi";
		context.fillText("Press " + keyName[keyPause] + " to continue.", 256, 340);
	}

	switch (gameStat)
	{
		case 0:			// Level select
			context.fillStyle = "#000000";
			context.fillRect(128, 257, 256, 128);
			context.fillStyle = "#FFFFFF";
			context.fillRect(128, 257, 256, 2);
			context.fillRect(128, 257, 2, 128);
			context.fillRect(382, 257, 2, 128);
			context.fillRect(128, 383, 256, 2);

			context.font = "24px Gadugi";
			context.textBaseline = "middle";
			context.textAlign = "center";
			context.fillText("Level: " + level, 256, 296);

			context.font = "14px Gadugi";
			context.fillText("Press ←/→ to select level.", 256, 328);

			context.font = "10px Gadugi";
			context.fillText("Press Spacebar to start.", 256, 352);
			break;
		case 2:			// Controls
			context.fillStyle = "#000000";
			context.fillRect(128, 192, 256, 256);
			context.fillStyle = "#FFFFFF";
			context.fillRect(128, 192, 256, 2);
			context.fillRect(128, 192, 2, 256);
			context.fillRect(382, 192, 2, 256);
			context.fillRect(128, 448, 256, 2);

			context.font = "18px Gadugi";
			context.textBaseline = "middle";
			context.textAlign = "center";
			context.fillText("- Controls -", 256, 224);

			var yOfs = 256;
			context.font = "14px Gadugi";
			context.fillText(keyName[keyMoveLeft] + "/" + keyName[keyMoveRight] + " - Move left/right", 256, yOfs);
			context.fillText(keyName[keyRotateLeft] + "/" + keyName[keyRotateRight] + " - Rotate left/right", 256, yOfs + 16);

			context.fillText(keyName[keySoftDrop] + " - Soft drop", 256, yOfs + 16 * 3);
			context.fillText(keyName[keyHardDrop] + " - Hard drop", 256, yOfs + 16 * 4);

			context.fillText(keyName[keyHold] + " - Hold", 256, yOfs + 16 * 6);

			context.fillText(keyName[keyPause] + " - Pause", 256, yOfs + 16 * 8);

			context.font = "10px Gadugi";
			context.fillText("Press " + keyName[keyInstruction] + " to close.", 256, yOfs + 16 * 10);
			break;
	}

	//Game over
	if (gameOver)
	{
		context.fillStyle = "#000000";
		context.fillRect(128, 273, 256, 96);
		context.fillStyle = "#FFFFFF";
		context.fillRect(128, 273, 256, 2);
		context.fillRect(128, 273, 2, 96);
		context.fillRect(382, 273, 2, 96);
		context.fillRect(128, 367, 256, 2);

		context.font = "24px Gadugi";
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText("Game Over", 256, 316);

		context.font = "10px Gadugi";
		context.fillText("Press Spacebar to continue.", 256, 340);
	}

	context.fillStyle = "#FFFFFF";
	context.font = "16px Gadugi";
	context.textBaseline = "middle";
	context.textAlign = "center";
	context.fillText(keyName[keyInstruction] + " - Controls", 256, 672);
}

// Randomizer

var tetriminoQueueTop = 4;
var tetriminoQueue = [];

var curBag = 0;
var curBagCount = 0;
var tetriminoBag = [[], [], []];

function NewBag(bagID)
{
	var maxRetryCount = 10;

	var i = 0;
	while (i < 7)
	{
		var randID = Math.floor(Math.random() * 7);

		var retryCount = 0;
		while (retryCount < maxRetryCount)
		{
			var j = 0;
			while (j < i)
			{
				if (randID == tetriminoBag[bagID][j])
				{
					randID = Math.floor(Math.random() * 7);
					break;
				}	

				j ++ ;
			}

			if (j == i)
				break;

			retryCount ++ ;
		}
		if (retryCount == maxRetryCount)
		{
			randID = 0;

			while (randID < 6)
			{
				var j = 0;
				while (j < i)
				{
					if (randID == tetriminoBag[bagID][j])
						break;

					j ++ ;
				}
				
				if (j == i)
					break;

				randID ++ ;
			}
		}
		
		tetriminoBag[bagID][i++] = randID;
	}
}

function RandTetrimino()
{
	var curTetrimino = tetriminoBag[curBag][curBagCount++];

	if (curBagCount >= 7)
	{
		NewBag(curBag++);
		curBagCount = 0;

		if (curBag >= 3)
			curBag = 0;
	}

	return curTetrimino;
}

function InitRandomizer()
{
	curBag = 0;
	curBagCount = 0;

	var i = 0;
	while (i < 3)
		NewBag(i++);

	i = 0;
	while (i < 5)
		tetriminoQueue[i++] = RandTetrimino();
}

function FetchQueue()
{
	curTetrimino = tetriminoQueue[0] << 2;
	curColour = curTetrimino >> 2;

	var i = 0;
	while (i < tetriminoQueueTop)
	{
		tetriminoQueue[i] = tetriminoQueue[i + 1];
		i ++ ;
	}

	tetriminoQueue[tetriminoQueueTop] = RandTetrimino();
}

// Logic

class Keys
{
	static keyTable = [];
	static keyPressTable = [];

	static Init()
	{
		var i = 0;
		while (i < 256)
		{
			this.keyTable[i] = 0;
			this.keyPressTable[i] = 0;
			
			i ++ ;
		}

		this.KeyPress = 0;
	}

	static KeyDown(keyNum)
	{
		this.keyTable[keyNum] = 1;
	}

	static KeyUp(keyNum)
	{
		
		this.keyTable[keyNum] = 0;
	}

	static KeyPressed(groupNum)
	{
		this.keyPressTable[groupNum] = 1;
	}

	static KeyReleased(groupNum)
	{
		this.keyPressTable[groupNum] = 0;
	}

	static IsPressed(groupNum)
	{
		return this.keyPressTable[groupNum];
	}

	static IsDown(keyNum)
	{
		return this.keyTable[keyNum];
	}
}

function ClearPlayfield()
{
	var y = 0;
	while (y < 25)
	{
		var x = 0;
		while (x < 10)
			minoTable[y][x++] = 0;

		y ++ ;
	}
}

function InitGame()
{
	gameStat = 0;
	menuSelected = 0;
	level = 1;
	score = 0;
	lines = 0;
	tSpin = false;
	combo = -1;
	backToBack = -1;
	paused = 0;
	gameOver = 0;

	stepTime = 1000;
	lockTmr = 0;
	rstCnt = 0;

	keyUp = 0;

	InitRandomizer();
	FetchQueue();

	ClearPlayfield();
}

function ToggleControlScreen()
{
	if (gameStat != 2)
	{
		modeOld = gameStat;
		gameStat = 2;
	}
	else
		gameStat = modeOld;
}

function RemoveLine(line)
{
	while (line)
	{
		minoTable[line] = minoTable[line - 1];
		line -- ;
	}

	minoTable[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function LineClearDetect()
{
	var count = 0;

	var y = 24;
	while (y >= 0)
	{
		var x = 0;
		while (x < 10)
		{
			if (!minoTable[y][x])
				break;

			x ++ ;
		}
		
		if (x == 10)
		{
			count ++ ;
			lines ++ ;
			RemoveLine(y);
		}
		else
			y -- ;
	}

	var lineClearStr = ["", "Double", "Triple", "Quad"];
	if (count > 0)
	{
		var ofs = 0;
		playfieldMsg = ["", "", "", ""];

		if (tSpin)
			playfieldMsg[ofs] += "T-Spin "

		playfieldMsg[ofs++] += lineClearStr[count - 1];

		if ((tSpin && count >= 2) || count == 4)
			backToBack ++ ;
		else
			backToBack = -1;

		if (backToBack > 0)
			playfieldMsg[ofs++] += "Back-to-back x" + backToBack;
		

		combo ++ ;
		if (combo > 0)
			playfieldMsg[ofs++] += "Combo " + combo;

		playfieldMsgTmr = 0;
	}
	else
	{
		combo = -1;
	}
}

function CollisionDetect(pX, pY, tetriminoID)
{
	var y = 0;
	while (y < tetriminoDataSize)
	{
		var x = 0;
		while (x < tetriminoDataSize)
		{
			if (tetriminoData[tetriminoID][y][x])
			{
				if ((pX + x < 0) || (pX + x >= 10) || (pY + y >= 25))
					return 1;

				if (pY + y >= 0) 
					if (minoTable[pY + y][pX + x])
						return 1;
			}
				
			x ++ ;
		}

		y ++ ;
	}

	return 0;
}

function ResetPosition()
{
	posX = startPosX;
	posY = startPosY;
	curColour = curTetrimino >> 2;
	tSpin = false;
	lockTmr = 0;
	rstCnt = 0;
	UpdatePreview();
}

function PutPiece(pX, pY, tetriminoID)
{
	var y = 0;
	while (y < tetriminoDataSize)
	{
		var x = 0;
		while (x < tetriminoDataSize)
		{
			if (tetriminoData[tetriminoID][y][x])
				minoTable[pY + y][pX + x] = curColour + 1;

			x ++ ;
		}

		y ++ ;
	}

	holdCount = 0;

	LineClearDetect();
	FetchQueue();

	ResetPosition();
	if (CollisionDetect(posX, posY, curTetrimino))
		gameOver = 1;
}

function TSpinDetect(pX, pY, tetriminoID)
{
	if ((tetriminoID >> 2) != 3)
		return;

	var count = 0;
	if (minoTable[pY + 1][pX + 1]) count ++ ;
	if (minoTable[pY + 1][pX + 3]) count ++ ;
	if (minoTable[pY + 3][pX + 1]) count ++ ;
	if (minoTable[pY + 3][pX + 3]) count ++ ;

	if (count >= 3)
		tSpin = true;
}

function Rotated()
{
	if (rstCnt < maxLockDelayRstCnt && CollisionDetect(posX, posY + 1, curTetrimino))
	{
		lockTmr = 0;
		rstCnt ++ ;
	}

	TSpinDetect(posX, posY, curTetrimino);
}

function RotatePiece(dir)
{
	var newTetrimino = curTetrimino;

	if (dir)
	{
		newTetrimino ++ ;
		if (!(newTetrimino % 4))
			newTetrimino -= 4;
	}
	else
	{
		newTetrimino -- ;
		if (!((newTetrimino + 1) % 4))
			newTetrimino += 4;
	}

	if (CollisionDetect(posX, posY, newTetrimino))
	{
		var testID = kickTestIDs[newTetrimino >> 2];
		var testDirOld = curTetrimino % 4;
		var testDirNew = newTetrimino % 4;
		var testLen = kickTestVectors[testID][testDirNew].length;

		var ofsX = 0;
		var ofsY = 0;

		var i = 0;
		while (i < testLen)
		{
			ofsX = kickTestVectors[testID][testDirOld][i][0] - kickTestVectors[testID][testDirNew][i][0];
			ofsY = kickTestVectors[testID][testDirNew][i][1] - kickTestVectors[testID][testDirOld][i][1];

			if (!CollisionDetect(posX + ofsX, posY + ofsY, newTetrimino))
			{
				posX += ofsX;
				posY += ofsY;
				curTetrimino = newTetrimino;
				Rotated();

				break;
			}

			i ++ ;
		}
	}
	else
	{
		curTetrimino = newTetrimino;
		Rotated();
	}
}

function UpdatePreview()
{
	previewX = posX;
	previewY = posY;
	while (!CollisionDetect(previewX, previewY + 1, curTetrimino))
		previewY ++ ;
}

// Update

function GameUpdate()
{
	if (Keys.IsDown(keyPause))
	{
		if (!Keys.IsPressed(2))
			paused = !paused;

		Keys.KeyPressed(2);
	}
	else
		Keys.KeyReleased(2);

	if (!(paused || gameOver))
	{
		var lvl = lines / 10 + 1;
		level = lvl > level ? lvl : level;
		stepTime = 1000.0 / level;

		timer += 1000.0 / 60.0;

		if (keyUp)
		{
			// Horizonal
			keyTimerH ++ ;
			if (Keys.IsDown(keyMoveLeft))
			{
				if (keyDir != -1)
				{
					keyDir = -1;
					keyTimerHS = 0;
					KeyTimer = 10;
				}

				if (keyTimerHS < das)
				{
					if (keyTimerHS == 0 && !CollisionDetect(posX - 1, posY, curTetrimino))
						posX -- ;
					
					keyTimerHS ++ ;
				}
				else if (keyTimerH >= arr)
				{
					keyTimerH %= arr;
					if (!CollisionDetect(posX - 1, posY, curTetrimino))
						posX -- ;
				}
			}
			else if (Keys.IsDown(keyMoveRight))
			{
				if (keyDir != 1)
				{
					keyDir = 1;
					KeyTimer = 10;
				}

				if (keyTimerHS < das)
				{
					if (keyTimerHS == 0 && !CollisionDetect(posX + 1, posY, curTetrimino))
						posX ++ ;
					
					keyTimerHS ++ ;
				}
				else if (keyTimerH >= arr)
				{
					keyTimerH %= arr;

					if (!CollisionDetect(posX + 1, posY, curTetrimino))
						posX ++ ;
				}
			}
			else
			{
				keyTimerHS = 0;
				keyTimerH = arr;
				keyDir = 0;
			}

			// Rotation
			if (Keys.IsDown(keyRotateLeft))
			{
				if (!Keys.IsPressed(3))
					RotatePiece(0);

				Keys.KeyPressed(3);
			}
			else if (Keys.IsDown(keyRotateRight))
			{
				if (!Keys.IsPressed(3))
					RotatePiece(1);

				Keys.KeyPressed(3);
			}
			else
				Keys.KeyReleased(3);

			// Drop & Hold
			UpdatePreview();
			if (Keys.IsDown(keyHold))
			{
				if (!Keys.IsPressed(1))
				{
					if (!holdCount)
					{
						holdCount ++ ;
						if (holdTetrimino == -1)
						{
							holdTetrimino = curTetrimino >> 2;
							FetchQueue();
						}
						else
						{
							var t = holdTetrimino;
							holdTetrimino = curTetrimino >> 2;
							curTetrimino = t << 2;
						}

						ResetPosition();
					}
				}

				Keys.KeyPressed(1);
			}
			else if (Keys.IsDown(keyHardDrop))
			{
				if (!Keys.IsPressed(1))
					PutPiece(previewX, previewY, curTetrimino);

				Keys.KeyPressed(1);
			}
			else
				Keys.KeyReleased(1);

			// Vertical
			keyTimerV ++ ;
			if (Keys.IsDown(keySoftDrop))
			{
				if (keyTimerV >= softDropDelay)
				{
					keyTimerV %= softDropDelay;

					if (!CollisionDetect(posX, posY + 1, curTetrimino))
					{
						tSpin = false;
						posY ++ ;
					}
					else
					{
						//PutTetrimino(posX, posY, curTetrimino);
						timer = 0;
					}
				}
			}
			else
				keyTimerV = softDropDelay;
		}

		if (timer >= stepTime)
		{
			timer %= stepTime;
			if (!CollisionDetect(posX, posY + 1, curTetrimino))
			{
				tSpin = false;
				posY ++ ;
			}
			else
			{
				//PutTetrimino(posX, posY, curTetrimino);
				timer = 0;
			}
		}

		if (CollisionDetect(posX, posY + 1, curTetrimino))
		{
			if (lockTmr < lockDelay)
				lockTmr ++ ;
			else
				PutPiece(posX, posY, curTetrimino);
		}
		else
		{
			if (lockTmr && (rstCnt < maxLockDelayRstCnt))
			{
				rstCnt ++ ;
				lockTmr = 0;
			}
		}
	}

	if (gameOver)
	{
		if (Keys.IsDown(32))
		{
			if (!Keys.IsPressed(1))
				InitGame();

			Keys.KeyPressed(1);
		}
		else
			Keys.KeyReleased(1);
	}
}

// Main

function GameMain()
{
	if (Keys.IsDown(keyInstruction))
	{
		if (!Keys.IsPressed(4))
			ToggleControlScreen();

		Keys.KeyPressed(4);
	}
	else
		Keys.KeyReleased(4);

	switch(gameStat)
	{
		case 0:
			if (Keys.IsDown(37))
			{
				if (level > 1 && !Keys.IsPressed(0))
					level -- ;

				Keys.KeyPressed(0);
			}
			else if (Keys.IsDown(39))
			{
				if (level < 9 && !Keys.IsPressed(0))
					level ++ ;

				Keys.KeyPressed(0);
			}
			else if (Keys.IsDown(32))
			{
				if (!Keys.IsPressed(0) && keyUp)
				{
					keyUp = 0;
					gameStat = 1;
				}

			}
			else
			{
				keyUp = 1;
				Keys.KeyReleased(0);
			}
				
			break;
		case 1:
			GameUpdate();
			break;
	}

	DrawScreen();
}

// Load

window.onload = function ()
{
	InitGame();

	gameCanvas = document.getElementById("GameCanvas");
	interval = self.setInterval("GameMain()", 1000.0/60.0);

	window.addEventListener("keydown", function (Event)
	{
		Keys.KeyDown(Event.keyCode);
		//console.log(Event.keyCode);
	});
	window.addEventListener("keyup", function (Event)
	{
		Keys.KeyUp(Event.keyCode);
		keyUp = 1;
	});
}
