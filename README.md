# movie-picker
## Requisiti:

Si vuole realizzare una web app che ha l'obiettivo di aiutare l'utente a scegliere un film da guardare. Considerando la difficoltà di scelta legata alla presenza di numerosi titoli presenti nelle piattaforme.

In fase di iscrizione, verrà chiesto all'utente il nickname da utilizzare, i generi (massimo 5) che preferisce e i tag (massimo 10) che vuole utilizzare per la ricerca, tali generi e tag verranno utilizzati dall'applicazione per scegliere quali film mostrare all'utente.

Generi e tag saranno modificabili in ogni momento nelle impostazioni.

Saranno presenti delle opzioni avanzate dove potrà essere specificata la volontà dell'utente di avere limiti rigidi sui film da visualizzare (nell'applicazione), ovvero vedere solo i film dei generi e/o tag richiesti, oppure avere dei limiti morbidi e quindi occasionalmente (per esempio ogni 5 film) vedere anche film della quale non si è espressa la preferenza di genere o tag, oppure ancora gestire la quantità minima di tag richiesti che il film deve matchare, o combinazioni varie di tali proprietà.   
Di Default saranno impostate delle soglie morbide senza limiti di tag.   
Altre proprietà saranno: attori, regista, ratings.

L'applicazione avrà 2 modalità:
  - Discovery: l'utente vuole semplicemente dare un'occhiata alle ultime uscite, ai film presenti sulle piattaforme o farsi un idea (per esempio durante la pausa pranzo) di quale film vedere la sera stessa.
  - Watch now: l'utente vuole scegliere un film da vedere ma non sa quale.    

In entrambe le modalità, la schermata mostrerà:
  - Locandina
  - Titolo
  - Anticipazione trama (es. "Il film è ambientato ... ***read more***")
  - Tags
  - Button: Mi piace
  - Button: Non mi piace
  - Il ratings di chi l'ha visto
  - Button: Da vedere un'altro giorno/See later (I film selezionati da questo tasto verranno salvati e riproposti in visualizzazioni successive. nonchè salvati in un apposito archivio es. :"Lista desideri" navigabile in ogni momento)

### Modalità discovery:
Verrà mostrata una serie di film coerenti con le scelte di ricerca dell'utente, gli elementi della schermata sono quelli base già nominati.   
L'utente potra aggiungere film alla lista desideri o semplicemente esprimere la propria preferenza sul film visualizzato utilizzando i bottoni mi piace/non mi piace, permettendo all'applicazione di prevedere meglio i film che potrebbero piacere all'utente.

### Modalità Watch now:
Aggiunta di un elemento:
  - Button: Trovato! (Permetterà all'utente di interrompere la ricerca in quanto ha trovato il film che vuole vedere, verrà visualizzata una schermata di buona visione.)

Verrà mostrata una serie di film (come prima.) ma questa volta verranno conteggiati i mi piace, e una volta raggiunto un tot (es. (20 mi piace) or (50 visualizzazioni and >= 2 mi piace) ) verrà effettuato il torneo con combattimenti a 2 dei film piaciuti /*Da modificare quest'ultima riga*/
