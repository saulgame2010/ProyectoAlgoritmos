function codificar(arbol, texto){
	var binario = '';
	for (var i in texto){
		binario = binario.concat(buscar_letra(arbol, texto[i]));
	}
	return binario;
}

function buscar_letra(arbol, letra){
	arbol = arbol[0];
	var binario='';
	while(arbol.izq && arbol.der){
		if((arbol.der.carac).indexOf(letra)!=-1){
	    	binario= binario+"1";
	    	arbol = arbol.der;
	    }

		else if((arbol.izq.carac).indexOf(letra)!=-1){
    		binario=binario+"0";
    		arbol = arbol.izq;
    	}
	}
	return binario;
}