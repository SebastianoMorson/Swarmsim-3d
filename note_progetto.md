# Note progetto
Questo file ha il solo scopo di annotare quello che capisco dal codice, in modo da non dover capirlo ogni volta.

## Folder structure
### dist folder
Questa cartella contiene i file di deploy. Sono essenzialmente la versione compressa del progetto. Una versione light

### node_modules folder
Sono i file delle librerie

### src folder
Sono i file effettivi del programma. 

## Running 
Per runnare il codice ci sono due modalità:
- dev: è quella che bisogna usare per poter vedere le modifiche effettuate sul codice
```
npm install
npm run dev
```
- build: mostra la build del codice, ma non so come rendere effettive le modifiche sul mio codice. Mostra sempre la versione del professore, ma non guarda le mie
```
npm install
npm run build
npm run show
```

## Src folder

### index.js
Contiene l'inizializzazione della pagina, definendo la funzione *load*. 
In questa porzione 
```
const display = container.display;
const controls = container.controls;
const grid = container.grid;
```
Quello che fa è 

### setup_container.js
Questo file a quanto pare non serva che venga toccato. Contiene le specifiche per il setup del container e viene usato all'interno di index.js

### controls.js
"This adds the actual widgets to the control panel, and connects controls to the parameters for later access" 
Questo significa che se voglio aggiungere un widget, come uno slider, in teoria devo toccare questo file.

### parameters.js
Questo file contiene la definizione di tutte le variabili usate dal sistema, come numero di particelle, range degli slider, possibili presets, etc.
Viene nominato all'interno del file "controls.js", dove vengono recuperati i valori di tutti i parametri 

# Note su cosa aggiungere
- aggiungere agli slider un riferimento numerico associato al valore impostato
- aggiungere un timer per capire quanto tempo è trascorso dall'inizio del processo di convergenza

    In particular, I would suggest the following modifications and extensions: 

    1. Interaction period T: The original swarmalator is with continuous coupling. We are interested in time-discrete coupling. We can extend the code in a way that the interaction between the nodes is discrete in time, with period T, and make T a parameter that can be changed in the UI with a slider.

    2. Stochastic coupling with probability p: Make the time discrete coupling stochastic in nature, as described in our ACSOS 2021 paper, make p a parameter called “coupling probability” (or 1-p called “interaction outage probability” or similar) that can be changed in the UI with a slider.

    3. Memory M (ACSOS 2021)