var immagini = [
    { nome: 'plastica.JPG', peso: 3 },
    { nome: 'vetro.PNG', peso: 5 },             //dichiarazione  array contenente le immagini accessibile tramite chiave
    { nome: 'monnezza.JPG', peso: 1 },
    { nome: 'carta.JPG', peso: 2 },

]

var carteSpeciali = [
    { nome: 'potere.jpg' },                 //dichiarazione array contenente le immagini dei poteri speciali
    { nome: 'potnat.jpg' },      
    { nome: 'esplosione.png' }
]


var colonne;
var righe;
var griglia = [];

function aggiornaGriglia() {
    griglia = [];

    for (let i = 0; i < righe; i++) {
        griglia[i] = [];
        for (let j = 0; j < colonne; j++) {
            var idCarta = `${i}-${j}`;   //dichiarazione per identificare univocamente la carta tramite id(concatenato dal trattino)
            var carta = document.getElementById(idCarta); //ottengo il DOM della carta
            var imgSrc = carta.querySelector('img').src;

            var indice = immagini.findIndex(im => im.nome === imgSrc.split('/').pop());//recupero l'indice dell'immagine nell'array

            griglia[i][j] = indice; //salva l'indice trovato nelle poszione corrispondente della matrice griglia
        }
    }
    verificaCombinazioni(); //richiamo la funzione 
}

document.addEventListener("DOMContentLoaded", function () {   //evento associato al caricamento della pagina HTML
    let music =document.getElementById("mus2");  //recupero dell'audio
    music.volume = 0.3;
    music.play();         
    music.loop= true;
    Griglia5();
    var carte = document.querySelectorAll('.carta'); //recupero tutte le carte appartenenti alla classe
    let primaCartaCliccata = false;
    var mosseSenzaCombinazione = 3; //inizializzo a 0 il contatore delle mosse 
    var mosseMassimeSenzaCombinazione = 0; //imposto il massimo di mosse

    carte.forEach(function (carta) {  //associazione evento di tipo click ad ogni carta
        carta.addEventListener('click', function () {
            //verifico il tipo di carta-potere e in base a quello assegno la rispettiva funzione
            //e successivamente la rimuovo dalla classe in modo da ripristinare il tutto
            if (!primaCartaCliccata) {
                if (carta.classList.contains("PotereDelRiciclo")) { 
                    potereDelRiciclo(carta.id);
                    carta.classList.remove("PotereDelRiciclo")
                }
                if (carta.classList.contains("PotereDellaNatura")) {
                    potereDellaNatura(carta.id)
                    carta.classList.remove("PotereDellaNatura")
                }
                primaCartaCliccata = carta;    //verifico se la carta è già stata cliccatta o meno
                carta.classList.add('selezionata');
            } else {
                var secondaCartaCliccata = carta;
                var [x1, y1] = primaCartaCliccata.id.split('-').map(Number); // ottengo le coordinate x e y della prima carta
                var [x2, y2] = secondaCartaCliccata.id.split('-').map(Number);// ottengo le coordinate x e y della seconda carta
                // Math.abs = modulo
                var distanzaX = Math.abs(x1 - x2); //calcolo distanze x e y di ogni carta
                var distanzaY = Math.abs(y1 - y2); 
            
                if ((distanzaX === 1 && distanzaY === 0) || (distanzaX === 0 && distanzaY === 1)) {//verifico che le carte siano adiacenti
                    scambiaCarte(primaCartaCliccata, secondaCartaCliccata);
                    mosseMassimeSenzaCombinazione++;//scambio le carte e aumento il contatore delle mosse
                }if ( mosseMassimeSenzaCombinazione>=mosseSenzaCombinazione) {
                    mosseSenzaCombinazione = 0; 
                          
                }
                primaCartaCliccata.classList.remove('selezionata');      //rimuovo le 2 carte dalla classe perchè altrimenti
                secondaCartaCliccata.classList.remove('selezionata');   //il programma continua ad eseguire la funzione della carta-potere
                primaCartaCliccata = false;                             //resetto la variabile con il valore booleano false                                         
                
            }
        })
    })

    function scambiaCarte(carta1, carta2) { //funzione per gestire lo scambio delle classi delle carte
        var classi1 = carta1.className;
        var classi2 = carta2.className;

        carta1.className = classi2;   //scambio le classi
        carta2.className = classi1;

        var img1 = carta1.querySelector('img'); //ottengo gli elementi immagine all'interno delle 2 carte
        var img2 = carta2.querySelector('img');

        var tempSrc = img1.src; //memorizzo l'URL dell'immagine in una variabile
        //transizioni per le 2 carte selezionate
        img1.style.transition = 'transform 0.5s ease';
        img2.style.transition = 'transform 0.5s ease';
        img1.style.transform = 'translateY(-150%)';  //transizione verticale
        img2.style.transform = 'translateY(150%)';

        aggiornaGriglia(); //richiamo la funzione per aggiornare la griglia

        setTimeout(function() {  //dopo mezzo secondo scambio effettivamente le carte 
            img1.src = img2.src;
            img2.src = tempSrc;
            img1.style.transform = 'none';
            img2.style.transform = 'none';
            carta1.classList.remove('selezionata');//rimuovo la prima carta dalla classe
            aggiornaGriglia();                     //aggiorno la griglia 
        }, 500); 
    }
});


