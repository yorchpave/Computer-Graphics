"use strict"

function main()
{

	// Jugando con matrix (matrices)
	var ma = mat3.create();
	mat3.set(ma, 1, 2, 0, 3, 4, 0, 5, 6, 1);
	var mb = mat3.fromValues(1, 2, 0, 3, 4, 0, 5, 6, 1); 

	var mc = mat3.create();
	mat3.add(mc, ma, mb);

	var msg = "Matriz A = " + mat3.str(ma) + "\n";
	msg = msg + "Matriz B = " + mat3.str(mb) + "\n";
	msg = msg + "Matriz C = A + B = " + mat3.str(mc) + "\n";

	var md = mat3.create();
	mat3.multiply(md, ma, mb);
	msg = msg + "Matriz D = AB = " + mat3.str(md) + "\n";

	alert(msg);
}