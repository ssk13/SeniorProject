angular.module( 'PseudoComposer' ).factory( 'CantusFirmus', [ 'Note', 'Counterpoint', function( Note, Counterpoint ) {

    var validNoteValues = [26, 28, 29, 31, 33, 35, 36, 38];

    var CantusFirmus = function( numNotes ) {
        var i;

        Counterpoint.apply( this, arguments );

        this.numNotes = numNotes;
        this.numVoices = 1;
        this.notes = [];
        for( i = 0; i != numNotes; ++i )
            this.notes.push( new Note( -1, 'w' ) );
    };

    CantusFirmus.prototype = new Counterpoint();

    CantusFirmus.prototype.pseudoComposeFromScratch = function() {
        var place = 0,
            randVal = Math.floor( Math.random() * 3 ),
            numberOfSkips = 0, 
            numberOfNoteRepetitions = 0,
            valueOfRepeatedNote = -1,
            counter = 0,
            diff = 0,
            nextMotionSmallAndOppositeDirection = false,
            noteFound = false,
            attempts;

        randVal = Math.floor( Math.random() * 2 );
        if( randVal == 0 ) {
            this.notes[ this.numNotes - 1 ] = new Note( validNoteValues[ 0 ] );
            this.notes[ this.numNotes - 2 ] = new Note( validNoteValues[ 1 ] );
        } 
        else {
            this.notes[ this.numNotes - 1 ] = new Note( validNoteValues[ 7 ] );
            this.notes[ this.numNotes - 2 ] = new Note( validNoteValues[ 6 ] );
            this.notes[ this.numNotes - 2 ].transpose( 1 );
        }

        while( place < this.numNotes - 2 && counter < 1000 ) {
            ++counter;
            randVal = Math.floor( Math.random() * 8 );
            attempts = 0;
            noteFound = false;

            while( ( attempts < 8 ) && !noteFound ) {
                if( place == 0 ) {
                    if( randVal == 0 )
                         this.notes[ place ] = new Note( validNoteValues[ 0 ] );
                    else if( randVal == 1 )
                        this.notes[ place ] = new Note( validNoteValues[ 4 ] );
                    else
                        this.notes[ place ] = new Note( validNoteValues[ 7 ] );

                    valueOfRepeatedNote = this.notes[ 0 ].val;
                    noteFound = true;
                }
                else {
                    diff = this.notes[ place - 1 ].val - validNoteValues[ randVal ];
                    if( diff == 0 ) {
                        if( numberOfNoteRepetitions != 2 && valueOfRepeatedNote != validNoteValues[ randVal ] && 
                            !nextMotionSmallAndOppositeDirection ) {
                            valueOfRepeatedNote = validNoteValues[ randVal ];
                            noteFound = true;
                        }
                    } 
                    else if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                        if( place > 1 ) {
                            if( !nextMotionSmallAndOppositeDirection || 
                                this.isApproachedFromOppositeDirection( this.notes[ place - 2 ].val, this.notes[ place - 1 ].val, 
                                                                        validNoteValues[ randVal ] ) )
                                noteFound = true;
                        } 
                        else
                            noteFound = true;
                    } 
                    else if( diff == 3 || diff == 4 || diff == -3 || diff == -4 ) {
                        if( numberOfSkips != 2 ) {
                            if( place > 1 ) {
                                if( !nextMotionSmallAndOppositeDirection || 
                                    this.isApproachedFromOppositeDirection( this.notes[ place - 2 ].val, this.notes[ place - 1 ].val, 
                                                                            validNoteValues[ randVal ] ) )
                                    noteFound = true;
                            }
                            else
                                noteFound = true;
                        }
                    } 
                    else if( diff == 5 || diff == 7 || diff == 8 || diff == 12 || diff == -5 || diff == -7 || diff == -8 || diff == -12 ) {
                        if( numberOfSkips == 0 ) {
                            if( place > 1 ) {
                                if( this.isApproachedFromOppositeDirection( this.notes[ place - 2 ].val, this.notes[ place - 1 ].val, 
                                                                            validNoteValues[ randVal ] ) )
                                    noteFound = true;
                            } else
                                noteFound = true;
                        }
                    }
                }

                if( noteFound ) {
                    this.notes[ place++ ] = new Note( validNoteValues[ randVal ] );
                    numberOfSkips = ( diff < 3 && diff > -3 ) ? 0 : numberOfSkips + 1;
                    nextMotionSmallAndOppositeDirection = ( diff > 4 || diff < -4 ) ? true : false;
                    numberOfNoteRepetitions = ( diff == 0 ) ? numberOfNoteRepetitions + 1 : 0;
                }

                randVal = ( randVal + 1 ) % 8;
                ++attempts;
            }
                    
            if( noteFound == false ) {
                --place;
                if( place < 0 )
                    place = 0;
            }

            if( place == this.numNotes - 2 ) {
                if( !this.voiceLeadingIntoCadenceIsValid( nextMotionSmallAndOppositeDirection, ( numberOfSkips == 2 ) ) )
                    place -= 2;
            }
        }
    }

    CantusFirmus.prototype.voiceLeadingIntoCadenceIsValid = function( mustLeaveInOppositeDirection, mustBeStepwise ) {
        var prevNote = this.notes[ this.numNotes - 3 ].val,
            cadNote = this.notes[ this.numNotes - 2 ].val,
            finalNote = this.notes[ this.numNotes - 1 ].val;

        if( mustBeStepwise ) {
            if( cadNote - prevNote > 2 || prevNote - cadNote > 2 )
                return false;
        }
        if( this.isConsonantMelodically( prevNote, cadNote ) && 
            ( !mustLeaveInOppositeDirection || this.isApproachedFromOppositeDirection( prevNote, cadNote, finalNote ) ) ) {
            if( cadNote - prevNote > 4 ) {
                if( finalNote - cadNote < 0 )
                    return true;
            } 
            else if( prevNote - cadNote > 4 ) {
                if( finalNote - cadNote > 0 )
                    return true;
            }
            else
                return true;    
        }
        return false;
    }

    return CantusFirmus;
} ] );