function immagineDuplicata(rigaCorrente, colonnaCorrente, indiceImmagine) {
//funzione che verifica se ci sono 2 immagini uguali nelle 2 colonne o nelle 2 righe precedenti rispetto alla posizone corrente della carta
    if (colonnaCorrente >= 2 &&
        griglia[rigaCorrente][colonnaCorrente - 1] === indiceImmagine &&
        griglia[rigaCorrente][colonnaCorrente - 2] === indiceImmagine) {
        return true;
    }

    //ritorna il valore true se trova immagini uguali altrimenti false
    if (rigaCorrente >= 2 &&
        griglia[rigaCorrente - 1][colonnaCorrente] === indiceImmagine &&
        griglia[rigaCorrente - 2][colonnaCorrente] === indiceImmagine) {
        return true;
    }

    return false;
}

function generaIndiceCasuale(rigaCorrente, colonnaCorrente) {
    //funzione che genera un indice casuale per l'immagine che non sia duplicata
    let indiceCasuale;

    do {
        indiceCasuale = Math.floor(Math.random() * immagini.length);
    } while (immagineDuplicata(rigaCorrente, colonnaCorrente, indiceCasuale));
 //utilizzo di un ciclo do-while che genera l'indice casualmente
//finchè non trova un'immagine uguale ;in quel caso viene richiamata
//la funzione immagineDuplicta
    return indiceCasuale;   //ritorno l'indice dell'immagine
}

function Griglia5() { //funzione per gestire la griglia 5x5
    colonne = 5;
    righe = 5;    

    let Board = document.getElementById("board");


    for (let i = 0; i < righe; i++) {            //utilizzo di 2 cicli for per scorrere righe e colonne della matrice
        griglia[i] = [];
        for (let j = 0; j < colonne; j++) {
            let carta = document.createElement('div'); //per ogni carta creo un elemento div
            carta.classList.add('carta');              //aggiungo la carta ad una classe
            carta.id = i + "-" + j;                    //definisco l'id della carta
            let img = document.createElement('img');    
            let indiceCasuale = generaIndiceCasuale(i, j);  //definisco l'indice dell'immagine
            img.src = immagini[indiceCasuale].nome;
            carta.appendChild(img);  //aggiungo l'img al div
            img.classList.add('immagine'); //aggiungo l'immagine alla classe
            Board.appendChild(carta); //aggiungo la carta alla griglia
            //verifico il tipo di carta e la aggiungo ala classe corrispondente
            if (immagini[indiceCasuale].nome === "plastica.JPG") {
                carta.classList.add("plastica");
            } else if (immagini[indiceCasuale].nome === "vetro.PNG") {
                carta.classList.add("vetro");
            } else if (immagini[indiceCasuale].nome === "monnezza.JPG") {
                carta.classList.add("monnezza");
            } else if (immagini[indiceCasuale].nome === "carta.JPG") {
                carta.classList.add("cartone");
            }
            griglia[i][j] = indiceCasuale; //aggiungo l'indice alla griglia
        }
    }
}
var punteggio = 0; //inizializzo il punteggio a 0

