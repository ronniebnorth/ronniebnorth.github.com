const diatonic = ['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B','C','Db','D','Eb','E','F','Gb','G'];

const g_dorian     =  [1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0];
const g_phrygian   =      [1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0];
const g_lydian     =        [1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1];
const g_myxolydian =            [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0];
const g_aeolian    =                [1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0];
const g_locrian    =                    [1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0];
const g_ionian     =                      [1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1];
const g_minorpent  =                [1,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0];
const g_majorpent  =                      [1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,0];
const g_phrygdom   =      [1,1,0,0,1,1,0,1,1,0,1,0,1,1,0,0,1,1,0,1,1,0,1,0];

window.onload = function () {

};
var lastVelocity = 100;

$(".btn_key").click(function(){
    doEverything($(this).text(), $(this).closest("div").attr('name'));
});

//$("#btnGetModes").click(function(){
function doEverything(inputRootNote, inputMode){    
    //let inputRootNote = $("#inputRootNote").val();
    console.log("input mode", inputMode);
    let inputNotes = $("#inputNotes").val().split(',').sort();
    
    
    MidiConvert.load("./js/C_MAJOR.mid", function(midi) {
        console.log(midi);
        console.log(midi.tracks[0].notes[0].name);
        let notes = [];
        midi.tracks[0].notes.forEach(function(element) {
            notes.push(element.name.replace(/[0-9]/g, ''));
        }, this);
        console.log('notes',notes);
        inputNotes.unshift(inputRootNote);
        
        let scales = getModes(getInputPattern(R.uniq(inputNotes)));
        console.log('scales', scales);

        var selMode = inputMode; //$("#selMode").val();
        var notesArr = getNotes(inputRootNote, selMode);


        //notesArr.concat(notesArr);
        var rootNoteStr = notesArr[0];

        //notesArr = notesArr.concat(notesArr);
        notesArr = shuffle(notesArr);

        var loopTimes = Math.floor(Math.random() * (notesArr.length));
        console.log("loop times", loopTimes);
        for(var lp = 0; lp < loopTimes; lp++){
            var randomNote = Math.floor(Math.random() * (notesArr.length - 1));
            notesArr[randomNote + 1] = notesArr[randomNote];
        }
        var reshuf = Math.floor(Math.random() * 2);
        console.log("reshuf", reshuf);
        if(reshuf === 1){
            notesArr = shuffle(notesArr);
            console.log("reshuffled");
        }

        var doStrip =  Math.floor(Math.random() * 3);
        if(doStrip === 1){
            var stripEnd = Math.floor(Math.random() * (notesArr.length - 1));
            while(stripEnd > 0){
                notesArr.pop();
                stripEnd--;
            }
        }

        var putHoles = Math.floor(Math.random() * 4);
        if(putHoles === 1 || putHoles === 2 || putHoles === 3){
            var numHoles = Math.floor(Math.random() * (notesArr.length - 3));
            numHoles = numHoles + 2;
            while(numHoles > 0){
                var pHole = Math.floor(Math.random() * (notesArr.length - 1));
                notesArr[pHole] = 0;
                numHoles--;
            }           
        }
        console.log('notesArr', notesArr);

        var instrumentName = "acoustic_guitar_nylon";
        //var instrumentName = "acoustic_grand_piano";
        //var instrumentName = "synth_drum";
        //var instrumentName = "glockenspiel";
        //var instrumentName = "orchestral_harp";
        //var instrumentName = "xylophone";
        //var instrumentName = "timpani";
        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            instrument: instrumentName,
            onprogress: function(state, progress) {
                console.log(state, progress);
            },
            onsuccess: function() {
                MIDI.programChange(0, MIDI.GM.byName[instrumentName].number);
                var notes = notesArr;
                var mydelayT = Math.floor(Math.random() * 2);
                var delayt = .3;
                if(mydelayT === 1){
                    delayt = .15;
                }
                var delay = [delayt, delayt, delayt, delayt, delayt, delayt, delayt,delayt, delayt, delayt, delayt, delayt, delayt, delayt];
                var tmpdelay= 0;
                var ctxtime = MIDI.getContext().currentTime;
                var channel = 0;

                var velocity = lastVelocity;
                if(Math.floor(Math.random() * 3) === 1){
                    velocity = Math.floor(Math.random() * 60 + 40);
                    lastVelocity = velocity;
                }

                var rootOctR = Math.floor(Math.random() * 3);
                if(rootOctR === 1){
                    rootNoteStr = inputRootNote + '2';
                }else{
                    rootNoteStr = inputRootNote + '1';
                }
                
                rootNoteStr = MIDI.keyToNote[rootNoteStr];
                console.log('root note string', rootNoteStr);
                MIDI.noteOn(channel, rootNoteStr, velocity + 150,0);
                console.log('notes ready', notes);
                if(delayt === .15){
                    var connotes = clone(notes);
                    console.log("connotes",connotes);
                    if(Math.floor(Math.random() * 3) === 1){
                        connotes.reverse();
                        console.log("connotes rev",connotes);
                    }else if(Math.floor(Math.random() * 3) === 2){
                        connotes = shuffle(connotes);
                        console.log("connotes shuffled",connotes);
                    }
                    console.log("connotes done", connotes);

                    let bs = Math.floor(Math.random() * 3);
                    if(bs === 0){
                        notes = notes.concat(connotes);
                    }

                    console.log('notes in', notes);
                }
                
                for(var i=0; i < notes.length; i++)
                {
                    var chordIt = Math.floor(Math.random() * 3);
                    if(chordIt === 1){
                        var chordIt2 = Math.floor(Math.random() * 2);
                        if(chordIt2 === 1){
                            var harm2 = Math.floor(Math.random() * (notes.length - 1));
                            var harm3 = Math.floor(Math.random() * (notes.length - 1));
                            MIDI.chordOn(channel, [notes[i],notes[harm2],notes[harm3]], velocity, ctxtime+tmpdelay);
                        }else{
                            var harm = Math.floor(Math.random() * (notes.length - 1));
                            MIDI.chordOn(channel, [notes[i],notes[harm]], velocity, ctxtime+tmpdelay);
                        }
                    }else{
                        MIDI.noteOn(channel, notes[i], velocity, ctxtime+tmpdelay);
                    }
                    
                    tmpdelay = tmpdelay + delay[i]
                }


            }
        });

        

    });
