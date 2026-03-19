JOLA BEATS — GAME BOY PLAYER

CE QUE TU DOIS FAIRE EXACTEMENT

1) Ouvre le dossier "audio"
2) Mets dedans tes prods en MP3 ou M4A
3) Renomme tes fichiers exactement comme ça :
   - street-vibes.mp3
   - drill-session.mp3
   - night-cruise.mp3
   - cloudy-waves.mp3
   - trap-lord.mp3

4) Si tu veux changer les titres, BPM ou durées affichés :
   - ouvre le fichier script.js
   - tout en haut tu as la liste "const tracks = [...]"
   - modifie title, file, bpm, duration

EXEMPLE :
{ title: 'Mon Son', file: 'audio/mon-son.mp3', bpm: 142, duration: '03:18' }

5) POUR TESTER SUR TON PC
   - double-clique sur index.html
   - ou ouvre-le dans Chrome / Safari / Edge

6) POUR METTRE SUR IPHONE
   LE PLUS SIMPLE :
   - envoie ce dossier sur GitHub Pages, Netlify ou Vercel
   - ouvre le lien dans Safari sur iPhone
   - partage > Ajouter à l'écran d'accueil

BOUTONS
- Croix haut / bas : change la sélection
- Croix gauche : piste précédente
- Croix droite : piste suivante
- Centre de la croix : play / pause
- Bouton A : play / pause
- Bouton B : piste suivante
- Start : info piste
- Select : change le mode d'affichage

TOUCHES CLAVIER SUR PC
- Flèche haut / bas : sélection
- Flèche gauche / droite : piste préc / suiv
- Entrée ou espace : play / pause
- A : play / pause
- B : piste suivante
- S : info
- X : mode

IMPORTANT
Si la musique ne se lance pas, c'est presque toujours parce que :
- le nom du fichier n'est pas exactement le bon
- le fichier n'est pas dans le dossier audio
- tu as changé l'extension (.wav, .m4a, .mp3) sans modifier script.js