function potereDelRiciclo(pos) {  
    let riga = parseInt(pos[0]); //estrazione di riga e colonna della carta
    let colonna = parseInt(pos[2]);
    let cartaCliccata = document.getElementById(pos);//ottengo l'elemento DOM della carta cliccata
    let arr = []; //dichiaro un array vuoto per memorizzare le carte che dovrà gestire il potere del riciclo
    //controllo i casi specfici e aggiungo le carte che dovrà gestire il potere all'array
    if (riga == 0 && colonna == 0) {
        // controllo:
        // riga+1, colonna+1
        arr.push(document.getElementById((riga + 1) + "-" + (colonna)));
        arr.push(document.getElementById((riga) + "-" + (colonna + 1)));

    } else if (riga == 0 && (colonna >= 1 && colonna <= 3)) {
        // controllo:
        // riga+1, colonna+1, colonna-1
        arr.push(document.getElementById((riga + 1) + "-" + colonna));
        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga) + "-" + (colonna + 1)));
    } else if (riga == 0 && colonna == 4) {
        // controllo:
        // riga+1, colonna-1
        arr.push(document.getElementById((riga + 1) + "-" + (colonna)));
        arr.push(document.getElementById((riga) + "-" + (colonna - 1)));

    } else if ((riga >= 1 && riga <= 3) && colonna == 0) {
        // controllo:
        // colonna+1, riga+1, riga-1
        arr.push(document.getElementById(riga + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga + 1) + "-" + colonna));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
    } else if (riga == 4 && colonna == 0) {
        // controllo:
        // riga-1, colonna+1
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
        arr.push(document.getElementById(riga + "-" + (colonna + 1)));
    } else if (riga == 4 && (colonna >= 1 && colonna <= 3)) {
        // controllo:
        // colonna-1, colonna+1, riga-1
        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
        arr.push(document.getElementById(riga + "-" + (colonna + 1)));
    } else if (riga == 4 && colonna == 4) {
        // controllo:
        // colonna-1, riga-1

        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
    } else if (colonna == 4 && (riga >= 1 && riga <= 3)) {
        // controllo:
        // colonna-1, riga+1, riga-1
        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga + 1) + "-" + colonna));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
    } else {
        //tutti gli altri casi
        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga + 1) + "-" + colonna));
        arr.push(document.getElementById(riga + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
    }

    arr.forEach(carta => {             
          //per ogni carta dell'array                               
        //gestisco le  carte esplose dal potere del riciclo così da aggiungere il loro peso al punteggio
        if(carta.classList[1] === "plastica") {
            punteggio += immagini[0].peso 
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        } else if(carta.classList[1] === "vetro") { 
            punteggio += immagini[1].peso
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        } else if(carta.classList[2] ==="monnezza") { 
            punteggio += immagini[2].peso
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        } else if(carta.classList[3] === "carta") { 
            punteggio += immagini[3].peso
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        }
       
        carta.firstChild.src = "esplosione.png";  //imposta l'immagine dell'esplosione 
    })

    setTimeout(function () { //utlizzo il setTimeout per ritardare la sostizione delle carte dopo essere state "esplose" dal potere
        arr.forEach(carta => {
            let indiceCasuale = generaIndiceCasuale(riga, colonna); // Genero un nuovo indice casuale
            carta.firstChild.src = immagini[indiceCasuale].nome;
            let nuovaCarta;
            do {                                                    
                nuovaCarta = generaIndiceCasuale(riga, colonna);   
            } while (immagineDuplicata(riga, colonna, nuovaCarta)); //controllo che la carta non sia uguale a quelle adiacenti

            let nuovaImmagine = immagini[nuovaCarta].nome;
            cartaCliccata.firstChild.src = nuovaImmagine;    
            aggiornaGriglia(); //aggiorno la griglia
        })
    }, 700)
    
} 




function formaTrisQuaternaOCinquina(riga, colonna) {
    // Controllo la riga
    if (griglia[riga].filter(carta => carta === griglia[riga][colonna]).length >= 3) {
        return true;
    }

    // Controllo la colonna
    if (griglia.map(row => row[colonna]).filter(carta => carta === griglia[riga][colonna]).length >= 3) {
        return true;
    }
    return false;
}

