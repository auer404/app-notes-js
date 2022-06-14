/* TODO :

- Corriger bug sauvegarde position

- Permettre save_note() hors d'une réponse à un événement

=========

- Limiter les mouvements des notes pour ne pas les laisser sortir de la fenêtre

- Personnaliser la demande de confirmation avant suppression

- Re-centrer une note nouvellement créer par rapport au curseur (au lieu d'y faire correspondre son coin supérieur gauche)

*/


// Établir la liste des notes (qui sera mise à jour à chaque création de note)
// Par défaut : cette liste est vide
var notes_list = new Array();

////// GESTION DRAG N DROP //////

window.onmousemove = function(e) {
    
    // MODIF PHASE 2 : Il faudra pouvoir tester le mouvement de chaque note existante
    
    // Transformer le code ci-dessous (et ajouter ce qu'il faut autour : forEach) pour que ces instructions soient appliquées sur CHAQUE note (donc sur chaque élément du tableau notes_list) au lieu de se baser sur une variable note qui n'existe plus
    
    notes_list.forEach(function(the_note){
        
        if (the_note.note_moving) {
            
            the_note.position_y = e.clientY - the_note.mouse_offset_Y;
            the_note.position_x = e.clientX - the_note.mouse_offset_X;
            
            the_note.style.top = the_note.position_y + "px";
            the_note.style.left = the_note.position_x + "px";
            
            // ICI IL FAUDRAIT APPELER save_note()
            
        }
        
    });
    
}

window.onmouseup = function() {
    // MODIF PHASE 2 : Toutes les propriétés note_moving peuvent repasser à false
    
    // Modif : même principe que pour le bloc précédent : il faut un forEach, qui permette d'atteindre la proriété note_moving de chaque élément du tableau notes_list
    
    notes_list.forEach(function(the_note){
        
        the_note.note_moving = false; 
        
    });
}


////// GESTION CHAMP EXTENSIBLE //////

function auto_resize(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
}


///// INSERTION DE NOUVELLES NOTES /////


function create_note(x = 0 , y = 0 , content = "" , id = 0) {
    
    
    /* À METTRE À JOUR !
        
        Donner à la nouvelle note les propriétés :
        - handle (référence à l'élément de classe "handle" contenu dans cette note)
        - field (même chose avec le champ texte)
        - moving (reste un boolean)
        - mouse_offset_X et mouse_offset_Y
        
        On peut directement donner les bonnes valeurs à ces proporiétés
        
        ATTENTION : Pour les propriétés devant faire référence à des éléments contenus dans la note (handle et field), il faut que ça se passe une fois que la note possède bien du contenu !
        
        On peut aussi, dans cette fonction de création, gérer la méthode onmousedown de la propriété handle
        
    */

    var new_note = document.createElement("div");
    
    document.body.appendChild(new_note);
    
    new_note.classList.add("note");
    
    new_note.position_y = y;
    new_note.position_x = x;
    
    new_note.style.top = y + "px";
    new_note.style.left = x + "px";
    
    new_note.innerHTML = '<div class = "handle"><div class = "close_cross">&times;</div></div><textarea></textarea>';

    new_note.note_id = id;
    
    // Maintenant que le contenu de la note est en place, on peut créer des références directes à sa poignée et à son champ texte (sous forme de propriétés personnalisées de la nouvelle note)
    
    new_note.handle = new_note.querySelector(".handle");
    new_note.field = new_note.querySelector("textarea");
    
    new_note.field.value = content;
    
    //new_note.field.focus();
    
    new_note.cross = new_note.querySelector(".close_cross");
    
    new_note.note_moving = false;
    
    new_note.mouse_offset_X;
    new_note.mouse_offset_Y;
    
    new_note.handle.onmousedown = function(e) {
        
        new_note.note_moving = true;
    
        new_note.mouse_offset_X = e.clientX - new_note.offsetLeft;
        new_note.mouse_offset_Y = e.clientY - new_note.offsetTop;
        
    }
    
    new_note.field.oninput = auto_resize;
    
    new_note.cross.onclick = function(){
        
        // Ce test se vérifie uniquement si le bouton "OK" d'une boîte de dialogue est cliqué - NOTE : On pourrait remplacer ceci par quelque chose d'un peu plus personnalisé
        if ( confirm("Supprimer cette note ?") ) {
        
            //document.body.removeChild(new_note);
            // ou :
            new_note.parentElement.removeChild(new_note);
        
        }
        
    }
    
    new_note.field.onblur = save_note;
    //new_note.field.onmouseout = save_note;
    
    // On ajoute la nouvelle note à la liste de toutes les notes
    notes_list.push(new_note);
    
}


///// GESTION DU DOUBLE-CLIC (Ajout de note) /////

document.ondblclick = function(e) {
    
  create_note(e.clientX , e.clientY); 

}



///// GESTION DE LA SAUVEGARDE EN BDD /////

function save_note(e) { // e = l'événement auquel cette fonction répondra
    
    // ! \ A CORRIGER : Rentre cette fonction utilisable hors d'un événement
    
    var field_to_save = e.target;
    var note_to_save = field_to_save.parentElement;
    var id_to_check = note_to_save.note_id;
    // Ici : on utilise la propriété .parentElement de notre champ, pour remonter à son élément parent, qui est la note elle-même. Cette note possède une propriété (personnalisée) note_id
    
    if (field_to_save.value != "") { // Si le champ n'est pas vide
        
        $.ajax({
            method:"POST",
            url:"php_scripts/save_note.php",
            data:{
                content:field_to_save.value,
                id:id_to_check,
                position_x:note_to_save.position_x,
                position_y:note_to_save.position_y
            },
            success:function(data){ // On doit mettre à jour l'id de la note maintenant qu'elle est sauvegardée (si elle n'existait pas encore)
                
                if (data != "") {
                    note_to_save.note_id = data;
                }
                
            }
        });
        
    }
    
}



///// RECUPERATION INITIALE DES NOTES EN BDD /////

$.ajax({
     method:"POST",
     url:"php_scripts/get_notes.php",
     dataType:"json", // Préciser sous quelle forme on attend les données
    
     success:function(data){ // Ici le paramètre data représentera l'information récupérée auprès du script avec lequel on communique
      
         // data représente la liste, au format JSON (Objets JS), des différentes lignes disponibles dans la table notes
        
         data.forEach(function(row){ // On passe en revue chaque ligne, qui représente une note. On peut récupérer depuis une ligne les contenus de ses différentes colonnes en y accédant comme des propriétés.
             create_note(row.position_x , row.position_y , row.content , row.id);
         });
        
     }
});
