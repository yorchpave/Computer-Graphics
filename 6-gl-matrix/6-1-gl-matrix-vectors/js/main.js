"use strict"

function main()
{

	// Jugando con matrix (vectors)
	var a = vec3.create();
	vec3.set(a, 1., 0., 0.);

	var b = vec3.fromValues(0., 1., 0.);

	var msg = "a = " + vec3.str(a) + "\n";
	msg = msg + "b = " + vec3.str(b) + "\n";

	var c = vec3.create();
	vec3.add(c, a, b);

	msg = msg + "c = a + b = " + vec3.str(c) + "\n";

	var d = vec3.create();
	vec3.cross(d, a, b);

	msg = msg + "d = a x b = " + vec3.str(d) + "\n";

	alert(msg);
}