function potereDellaNatura(pos) { //funzione che ragiona come quella del potere del riciclo ma gestisce più casi
    let riga = parseInt(pos[0]);
    let colonna = parseInt(pos[2]);
    let cartaCliccata = document.getElementById(pos);
    let arr = [];
    if (riga == 0 && colonna == 0) {
        
        arr.push(document.getElementById((riga + 1) + "-" + (colonna)));
        arr.push(document.getElementById((riga) + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga + 1) + "-" + (colonna + 1)));

    } else if (riga == 0 && (colonna >= 1 && colonna <= 3)) {
        arr.push(document.getElementById((riga + 1) + "-" + colonna));
        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga) + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga + 1) + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga + 1) + "-" + (colonna - 1)));

    } else if (riga == 0 && colonna == 4) {
        arr.push(document.getElementById((riga + 1) + "-" + (colonna)));
        arr.push(document.getElementById((riga) + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga + 1) + "-" + (colonna - 1)));

    } else if ((riga >= 1 && riga <= 3) && colonna == 0) {
        arr.push(document.getElementById(riga + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga + 1) + "-" + colonna));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
        arr.push(document.getElementById((riga + 1) + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga - 1) + "-" + (colonna + 1)));

    } else if (riga == 4 && colonna == 0) {
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
        arr.push(document.getElementById(riga + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga - 1) + "-" + (colonna + 1)));

    } else if (riga == 4 && (colonna >= 1 && colonna <= 3)) {
        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
        arr.push(document.getElementById(riga + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga - 1) + "-" + (colonna + 1)));
        arr.push(document.getElementById((riga - 1) + "-" + (colonna - 1)));

    } else if (riga == 4 && colonna == 4) {
        // controllo:
        // colonna-1, riga-1

        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
        arr.push(document.getElementById((riga - 1) + "-" + (colonna - 1)));
    } else if (colonna == 4 && (riga >= 1 && riga <= 3)) {
        arr.push(document.getElementById(riga + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga + 1) + "-" + colonna));
        arr.push(document.getElementById((riga - 1) + "-" + colonna));
        arr.push(document.getElementById((riga + 1) + "-" + (colonna - 1)));
        arr.push(document.getElementById((riga - 1) + "-" + (colonna - 1)));
    }

    arr.forEach(carta => {
        if(carta.classList[1] === "plastica") {
            punteggio += immagini[0].peso 
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        } else if(carta.classList[1] === "vetro") { 
            punteggio += immagini[1].peso
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        } else if(carta.classList[2] === "monnezza") { 
            punteggio += immagini[2].peso
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        } else if(carta.classList[3] === "carta") { 
            punteggio += immagini[3].peso
            document.getElementById("score").innerHTML =  "SCORE : "  + punteggio;
        }
        carta.firstChild.src = "esplosione.png";
    })

    setTimeout(function () {
        arr.forEach(carta => {
            let indiceCasuale = generaIndiceCasuale(riga, colonna); 
            carta.firstChild.src = immagini[indiceCasuale].nome;
            let nuovaCarta;
            do {
                nuovaCarta = generaIndiceCasuale(riga, colonna);
            } while (immagineDuplicata(riga, colonna, nuovaCarta));

            let nuovaImmagine = immagini[nuovaCarta].nome;
            cartaCliccata.firstChild.src = nuovaImmagine; 
        })

    }, 700)

}