//});
}

function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}

function getPattern(mode){

}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}


function getModes(inputPattern){
    let modes  = ['DORIAN','PHRYGIAN','LYDIAN','MYXOLYDIAN','AEOLIAN','LOCRIAN','IONIAN','MAJORPENT','MINORPENT','PHRYGDOM'];
    
    for(let i = 0; i < inputPattern.length; i++){
        if(inputPattern[i] == 1){
            if(g_dorian[i] !== 1 && modes.includes("DORIAN")){
                modes.splice(modes.indexOf("DORIAN"), 1);
            }
            if(g_phrygian[i] !== 1 && modes.includes("PHRYGIAN")){
                modes.splice(modes.indexOf("PHRYGIAN"), 1);
            }
            if(g_lydian[i] !== 1 && modes.includes("LYDIAN")){
                modes.splice(modes.indexOf("LYDIAN"), 1);
            }
            if(g_myxolydian[i] !== 1 && modes.includes("MYXOLYDIAN")){
                modes.splice(modes.indexOf("MYXOLYDIAN"), 1);
            }
            if(g_aeolian[i] !== 1 && modes.includes("AEOLIAN")){
                modes.splice(modes.indexOf("AEOLIAN"), 1);
            }
            if(g_locrian[i] !== 1 && modes.includes("LOCRIAN")){
                modes.splice(modes.indexOf("LOCRIAN"), 1);
            }
            if(g_ionian[i] !== 1 && modes.includes("IONIAN")){
                modes.splice(modes.indexOf("IONIAN"), 1);
            }
            if(g_majorpent[i] !== 1 && modes.includes("MAJORPENT")){
                modes.splice(modes.indexOf("MAJORPENT"), 1);
            }
            if(g_minorpent[i] !== 1 && modes.includes("MINORPENT")){
                modes.splice(modes.indexOf("MINORPENT"), 1);
            }
            if(g_phrygdom[i] !== 1 && modes.includes("PHRYGDOM")){
                modes.splice(modes.indexOf("PHRYGDOM"), 1);
            }
        }
    }
    return modes;
}


function getNotes(rootNote, mode){
    let notes = [];
    var kOct = 3;
    var oct = Math.floor(Math.random() * 9);
    if(oct === 3 || oct === 4 || oct === 5){
        kOct = 4;
    }else if(oct === 6 || oct === 7){
        kOct = 5;
    }else if(oct === 8){
        kOct = 6;
    }
    if(mode === "DORIAN"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_dorian[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "PHRYGIAN"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_phrygian[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "LYDIAN"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_lydian[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "MYXOLYDIAN"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_myxolydian[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "AEOLIAN"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_aeolian[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "LOCRIAN"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_locrian[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "IONIAN"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_ionian[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "MAJORPENT"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_majorpent[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "MINORPENT"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_minorpent[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    if(mode === "PHRYGDOM"){
        let start = diatonic.indexOf(rootNote);
        for(var i = 0; i < 13; i++){
            if(g_phrygdom[i] === 1){
                let thisOct = kOct;
                let bump = Math.floor(Math.random() * 3);
                if(bump === 1){
                    thisOct += 1;          
                }
                let key = diatonic[start + i] + thisOct;
                console.log(key);
                let note = MIDI.keyToNote[key]
                notes.push(note);
            }
        }
    }
    return notes;
}

function getInputPattern(inputNotes){
    let inputPattern = [1]; 
    for(let i = 0; i < inputNotes.length - 1; i++){
        let steps = getHalfStepsBetween(inputNotes[i], inputNotes[i+1]);
        while(steps > 0){
            inputPattern.push(0);
            steps = steps - 1;
        }
        inputPattern.push(1);
    }
    return inputPattern;
}


function getHalfStepsBetween(note1, note2){
    
    const ind1 = diatonic.indexOf(note1);
    const ind2 = diatonic.indexOf(note2, ind1);
    return ind2 - ind1 - 1;
}
















