
// cell class
function Cell(x,y,color) {
	this.x = x;
	this.y = y;

	this.color = color;
	this.visited = false;
}

Cell.prototype.reset_visited = function() {
	this.visited = false;
};

Cell.prototype.make_td = function() {
	var td = $('<td></td>');
	this.addElementClasses(td);
	td.html('&nbsp;');
	return td;
};

Cell.prototype.update_td = function() {
	var td = $('td.cell'+this.x+this.y);
	td.removeClass();
	this.addElementClasses(td);
};

Cell.prototype.addElementClasses = function(element) {
	element.addClass('cell');
	element.addClass('cell'+this.x+this.y);
	element.addClass('color'+this.color);
};

Cell.prototype.get_neighbors = function(board) {
	var x = this.x,
		y = this.y,
		neighbor_list = [];

	if (x > 0 && !(board[x - 1][y].visited)) {
		neighbor_list.push(board[x-1][y]);
	}
	if (y > 0 && !(board[x][y - 1].visited)) {
		neighbor_list.push(board[x][y-1]);
	}

	if (x < board.length-1 && !(board[x+1][y].visited)) {
		neighbor_list.push(board[x+1][y]);
	}
	if (y < board[x].length-1 && !(board[x][y+1].visited)) {
		neighbor_list.push(board[x][y+1]);
	}

	return neighbor_list;
};

function create_board(size_x, size_y, color_count) {
	var board = [];

	for(var i=0, ll=size_y; i<ll; i++) {
		board[i] = [];

		for(var j=0, ll2=size_x; j<ll2; j++) {
			board[i][j] = new Cell(i, j, random_color(color_count));
		}
	}

	return board;
}

function create_tds(board) {
	var board_table = $('#board-table');

	for (var i=0, ll=board.length; i<ll; i++) {
		var current_row = board[i],
			current_table_row = $('<tr></tr>');

		for (var j=0, ll2=current_row.length; j<ll2; j++) {
			current_table_row.append(current_row[j].make_td());
		}
		board_table.append(current_table_row);
	}
}

function random_color(color_count) {
	return Math.floor(Math.random() * color_count);
}

function create_buttons(color_count) {
	var button_div = $("#button-div");

	for (var i=0; i<color_count; i++) {
		button_div.append($("<button>").addClass('color'+i));
	}
}

// here's my answer to the problem
function button_click(board, to_color) {
	var from_color = board[0][0].color,
		check_list = [];

	for(var i=0, ll=board.length; i<ll; i++) {
		for(var j=0, ll2=board[i].length; j<ll2; j++) {
			board[i][j].reset_visited();
		}
	}

	check_list.push(board[0][0]);

	while (check_list.length > 0) {
		var current_cell = check_list.pop();
		current_cell.visited = true;

		if (current_cell.color == from_color) {
			current_cell.color = to_color;

			check_list = check_list.concat(current_cell.get_neighbors(board));
		}
	}

	for(var i=0, ll=board.length; i<ll; i++) {
		for(var j=0, ll2=board[i].length; j<ll2; j++) {
			board[i][j].update_td();
		}
	}
}

function run() {
	$("#board-table").empty();
	$("#button-div").empty();

	var color_count = $("#color_count").val();
	var size_x = $("#size_x").val();
	var size_y = $("#size_y").val();

	create_buttons(color_count)
	var board = create_board(size_x, size_y, color_count);
	create_tds(board);

	$('button').click(function() {
		var class_string = this.classList[0];
		button_click(board, class_string.charAt(class_string.length - 1));
	});

	$('#run-button').click(function() {
		run();
	})
}

$(function() {
	run();
});