function verificaCombinazioni() {
    let combinazioneTrovata = false;
    let potereDelRiciclo = false;
    // controllo cinquina orrizzontale
    for (let riga = 0; riga < righe; riga++) {
        for (let colonna = 0; colonna <= colonne - 5; colonna++) {
            var carta1 = griglia[riga][colonna];
            var carta2 = griglia[riga][colonna + 1];
            var carta3 = griglia[riga][colonna + 2];
            var carta4 = griglia[riga][colonna + 3];
            var carta5 = griglia[riga][colonna + 4];
            if (carta1 === carta2 && carta2 === carta3 && carta3 === carta4 && carta4 === carta5) {
                combinazioneTrovata = true;
                potereDelRiciclo = true;

                // Sostituzione carte
                for (let i = 0; i < 4; i++) {
                    let nuovaIndiceCasuale;
                    do {
                        nuovaIndiceCasuale = generaIndiceCasuale(riga, colonna + i);
                    } while (nuovaIndiceCasuale === carta1);
                    var nuovaImmagine = immagini[nuovaIndiceCasuale].nome;
                    griglia[riga][colonna + i] = nuovaIndiceCasuale;
                    var cartaDaSostituire = document.getElementById(riga + '-' + (colonna + i));
                    cartaDaSostituire.querySelector('img').src = nuovaImmagine;
                }
                var ImmaginePotere = carteSpeciali[1].nome;
                griglia[riga][colonna + 3] = carteSpeciali[1];
                var cartaPotere = document.getElementById(riga + '-' + (colonna + 4));
                cartaPotere.querySelector('img').src = ImmaginePotere;
                cartaPotere.className = "carta PotereDellaNatura"
            }
        }
    }
    //  controllo cinquina verticale
    for (let riga = 0; riga <= righe - 5; riga++) {
        for (let colonna = 0; colonna < colonne; colonna++) {
            var carta1 = griglia[riga][colonna];
            var carta2 = griglia[riga + 1][colonna];
            var carta3 = griglia[riga + 2][colonna];
            var carta4 = griglia[riga + 3][colonna];
            var carta5 = griglia[riga + 4][colonna];

            if (carta1 === carta2 && carta2 === carta3 && carta3 === carta4 && carta4 === carta5) {
                combinazioneTrovata = true;
                potereDelRiciclo = true

                // Sostituzione carte
                for (let i = 0; i < 4; i++) {
                    let nuovaIndiceCasuale;
                    do {
                        nuovaIndiceCasuale = generaIndiceCasuale(riga, colonna + i);
                    } while (nuovaIndiceCasuale === carta1);
                    var nuovaImmagine = immagini[nuovaIndiceCasuale].nome;
                    griglia[riga][colonna + i] = nuovaIndiceCasuale;
                    var cartaDaSostituire = document.getElementById((riga + i) + '-' + (colonna));
                    cartaDaSostituire.querySelector('img').src = nuovaImmagine;
                }
                var ImmaginePotere = carteSpeciali[1].nome;
                griglia[riga + 4][colonna] = carteSpeciali[1];
                var cartaPotere = document.getElementById((riga + 4) + '-' + (colonna));
                cartaPotere.querySelector('img').src = ImmaginePotere;
                cartaPotere.className = "carta PotereDellaNatura"
            }
        }
    }


    //  controllo quaterna orrizzontale
    for (let riga = 0; riga < righe; riga++) {
        for (let colonna = 0; colonna <= colonne - 4; colonna++) {
            var carta1 = griglia[riga][colonna];
            var carta2 = griglia[riga][colonna + 1];
            var carta3 = griglia[riga][colonna + 2];
            var carta4 = griglia[riga][colonna + 3];

            if (carta1 === carta2 && carta2 === carta3 && carta3 === carta4) {
                combinazioneTrovata = true;
                potereDelRiciclo = true;

                // Sostituzione carte
                for (let i = 0; i < 3; i++) {
                    let nuovaIndiceCasuale;
                    do {
                        nuovaIndiceCasuale = generaIndiceCasuale(riga, colonna + i);
                    } while (nuovaIndiceCasuale === carta1);
                    var nuovaImmagine = immagini[nuovaIndiceCasuale].nome;
                    griglia[riga][colonna + i] = nuovaIndiceCasuale;
                    var cartaDaSostituire = document.getElementById(riga + '-' + (colonna + i));
                    cartaDaSostituire.querySelector('img').src = nuovaImmagine;
                }
                var ImmaginePotere = carteSpeciali[0].nome;
                griglia[riga][colonna + 3] = carteSpeciali[0];
                var cartaPotere = document.getElementById(riga + '-' + (colonna + 3));
                cartaPotere.querySelector('img').src = ImmaginePotere;
                cartaPotere.className = "carta PotereDelRiciclo"
            }
        }
    }
    // controllo quaterna verticale
    for (let riga = 0; riga <= righe - 4; riga++) {
        for (let colonna = 0; colonna < colonne; colonna++) {
            var carta1 = griglia[riga][colonna];
            var carta2 = griglia[riga + 1][colonna];
            var carta3 = griglia[riga + 2][colonna];
            var carta4 = griglia[riga + 3][colonna];

            if (carta1 === carta2 && carta2 === carta3 && carta3 === carta4) {
                combinazioneTrovata = true;
                potereDelRiciclo = true

                // Sostituzione carte
                for (let i = 0; i < 3; i++) {
                    let nuovaIndiceCasuale;
                    do {
                        nuovaIndiceCasuale = generaIndiceCasuale(riga, colonna + i);
                    } while (nuovaIndiceCasuale === carta1);
                    var nuovaImmagine = immagini[nuovaIndiceCasuale].nome;
                    griglia[riga][colonna + i] = nuovaIndiceCasuale;
                    var cartaDaSostituire = document.getElementById((riga + i) + '-' + (colonna));
                    cartaDaSostituire.querySelector('img').src = nuovaImmagine;
                }
                var ImmaginePotere = carteSpeciali[0].nome;
                griglia[riga + 3][colonna] = carteSpeciali[0];
                var cartaPotere = document.getElementById((riga + 3) + '-' + (colonna));
                cartaPotere.querySelector('img').src = ImmaginePotere;
                cartaPotere.className = "carta PotereDelRiciclo"
            }
        }
    }

    // Controllo Tris orizzontali
    for (let riga = 0; riga < righe; riga++) {
        let combinazioneTrovata = false; // Inizializza la variabile combinazioneTrovata all'inizio di ogni iterazione della riga
        for (let colonna = 0; colonna <= colonne - 3; colonna++) {
            var carta1 = griglia[riga][colonna];
            var carta2 = griglia[riga][colonna + 1];
            var carta3 = griglia[riga][colonna + 2];

            if (carta1 === carta2 && carta2 === carta3) {
                combinazioneTrovata = true;

                var img1 = immagini[carta1];
                var pesoImmagine = img1.peso;
                punteggio += 3 * pesoImmagine;
                document.getElementById("score").innerHTML = "SCORE : " + punteggio;

                // Sostituzione carte
                for (let i = 0; i < 3; i++) {
                    let nuovaIndiceCasuale;
                    do {
                        nuovaIndiceCasuale = generaIndiceCasuale(riga, colonna + i);
                    } while (nuovaIndiceCasuale === carta1);
                    var nuovaImmagineSrc = immagini[nuovaIndiceCasuale].nome;
                    griglia[riga][colonna + i] = nuovaIndiceCasuale;
                    var cartaDaSostituire = document.getElementById(riga + '-' + (colonna + i));
                    cartaDaSostituire.querySelector('img').src = nuovaImmagineSrc;
                    cartaDaSostituire.classList.add('tris');

                }
            }
        }
    }
    //  Controllo Tris verticali 

    for (let riga = 0; riga <= righe - 3; riga++) {
        for (let colonna = 0; colonna < colonne; colonna++) {
            console.log(griglia[riga][colonna])
            var carta1 = griglia[riga][colonna];
            var carta2 = griglia[riga + 1][colonna];
            var carta3 = griglia[riga + 2][colonna];


            if (carta1 === carta2 && carta2 === carta3) {
                combinazioneTrovata = true;

                punteggio += 3 * immagini[carta1].peso;
                document.getElementById("score").innerHTML = "SCORE: " + punteggio;
                // Sostituzione carte
                for (let i = 0; i < 3; i++) {
                    let nuovaIndiceCasuale;
                    do {
                        nuovaIndiceCasuale = generaIndiceCasuale(riga + i, colonna);
                    } while (nuovaIndiceCasuale === carta1);
                    var nuovaImmagineSrc = immagini[nuovaIndiceCasuale].nome;
                    griglia[riga + i][colonna] = nuovaIndiceCasuale;
                    var cartaDaSostituire = document.getElementById((riga + i) + '-' + colonna);
                    cartaDaSostituire.querySelector('img').src = nuovaImmagineSrc;
                    
                }

            }

        }
        
        carteDaScambiare = [];
        if (combinazioneTrovata === true) {
            verificaCombinazioni();
        }
    }
}
