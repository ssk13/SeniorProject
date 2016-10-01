angular.module( 'PseudoComposer' ).factory( 'TwoVoiceCounterpoint', [ 'Note', 'Counterpoint', '$rootScope', 
                                                                      function( Note, Counterpoint, $rootScope ) {

    var validNoteValues = [ 33, 35, 36, 38, 40, 41, 43, 45 ];

    var TwoVoiceCounterpoint = function( cantusFirmus, numNotes, species ) {
        var i;

        this.cantusFirmus = cantusFirmus;
        this.numVoices = 2;
        if( species == 1 )
            this.numNotes = cantusFirmus.numNotes;
        else if( species == 2 ) 
            this.numNotes = ( cantusFirmus.numNotes * 2 ) - 1;
        else if( species == 3 )
            this.numNotes = ( cantusFirmus.numNotes * 4 ) - 3;

        this.notes = [];
        for( i = 0; i < 2; ++i )
            this.notes[ i ] = [];

        if( species == 1 ) {
            for( i = 0; i != this.numNotes; ++i ) {
                this.notes[ 0 ].push( new Note( -1, 'q' ) );
                this.notes[ 1 ].push( cantusFirmus.notes[ i ] );
            }
        } 
        else if( species == 2 ) {
            for( i = 0; i != this.numNotes - 1; ++i ) {
                this.notes[ 0 ].push( new Note( -1, 'i' ) );
                this.notes[ 1 ].push( cantusFirmus.notes[ Math.floor( i / 2 ) ] );
            }
            this.notes[ 0 ].push( new Note( -1, 'q' ) );
            this.notes[ 1 ].push( cantusFirmus.notes[ Math.floor( this.numNotes / 2 ) ] );
        } 
        else if( species == 3 ) {
            for( var i = 0; i != this.numNotes - 1; ++i ) {
                this.notes[ 0 ].push( new Note( -1, 'i' ) );
                this.notes[ 1 ].push( cantusFirmus.notes[ Math.floor( i / 4 ) ] );
            }
            this.notes[ 0 ].push( new Note( -1, 'q' ) );
            this.notes[ 1 ].push( cantusFirmus.notes[ Math.floor( this.numNotes / 4 ) ] );
        }
    };

    TwoVoiceCounterpoint.prototype = new Counterpoint();

    TwoVoiceCounterpoint.prototype.pseudoComposeFromScratch = function() {
        if( $rootScope.inputParams.species == 1 )
            this.pseudoComposeFromScratchInFirstSpecies();
        else if( $rootScope.inputParams.species == 2 )
            this.pseudoComposeFromScratchInSecondSpecies();
        else
            this.pseudoComposeFromScratchInThirdSpecies();
    }

    TwoVoiceCounterpoint.prototype.pseudoComposeFromScratchInFirstSpecies = function() {
        var place = 0,
            randVal = Math.floor( Math.random() * 3 ),
            numberOfSkips = 0, 
            numberOfNoteRepetitions = 0,
            valueOfRepeatedNote = 0,
            counter = 0,
            nextMotionSmallAndOppositeDirection = false,
            noteFound = false,
            attempts, diff;

        if( this.notes[ 1 ][ this.numNotes - 2 ].val == validNoteValues[ 2 ] + 1)
            this.notes[0][this.numNotes - 2] = new Note(validNoteValues[4]);
        else {
            this.notes[ 0 ][ this.numNotes - 2 ] = new Note( validNoteValues[ 2 ] );
            this.notes[ 0 ][ this.numNotes - 2 ].transpose( 1 );
        }

        this.notes[ 0 ][ this.numNotes - 1 ] = new Note( validNoteValues[ 3 ] );

        while( place < this.numNotes - 2 && counter < 1000 ) {
            ++counter;
            attempts = 0;
            noteFound = false;

            randVal = Math.floor( Math.random() * 8 );
            while( attempts < 8 && !noteFound ) {
                if( place == 0 ) {
                    if( randVal == 0 )
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 0 ] );
                    else if( randVal == 1 )
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 3 ] );
                    else
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 7 ] );

                    valueOfRepeatedNote = this.notes[ 0 ][ 0 ].val;
                    noteFound = true;
                } 
                else {
                    if( this.isConsonantVertically( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) && 
                        ( this.isImperfectConsonance( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) || 
                          this.isContraryOrOblique( this.notes[ 0 ][ place - 1 ].val, this.notes[ 1 ][ place - 1 ].val, validNoteValues[ randVal ],
                                                    this.notes[ 1 ][ place ].val)) &&
                        this.notes[ 1 ][ place ].val != validNoteValues[ randVal ]
                        ) {
                        diff = this.notes[ 0 ][ place - 1 ].val - validNoteValues[ randVal ];
                        if( diff == 0 ) {
                            if( numberOfNoteRepetitions != 2 && valueOfRepeatedNote != validNoteValues[ randVal ] && 
                                !nextMotionSmallAndOppositeDirection && this.notes[ 1 ][ place - 1 ].val != this.notes[ 1 ][ place ].val) {
                                noteFound = true;
                                valueOfRepeatedNote = validNoteValues[ randVal ];
                            }
                        } 
                        else if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                            if( place > 1 ) {
                                if( !nextMotionSmallAndOppositeDirection || 
                                    this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val, 
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
                                        this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1].val, 
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                }
                                else
                                    noteFound = true;
                            }
                        }
                        else if( diff == 5 || diff == 7 || diff == 8 || diff == 12 || diff == -5 || diff == -7 ||  diff == -8 || diff == -12 ) {
                            if( numberOfSkips == 0 ) {
                                if( place > 1 ) {
                                    if( this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                        validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                } 
                                else
                                    noteFound = true;
                            }
                        }

                        if( noteFound ) {
                            this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ randVal ] );
                            numberOfSkips = ( diff < 3 && diff > -3 ) ? 0 : numberOfSkips + 1;
                            nextMotionSmallAndOppositeDirection = ( diff > 4 || diff < -4 ) ? true : false;
                            numberOfNoteRepetitions = ( diff == 0 ) ? numberOfNoteRepetitions + 1 : 0;
                        }
                    }
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
                if( !this.voiceLeadingIntoCadenceIsValid( nextMotionSmallAndOppositeDirection, numberOfSkips == 2 ) )
                    place -= 2;
            }
        }
    }

    TwoVoiceCounterpoint.prototype.pseudoComposeFromScratchInSecondSpecies = function() {
        var place = 0,
            randVal = Math.floor( Math.random() * 3 ),
            numberOfSkips = 0, 
            counter = 0,
            nextMotionSmallAndOppositeDirection = false,
            nextMotionStepwise = false,
            nextMotionAscending = false,
            noteFound = false,
            attempts, diff;

        if( this.notes[ 1 ][ this.numNotes - 2 ].val == validNoteValues[ 2 ] + 1 )
            this.notes[ 0 ][ this.numNotes - 2 ] = new Note( validNoteValues[ 4 ], 'i' );
        else {
            this.notes[ 0 ][ this.numNotes - 2 ] = new Note( validNoteValues[ 2 ], 'i' );
            this.notes[ 0 ][ this.numNotes - 2 ].transpose( 1 );
        }

        this.notes[ 0 ][ this.numNotes - 1 ] = new Note( validNoteValues[ 3 ], 'q' );

        while( place < this.numNotes - 2 && counter < 2000 ) {
            ++counter;
            attempts = 0;
            noteFound = false;

            randVal = Math.floor( Math.random() * 8 );
            while( attempts < 8 && !noteFound ) {
                if( place == 0 ) {
                    if( randVal == 0 )
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 0 ], 'i' );
                    else if( randVal == 1 )
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 3 ], 'i' );
                    else
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 7 ], 'i' );

                    noteFound = true;
                } 
                else if( place % 2 == 0 ) {
                    if( this.isConsonantVertically( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) && 
                        ( this.isImperfectConsonance( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) || 
                        this.isContraryOrOblique( this.notes[ 0 ][ place - 1 ].val, this.notes[ 1 ][ place - 1 ].val, validNoteValues[ randVal ], 
                                                  this.notes[ 1 ][ place ].val) ) &&
                        this.notes[ 1 ][ place ].val != validNoteValues[ randVal ] ) {
                        diff = this.notes[ 0 ][ place - 1 ].val - validNoteValues[ randVal ];
                        if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                            if( !nextMotionAscending || diff > 0 ) {
                                if( place > 1 ) {
                                    if( !nextMotionSmallAndOppositeDirection || 
                                        this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                    else
                                        noteFound = true;
                                }
                            }
                        } 
                        else if( diff == 3 || diff == 4 || diff == -3 || diff == -4 ) {
                            if( numberOfSkips != 2 && !nextMotionStepwise ) {
                                if( place > 1 ) {
                                    if( !nextMotionSmallAndOppositeDirection || 
                                        this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                }
                                else
                                    noteFound = true;
                            }
                        } 
                        else if( diff == 5 || diff == 7 || diff == 8 || diff == 12 || diff == -5 || diff == -7 ||  diff == -8 || diff == -12 ) {
                            if( numberOfSkips == 0 && !nextMotionStepwise ) {
                                if( place > 1 ) {
                                    if( this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                } else
                                    noteFound = true;
                            }
                        }

                        if( noteFound ) {
                            this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ randVal ], 'i' );
                            numberOfSkips = ( diff < 3 && diff > -3 ) ? 0 : numberOfSkips + 1;
                            nextMotionSmallAndOppositeDirection = ( diff > 4 || diff < -4 ) ? true : false;
                        }
                    }
                } 
                else {
                    if( this.isConsonantVertically( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) && 
                        ( this.isImperfectConsonance( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) || 
                          this.isContraryOrOblique( this.notes[ 0 ][ place - 1 ].val, this.notes[ 1 ][ place - 1 ].val, validNoteValues[ randVal ],
                                                    this.notes[ 1 ][ place ].val ) ) &&
                        this.notes[ 1 ][ place ].val != validNoteValues[ randVal ] ) {
                        diff = this.notes[ 0 ][ place - 1].val - validNoteValues[ randVal ];
                        if( diff == 0 ) {
                            if( !nextMotionSmallAndOppositeDirection && this.notes[ 1 ][ place - 1 ].val != this.notes[ 1 ][ place ].val )
                                noteFound = true;
                        } 
                        else if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                            if( place > 1 ) {
                                if( !nextMotionSmallAndOppositeDirection || 
                                    this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val, 
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
                                        this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val, 
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                }
                                else
                                    noteFound = true;
                            }
                        }
                        else if( diff == 5 || diff == 7 || diff == 8 || diff == 12 || diff == -5 || diff == -7 ||  diff == -8 || diff == -12 ) {
                            if( numberOfSkips == 0 ) {
                                if( place > 1 ) {
                                    if( this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                        validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                } else
                                    noteFound = true;
                            }
                        }

                        if( noteFound ) {
                            this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ randVal ], 'i' );
                            numberOfSkips = ( diff < 3 && diff > -3 ) ? 0 : numberOfSkips + 1;
                            nextMotionSmallAndOppositeDirection = ( diff > 4 || diff < -4 ) ? true : false;
                        }
                    } 
                    else {
                        diff = this.notes[ 0 ][ place - 1 ].val - validNoteValues[ randVal ];
                        if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                            if( place > 1 ) {
                                if( !nextMotionSmallAndOppositeDirection || 
                                    this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val, 
                                                                            validNoteValues[ randVal ] ) )
                                    noteFound = true;
                            } else
                                noteFound = true;
                        }

                        if( noteFound ) {
                            this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ randVal ], 'i' );
                            numberOfSkips = 0;
                            nextMotionSmallAndOppositeDirection = false;
                            nextMotionStepwise = true;
                            nextMotionAscending = ( diff < 0 ) ? true : false;
                        }
                    }
                }

                randVal = ( randVal + 1 ) % 8;
                ++attempts;
            }
                    
            if( noteFound == false ) {
                place -= 3;
                if( place < 0 )
                    place = 0;
            }

            if( place == this.numNotes - 2 ) {
                if( !this.voiceLeadingIntoCadenceIsValid( nextMotionSmallAndOppositeDirection, numberOfSkips == 2 ) )
                    place -= 2;
            }
        }
    }

    TwoVoiceCounterpoint.prototype.pseudoComposeFromScratchInThirdSpecies = function() {
        var place = 0,
            randVal = Math.floor( Math.random() * 3 ),
            numberOfSkips = 0,
            counter = 0,
            nextMotionSmallAndOppositeDirection = false,
            nextMotionStepwise = false,
            nextMotionAscending = false,
            noteFound = false,
            attempts, diff;

        if( this.notes[ 1 ][ this.numNotes - 2 ].val == validNoteValues[ 2 ] + 1 )
            this.notes[ 0 ][ this.numNotes - 2 ] = new Note( validNoteValues[ 4 ], 's' );
        else {
            this.notes[ 0 ][ this.numNotes - 2 ] = new Note( validNoteValues[ 2 ], 's' );
            this.notes[ 0 ][ this.numNotes - 2 ].transpose( 1 );
        }
        this.notes[ 0 ][ this.numNotes - 1 ] = new Note( validNoteValues[ 3 ], 'q' );

        while( place < this.numNotes - 2 && counter < 4000 ) {
            ++counter;
            attempts = 0;
            noteFound = false;

            randVal = Math.floor( Math.random() * 8) ;
            while( attempts < 8 && !noteFound ) {
                if( place == 0 ) {
                    if( randVal == 0 )
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 0 ], 's' );
                    else if( randVal == 1 )
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 3 ], 's' );
                    else
                        this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ 7 ], 's' );

                    noteFound = true;
                } 
                else if( place % 2 == 0 ) {
                    if( this.isConsonantVertically( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) && 
                        ( this.isImperfectConsonance( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) || 
                          this.isContraryOrOblique( this.notes[ 0 ][ place - 1 ].val, this.notes[ 1 ][ place - 1 ].val, validNoteValues[ randVal ],
                                                    this.notes[ 1 ][ place ].val ) ) && 
                                                    this.notes[ 1 ][ place ].val != validNoteValues[ randVal ] ) {
                        diff = this.notes[ 0 ][ place - 1 ].val - validNoteValues[ randVal ];
                        if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                            if( !nextMotionAscending || diff > 0 ) {
                                if( place > 1 ) {
                                    if( !nextMotionSmallAndOppositeDirection || 
                                        this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val, 
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                }
                                else
                                    noteFound = true;
                            }
                        }
                        else if( diff == 3 || diff == 4 || diff == -3 || diff == -4 ) {
                            if( numberOfSkips != 2 && !nextMotionStepwise ) {
                                if( place > 1 ) {
                                    if( !nextMotionSmallAndOppositeDirection || 
                                        this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                }
                                else
                                    noteFound = true;
                            }
                        } 
                        else if( diff == 5 || diff == 7 || diff == 8 || diff == 12 || diff == -5 || diff == -7 ||  diff == -8 || diff == -12 ) {
                            if( numberOfSkips == 0 && !nextMotionStepwise ) {
                                if( place > 1 ) {
                                    if( this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                        validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                } 
                                else
                                    noteFound = true;
                            }
                        }

                        if( noteFound ) {
                            this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ randVal ], 's' );
                            numberOfSkips = (diff < 3 && diff > -3) ? 0 : numberOfSkips + 1;
                            nextMotionSmallAndOppositeDirection = ( diff > 4 || diff < -4 ) ? true : false;
                        }
                    }
                }
                else {
                    if( this.isConsonantVertically( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) && 
                        ( this.isImperfectConsonance( this.notes[ 1 ][ place ].val, validNoteValues[ randVal ] ) || 
                          this.isContraryOrOblique( this.notes[ 0 ][ place - 1 ].val, this.notes[ 1 ][ place - 1 ].val, validNoteValues[ randVal ],
                                                    this.notes[ 1 ][ place ].val ) ) &&
                        this.notes[ 1 ][ place ].val != validNoteValues[ randVal ] ) {
                        diff = this.notes[ 0 ][ place - 1 ].val - validNoteValues[ randVal ];
                        if( diff == 0 ) {
                            if( !nextMotionSmallAndOppositeDirection && this.notes[ 1 ][ place - 1 ].val != this.notes[ 1 ][ place ].val )
                                noteFound = true;
                        }
                        else if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                            if( place > 1 ) {
                                if( !nextMotionSmallAndOppositeDirection || 
                                    this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val, 
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
                                        this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                }
                                else
                                    noteFound = true;
                            }
                        }
                        else if( diff == 5 || diff == 7 || diff == 8 || diff == 12 || diff == -5 || diff == -7 ||  diff == -8 || diff == -12 ) {
                            if( numberOfSkips == 0 ) {
                                if( place > 1 ) {
                                    if( this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val,
                                                                                validNoteValues[ randVal ] ) )
                                        noteFound = true;
                                } else
                                    noteFound = true;
                            }
                        }

                        if( noteFound ) {
                            this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ randVal ], 's' );
                            numberOfSkips = (diff < 3 && diff > -3) ? 0 : numberOfSkips + 1;
                            nextMotionSmallAndOppositeDirection = ( diff > 4 || diff < -4 ) ? true : false;
                        }
                    }
                    else {
                        diff = this.notes[ 0 ][ place - 1 ].val - validNoteValues[ randVal ];
                        if( diff == 1 || diff == 2 || diff == -2 || diff == -1 ) {
                            if( place > 1 ) {
                                if( !nextMotionSmallAndOppositeDirection || 
                                    this.isApproachedFromOppositeDirection( this.notes[ 0 ][ place - 2 ].val, this.notes[ 0 ][ place - 1 ].val, 
                                                                            validNoteValues[ randVal ] ) )
                                    noteFound = true;
                            } 
                            else
                                noteFound = true;
                        }

                        if( noteFound ) {
                            this.notes[ 0 ][ place++ ] = new Note( validNoteValues[ randVal ], 's' );
                            numberOfSkips = 0;
                            nextMotionSmallAndOppositeDirection = false;
                            nextMotionStepwise = true;
                            nextMotionAscending = ( diff < 0 ) ? true : false;
                        }
                    }
                }

                randVal = ( randVal + 1 ) % 8;
                ++attempts;
            }
                    
            if( noteFound == false ) {
                place -= 3;
                if( place < 0 )
                    place = 0;
            }

            if( place == this.numNotes - 2 ) {
                if( !this.voiceLeadingIntoCadenceIsValid( nextMotionSmallAndOppositeDirection, numberOfSkips == 2 ) )
                    place -= 2;
            }
        }
    }

    TwoVoiceCounterpoint.prototype.voiceLeadingIntoCadenceIsValid = function( mustLeaveInOppositeDirection, mustBeStepwise ) {
        var prevSoprano = this.notes[ 0 ][ this.numNotes - 3 ].val,
            cadSoprano = this.notes[ 0 ][ this.numNotes - 2 ].val,
            finalSoprano = this.notes[ 0 ][ this.numNotes - 1 ].val;

        if( mustBeStepwise ) {
            if( cadSoprano - prevSoprano > 2 || prevSoprano - cadSoprano > 2 )
                return false;
        }

        if( this.isConsonantMelodically( prevSoprano, cadSoprano ) && 
            ( !mustLeaveInOppositeDirection || this.isApproachedFromOppositeDirection( prevSoprano, cadSoprano, finalSoprano ) ) ) {
            if( cadSoprano - prevSoprano > 4 ) {
                if( finalSoprano - cadSoprano < 0 )
                    return true;
            } 
            else if( prevSoprano - cadSoprano > 4 ) {
                if( finalSoprano - cadSoprano > 0 )
                    return true;
            }
            else
                return true;    
        }
        return false;

    }

    return TwoVoiceCounterpoint;
} ] );
