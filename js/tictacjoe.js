  
	var human = 1
	var movesahead = 2
	var humansym
	var turn = 0
	
	var syms = ["<div class=anim>&#9711;</div>","<div class=anim>&#10005;</div>"]
	var ai = 0
  
	board_state = [
		[-10,-10,-10],
		[-10,-10,-10],
		[-10,-10,-10]
	]
	
	
	$( document ).ready(function() {
		setmode("easybtn")
		replay()
	});
	
	function setmode(btn) {
		$(".btnmode").css("background-color","white")
		$(".btnmode").css("color","rgb(230,60,80)")
		
		$("#"+btn).css("color","white")
		$("#"+btn).css("background-color","rgb(230,60,80)")
		
		if (btn=="easybtn") {
			movesahead=1
		}
		
		if (btn=="mediumbtn") {
			movesahead=2
		}
		
		if (btn=="impbtn") {
			movesahead=8
		}
	}
	
	function startgame() {
		$("#restartbutton").css("display","inline")
		$("#startbutton").css("display","none")
		turn = Math.floor(Math.random() * 2)
		
		////$("#go").html(syms[turn])
		
		if (turn==ai) {
			$("#info").html("Computer starts first")
		}	
		else {
			$("#info").html("You start first")
		}
		
		makeRandomMove()			
	
		
	}
	
	function replay() {
		turn = -1
		$("#startbutton").css("display","inline")
		$("#restartbutton").css("display","none")
		board_state = [
			[-10,-10,-10],
			[-10,-10,-10],
			[-10,-10,-10]
		]
		
		var newstr = ''
		newstr+='<tr>'
		newstr+='<td id = "c00" onclick="makeAMove(0,0)"></td>'
		newstr+='<td id = "c01" onclick="makeAMove(0,1)"></td>'
		newstr+='<td id = "c02" onclick="makeAMove(0,2)"></td>'
		newstr+='</tr>'
		newstr+='<tr>'
		newstr+='<td id = "c10" onclick="makeAMove(1,0)"></td>'
		newstr+='<td id = "c11" onclick="makeAMove(1,1)"></td>'
		newstr+='<td id = "c12" onclick="makeAMove(1,2)"></td>'
		newstr+='</tr>'
		newstr+='<tr>'
		newstr+='<td id = "c20" onclick="makeAMove(2,0)"></td>'
		newstr+='<td id = "c21" onclick="makeAMove(2,1)"></td>'
		newstr+='<td id = "c22" onclick="makeAMove(2,2)"></td>'
		newstr+='</tr>'
		
		
		$("#board").html(newstr)
	}
	
	function makeOptimalMove() {
		
		if (turn==ai) {
			var optmove = bestMove(board_state,movesahead,ai)
				
			console.log(optmove)
			
			board_state=makeMove(optmove,ai,board_state)
			console.log("--------------------------")
			drawBoard(board_state)
			
			$("#c"+optmove[0]+""+optmove[1]).html(syms[turn])
			
			turn = (turn-1)*(turn-1)
			
			$("#info").html("Your turn now")
			//alert(syms[turn])
			
			checkwin()
		}
		
	}
	
	function makeRandomMove() {
	
		if (turn==ai) {
			var optmove = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)]
			
			board_state=makeMove(optmove,ai,board_state)
			console.log("--------------------------")
			drawBoard(board_state)
			
			$("#c"+optmove[0]+""+optmove[1]).html(syms[turn])
			
			turn = (turn-1)*(turn-1)
			
			$("#info").html("Your turn now")
			//alert(syms[turn])
			
			checkwin()
		}
		
	}
	
	
	function makeAMove(i,j) {
	console.log(turn + ": "+human)
		
		if (turn==human && board_state[i][j]==-10) {
			$("#info").html("Computers turn")
			var pmove = [i,j]
			
			
			board_state=makeMove(pmove,human,board_state)
			console.log("--------------------------")
			drawBoard(board_state)
			
			$("#c"+pmove[0]+""+pmove[1]).html(syms[human])
			
			turn = (turn-1)*(turn-1)
			
			////$("#go").html(syms[turn])
			
			//alert(syms[turn])
			checkwin()
			makeOptimalMove()
			//alert(syms[turn])
			
			
		}
	}
	
	function add(a, b) {
		return a + b;
	}
	
	function addrows(a,b) {
		return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]
	}
  
	function drawBoard(board) {
		var board_str = ""
		for (var i = 0; i<3;i++){
			for (var j = 0;j<3;j++){
				if(board[i][j]==0) {
					board_str+=" 0 "
				}
				else if(board[i][j]==1) {
					board_str+=" 1 "
				}
				else {
				    board_str+="   "
				}
			}
			board_str += "\n"
		}
		
		console.log(board_str)
	}
  
	function makeMove(move,player,board) {
		board[move[0]][move[1]] = player
		return board
	}
	
	
	
	function isterminal(board) {
		for (var i = 0; i<3;i++) {
			for (var j = 0; j<3;j++) {
				if (board[i][j]==-10) {
					return false
				}
			}
		}	
		return true
	}
	
	function minimax(board,maxdepth,depth,player,maxplayer) {
		var p=(player-1)*(player-1)
		console.log("curr player: "+player)
		var b = board
		var inputboard = board
		
		if (evaluate(board,maxplayer,depth)!=0) {
			console.log("LEAVING CUZ WINN")
			return evaluate(board,maxplayer,depth)
		}
		
		if (maxdepth==depth || isterminal(board)) {
			return evaluate(board,maxplayer,depth)
			
		}
		
		
		
		if (p==maxplayer) {
			console.log("player " +player +" = "+"player "+maxplayer)
			var max = -1000
			for (var i = 0; i<3;i++) {
				for (var j = 0; j<3;j++) {
					if (b[i][j]==-10) {
						b[i][j]=p
						drawBoard(b)
						
						console.log("Entering " + p)
						var max_val = minimax(b,maxdepth,depth+1,p,maxplayer)
						max = Math.max(max,max_val)
						console.log("max - " + max_val)
						b[i][j]=-10
					}
				}
			}
			console.log("FINAL MAXIMUM - " + max + "DEPTH: " + depth)
			
			return max
		}
		else {
			var min = 1000
			for (var i = 0; i<3;i++) {
				for (var j = 0; j<3;j++) {
					if (b[i][j]==-10) {
						b[i][j]=p
						drawBoard(b)
						var min_val = minimax(b,maxdepth,depth+1,p,maxplayer)
						min = Math.min(min,min_val)
						console.log("min - " + min)
						b[i][j]=-10
					}
				}
			}
			console.log("FINAL MINIMUM - " + min+ "DEPTH: " + depth)
			console.log("\n\n\n")
			return min
		
		}

		
	}
  
	function bestMove(board,maxdepth,player) {
		var b = board
		var move = [-1,-1]
		var max = -1000
		
		if(maxdepth==0) {
			var temp=[]
			for (var i = 0; i<3;i++) {
				for (var j = 0; j<3;j++) {
					if (b[i][j]==-10) {
						temp.push([i,j])
					}
				}
			}
			var randmove = Math.floor(Math.random() * temp.length)
			return temp[randmove]
		}
		
		for (var i = 0; i<3;i++) {
			//console.log("i "+i)
			for (var j = 0; j<3;j++) {
				//console.log("j "+j)
				if (b[i][j]==-10) {
					b[i][j]=player
					drawBoard(b)
					var max_val = minimax(b,maxdepth,1,player,player)
					console.log(max_val)
					b[i][j]=-10
					if (max_val>max) {
					//console.log(max_val + " more than " + max)
						max=max_val
						console.log("moving max move from " + move + " to " + [i,j])
						move = [i,j]
					}
				}
			}
		}	
			
		return move
	}
	
	function evaluate(board,player,depth) {
		if(isWin(board,player).length>0) {
			return 100-depth
		}
		else if(isLoss(board,player)) {
			return -100+depth
		}
		else {
			return 0
		}
	}
	
	function checkwin() {
		
		
		var compwin = isWin(board_state,ai)	
		if(compwin.length>0) {
			turn = -1
			for (var i = 0; i<3; i++) {
				$("#c"+compwin[i][0]+""+compwin[i][1]).css("color","rgb(255, 219, 79)");
			}

			$("#info").html("You Lose!")
			return

		}
		
		
		var humanwin = isWin(board_state,human)	
		if(humanwin.length>0) {
			turn = -1
			for (var i = 0; i<3; i++) {
				$("#c"+humanwin[i][0]+""+humanwin[i][1]).css("color","rgb(255, 219, 79)");
			}
			
			$("#info").html("You Win!")
			return

		}
		
		
	}
	
	function isWin(board,player) {
		var playersum = player*3
		var b = board

		if (b[0].reduce(add,0)==playersum) {
			return [[0,0],[0,1],[0,2]]
		}
		if (b[1].reduce(add,0)==playersum) {
			return [[1,0],[1,1],[1,2]]
		}	
		if (b[2].reduce(add,0)==playersum) {
			return [[2,0],[2,1],[2,2]]	
		}
		
		
		if (b.reduce(addrows,[0,0,0])[0]==playersum) {
			return [[0,0],[1,0],[2,0]]
		}
		if (b.reduce(addrows,[0,0,0])[1]==playersum) {
			return [[0,1],[1,1],[2,1]]
		}		
		if (b.reduce(addrows,[0,0,0])[2]==playersum) {
			return [[0,2],[1,2],[2,2]]
		}
		
		
		if (b[0][0]+b[1][1]+b[2][2]==playersum) {
			return [[0,0],[1,1],[2,2]]
		}
		if (b[0][2]+b[1][1]+b[2][0]==playersum) {
			return [[0,2],[1,1],[2,0]]
		}
		
		return []
	}
	
	function isLoss(board,player) {
		var p=(player-1)*(player-1)
		
		if (isWin(board,p).length>0) {
			return true
		}
		return false
	
	}
	
	
  