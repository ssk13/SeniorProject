PseudoComposer.controller( 'inputController', [ '$scope', '$rootScope', 
    function( $scope, $rootScope ) {

        $scope.duration = 'whole';
        $scope.isRest = false
        $scope.floatingNoteheadTopPos = 59;
        $scope.songString = "";

        /* [ has, show ] */
        /*hard rules*/
        $scope.imperfectStartingOrEndingInterval = [ false, false ];
        $scope.incorrectAccidental = [ false, false ];
        $scope.incorrectHarmony = [ false, false ];
        $scope.incorrectMelody = [ false, false ];
        $scope.largerThan12th = [ false, false ];
        $scope.motivicRepetition = [ false, false ];
        $scope.outlineOfTritone = [ false, false ];
        $scope.parallelPerfect = [ false, false ];
        $scope.perfectApproachedBySimilarMotion = [ false, false ];
        $scope.repeatedNotes = [ false, false ];
        $scope.repeatedNoteInBothVoices = [ false, false ];
        $scope.repeatedNoteInCounterpoint = [ false, false ];
        $scope.slowTrill = [ false, false ];
        $scope.tooManyParallelIntervals = [ false, false ];
        $scope.tooMuchChangingDirection = [ false, false ];
        $scope.hasTooManySkips = [ false ];
        $scope.unequalNumberOfBeats = [ false ];
        /*soft rules*/
        $scope.changeDirectionAfterLargeSkip = [ false, false ];
        $scope.consecutivePerfect = [ false, false ];
        $scope.consecutiveSkips = [ false, false ];
        $scope.coverOctave = [ false, false ];
        $scope.descendAfterBflat = [ false, false ];
        $scope.dissonantOutline = [ false, false ];
        $scope.fillInSkips = [ false, false ];
        $scope.internalUnison = [ false, false ];
        $scope.largeSkipOnTop = [ false, false ];
        $scope.leapIn3rdSpecies = [ false, false ];
        $scope.melodic6th = [ false, false ];
        $scope.overusedVerticalIntervalSecondSpecies = [ false, false ];
        $scope.skippingInBothVoices = [false, false ];
        $scope.skippingToAndFromExtreme = [ false, false ];
        $scope.skippingUpToWeakQuarter = [ false, false ];
        $scope.surroundSkipWithStepsInOppositeDirection = [ false, false ];
        $scope.tempHighOnWeakQuarter = [ false, false ];
        $scope.voiceCrossing = [ false, false ];

        $scope.hasBrokenHardRules = false;
        $scope.hasBrokenSoftRules = false;

        $scope.counterpointChecked = false;

        var currentLeftPos = [ 90, 90, 90 ],
            noteIndex = [ 0, 0, 0 ],
            beatIndex = [ 0, 0, 0 ],
            notes = [ [],[],[] ],
            topPosToNoteTableTreble = [ 
                                        [ 19, 'g5', 41, '.slot0' ], [ 29, 'f5', 39, '.slot1' ], [ 39, 'e5', 38, '.slot2' ], [ 48, 'd5', 36, '.slot3' ], 
                                        [ 59, 'c5', 34, '.slot4' ], [ 70, 'b4', 33, '.slot5' ], [ 79, 'a4', 31, '.slot6' ], [ 90, 'g4', 29, '.slot7' ], 
                                        [ 99, 'f4', 27, '.slot8' ], [ 111, 'e4', 26, '.slot9' ], [ 119, 'd4', 24, '.slot10' ]
                                    ],
            topPosToNoteTableAlto = [ 
                                        [ 19, 'a4', 31, '.slot0' ], [ 29, 'g4', 29, '.slot1' ], [ 39, 'f4', 27, '.slot2' ], [ 48, 'e4', 26, '.slot3' ], 
                                        [ 59, 'd4', 24, '.slot4' ], [ 70, 'c4', 22, '.slot5' ], [ 79, 'b3', 21, '.slot6' ], [ 90, 'a3', 19, '.slot7' ], 
                                        [ 99, 'g3', 17, '.slot8' ], [ 111, 'f3', 15, '.slot9' ], [ 119, 'e3', 14, '.slot10' ]
                                    ],
            topPosToNoteTableTenor = [ 
                                        [ 19, 'f4', 27, '.slot0' ], [ 29, 'e4', 26, '.slot1' ], [ 39, 'd4', 24, '.slot2' ], [ 48, 'c4', 22, '.slot3' ], 
                                        [ 59, 'b3', 21, '.slot4' ], [ 70, 'a3', 19, '.slot5' ], [ 79, 'g3', 17, '.slot6' ], [ 90, 'f3', 15, '.slot7' ], 
                                        [ 99, 'e3', 14, '.slot8' ], [ 111, 'd3', 12, '.slot9' ], [ 119, 'c3', 10, '.slot10' ]
                                    ],
            topPosToNoteTableBass = [ 
                                        [ 19, 'b3', 21, '.slot0' ], [ 29, 'a3', 19, '.slot1' ], [ 39, 'g3', 17, '.slot2' ], [ 48, 'f3', 15, '.slot3' ], 
                                        [ 59, 'e3', 14, '.slot4' ], [ 70, 'd3', 12, '.slot5' ], [ 79, 'c3', 10, '.slot6' ], [ 90, 'b2', 9, '.slot7' ], 
                                        [ 99, 'a2', 7, '.slot8' ], [ 111, 'g2', 5, '.slot9' ], [ 119, 'f2', 3, '.slot10' ]
                                    ],
            activeStaff = 0,
            connections = $('connection'),
            connectionNumber = 0,
            targetNote;

        /* staff actions */

        $scope.addAccidental = function( acc ) {
            var index = parseInt( targetNote[ 0 ].getAttribute( 'data-note-index' ) ),
                note, i, margin, acc, accEl, accClass;

                margin = $( targetNote )[ 0 ].getAttribute( 'style' );
                margin = margin.slice( margin.indexOf( 'margin' ) + 13 );
                margin = margin.slice( 0, margin.indexOf( 'px' ) ) ;
                margin = parseInt( margin ) - 105;

            if( !targetNote || $( targetNote ).hasClass( 'quarterrest' ) || $( targetNote ).hasClass( 'halfrest' ) || $( targetNote ).hasClass( 'wholerest' ) )
                return;

            if( $( targetNote ).hasClass( 'hasAccidental' ) ) {
                accEl = $( $( targetNote )[ 0 ].previousElementSibling )[ 0 ];
                accClass = $( $( accEl )[ 0 ].firstElementChild )[ 0 ].className;
                accEl.remove();
                notes[ activeStaff ][ index ][ 0 ] = notes[ activeStaff ][ index ][ 0 ].slice( 0, 2 );

                if( accClass == 'sharp' )
                    notes[ activeStaff ][ index ][ 1 ]--;
                else if( accClass == 'flat' )
                    notes[ activeStaff ][ index ][ 1 ]++;

                if( accClass == acc ) {
                    $( targetNote ).removeClass( 'hasAccidental' );
                    setUpTaskbar( targetNote );
                    checkSpacing();
                    return;
                }
            }

            if( ( $rootScope.inputParams.keySignature == 1 ) && ( notes[ activeStaff ][ index ][ 0 ].indexOf( 'b' ) != -1 ) ) {
                notes[ activeStaff ][ index ][ 0 ] = notes[ activeStaff ][ index ][ 0 ].slice( 0, 2 );
                notes[ activeStaff ][ index ][ 1 ]++;
            }

            addAccidentalToNote( margin, acc, index );

            if( !$( targetNote ).hasClass( 'hasAccidental' ) )
                $( targetNote ).addClass( 'hasAccidental' );
            
            setUpTaskbar( targetNote );
            checkSpacing();
        };

        $scope.areAllShown = function() {
            return ( $scope.imperfectStartingOrEndingInterval[ 1 ] && $scope.incorrectAccidental[ 1 ] && $scope.incorrectHarmony[ 1 ] && $scope.incorrectMelody[ 1 ] &&
                     $scope.largerThan12th[ 1 ] && $scope.parallelPerfect[ 1 ] && $scope.perfectApproachedBySimilarMotion[ 1 ] && $scope.repeatedNotes[ 1 ] &&
                     $scope.tooManyParallelIntervals[ 1 ] && $scope.consecutivePerfect[ 1 ] && $scope.consecutiveSkips[ 1 ] && $scope.internalUnison[ 1 ] &&
                     $scope.largeSkipOnTop[ 1 ] && $scope.melodic6th[ 1 ] && $scope.voiceCrossing[ 1 ] && $scope.dissonantOutline[ 1 ] && $scope.repeatedNoteInCounterpoint[ 1 ] &&
                     $scope.leapIn3rdSpecies[ 1 ] && $scope.outlineOfTritone[ 1 ] && $scope.surroundSkipWithStepsInOppositeDirection[ 1 ] &&
                     $scope.skippingToAndFromExtreme[ 1 ] && $scope.repeatedNoteInBothVoices[ 1 ] && $scope.motivicRepetition[ 1 ] && $scope.skippingInBothVoices[ 1 ] &&
                     $scope.changeDirectionAfterLargeSkip[ 1 ] && $scope.fillInSkips[ 1 ] && $scope.coverOctave[ 1 ] && $scope.overusedVerticalIntervalSecondSpecies[ 1 ] &&
                     $scope.slowTrill[ 1 ] && $scope.tooMuchChangingDirection[ 1 ] && $scope.skippingUpToWeakQuarter[ 1 ] && $scope.tempHighOnWeakQuarter[ 1 ] &&
                     $scope.descendAfterBflat[ 1 ] );
        };

        $scope.areAllHidden = function() {
            return ( !$scope.imperfectStartingOrEndingInterval[ 1 ] && !$scope.incorrectAccidental[ 1 ] && !$scope.incorrectHarmony[ 1 ] && !$scope.incorrectMelody[ 1 ] &&
                     !$scope.largerThan12th[ 1 ] && !$scope.parallelPerfect[ 1 ] && !$scope.perfectApproachedBySimilarMotion[ 1 ] && !$scope.repeatedNotes[ 1 ] &&
                     !$scope.tooManyParallelIntervals[ 1 ] && !$scope.consecutivePerfect[ 1 ] && !$scope.consecutiveSkips[ 1 ] && !$scope.internalUnison[ 1 ] &&
                     !$scope.largeSkipOnTop[ 1 ] && !$scope.melodic6th[ 1 ] && !$scope.voiceCrossing[ 1 ] && $scope.dissonantOutline[ 1 ] && !$scope.repeatedNoteInCounterpoint[ 1 ] &&
                     !$scope.leapIn3rdSpecies[ 1 ] && !$scope.outlineOfTritone[ 1 ] && !$scope.surroundSkipWithStepsInOppositeDirection[ 1 ] &&
                     !$scope.skippingToAndFromExtreme[ 1 ] && !$scope.repeatedNoteInBothVoices[ 1 ] && !$scope.motivicRepetition[ 1 ] && !$scope.skippingInBothVoices[ 1 ] &&
                     !$scope.changeDirectionAfterLargeSkip[ 1 ] && !$scope.fillInSkips[ 1 ] && !$scope.coverOctave[ 1 ] && !$scope.overusedVerticalIntervalSecondSpecies[ 1 ] &&
                     !$scope.slowTrill[ 1 ] && !$scope.tooMuchChangingDirection[ 1 ] && !$scope.skippingUpToWeakQuarter[ 1 ] && !$scope.tempHighOnWeakQuarter[ 1 ] &&
                     !$scope.descendAfterBflat[ 1 ] );
        };

        $scope.changeDuration = function( dur, isRest ) {
            var staffIndex, noteIndex, val, prevDur, noteVal;

            $scope.duration = dur;
            $scope.isRest = isRest;

            if( targetNote ) {
                staffIndex = $( targetNote )[ 0 ].getAttribute( 'data-staff-index' );
                noteIndex = $( targetNote )[ 0 ].getAttribute( 'data-note-index' );
                val = notes[ staffIndex ][ noteIndex ][ 1 ];
                prevDur = notes[ staffIndex ][ noteIndex ][ 2 ];
                $( targetNote ).removeClass( 'whole quarterup quarterdown halfup halfdown quarterrest halfrest wholerest' );

                if( prevDur == 'whole' )
                    beatIndex[ staffIndex ] -= 4;
                else if( prevDur == 'half' )
                    beatIndex[ staffIndex ] -= 2;
                else
                    beatIndex[ staffIndex ] -= 1;

                noteVal = getNoteFromDurationAndValue( dur, val, isRest, $rootScope.inputParams.clef[ staffIndex ] );

                $( targetNote )[ 0 ].setAttribute( 'src', 'img/' + noteVal + '.png' );
                $( targetNote ).addClass( noteVal );
                if( dur == 'quarter' )
                    beatIndex[ staffIndex ] += 1;
                else if( dur == 'half' )
                    beatIndex[ staffIndex ] += 2;
                else
                    beatIndex[ staffIndex ] += 4;

                notes[ staffIndex ][ noteIndex ][ 0 ] = 'rest';
                notes[ staffIndex ][ noteIndex ][ 1 ] = -1;
                notes[ staffIndex ][ noteIndex ][ 2 ] = dur;
            }

            checkSpacing();
        };

        $scope.deleteNote = function() {
            if( !targetNote )
                return;

            var noteEls = $( document.querySelectorAll( '[data-staff-index="' + activeStaff + '"].static' ) ),
                index = targetNote[ 0 ].getAttribute( 'data-note-index' ),
                prevDur = notes[ activeStaff ][ index ][ 2 ],
                hasAccidental = $( targetNote ).hasClass( 'hasAccidental' ),
                offset = 40,
                note, acc, i;

            if ( prevDur == 'whole' )
                beatIndex[ activeStaff ] -= 4;
            else if( prevDur == 'half' )
                beatIndex[ activeStaff ] -= 2;
            else
                beatIndex[ activeStaff ] -= 1;

            if( hasAccidental )
                offset = 60;

            
            if( $( targetNote ).hasClass( 'hasAccidental' ) ) {
                acc = $( targetNote)[ 0 ].previousElementSibling;
                $( acc ).remove();
            }
            $( targetNote ).remove();

            for( i = parseInt( index ); i != noteEls.length - 1; ++i ) {
                note = $( document.querySelector( '[data-note-index="' + ( i + 1 ) + '"][data-staff-index="' + activeStaff + '"]' ) );
                note[ 0 ].setAttribute( 'data-note-index', i );
            }

            currentLeftPos[ activeStaff ] -= offset;
            notes[ activeStaff ].splice( index, 1 );
            noteIndex[ activeStaff ]--;

            if( noteIndex[ activeStaff ] > 0 ) {
                targetNote = $( document.querySelector( '[data-note-index="' + ( noteIndex[ activeStaff ] - 1 ) + '"][data-staff-index="' + activeStaff + '"]' ) );
                $( targetNote ).addClass( 'activeNote' );
            }
            else
                targetNote = undefined;

            checkSpacing();
        };

        $scope.enableEditing = function() {
            $scope.counterpointChecked = false;
            connections.connections('remove');
        };

        $scope.floatingNoteheadClicked = function( $event, staffNumber ) {
            var target;

            for( i = 0; i < topPosToNoteTableTreble.length; ++i ) {
                if( $rootScope.inputParams.clef[ staffNumber ] == 'img/trebleclef.png' ) {
                    if( $scope.floatingNoteheadTopPos == topPosToNoteTableTreble[ i ][ 0 ] ) {
                        target = $( document.querySelector( '.activeStaff' ).querySelector( topPosToNoteTableTreble[ i ][ 3 ] ) );
                        $scope.insertNote( topPosToNoteTableTreble[ i ][ 3 ], topPosToNoteTableTreble[ i ][ 0 ], target, staffNumber );
                        return;
                    }
                }
                else if( $rootScope.inputParams.clef[ staffNumber ] == 'img/altoclef.png' ) {
                    if( $scope.floatingNoteheadTopPos == topPosToNoteTableAlto[ i ][ 0 ] ) {
                        target = $( document.querySelector( '.activeStaff' ).querySelector( topPosToNoteTableAlto[ i ][ 3 ] ) );
                        $scope.insertNote( topPosToNoteTableAlto[ i ][ 3 ], topPosToNoteTableAlto[ i ][ 0 ], target, staffNumber );
                        return;
                    }
                }
                else if( $rootScope.inputParams.clef[ staffNumber ] == 'img/tenorclef.png' ) {
                    if( $scope.floatingNoteheadTopPos == topPosToNoteTableTenor[ i ][ 0 ] ) {
                        target = $( document.querySelector( '.activeStaff' ).querySelector( topPosToNoteTableTenor[ i ][ 3 ] ) );
                        $scope.insertNote( topPosToNoteTableTenor[ i ][ 3 ], topPosToNoteTableTenor[ i ][ 0 ], target, staffNumber );
                        return;
                    }
                }
                else {
                    if( $scope.floatingNoteheadTopPos == topPosToNoteTableBass[ i ][ 0 ] ) {
                        target = $( document.querySelector( '.activeStaff' ).querySelector( topPosToNoteTableBass[ i ][ 3 ] ) );
                        $scope.insertNote( topPosToNoteTableBass[ i ][ 3 ], topPosToNoteTableBass[ i ][ 0 ], target, staffNumber );
                        return;
                    }
                }
            }
        };

        $scope.insertNote = function( classname, topPosValue, $event, staffNumber ) {
            var otherStaffNumber = Math.abs( staffNumber - 1 ),
                spaceEl, noteheadDiv, noteheadEl, note, target, i, numericValue, noteName, noteVal;

            if( $event.target === undefined ) //inserting from click of floating notehead
                target = $event[ 0 ];
            else if( $event.target.className.indexOf( 'line' ) !== -1 ) //inserting from click of line
                target = $( $event.target )[ 0 ].parentElement;
            else if( $( $event.target )[ 0 ].className.indexOf( 'accidental' ) !== -1 ) //clicking on note with accidental
                target = $( $event.target )[ 0 ].parentElement;
            else //inserting from click of space
                target = $event.target;

            if( target.getAttribute( 'data-staff-index' ) != activeStaff )
                return;

            if( target.className.indexOf( 'notehead static' ) !== -1 ) { //clicked on notehead
                setUpTaskbar( target );
                targetNote = $( target )
                return;
            }

            for( i = 0; i < topPosToNoteTableTreble.length; ++i ) {
                if( $rootScope.inputParams.clef[ staffNumber ] == 'img/trebleclef.png' ) {
                    if( topPosValue == topPosToNoteTableTreble[ i ][ 0 ] ) {
                        numericValue = topPosToNoteTableTreble[ i ][ 2 ];
                        noteName = topPosToNoteTableTreble[ i ][ 1 ];
                        i = topPosToNoteTableTreble.length;
                        if( ( noteName.indexOf( 'b' ) != -1 ) && ( $rootScope.inputParams.keySignature == 1 ) ) {
                            numericValue -= 1;
                            noteName = noteName.concat( 'flat' );
                        }
                    }
                }
                else if( $rootScope.inputParams.clef[ staffNumber ] == 'img/altoclef.png' ) {
                    if( topPosValue == topPosToNoteTableAlto[ i ][ 0 ] ) {
                        numericValue = topPosToNoteTableAlto[ i ][ 2 ];
                        noteName = topPosToNoteTableAlto[ i ][ 1 ];
                        i = topPosToNoteTableTreble.length;
                        if( ( noteName.indexOf( 'b' ) != -1 ) && ( $rootScope.inputParams.keySignature == 1 ) ) {
                            numericValue -= 1;
                            noteName = noteName.concat( 'flat' );
                        }
                    }
                }
                else if( $rootScope.inputParams.clef[ staffNumber ] == 'img/tenorclef.png' ) {
                    if( topPosValue == topPosToNoteTableTenor[ i ][ 0 ] ) {
                        numericValue = topPosToNoteTableTenor[ i ][ 2 ];
                        noteName = topPosToNoteTableTenor[ i ][ 1 ];
                        i = topPosToNoteTableTreble.length;
                        if( ( noteName.indexOf( 'b' ) != -1 ) && ( $rootScope.inputParams.keySignature == 1 ) ) {
                            numericValue -= 1;
                            noteName = noteName.concat( 'flat' );
                        }
                    }
                }
                else {
                    if( topPosValue == topPosToNoteTableBass[ i ][ 0 ] ) {
                        numericValue = topPosToNoteTableBass[ i ][ 2 ];
                        noteName = topPosToNoteTableBass[ i ][ 1 ];
                        i = topPosToNoteTableTreble.length;
                        if( ( noteName.indexOf( 'b' ) != -1 ) && ( $rootScope.inputParams.keySignature == 1 ) ) {
                            numericValue -= 1;
                            noteName = noteName.concat( 'flat' );
                        }
                    }
                }
            }

            noteVal = getNoteFromDurationAndValue( $scope.duration, numericValue, $scope.isRest, $rootScope.inputParams.clef[ staffNumber ] );
            spaceEl = $( document.querySelector( '.activeStaff' ).querySelector( classname ) );
            noteheadEl = $( '<img class="notehead static">' )
            $( noteheadEl )[ 0 ].setAttribute( 'src', 'img/' + noteVal + '.png' );
            $( noteheadEl ).addClass( noteVal );
            noteheadEl[ 0 ].setAttribute( 'data-note-index', noteIndex[ activeStaff ] );
            noteheadEl[ 0 ].setAttribute( 'data-staff-index', staffNumber );
            noteheadEl.css( {
                 marginLeft: ( currentLeftPos[ staffNumber ] ) + 'px',
                 top: ( topPosValue + 105 + ( 199 * staffNumber ) ) + 'px'
            } ); 

            noteheadDiv = $( '<div></div>' );
            noteheadDiv.append( noteheadEl );
            spaceEl.prepend( noteheadDiv );
            currentLeftPos[ staffNumber ] += 40;
            note = [ noteName, numericValue, $scope.duration ];
            notes[ activeStaff ].push( note );
            noteIndex[ activeStaff ]++;
            targetNote = noteheadEl[0];

            if( $scope.duration == 'whole' )
                beatIndex[ activeStaff ] += 4;
            else if( $scope.duration == 'half' )
                beatIndex[ activeStaff ] += 2;
            else
                beatIndex[ activeStaff ] += 1;

            setUpTaskbar( noteheadEl );

            checkSpacing();
        };

        $scope.setDefinition = function( ruleDefinition ) {
            $rootScope.ruleDefinition = ruleDefinition;
        };

        $scope.startOver = function() {
            $rootScope.inputParams = {
                numberOfVoices: 0,
                keySignature: 0,
                species: 0,
                voiceType: [ 'Cantus Firmus', 'Counterpoint', 'Counterpoint', 'Counterpoint' ],
                clef: [ 'img/trebleclef.png', 'img/trebleclef.png', 'img/trebleclef.png', 'img/trebleclef.png' ]
            };

            $scope.duration = 'whole';
            $scope.isRest = false;
            $scope.floatingNoteheadTopPos = 59;
            $scope.counterpointChecked = false;

            currentLeftPos = [ 90, 90, 90 ];
            noteIndex = [ 0, 0, 0 ];
            beatIndex = [ 0, 0, 0 ];
            notes = [ [],[],[] ];
            activeStaff = 0;
            targetNote = '';
            connections.connections('remove');
        };

        $scope.toggleActiveStaff = function( staff ) {
            activeStaff = staff;
        };

        $scope.toggleAll = function( show ) {
            $scope.changeDirectionAfterLargeSkip[ 1 ] = show;
            $scope.consecutivePerfect[ 1 ] = show;
            $scope.consecutiveSkips[ 1 ] = show;
            $scope.coverOctave[ 1 ] = show;
            $scope.descendAfterBflat[ 1 ] = show;
            $scope.dissonantOutline[ 1 ] = show;
            $scope.fillInSkips[ 1 ] = show;
            $scope.imperfectStartingOrEndingInterval[ 1 ] = show;
            $scope.incorrectAccidental[ 1 ] = show;
            $scope.incorrectHarmony[ 1 ] = show;
            $scope.incorrectMelody[ 1 ] = show;
            $scope.internalUnison[ 1 ] = show;
            $scope.largerThan12th[ 1 ] = show;
            $scope.largeSkipOnTop[ 1 ] = show;
            $scope.leapIn3rdSpecies[ 1 ] = show;
            $scope.melodic6th[ 1 ] = show;
            $scope.motivicRepetition[ 1 ] = show;
            $scope.outlineOfTritone[ 1 ] = show;
            $scope.overusedVerticalIntervalSecondSpecies[ 1 ] = show;
            $scope.parallelPerfect[ 1 ] = show;
            $scope.perfectApproachedBySimilarMotion[ 1 ] = show;
            $scope.repeatedNoteInBothVoices[ 1 ] = show;
            $scope.repeatedNoteInCounterpoint[ 1 ] = show;
            $scope.repeatedNotes[ 1 ] = show;
            $scope.skippingInBothVoices[ 1 ] = show;
            $scope.skippingToAndFromExtreme[ 1 ] = show;
            $scope.skippingUpToWeakQuarter[ 1 ] = show;
            $scope.slowTrill[ 1 ] = show;
            $scope.surroundSkipWithStepsInOppositeDirection[ 1 ] = show;
            $scope.tempHighOnWeakQuarter[ 1 ] = show;
            $scope.tooManyParallelIntervals[ 1 ] = show;
            $scope.tooMuchChangingDirection[ 1 ] = show;
            $scope.voiceCrossing[ 1 ] = show;
        };

        /* buttons */

        $scope.checkCounterpoint = function() {
            $rootScope.notes = notes;
            checkHorizontallyBeatByBeat();
            checkVerticallyBeatByBeat();
            setRulesHeadings();
            connections.connections( 'update' );
            //createMidiTrack( $rootScope.notes );

            $scope.counterpointChecked = true;
        };

        var createMidiTrack = function( notes ) {
            var trax = [ [] , [], [] ];
            for( var i = 0; i != notes.length; ++i ) {
                for( var j = 0; j != notes[ i ].length; ++j) {
                    trax[ i ][ j ] = MidiEvent.createNote( notes[ i ][ j ][ 0 ], notes[ i ][ j ][ 2 ] );
                }
            }

            var noteEvents = [[],[],[]];
            for (var i = 0; i != 3; ++i) {
                trax[i].forEach(function(note) {
                    Array.prototype.push.apply(noteEvents[i], MidiEvent.createNote(note));
                });
                trax[i] = new MidiTrack({ events: noteEvents[i] });
            }

            // Creates an object that contains the final MIDI track in base64 and some
            // useful methods.
            var song  = MidiWriter({ tracks: [trax[0], trax[1], trax[2]] });

            $scope.songString = song.b64;
        };

        $scope.toggleShowValue = function ( variable, value ) {
            variable[ 1 ] = value;
        };

        /* helpers */

        $scope.getClefName = function( val ) {
            if( val == 'img/trebleclef.png' )
                return 'treble';
            if( val == 'img/altoclef.png' )
                return 'alto';
            if( val == 'img/tenorclef.png' )
                return 'tenor';
            if( val == 'img/bassclef.png' )
                return 'bass';
        };

        $scope.getLeftPos = function( staffNumber ) {
            return currentLeftPos[ staffNumber ];
        };

        $scope.isActiveStaff = function( staff ) {
            return ( ( activeStaff == staff ) || $scope.counterpointChecked ) ? 'activeStaff' : '';
        };

        $scope.showFloatingNotehead = function( value ) {
            $scope.floatingNoteheadTopPos = value;
        };

        /* note actions */

        function addAccidentalToNote( margin, acc, index ) {
            $( $( targetNote )[ 0 ].parentElement).prepend( "<div style='margin-left: " + margin + "px;' class='accidental'><img class='" + 
                                                                 acc + "' src='img/" + acc + ".png'</div>" );
            notes[ activeStaff ][ index ][ 0 ] = notes[ activeStaff ][ index ][ 0 ].concat( acc );
            if( acc == 'sharp' )
                notes[ activeStaff ][ index ][ 1 ]++;    
            else if( acc == 'flat' )
                notes[ activeStaff ][ index ][ 1 ]--;
            else if( acc == 'natural')
                if( ( $rootScope.inputParams.keySignature == 1 ) && ( notes[ activeStaff ][ index ][ 0 ].indexOf( 'b' ) != -1 ) )
                    notes[ activeStaff ][ index ][ 1 ]++;

        };

        /* counterpoint-checking methods */

        /* this method takes the absolute values of the difference between the int values of 2 pairs of notes and returns whether they are the same interval, ignoring quality or 
            enharmonic versions of the intervals (i.e. a diminished-fourth is treated like a major-third) */
        function areSameInterval( intervalA, intervalB ) {
            if( intervalA == intervalB )
                return true;
            else if( ( intervalA == 3 ) || ( intervalA == 4 ) ) {
                if( ( intervalB == 3 ) || ( intervalB == 4 ) )
                    return true;
            }
            else if( ( intervalA == 6 ) || ( intervalA == 6 ) ) {
                if( ( intervalB == 7 ) || ( intervalB == 7 ) )
                    return true;
            }

            return false;
        };

        /*
            Checks for:
            * invalid melodic intervals
            * invalid accidentals
            * too many horizontal repeated notes
            * too many consecutive skips if one is large
            * consecutive skips with larger on top
            * large leaps in 3rd species
            * temporary high point on weak quarter
        */
        function checkHorizontallyBeatByBeat() {
            var numberOfSkips = 0,
                numberOfConsecutiveSkips = 0,
                hadLargeSkip = false,
                isAscending = false,
                numberOfTimesChangedDirections = 0,
                numberOfSteps = 0,
                counterpointStaff = $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ? 1 : 0,
                i, j, k, l, prevNonRestVal, noteEl, classA, classB, diff, tempDiff, note, accEl, nextNote, repeatedNote, firstNoteOfOutline;

            for( i = 0; i < $rootScope.notes.length; ++i ) {
                firstNoteOfOutline = 0;
                for( j = 0; j < $rootScope.notes[ i ].length; ++j ) {
                    if( $rootScope.notes[ i ][ j ][ 1 ] > 0 ) {
                        if( j < ( $rootScope.notes[ i ].length - 1 ) ) {
                            k = j + 1;
                            while( k < ( $rootScope.notes[ i ].length - 1 ) ) {
                                if( $rootScope.notes[ i ][ k ][ 1 ] > 0 ) {
                                    diff = $rootScope.notes[ i ][ k ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ];
                                    break;
                                }
                                ++k;
                            }
                            isAscending = diff > 0;
                            if( $rootScope.inputParams.species == 3 ) {
                                if( ( ( j % 4 ) != 0 ) && ( i == counterpointStaff ) ) {
                                    if( diff > 2 )
                                        markTwoConsecutiveNotes( i, j, 'skippingUpToWeakQuarter' );
                                    k = j - 1;
                                    while( k > 0 ) {
                                        if( $rootScope.notes[ i ][ k ][ 1 ] > 0 ) {
                                            tempDiff = $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ k ][ 1 ];
                                            break;
                                        }
                                        --k;
                                    }
                                    if( (diff < 0 ) && ( ( j > 0 ) && ( tempDiff > 0 ) ) )
                                        markOneNote( i, j, 'tempHighOnWeakQuarter' );
                                }

                                if( j < ( $rootScope.notes[ i ].length - 5 ) ) {
                                    numberOfTimesChangedDirections = ( diff != 0 ) ? 1 : 0;
                                    for( k = 1; k < 5; ++k ) {
                                        if( $rootScope.notes[ i ][ j + k ][ 1 ] > 0 )
                                            prevNonRestVal = $rootScope.notes[ i ][ j + k ][ 1 ];

                                        if( $rootScope.notes[ i ][ j + k + 1 ][ 1 ] > 0 )
                                            diff = $rootScope.notes[ i ][ j + k + 1 ][ 1 ] - prevNonRestVal;

                                        if( diff > 0 ) {
                                            if( !isAscending ) {
                                                ++numberOfTimesChangedDirections;
                                                isAscending = true;
                                            }
                                        }
                                        else {
                                            if( isAscending ) {
                                                ++numberOfTimesChangedDirections;
                                                isAscending = false;
                                            }
                                        }
                                    }
                                }

                                if( numberOfTimesChangedDirections > 3 )
                                    markSixConsecutiveNotes( 'tooMuchChangingDirection', i, j );
                            }

                            if( j > 0 ) {
                                k = j - 1;
                                while( k > 0 ) {
                                    if( $rootScope.notes[ i ][ k ][ 1 ] > 0 ) {
                                        tempDiff = $rootScope.notes[ i ][ k ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ];
                                        break;
                                    }
                                    --k;
                                }
                                k = j + 1;
                                while( k < ( $rootScope.notes[ i ].length - 1 ) ) {
                                    if( $rootScope.notes[ i ][ k ][ 1 ] > 0 ) {
                                        diff = $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ k ][ 1 ];
                                        break;
                                    }
                                    ++k;
                                }
                                if( ( tempDiff * diff ) < 0 ) {
                                    //if there are skips on both sides
                                    if( ( Math.abs( tempDiff ) > 2 ) && ( Math.abs( diff ) > 2 ) )
                                        markThreeConsecutiveNotes( i, j, 'skippingToAndFromExtreme' );
                                }

                                if( j > 1 ) {
                                //if this note is changing direction
                                    if( ( tempDiff * diff ) < 0 ) {
                                        if( $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ firstNoteOfOutline ][ 1 ] == 6 )
                                            markIllegalOutline( i, firstNoteOfOutline, j, 'outlineOfTritone')
                                        firstNoteOfOutline = j;
                                    }
                                }
                            }

                            k = j + 1;
                            while( k < ( $rootScope.notes[ i ].length - 1 ) ) {
                                if( $rootScope.notes[ i ][ k ][ 1 ] > 0 )
                                    break;
                                ++k;
                            }
                            if( !isValidMelodically( $rootScope.notes[ i ][ k ], $rootScope.notes[ i ][ j ] ) ) {
                                diff = Math.abs( $rootScope.notes[ i ][ k ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ] );
                                if( ( diff == 8 ) || ( diff == 9 ) )
                                    markTwoConsecutiveNotes( i, j, 'melodic6th' );
                                else
                                    markTwoConsecutiveNotes( i, j, 'melodic' );
                            }

                            if( $rootScope.notes[ i ][ k ][ 1 ] == $rootScope.notes[ i ][ j ][ 1 ] ) {
                                if( ( $rootScope.inputParams.species > 1 ) && ( $rootScope.inputParams.voiceType[ $rootScope.inputParams.species  - 1 ] == 'Counterpoint' ) )
                                    markTwoConsecutiveNotes( i, j, 'repeatedNoteInCounterpoint' );
                                if( repeatedNote == $rootScope.notes[ i ][ j ][ 1 ] )
                                    markThreeConsecutiveNotes( i, j, 'repeatedNote' );
                                else
                                    repeatedNote = $rootScope.notes[ i ][ j ][ 1 ];
                            }
                            else
                                repeatedNote = 0;

                            if( isSkip( $rootScope.notes[ i ][ k ], $rootScope.notes[ i ][ j ] ) ) {
                                ++numberOfSkips;
                                ++numberOfConsecutiveSkips;
                                if( isLargeSkip( $rootScope.notes[ i ][ k ], $rootScope.notes[ i ][ j ] ) ) {
                                    hadLargeSkip = true;
                                    l = k + 1;
                                    while( l < ( $rootScope.notes[ i ].length - 1 ) ) {
                                        if( $rootScope.notes[ i ][ l ][ 1 ] > 0 )
                                            break;
                                        ++l;
                                    }
                                    if( ( j < ( $rootScope.notes[ i ].length - 2 ) ) &&
                                        ( isSkip( $rootScope.notes[ i ][ l ], $rootScope.notes[ i ][ k ] ) ||
                                          ( isAscending == ( ( $rootScope.notes[ i ][ l ][ 1 ] - $rootScope.notes[ i ][ k ][ 1 ] ) > 0 ) ) ||
                                          ( ( $rootScope.notes[ i ][ l ][ 1 ] - $rootScope.notes[ i ][ k ][ 1 ] ) == 0 )
                                        )
                                      )
                                            markThreeConsecutiveNotes( i, k, 'surroundSkipWithStepsInOppositeDirection' );
                                        if( $rootScope.inputParams.species == 3 )
                                            markTwoConsecutiveNotes( i, j, 'leapIn3rdSpecies' );
                                }
                                if( numberOfConsecutiveSkips > 1 ) {
                                    k = j + 1;
                                    while( k < ( $rootScope.notes[ i ].length - 1 ) ) {
                                        if( $rootScope.notes[ i ][ k ][ 1 ] > 0 ) {
                                            diff = $rootScope.notes[ i ][ k ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ];
                                            break;
                                        }
                                        ++k;
                                    }
                                    k = j - 1;
                                    while( k > 0 ) {
                                        if( $rootScope.notes[ i ][ k ][ 1 ] > 0 ) {
                                            tempDiff = $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ k ][ 1 ];
                                            break;
                                        }
                                        --k;
                                    }
                                    if( tempDiff < diff )
                                        markThreeConsecutiveNotes( i, j, 'largeSkipOnTop' );

                                    if( ( numberOfConsecutiveSkips > 2 ) )
                                        markThreeConsecutiveNotes( i, j, 'consecutiveSkips' );
                                }
                            }
                            else {
                                ++numberOfSteps;
                                numberOfConsecutiveSkips = 0;
                                hadLargeSkip = false;
                            }
                        }
                        else {
                            if( j > 1 ) {
                                if( $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ firstNoteOfOutline ][ 1 ] == 6 )
                                    markIllegalOutline( i, firstNoteOfOutline, j, 'outlineOfTritone')
                            }
                        }
                    }

                    note =  $rootScope.notes[ i ][ j ];

                    if( note[ 0 ].indexOf( 'sharp' ) !== -1 ) {
                        if( note[ 0 ].indexOf( 'c' ) !== -1 ) {
                            if( ( j + 1 ) < $rootScope.notes[ i ].length )
                                nextNote = ( ( j + 1 ) < $rootScope.notes[ i ].length ) ? $rootScope.notes[ i ][ j + 1 ] : undefined;
                            else
                                nextNote = "";

                            if( ( !nextNote[ 0 ] ) || ( nextNote[ 0 ].indexOf( 'd' ) === -1 ) || ( nextNote[ 0 ].indexOf( 'sharp' ) !== -1 ) || 
                                ( nextNote[ 0 ].indexOf( 'flat' ) !== -1 ) || ( nextNote[ 1 ] - note[ 1 ] != 1 ) )
                                    markOneNote( i, j, 'invalidAccidental' )
                        }
                        else
                            markOneNote( i, j, 'invalidAccidental' )
                    }

                    if( note[ 0 ].indexOf( 'flat' ) > 0 ) {
                        if ( ( note[ 0 ].indexOf( 'b' ) === -1 ) && ( note[ 0 ].indexOf( 'e' ) === -1 ) )
                            markOneNote( i, j, 'invalidAccidental' );
                        else if( note[ 0 ].indexOf( 'b' ) !== -1 ) {
                            k = j + 1;
                            while( k < $rootScope.notes.length - 1 ) {
                                if( $rootScope.notes[ i ][ k ][ 1 ] > 0 ) {
                                    break;
                                }
                                ++k;
                            }
                            l = j - 1;
                            while( l > 0 ) {
                                if( $rootScope.notes[ i ][ l ][ 1 ] > 0 ) {
                                    break;
                                }
                                --l;
                            }
                            if( j != 0 ) {
                                if ( !( ( ( note[ 1 ] - $rootScope.notes[ i ][ l ][ 1 ] ) == 1 ) || ( ( note[ 1 ] - $rootScope.notes[ i ][ l ][ 1 ] ) == 5 ) ) )
                                    markOneNote( i, j, 'invalidAccidental' );
                            }
                            if( ( j < ( $rootScope.notes[ i ].length - 2 ) ) && ( $rootScope.inputParams.keySignature != 1 ) ) {
                                if( $rootScope.notes[ i ][ k ][ 1 ] > $rootScope.notes[ i ][ j ][ 1 ] )
                                    markTwoConsecutiveNotes( i, j, 'descendAfterBflat' )
                            }
                        }
                        else if( note[ 0 ].indexOf( 'e' ) !== -1 ) {
                            if( $rootScope.inputParams.keySignature != 1 )
                                markOneNote( i, j, 'invalidAccidental' );
                            else if( j != 0) {
                                if ( !( ( ( note[ 1 ] - $rootScope.notes[ i ][ l ][ 1 ] ) == 1 ) ||
                                                                                    ( ( note[ 1 ] - $rootScope.notes[ i ][ l ][ 1 ] ) == 5 ) ) )
                                    markOneNote( i, j, 'invalidAccidental' );
                            }
                            if( j < ( $rootScope.notes[ i ].length - 2 ) ) {
                                if( $rootScope.notes[ i ][ k ][ 1 ] > $rootScope.notes[ i ][ j ][ 1 ] )
                                    markTwoConsecutiveNotes( i, j, 'descendAfterBflat' )
                            }
                        }
                    }

                    if( note[ 0 ].indexOf( 'natural' ) > 0 ) {
                        if( note[ 0 ].indexOf( 'b' ) !== -1 ) {
                            if( $rootScope.inputParams.keySignature == 1)
                                markOneNote( i, j, 'invalidAccidental' );
                        }
                    }
                }

                numberOfConsecutiveSkips = 0;
                hadLargeSkip = false;
            }

            if( numberOfSteps < numberOfSkips )
                $scope.hasTooManySkips[ 0 ] = true;
            else if( $rootScope.inputParams.species == 3 ) {
                if( numberOfSteps < ( numberOfSkips * 4 ) )
                    $scope.hasTooManySkips[ 0 ] = true;
            }
        };

        /*
            Checks for:
            * Parallel perfect intervals
            * Direct perfect intervals
            * Voice crossing
            * Invalid harmonic intervals
            * Approach of perfect intervals by similar motion
            * No more than 4 consecutive parallels
            * Perfect first and last intervals
            * Equality of length of voices
            * Nothing wider than a 12th
            * Internal unisons
        */

        function checkVerticallyBeatByBeat() {
            if( $rootScope.inputParams.numberOfVoices < 2 )
                return;

            var i = 0,
                j = 0,
                beatOfI = 0,
                beatOfJ = 0,
                prevWasFifth = false,
                prevWasOctave = false,
                prevWasUnison = false,
                prevInterval = -1,
                numberOfParallelIntervals = 1,
                counterpointStaff = $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ? 1 : 0,
                currInterval, note, classA, classB, prevNeighbor;

            while( ( i < $rootScope.notes[ 0 ].length ) && ( j < $rootScope.notes[ 1 ].length ) ) {
                if( ( $rootScope.notes[ 0 ][ i ][ 1 ] > 0 ) && ( $rootScope.notes[ 0 ][ j ][ 1 ] > 0 ) ) {
                    checkVoiceCrossing( i, j );

                    if( !isConsonantHarmonically( $rootScope.notes[ 0 ][ i ], $rootScope.notes[ 1 ][ j ] ) ) {
                        if( isStrongBeat( i, j ) )
                            markHarmony( 'harmonic', i, j );
                        else if( !isPassing( i, j ) ) {
                            if( $rootScope.inputParams.species == 2 )
                                markHarmony( 'harmonic', i, j );
                            else if( $rootScope.inputParams.species == 3 ) {
                                if( !isLowerNeighbor( i, j ) && !isCambiata( i, j ) && !isEchappee( i, j ) && isDoubleNeighbor( i, j ) )
                                    markHarmony( 'harmonic', i, j );
                                else {
                                    if( ( counterpointStaff == 0 ) && ( $rootScope.notes[ counterpointStaff ][ i ][ 0 ] == prevNeighbor ) ||
                                        ( counterpointStaff == 1 ) && ( $rootScope.notes[ counterpointStaff ][ j ][ 0 ] == prevNeighbor ) ) {
                                        markFourConsecutiveNotes( 'slowTrill', counterpointStaff, i, j );
                                    }
                                    else {
                                        if( counterpointStaff == 0 )
                                            prevNeighbor = $rootScope.notes[ counterpointStaff ][ i ][ 0 ];
                                        else
                                            prevNeighbor = $rootScope.notes[ counterpointStaff ][ j ][ 0 ];
                                    }
                                }
                            }
                        }
                        else
                            prevNeighbor = '';

                    }
                    else if( !isStrongBeat( i, j ) )
                        prevNeighbor = '';

                    if( ( beatOfI == 0 ) || ( beatOfJ == 0 ) ) {
                        if( Math.abs( notes[ 0 ][ i ][ 1 ] - notes[ 1 ][ j ][ 1 ] ) > 16 )
                            markHarmony( 'largerThan12th', i, j );

                        if( ( beatOfI == 0 ) && ( beatOfJ == 0 ) ) {
                            currInterval = Math.abs( notes[ 0 ][ i ] [ 1 ] - notes[ 1 ][ j ][ 1 ] );
                            if( areSameInterval( currInterval, prevInterval ) ) {
                                ++numberOfParallelIntervals;
                                if( numberOfParallelIntervals > 4 )
                                    markConsecutiveVerticalIntervals( 'tooManyParallelIntervals', i, j );
                            }
                            prevInterval = currInterval;
                        }
                        else {
                            numberOfParallelIntervals = 0;
                            prevInterval = -1;
                            currInterval = -1;
                        }

                        if( notes[ 0 ][ i ] [ 1 ] == notes[ 1 ][ j ][ 1 ] ) {
                            if( isStrongBeat( i, j ) ) {
                                markHarmony( 'internalUnison', i, j );
                                if( isApproachedBySimilarMotion( i, j ) )
                                    markConsecutiveVerticalIntervals( 'perfectApproachedBySimilarMotion', i, j );
                            }

                            if( prevWasOctave || prevWasFifth ) {
                                markConsecutiveVerticalIntervals( 'consecutivePerfect', i, j );
                                prevWasUnison = true;
                            }
                            else if( prevWasUnison )
                                markConsecutiveVerticalIntervals( 'parallelPerfect', i, j )
                            else
                                prevWasUnison = true;

                            prevWasOctave = false;
                            prevWasFifth = false;
                        }
                        else if( ( ( notes[ 0 ][ i ][ 1 ] - notes[ 1 ][ j ][ 1 ] ) % 7 ) == 0 ) {
                            if( isStrongBeat( i, j ) && isApproachedBySimilarMotion( i, j ) )
                                markConsecutiveVerticalIntervals( 'perfectApproachedBySimilarMotion', i, j );

                            if( prevWasOctave || prevWasUnison ) {
                                markConsecutiveVerticalIntervals( 'consecutivePerfect', i, j );
                                prevWasFifth = true;
                            }
                            else if( prevWasFifth ) 
                                markConsecutiveVerticalIntervals( 'parallelPerfect', i, j )
                            else
                                prevWasFifth = true;

                            prevWasOctave = false;
                            prevWasUnison = false;
                        }
                        else if( ( ( notes[ 0 ][ i ][ 1 ] - notes[ 1 ][ j ][ 1 ] ) % 12 ) == 0 )  {
                            if( isStrongBeat( i, j ) && isApproachedBySimilarMotion( i, j ) )
                                markConsecutiveVerticalIntervals( 'perfectApproachedBySimilarMotion', i, j );

                            if( prevWasFifth || prevWasUnison ) {
                                markConsecutiveVerticalIntervals( 'consecutivePerfect', i, j );
                                prevWasOctave = true;
                            }
                            else if( prevWasOctave ) 
                                markConsecutiveVerticalIntervals( 'parallelPerfect', i, j )
                            else
                                prevWasOctave = true;

                            prevWasFifth = false;
                            prevWasUnison = false;
                        }
                        else {
                            prevWasFifth = false;
                            prevWasOctave = false;
                            prevWasUnison = false;
                        }
                    }

                    if( notes[ 0 ][ i ][ 2 ] == 'whole' ) {
                        if( beatOfI == 3 ) {
                            beatOfI = 0;
                            ++i;
                        }
                        else
                            ++beatOfI;
                    }
                    else if( notes[ 0 ][ i ][ 2 ] == 'half' ) {
                        if( beatOfI == 1 ) {
                            beatOfI = 0;
                            ++i;
                        }
                        else
                            ++beatOfI;
                    }
                    else
                       ++i;

                    if( notes[ 1 ][ j ][ 2 ] == 'whole' ) {
                        if( beatOfJ == 3 ) {
                            beatOfJ = 0;
                            ++j;
                        }
                    else
                        ++beatOfJ;
                    }
                    else if( notes[ 1 ][ j ][ 2 ] == 'half' ) {
                        if( beatOfJ == 1 ) {
                            beatOfJ = 0;
                            ++j;
                        }
                    else
                        ++beatOfJ;
                    }
                    else
                        ++j;
                }

            }

            if( ( notes[ 0 ].length < 1 ) || ( notes[ 1 ].length < 1 ) ) {
                $scope.unequalNumberOfBeats[ 0 ] = true;
                return;
            }

            if( !isPerfectInterval( notes[ 0 ][ 0 ], notes[ 1 ][ 0 ] ) )
                markHarmony( 'imperfectStartingOrEndingInterval', 0, 0 );
            if( !isPerfectInterval( notes[ 0 ][ $rootScope.notes[ 0 ].length - 1 ], notes[ 1 ][ $rootScope.notes[ 1 ].length - 1 ] ) )
                markHarmony( 'imperfectStartingOrEndingInterval', $rootScope.notes[ 0 ].length - 1, $rootScope.notes[ 1 ].length - 1 );

            if( beatIndex[ 0 ] !=  beatIndex[ 1 ] )
                $scope.unequalNumberOfBeats[ 0 ] = true;
        };

        function checkSpacing() {
            var i = 0,
                j = 0,
                beatOfI = 0,
                beatOfJ = 0,
                marginOfI = 90,
                marginOfJ = 90,
                topNote, bottomNote, acc;

            if( $rootScope.inputParams.numberOfVoices < 2 ) {
                while( i < notes[ 0 ].length ) {
                    topNote = $( document.querySelector( '[data-note-index="' + ( i ) + '"][data-staff-index="0"]' ) );
                    if( beatOfI == 0 ) {
                        if( topNote.hasClass( 'hasAccidental' ) ) {
                            marginOfI += 20;
                            acc = topNote[ 0 ].previousElementSibling;
                            $( acc )[ 0 ].style = 'margin-left: ' + ( marginOfI - 105 ) + 'px;';
                        }
                        topNote[ 0 ].style.marginLeft = marginOfI + 'px';
                        marginOfI += 40;
                    }

                    if( i < notes[ 0 ].length ) {
                        if( notes[ 0 ][ i ][ 2 ] == 'whole' ) {
                            if( beatOfI == 3 ) {
                                beatOfI = 0;
                                ++i;
                            }
                            else
                                ++beatOfI;
                        }
                        else if( notes[ 0 ][ i ][ 2 ] == 'half' ) {
                            if( beatOfI == 1 ) {
                                beatOfI = 0;
                                ++i;
                            }
                            else
                                ++beatOfI;
                        }
                        else
                           ++i;
                    }

                    if( i == notes[ 0 ].length )
                        currentLeftPos[ 0 ] = marginOfI;
                }
                return;
            }

            while( ( i < notes[ 0 ].length ) || ( j < notes[ 1 ].length ) ) {
                topNote = $( document.querySelector( '[data-note-index="' + ( i ) + '"][data-staff-index="0"]' ) );
                bottomNote = $( document.querySelector( '[data-note-index="' + ( j ) + '"][data-staff-index="1"]' ) );
                if( ( ( beatOfI == 0 ) && ( i < notes[ 0 ].length ) && topNote.hasClass( 'hasAccidental' ) ) ||
                    ( ( beatOfJ == 0 ) && ( i < notes[ 1 ].length ) && bottomNote.hasClass( 'hasAccidental' ) ) ) {
                    marginOfI += 20;
                    marginOfJ += 20;
                }
                if( ( beatOfI == 0 ) && ( i < notes[ 0 ].length ) ) {
                    if( beatOfJ != 0 )
                        marginOfJ += 40;
                    topNote[ 0 ].style.marginLeft = marginOfI + 'px';
                    if( topNote.hasClass( 'hasAccidental' ) ) {
                        acc = topNote[ 0 ].previousElementSibling;
                        $( acc )[ 0 ].style = 'margin-left: ' + ( marginOfI - 105 ) + 'px;';
                    }
                    marginOfI += 40;
                }
                if( ( beatOfJ == 0 ) && ( j < notes[ 1 ].length ) ) {
                    if( beatOfI != 0 )
                        marginOfI += 40;
                    bottomNote[ 0 ].style.marginLeft = marginOfJ + 'px';
                    if( bottomNote.hasClass( 'hasAccidental' ) ) {
                        acc = bottomNote[ 0 ].previousElementSibling;
                        $( acc )[ 0 ].style = 'margin-left: ' + ( marginOfJ - 105 ) + 'px;';
                    }
                    marginOfJ += 40;
                }

                if( i < notes[ 0 ].length ) {
                    if( notes[ 0 ][ i ][ 2 ] == 'whole' ) {
                        if( beatOfI == 3 ) {
                            beatOfI = 0;
                            ++i;
                        }
                        else
                            ++beatOfI;
                    }
                    else if( notes[ 0 ][ i ][ 2 ] == 'half' ) {
                        if( beatOfI == 1 ) {
                            beatOfI = 0;
                            ++i;
                        }
                        else
                            ++beatOfI;
                    }
                    else
                       ++i;
                }

                if( j < notes[ 1 ].length ) {
                    if( notes[ 1 ][ j ][ 2 ] == 'whole' ) {
                        if( beatOfJ == 3 ) {
                            beatOfJ = 0;
                            ++j;
                        }
                        else
                            ++beatOfJ;
                    }
                    else if( notes[ 1 ][ j ][ 2 ] == 'half' ) {
                        if( beatOfJ == 1 ) {
                            beatOfJ = 0;
                            ++j;
                        }
                        else
                            ++beatOfJ;
                    }
                    else
                       ++j;
                }

                if( i == notes[ 0 ].length )
                    currentLeftPos[ 0 ] = marginOfI;
                if( j == notes[ 1 ].length )
                    currentLeftPos[ 1 ] = marginOfJ;
            }
        };

        function checkVoiceCrossing( firstNoteIndex, secondNoteIndex ) {
            var note, classA, classB;

            if( firstNoteIndex < $rootScope.notes[ 0 ].length && secondNoteIndex < $rootScope.notes[ 1 ].length ) {
                if( isVoiceCrossing( $rootScope.notes[ 0 ][ firstNoteIndex ], $rootScope.notes[ 1 ][ secondNoteIndex ] ) ) {
                    note = $( document.querySelector( '[data-note-index="' + firstNoteIndex + '"][data-staff-index="' + 0 + '"]' ) );
                    classA = "voiceCrossing" + connectionNumber++;
                    classB = "voiceCrossing" + connectionNumber++;
                    note.addClass( classA );
                    note = $( document.querySelector( '[data-note-index="' + secondNoteIndex + '"][data-staff-index="' + 1 + '"]' ) );
                    note.addClass( classB );
                    $( '.' + classA ).connections( { to: '.' + classB, 'class': 'connections voiceCrossing' } );
                    $scope.voiceCrossing[ 0 ] = true;
                }
            }
        };

        function isApproachedBySimilarMotion( topNoteIndex, bottomNoteIndex ) {
            if( ( topNoteIndex < 1 ) || ( bottomNoteIndex < 1 ) )
                return;

            var firstTopNote = notes[ 0 ][ topNoteIndex - 1 ],
                secondTopNote = notes[ 0 ][ topNoteIndex ],
                firstBottomNote = notes[ 1 ][ bottomNoteIndex - 1 ],
                secondBottomNote = notes[ 1 ][ bottomNoteIndex ];

            if( ( firstTopNote[ 1 ] * firstBottomNote[ 1 ] * secondTopNote[ 1 ] * secondBottomNote[ 1 ] ) < 0 )
                return false;

            if( ( secondTopNote[ 1 ] - firstTopNote[ 1 ] ) < 0 ) {
                if( ( secondBottomNote[ 1 ] - firstBottomNote[ 1 ] ) < 0 )
                    return true;
                else
                    return false;
            }

            if( ( secondTopNote[ 1 ] - firstTopNote[ 1 ] ) > 0 ) {
                if( ( secondBottomNote[ 1 ] - firstBottomNote[ 1 ] ) > 0 )
                    return true;
                else
                    return false;
            }

            return false;
        };

        function isConsonantHarmonically( topNote, bottomNote ) {
            if( ( topNote[ 1 ] * bottomNote [ 1 ] ) < 0 )
                return true;

            var diff = topNote[ 1 ] - bottomNote[ 1 ],
                validityTable = [ 
                                    [ 0, 0 ], [ 3, -5 ], [ 3, 2 ], [ 4, -5 ], [ 4, 2 ], [ 7, -3 ], [ 7, 4 ], [ 8, -2 ], [ 8, 5 ], [ 9, -2 ], 
                                    [ 9, 5 ], [ 12, 0 ]
                                ],
                i = 0,
                swap = ( diff < 0 );

            diff %= 12;
            if( diff < 0 )
                diff *= -1;

            while( i < validityTable.length ) {
                if( diff == validityTable[ i ][ 0 ] ) {
                    if( swap ) {
                        if( $rootScope.getAsciiDiff( bottomNote[ 0 ].charAt( 0 ), topNote[ 0 ].charAt( 0 ) ) == validityTable[ i ][ 1 ] )
                            return true;
                    }
                    else {
                        if( $rootScope.getAsciiDiff( topNote[ 0 ].charAt( 0 ), bottomNote[ 0 ].charAt( 0 ) ) == validityTable[ i ][ 1 ] )
                            return true;
                    }
                    
                    if( validityTable[ i ][ 0 ] > diff )
                        return false;
                }
                ++i;
            }

            return false;
        };

        /*
            Returns whether an interval is a perfect 5th or octave (omits 4th)
        */
        function isPerfectInterval( topNote, bottomNote ) {
            if( ( topNote[ 1 ] * bottomNote [ 1 ] ) < 0 )
                return false;

            var diff = ( topNote[ 1 ] - bottomNote[ 1 ] ),
                validityTable = [
                                    [ -12, 0 ], [ -7, -4 ], [ -7, 3 ], [ 0, 0 ], [ 7, -3 ], [ 7, 4 ], [ 12, 0 ]
                                ],
                i = 0,
                swap = ( diff < 0 );

            diff %= 12;
            if( diff < 0 )
                diff *= -1;

            while( i < validityTable.length ) {
                if( diff == validityTable[ i ][ 0 ] ) {
                    if( swap ) {
                        if( $rootScope.getAsciiDiff( bottomNote[ 0 ].charAt( 0 ), topNote[ 0 ].charAt( 0 ) ) == validityTable[ i ][ 1 ] )
                            return true;
                    }
                    else {
                        if( $rootScope.getAsciiDiff( topNote[ 0 ].charAt( 0 ), bottomNote[ 0 ].charAt( 0 ) ) == validityTable[ i ][ 1 ] )
                            return true;
                    }

                    if( validityTable[ i ][ 0 ] > diff )
                        return false;
                }
                ++i;
            }

            return false;
        }

        function isValidMelodically( secondNote, firstNote ) {
            if( ( firstNote[ 1 ] * secondNote [ 1 ] ) < 0 )
                return true;

            var diff = secondNote[ 1 ] - firstNote[ 1 ],
                validityTable = [ 
                                    [ -12, 0 ], [ -7, -4 ], [ -7, 3 ], [ -5, 4 ], [ -5, -3 ], [ -4, 5 ], [ -4, -2 ], [ -3, -5 ], [ -3, -2 ], 
                                    [ -3, 5 ], [-2, 6 ], [ -2, -1 ], [ -1, -6 ], [ -1, -1 ], [ 0, 0 ], [ 1, -6 ], [ 1, 1 ], [ 2, -6 ], [ 2, 1 ], 
                                    [ 3, -5 ], [ 3, 2 ], [ 4, -5 ], [ 4, 2 ], [ 5, -4 ], [ 5, 3 ], [ 7, -3 ], [ 7, 4 ], [ 8, -2 ], [ 8, 5 ], 
                                    [ 12, 0 ] 
                                ],
                i = 0;

            while( i < validityTable.length ) {
                if( diff == validityTable[ i ][ 0 ] ) {
                    if( $rootScope.getAsciiDiff( secondNote[ 0 ].charAt( 0 ), firstNote[ 0 ].charAt( 0 ) ) == validityTable[ i ][ 1 ] )
                        return true;
                    if( validityTable[ i ][ 0 ] > diff )
                        return false;
                }
                ++i;
            }

            return false;
        };

        function isLargeSkip( secondNote, firstNote ) {
            if( ( secondNote[ 1 ] * firstNote [ 1 ] ) < 0 )
                return false;

            if( ( Math.abs( $rootScope.getAsciiDiff( secondNote[ 0 ].charAt( 0 ), firstNote[ 0 ].charAt( 0 ) ) ) <= 2 ) || 
                ( (secondNote[ 0 ].charAt( 0 ) == 'g' ) && ( firstNote[ 0 ].charAt( 0 ) == 'a' ) ) ||
                ( (secondNote[ 0 ].charAt( 0 ) == 'a' ) && ( firstNote[ 0 ].charAt( 0 ) == 'g' ) ) ||
                ( (secondNote[ 0 ].charAt( 0 ) == 'f' ) && ( firstNote[ 0 ].charAt( 0 ) == 'a' ) ) ||
                ( (secondNote[ 0 ].charAt( 0 ) == 'a' ) && ( firstNote[ 0 ].charAt( 0 ) == 'f' ) ) ||
                ( (secondNote[ 0 ].charAt( 0 ) == 'g' ) && ( firstNote[ 0 ].charAt( 0 ) == 'b' ) ) ||
                ( (secondNote[ 0 ].charAt( 0 ) == 'b' ) && ( firstNote[ 0 ].charAt( 0 ) == 'g' ) )
              ) {
                if( Math.abs( secondNote[ 1 ] - firstNote[ 1 ] ) < 6 )
                    return false;
            }

            return true;
        };

        function isSkip( secondNote, firstNote ) {
            if( ( secondNote[ 1 ] * firstNote [ 1 ] ) < 0 )
                return false;

            if( ( Math.abs( $rootScope.getAsciiDiff( secondNote[ 0 ].charAt( 0 ), firstNote[ 0 ].charAt( 0 ) ) ) <= 1 ) || 
                ( (secondNote[ 0 ].charAt( 0 ) == 'g' ) && ( firstNote[ 0 ].charAt( 0 ) == 'a' ) ) ||
                ( (secondNote[ 0 ].charAt( 0 ) == 'a' ) && ( firstNote[ 0 ].charAt( 0 ) == 'g' ) )
              ) {
                if( Math.abs( secondNote[ 1 ] - firstNote[ 1 ] ) < 4 )
                    return false;
            }

            return true;
        };

        function isVoiceCrossing( topNote, bottomNote ) {
            return ( ( topNote[ 1 ] - bottomNote[ 1 ] ) < 0 );
        };

        /* marking methods */

        function markConsecutiveVerticalIntervals( className, i, j ) {
            var note = $( document.querySelector( '[data-note-index="' + i + '"][data-staff-index="' + 0 + '"]' ) ),
                classA = className + connectionNumber++,
                classB = className + connectionNumber++,
                classC = className + connectionNumber++,
                classD = className + connectionNumber++;

            note.addClass( classA + ' ' + className );
            note = $( document.querySelector( '[data-note-index="' + ( i - 1 ) + '"][data-staff-index="' + 0 + '"]' ) );
            note.addClass( classB + ' ' + className );

            note = $( document.querySelector( '[data-note-index="' + j + '"][data-staff-index="' + 1 + '"]' ) );

            note.addClass( classC + ' ' + className );
            note = $( document.querySelector( '[data-note-index="' + ( j - 1 ) + '"][data-staff-index="' + 1 + '"]' ) );
            note.addClass( classD + ' ' + className );

            $( '.' + classA ).connections( { to: '.' + classC, 'class': 'connections ' + className } );
            $( '.' + classB ).connections( { to: '.' + classD, 'class': 'connections ' + className } );

            if( className == 'tooManyParallelIntervals' ) {
                note = $( document.querySelector( '[data-note-index="' + ( i - 2 ) + '"][data-staff-index="' + 0 + '"]' ) ),
                    classA = className + connectionNumber++,
                    classB = className + connectionNumber++,
                    classC = className + connectionNumber++,
                    classD = className + connectionNumber++;

                note.addClass( classA + ' ' + className );
                note = $( document.querySelector( '[data-note-index="' + ( i - 3 ) + '"][data-staff-index="' + 0 + '"]' ) );
                note.addClass( classB + ' ' + className );

                note = $( document.querySelector( '[data-note-index="' + ( j - 2 ) + '"][data-staff-index="' + 1 + '"]' ) );

                note.addClass( classC + ' ' + className );
                note = $( document.querySelector( '[data-note-index="' + ( j - 3 ) + '"][data-staff-index="' + 1 + '"]' ) );
                note.addClass( classD + ' ' + className );

                $( '.' + classA ).connections( { to: '.' + classC, 'class': 'connections ' + className } );
                $( '.' + classB ).connections( { to: '.' + classD, 'class': 'connections ' + className } );
            }

            if( className == 'parallelPerfect')
                $scope.parallelPerfect[ 0 ] = true;
            else if( className == 'consecutivePerfect' )
                $scope.consecutivePerfect[ 0 ] = true;
            else if( className == 'perfectApproachedBySimilarMotion' )
                $scope.perfectApproachedBySimilarMotion[ 0 ] = true;
            else if( className == 'tooManyParallelIntervals' )
                $scope.tooManyParallelIntervals[ 0 ] = true;
        };

        function markHarmony( className, i, j ) {
            var note = $( document.querySelector( '[data-note-index="' + i + '"][data-staff-index="' + 0 + '"]' ) );
                classA = className + connectionNumber++,
                classB = className + connectionNumber++;

            note.addClass( classA );
            note = $( document.querySelector( '[data-note-index="' + j + '"][data-staff-index="' + 1 + '"]' ) );
            note.addClass( classB );
            $( '.' + classA ).connections( { to: '.' + classB, 'class': 'connections ' + className } );

            if( className == 'harmonic' )
                $scope.incorrectHarmony[ 0 ] = true;
            else if( className == 'imperfectStartingOrEndingInterval' )
                $scope.imperfectStartingOrEndingInterval[ 0 ] = true;
            else if( className == 'largerThan12th' )
                $scope.largerThan12th[ 0 ] = true;
            else if( className == 'internalUnison' )
                $scope.internalUnison[ 0 ] = true;
        };

        function markOneNote( i, j, className ) {
            var targetEl = $( document.querySelector( '[data-note-index="' + j + '"][data-staff-index="' + i + '"]' ) );

            if( className == 'invalidAccidental' ) {
                if( $( $( $( targetEl )[ 0 ].previousElementSibling )[ 0 ] )[ 0 ] ) {
                    targetEl = $( $( $( $( targetEl )[ 0 ].previousElementSibling )[ 0 ] )[ 0 ].firstElementChild );
                }
            }

            $( targetEl ).addClass( className );

            if( className == 'invalidAccidental' )
                $scope.incorrectAccidental[ 0 ] = true;
            if( className == 'tempHighOnWeakQuarter' )
                $scope.tempHighOnWeakQuarter[ 0 ] = true;
        };

        function markThreeConsecutiveNotes( i, j, className) {
            var noteEl;

            for( k = -1; k < 2; k++) {
                noteEl = $( document.querySelector( '[data-note-index="' + ( j + k ) + '"][data-staff-index="' + i + '"]' ) );
                noteEl.addClass( className );
            }

            if( className == 'repeatedNote')
                $scope.repeatedNotes[ 0 ] = true;
            else if( className == 'consecutiveSkips' )
                $scope.consecutiveSkips[ 0 ] = true;
            else if( className == 'largeSkipOnTop' )
                $scope.largeSkipOnTop[ 0 ] = true;
            else if( className == 'skippingToAndFromExtreme' )
                $scope.skippingToAndFromExtreme[ 0 ] = true;
            else if( className == 'surroundSkipWithStepsInOppositeDirection' )
                $scope.surroundSkipWithStepsInOppositeDirection[ 0 ] = true;
        };

        function markFourConsecutiveNotes( className, staffNumber, i, j ) {
            var index = staffNumber == 0 ? i : j,
                noteEl;

            for( k = -3; k < 1; k++) {
                noteEl = $( document.querySelector( '[data-note-index="' + ( index + k ) + '"][data-staff-index="' + staffNumber + '"]' ) );
                noteEl.addClass( className );
            }

            if( className == 'slowTrill')
                $scope.slowTrill[ 0 ] = true;
        };

        function markSixConsecutiveNotes( className, i, j ) {
            var noteEl;

            for( k = 0; k < 6; k++) {
                noteEl = $( document.querySelector( '[data-note-index="' + ( j + k ) + '"][data-staff-index="' + i + '"]' ) );
                noteEl.addClass( className );
            }

            if( className == 'tooMuchChangingDirection')
                $scope.tooMuchChangingDirection[ 0 ] = true;
        };

        function markTwoConsecutiveNotes( i, j, className ) {
            var noteEl = $( document.querySelector( '[data-note-index="' + ( j + 1 ) + '"][data-staff-index="' + i + '"]' ) ),
                classA = className + connectionNumber++,
                classB = className + connectionNumber++;

            noteEl.addClass( classA );
            noteEl = $( document.querySelector( '[data-note-index="' + j + '"][data-staff-index="' + i + '"]' ) );
            noteEl.addClass( className );
            noteEl.addClass( classB );
            $( '.' + classA ).connections( { to: '.' + classB, 'class': 'connections ' + className } );
            noteEl.addClass( className );

            if( className == 'melodic' )
                $scope.incorrectMelody[ 0 ] = true;
            else if( className == 'melodic6th' )
                $scope.melodic6th[ 0 ] = true;
            else if( className == 'repeatedNoteInCounterpoint' )
                $scope.repeatedNoteInCounterpoint[ 0 ] = true;
            else if( className == 'leapIn3rdSpecies' )
                $scope.leapIn3rdSpecies[ 0 ] = true;
            else if( className == 'skippingUpToWeakQuarter' )
                $scope.skippingUpToWeakQuarter[ 0 ] = true;
            else if( className == 'descendAfterBflat' )
                $scope.descendAfterBflat[ 0 ] = true;
        };

        function markIllegalOutline( i, j, k, className ) {
            var noteEl = $( document.querySelector( '[data-note-index="' + j + '"][data-staff-index="' + i + '"]' ) ),
                classA = className + connectionNumber++,
                classB = className + connectionNumber++;

            noteEl.addClass( classA );
            noteEl = $( document.querySelector( '[data-note-index="' + k + '"][data-staff-index="' + i + '"]' ) );
            noteEl.addClass( classB );
            $( '.' + classA ).connections( { to: '.' + classB, 'class': 'connections ' + className } );

            if( className == 'outlineOfTritone' )
                $scope.outlineOfTritone[ 0 ] = true;
        };

        /* helpers */

        function getNoteFromDurationAndValue( dur, val, isRest, clef ) {
            if( isRest ) {
                if( dur == 'quarter' )
                    return 'quarterrest';
                else if( dur == 'half' )
                    return 'halfrest';
                else if( dur == 'whole' )
                    return 'wholerest';
            }
            if( dur == 'quarter' ) {
                if( clef == 'img/trebleclef.png' ) {
                    if( val < 33 )
                        return 'quarterup';
                    else
                        return 'quarterdown';
                }
                else if( clef == 'img/altoclef.png' ) {
                    if( val < 22 )
                        return 'quarterup';
                    else
                        return 'quarterdown';
                }
                else if( clef == 'img/tenorclef.png' ) {
                    if( val < 19 )
                        return 'quarterup';
                    else
                        return 'quarterdown';
                }
                else {
                    if( val < 12 )
                        return 'quarterup';
                    else
                        return 'quarterdown';
                }
            }
            if( dur == 'half' ) {
                if( clef == 'img/trebleclef.png' ) {
                    if( val < 33 )
                        return 'halfup';
                    else
                        return 'halfdown';
                }
                else if( clef == 'img/altoclef.png' ) {
                    if( val < 22 )
                        return 'halfup';
                    else
                        return 'halfdown';
                }
                else if( clef == 'img/tenorclef.png' ) {
                    if( val < 19 )
                        return 'halfup';
                    else
                        return 'halfdown';
                }
                else {
                    if( val < 12 )
                        return 'halfup';
                    else
                        return 'halfdown';
                }
            }
            else
                return 'whole';
        };

        function insertPreComposedNote( value, staffNumber ) {
            var notesConversion = [
                                    [ 24, 130, '.d4', false ], [ 26, 119, '.e4', false ], [ 27, 108, '.f4', false ], [ 29, 97, '.g4', false ], 
                                    [ 31, 86, '.a4', false ], [ 33, 75, '.b4', false ], [ 34, 64, '.c5', false ], [ 35, 64, '.c5', true ], 
                                    [ 36, 53, '.d5', false ], [ 38, 42, '.e5', false ], [ 39, 31, '.f5', false ], [ 41, 20, '.g5', false ],
                                    [ 43, 9, '.a5', false ]
                                  ],
                noteIndex = -1,
                i = 0,
                myEl, classname;

            while( noteIndex < 0 ) {
                if( notesConversion[ i ][ 0 ] == value )
                    noteIndex = i;
                ++i;
                if( i > notesConversion.length ) {
                    console.log("invalid note value: " + value);
                    return;
                }
            }

            classname = 'space hoverable ' + notesConversion[ noteIndex ][ 2 ];
            myEl = angular.element( document.querySelectorAll( '.composed' )[ staffNumber ].querySelector( notesConversion[ noteIndex ][ 2 ] ) );
            if( notesConversion[ noteIndex ][ 3 ] ) {
                myEl.append( "<div class='accidental' style='margin-left:" + ( currentLeftPos[ staffNumber ] - 76 ) + 
                             "px;'><img src='img/sharp.png'></div>" );
                currentLeftPos[ staffNumber ] += 20;
            }
            myEl.append( "<div class='notehead static' style='margin-left:" + ( currentLeftPos[ staffNumber ] ) + "px; top: " + 
                         ( notesConversion[ noteIndex ][ 1 ] + ( 300 * staffNumber ) ) + "px;'><img src='img/whole.png'></div>" );
            currentLeftPos[ staffNumber ] += 20;
        };

        /*
            Checks if this note in the counterpoint is a cambiata - is preceded by step in one direction and folowed by third tthen step in other direction
        */
        function isCambiata( topVoiceBeat, bottomVoiceBeat ) {
            var beatInCp = topVoiceBeat,
                cpStaff = 0;

            if( $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ) {
                beatInCp = bottomVoiceBeat;
                cpStaff = 1;
            }

            if( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) < 0 )
                return false;


            if( Math.abs( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) < 3 ) {
                if( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) < 0 ) {
                    if( ( ( beatInCp + 1 ) < $rootScope.notes[ cpStaff ].length ) &&
                        ( ( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] ) == -3 ) ||
                          ( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] ) == -4 ) )
                      )
                    {
                        if( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] ) < 0 )
                            return false;

                            if( ( ( beatInCp + 2 ) < $rootScope.notes[ cpStaff ].length ) &&
                            ( ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == 2 ) ||
                              ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == 1 ) )
                          ) {
                                if( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) < 0 )
                                        return false;
                                return true;
                            }
                    }
                }
            }
            return false;
        };

        /*
            Checks if this note in the counterpoint is an echappee - is preceded by step in one direction and folowed by a leap in the opposite direction,
            and then resolved by step in the first direction
        */
        function isEchappee( topVoiceBeat, bottomVoiceBeat ) {
            var beatInCp = topVoiceBeat,
                cpStaff = 0;

            if( $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ) {
                beatInCp = bottomVoiceBeat;
                cpStaff = 1;
            }

            if( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) < 0 )
                return false;

            if( Math.abs( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) < 3 ) {
                if( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) < 0 ) {
                    if( ( ( beatInCp + 1 ) < $rootScope.notes[ cpStaff ].length ) &&
                        ( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] ) >= 3 )
                      )
                    {
                        if( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] ) < 0 )
                            return false;
                        if( ( ( beatInCp + 2 ) < $rootScope.notes[ cpStaff ].length ) &&
                            ( ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == -2 ) ||
                              ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == -1 ) )
                          ) {
                                if( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) < 0 )
                                    return false;
                                return true;
                            }
                    }
                }
                else if( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) > 0 ) {
                    if( ( ( beatInCp + 1 ) < $rootScope.notes[ cpStaff ].length ) &&
                        ( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] ) <= -3 )
                      )
                    {
                        if( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] ) < 0 )
                            return false;
                        if( ( ( beatInCp + 2 ) < $rootScope.notes[ cpStaff ].length ) &&
                            ( ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == 2 ) ||
                              ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == 1 ) )
                          ) {
                                if( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) < 0 )
                                    return false;
                                return true;
                        }
                    }
                }
            }
            return false;
        };

        /*
            Checks if this note in the counterpoint is a double neighbor - is preceded by third in one direction and folowed by a third in the opposite direction,
            and then resolved by step in the first direction
        */
        function isDoubleNeighbor( topVoiceBeat, bottomVoiceBeat ) {
            var beatInCp = topVoiceBeat,
                cpStaff = 0;

            if( $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ) {
                beatInCp = bottomVoiceBeat;
                cpStaff = 1;
            }

             if( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) < 0 )
                return false;

            if( ( ( beatInCp + 2 ) < $rootScope.notes[ cpStaff ].length ) &&
                ( $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] == $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] )
              ) {
                if( ( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) == 2 ) ||
                    ( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) == 1 )
                  ) {
                    if( ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == -2 ) ||
                        ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == -1 )
                      ) {
                        if( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] ) < 0 )
                            return false;
                        return true;
                    }
                }
            }
            else if( ( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) == -2 ) ||
                     ( ( $rootScope.notes[ cpStaff ][ beatInCp ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp - 1 ][ 1 ] ) == -1 )
                   ) {
                if( ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == 2 ) ||
                    ( ( $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] - $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] ) == 1 )
                  ) {
                    if( ( $rootScope.notes[ cpStaff ][ beatInCp + 1 ][ 1 ] * $rootScope.notes[ cpStaff ][ beatInCp + 2 ][ 1 ] ) < 0 )
                        return false;
                    return true;
                }
            }
            return false;
        };

        /*
            Checks if this note in the counterpoint is a lower neighbor tone
        */
        function isLowerNeighbor( topVoiceBeat, bottomVoiceBeat ) {
            var beatInCounterpoint = topVoiceBeat,
                counterpointStaff = 0;


            if( $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ) {
                beatInCounterpoint = bottomVoiceBeat;
                counterpointStaff = 1;
            }

            if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ] * $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ] ) < 0 )
                return false;

            if( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ] ) ) {
                if( ( ( beatInCounterpoint + 1 ) < $rootScope.notes[ counterpointStaff ].length ) && 
                    ( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ] ) ) ) {
                    if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ][ 1 ] - $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ][ 1 ] ) < 0 ) {
                        if( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ] < 0 )
                            return false;
                        if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ][ 1 ] - $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ][ 1 ] ) > 0 )
                            return true;
                        else
                            return false;
                    }
                }
            }

            return false;
        };

        /*
            Checks if this note in the counterpoint is a passing tone
        */
        function isPassing( topVoiceBeat, bottomVoiceBeat ) {
            var beatInCounterpoint = topVoiceBeat,
                counterpointStaff = 0;

            if( $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ) {
                beatInCounterpoint = bottomVoiceBeat;
                counterpointStaff = 1;
            }

            if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ] * $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ] ) < 0 )
                return false;

            if( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ] ) ) {
                if( ( ( beatInCounterpoint + 1 ) < $rootScope.notes[ counterpointStaff ].length ) && 
                    ( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ] ) ) ) {
                    if( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ] < 0 )
                        return false;
                    if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ][ 1 ] - $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ][ 1 ] ) < 0 ) {
                        if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ][ 1 ] - $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ][ 1 ] ) < 0 )
                            return true;
                        else
                            return false;
                    }
                    if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ][ 1 ] - $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ][ 1 ] ) > 0 ) {
                        if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ][ 1 ] - $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ][ 1 ] ) > 0 )
                            return true;
                        else
                            return false;
                    }
                }
            }

            return false;
        };

        function isStrongBeat ( topVoiceBeat, bottomVoiceBeat ) {
            var beatInCounterpoint = topVoiceBeat;

            if( $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' )
                beatInCounterpoint = bottomVoiceBeat;

            if( $rootScope.inputParams.species == 1 || ( ( $rootScope.inputParams.species > 1 ) && ( beatInCounterpoint % 2 == 0 ) ) )
                return true

            return false;
        }

        function setRulesHeadings() {
            if( $scope.incorrectAccidental[ 0 ] || $scope.incorrectHarmony[ 0 ] || $scope.incorrectMelody[ 0 ] || $scope.repeatedNotes[ 0 ] ||
                $scope.parallelPerfect[ 0 ] || $scope.perfectApproachedBySimilarMotion[ 0 ] || $scope.tooManyParallelIntervals[ 0 ] || $scope.unequalNumberOfBeats[ 0 ] ||
                $scope.imperfectStartingOrEndingInterval[ 0 ] || $scope.repeatedNoteInCounterpoint[ 0 ] || $scope.outlineOfTritone[ 0 ] || $scope.repeatedNoteInBothVoices[ 0 ] ||
                $scope.hasTooManySkips[ 0 ] || $scope.motivicRepetition[ 0 ] || $scope.tooMuchChangingDirection[ 0 ] )
                $scope.hasBrokenHardRules = true;
            if( $scope.voiceCrossing[ 0 ] || $scope.consecutivePerfect[ 0 ] || $scope.consecutiveSkips[ 0 ] || $scope.largeSkipOnTop[ 0 ] ||
                $scope.largerThan12th[ 0 ] || $scope.internalUnison[ 0 ] || $scope.melodic6th[ 0 ] || $scope.leapIn3rdSpecies[ 0 ] ||
                $scope.surroundSkipWithStepsInOppositeDirection[ 0 ] || $scope.skippingToAndFromExtreme[ 0 ] || $scope.skippingInBothVoices[ 0 ] ||
                $scope.overusedVerticalIntervalSecondSpecies[ 0 ] || $scope.skippingUpToWeakQuarter[ 0 ] || $scope.dissonantOutline[ 0 ] ||
                $scope.tempHighOnWeakQuarter[ 0 ] || $scope.descendAfterBflat[ 0 ] )
                $scope.hasBrokenSoftRules = true;
        };

        function setUpTaskbar( target ) {
            var acc;

            targetNote = target;
            $( document.querySelector( '.activeNote' ) ).removeClass( 'activeNote' );
            $( target ).addClass( 'activeNote' );
            $( document.querySelector( '.accidental-item.active' ) ).removeClass( 'active' );

            if( $(target).hasClass( 'hasAccidental' ) ) {
                acc = $( $( target )[ 0 ].previousElementSibling )[ 0 ];

                if( $( $( $( acc )[ 0 ].firstElementChild )[ 0 ] ).hasClass( 'sharp' ) )
                    $( document.querySelector( '.toolbar-item.sharp' ) ).addClass( 'active' );
                else if( $( $( $( acc )[ 0 ].firstElementChild )[ 0 ] ).hasClass( 'flat' ) )
                    $( document.querySelector( '.toolbar-item.flat' ) ).addClass( 'active' );
                else
                    $( document.querySelector( '.toolbar-item.natural' ) ).addClass( 'active' );
            }

            if( $( target ).hasClass( 'whole' ) ) {
                $scope.duration = 'whole';
                $scope.isRest = false;
            }
            else if( $( target ).hasClass( 'quarterup' ) || $( target ).hasClass( 'quarterdown' ) ) {
                $scope.duration = 'quarter';
                $scope.isRest = false;
            }
            else if( $( target ).hasClass( 'half' ) ) {
                $scope.duration = 'half';
                $scope.isRest = false;
            }
            else if( $( target ).hasClass( 'wholerest' ) ) {
                $scope.duration = 'whole';
                $scope.isRest = true;
            }
            else if( $( target ).hasClass( 'halfrest' ) ) {
                $scope.duration = 'half';
                $scope.isRest = true;
            }
            else if( $( target ).hasClass( 'quarterrest' ) ) {
                $scope.duration = 'quarter';
                $scope.isRest = true;
            }

        };

        $rootScope.$on( 'printMusic', function( event, args ) {
            var i, j;
            console.log(args);
            if( $rootScope.inputParams.numberOfVoices == 1) {
                for( j = 0; j != args.numNotes; ++j )
                    insertPreComposedNote( args.notes[ j ].val, 0 );
                return;
            }

            for( i = 0; i != args.numVoices; ++i ) {
                if( $rootScope.inputParams.species == 1 ) {
                    for( j = 0; j != args.numNotes; ++j )
                        insertPreComposedNote( args.notes[ i ][ j ].val, i );
                }
                else if( $rootScope.inputParams.species == 2 ) {
                    for( j = 0; j != args.numNotes; ++j ) {
                        if( i == 0 || j % 2 == 0 )
                            insertPreComposedNote( args.notes[ i ][ j ].val, i );
                    }
                }
                else {
                    for( j = 0; j != args.numNotes; ++j ) {
                        if( i == 0 || j % 4 == 0 )
                            insertPreComposedNote( args.notes[ i ][ j ].val, i );
                    }
                }
            }
        } );

        var AP = Array.prototype;

    var DEFAULT_VOLUME   = 90;
    var DEFAULT_DURATION = 128;
    var DEFAULT_CHANNEL  = 1;

    // These are the different values that compose a MID header. They are already
    // expressed in their string form, so no useless conversion has to take place
    // since they are constants.

    var HDR_CHUNKID     = "MThd";
    var HDR_CHUNK_SIZE  = "\x00\x00\x00\x06"; // Header size for SMF
    var HDR_TYPE0       = "\x00\x00"; // Midi Type 0 id
    var HDR_TYPE1       = "\x00\x01"; // Midi Type 1 id
    var HDR_SPEED       = "\x00\x80"; // Defaults to 128 ticks per beat

    // Midi event codes
    var EVT_NOTE_OFF           = 0x8;
    var EVT_NOTE_ON            = 0x9;
    var EVT_AFTER_TOUCH        = 0xA;
    var EVT_CONTROLLER         = 0xB;
    var EVT_PROGRAM_CHANGE     = 0xC;
    var EVT_CHANNEL_AFTERTOUCH = 0xD;
    var EVT_PITCH_BEND         = 0xE;

    var META_SEQUENCE   = 0x00;
    var META_TEXT       = 0x01;
    var META_COPYRIGHT  = 0x02;
    var META_TRACK_NAME = 0x03;
    var META_INSTRUMENT = 0x04;
    var META_LYRIC      = 0x05;
    var META_MARKER     = 0x06;
    var META_CUE_POINT  = 0x07;
    var META_CHANNEL_PREFIX = 0x20;
    var META_END_OF_TRACK   = 0x2f;
    var META_TEMPO      = 0x51;
    var META_SMPTE      = 0x54;
    var META_TIME_SIG   = 0x58;
    var META_KEY_SIG    = 0x59;
    var META_SEQ_EVENT  = 0x7f;

    // This is the conversion table from notes to its MIDI number. Provided for
    // convenience, it is not used in this code.
    var noteTable = { "g9": 0x7F, "gb9": 0x7E, "f9": 0x7D, "e9": 0x7C, "eb9": 0x7B,
    "d9": 0x7A, "db9": 0x79, "c9": 0x78, "b8": 0x77, "bb8": 0x76, "a8": 0x75, "ab8": 0x74,
    "g8": 0x73, "gb8": 0x72, "f8": 0x71, "e8": 0x70, "eb8": 0x6F, "d8": 0x6E, "db8": 0x6D,
    "c8": 0x6C, "b7": 0x6B, "bb7": 0x6A, "a7": 0x69, "ab7": 0x68, "g7": 0x67, "gb7": 0x66,
    "f7": 0x65, "e7": 0x64, "eb7": 0x63, "d7": 0x62, "db7": 0x61, "c7": 0x60, "b6": 0x5F,
    "bb6": 0x5E, "a6": 0x5D, "ab6": 0x5C, "g6": 0x5B, "gb6": 0x5A, "f6": 0x59, "e6": 0x58,
    "eb6": 0x57, "d6": 0x56, "db6": 0x55, "c6": 0x54, "b5": 0x53, "bb5": 0x52, "a5": 0x51,
    "ab5": 0x50, "g5": 0x4F, "gb5": 0x4E, "f5": 0x4D, "e5": 0x4C, "eb5": 0x4B, "d5": 0x4A,
    "db5": 0x49, "c5": 0x48, "b4": 0x47, "bb4": 0x46, "a4": 0x45, "ab4": 0x44, "g4": 0x43,
    "gb4": 0x42, "f4": 0x41, "e4": 0x40, "eb4": 0x3F, "d4": 0x3E, "db4": 0x3D, "c4": 0x3C,
    "b3": 0x3B, "bb3": 0x3A, "a3": 0x39, "ab3": 0x38, "g3": 0x37, "gb3": 0x36, "f3": 0x35,
    "e3": 0x34, "eb3": 0x33, "d3": 0x32, "db3": 0x31, "c3": 0x30, "b2": 0x2F, "bb2": 0x2E,
    "a2": 0x2D, "ab2": 0x2C, "g2": 0x2B, "gb2": 0x2A, "f2": 0x29, "e2": 0x28, "eb2": 0x27,
    "d2": 0x26, "db2": 0x25, "c2": 0x24, "b1": 0x23, "bb1": 0x22, "a1": 0x21, "ab1": 0x20,
    "g1": 0x1F, "gb1": 0x1E, "f1": 0x1D, "e1": 0x1C, "eb1": 0x1B, "d1": 0x1A, "db1": 0x19,
    "c1": 0x18, "b0": 0x17, "bb0": 0x16, "a0": 0x15, "ab0": 0x14, "g0": 0x13, "gb0": 0x12,
    "f0": 0x11, "e0": 0x10, "eb0": 0x0F, "d0": 0x0E, "db0": 0x0D, "c0": 0x0C };

    // Helper functions

    /*
     * Converts an array of bytes to a string of hexadecimal characters. Prepares
     * it to be converted into a base64 string.
     *
     * @param byteArray {Array} array of bytes that will be converted to a string
     * @returns hexadecimal string
     */
    function codes2Str(byteArray) {
        return String.fromCharCode.apply(null, byteArray);
    }

    /*
     * Converts a String of hexadecimal values to an array of bytes. It can also
     * add remaining "0" nibbles in order to have enough bytes in the array as the
     * |finalBytes| parameter.
     *
     * @param str {String} string of hexadecimal values e.g. "097B8A"
     * @param finalBytes {Integer} Optional. The desired number of bytes that the returned array should contain
     * @returns array of nibbles.
     */

    function str2Bytes(str, finalBytes) {
        if (finalBytes) {
            while ((str.length / 2) < finalBytes) { str = "0" + str; }
        }

        var bytes = [];
        for (var i=str.length-1; i>=0; i = i-2) {
            var chars = i === 0 ? str[i] : str[i-1] + str[i];
            bytes.unshift(parseInt(chars, 16));
        }

        return bytes;
    }

    function isArray(obj) {
        return !!(obj && obj.concat && obj.unshift && !obj.callee);
    }


    /**
     * Translates number of ticks to MIDI timestamp format, returning an array of
     * bytes with the time values. Midi has a very particular time to express time,
     * take a good look at the spec before ever touching this function.
     *
     * @param ticks {Integer} Number of ticks to be translated
     * @returns Array of bytes that form the MIDI time value
     */
    var translateTickTime = function(ticks) {
        var buffer = ticks & 0x7F;

        while (ticks = ticks >> 7) {
            buffer <<= 8;
            buffer |= ((ticks & 0x7F) | 0x80);
        }

        var bList = [];
        while (true) {
            bList.push(buffer & 0xff);

            if (buffer & 0x80) { buffer >>= 8; }
            else { break; }
        }
        return bList;
    };

    /*
     * This is the function that assembles the MIDI file. It writes the
     * necessary constants for the MIDI header and goes through all the tracks, appending
     * their data to the final MIDI stream.
     * It returns an object with the final values in hex and in base64, and with
     * some useful methods to play an manipulate the resulting MIDI stream.
     *
     * @param config {Object} Configuration object. It contains the tracks, tempo
     * and other values necessary to generate the MIDI stream.
     *
     * @returns An object with the hex and base64 resulting streams, as well as
     * with some useful methods.
     */
    var MidiWriter = function(config) {
        if (config) {
            var tracks  = config.tracks || [];
            // Number of tracks in hexadecimal
            var tracksLength = tracks.length.toString(16);

            // This variable will hold the whole midi stream and we will add every
            // chunk of MIDI data to it in the next lines.
            var hexMidi = HDR_CHUNKID + HDR_CHUNK_SIZE + HDR_TYPE0;

            // Appends the number of tracks expressed in 2 bytes, as the MIDI
            // standard requires.
            hexMidi += codes2Str(str2Bytes(tracksLength, 2));
            hexMidi += HDR_SPEED;
            // Goes through the tracks appending the hex strings that compose them.
            tracks.forEach(function(trk) { hexMidi += codes2Str(trk.toBytes()); });

            return {
                b64: btoa(hexMidi)
            };

        } else {
            throw new Error("No parameters have been passed to MidiWriter.");
        }
    };

    /*
     * Generic MidiEvent object. This object is used to create standard MIDI events
     * (note Meta events nor SysEx events). It is passed a |params| object that may
     * contain the keys time, type, channel, param1 and param2. Note that only the
     * type, channel and param1 are strictly required. If the time is not provided,
     * a time of 0 will be assumed.
     *
     * @param {object} params Object containing the properties of the event.
     */
    var MidiEvent = function(params) {
        if (params &&
            (params.type    !== null || params.type    !== undefined) &&
            (params.channel !== null || params.channel !== undefined) &&
            (params.param1  !== null || params.param1  !== undefined)) {
            this.setTime(params.time);
            this.setType(params.type);
            this.setChannel(params.channel);
            this.setParam1(params.param1);
            this.setParam2(params.param2);
        } else {
            throw new Error("Not enough parameters to create an event.");
        }
    };


    /**
     * Returns the list of events that form a note in MIDI. If the |sustained|
     * parameter is not specified, it creates the noteOff event, which stops the
     * note after it has been played, instead of keeping it playing.
     *
     * This method accepts two ways of expressing notes. The first one is a string,
     * which will be looked up in the global |noteTable| but it will take the
     * default values for pitch, channel, durtion and volume.
     *
     * If a note object is passed to the method instead, it should contain the properties
     * channel, pitch, duration and volume, of which pitch is mandatory. In case the
     * channel, the duration or the volume are not passed, default values will be
     * used.
     *
     * @param note {object || String} Object with note properties or string
     * @param sustained {Boolean} Whether the note has to end or keep playing
     * @returns Array of events, with a maximum of two events (noteOn and noteOff)
     */

    MidiEvent.createNote = function(note, sustained) {
        console.log("creating note")
        console.log(note);
        console.log(sustained);
        if (!note) { throw new Error("Note not specified"); }

        if (typeof note === "string") {
            note = noteTable[note];
        // The pitch is mandatory if the note object is used.
        } /*else if (!note.pitch) {
            throw new Error("The pitch is required in order to create a note.");
        }*/

        var events = [];
        events.push(MidiEvent.noteOn(note, 96));

        // If there is a |sustained| parameter, the note will keep playing until
        // a noteOff event is issued for it.
        if (!sustained) {
            // The noteOff event will be the one that is passed the actual duration
            // value for the note, since it is the one that will stop playing the
            // note at a particular time. If not specified it takes the default
            // value for it.
            // TODO: Is is good to have a default value for it?
            events.push(MidiEvent.noteOff(note, note.duration || DEFAULT_DURATION));
        }

        console.log(events);

        return events;
    };

    /**
     * Returns an event of the type NOTE_ON taking the values passed and falling
     * back to defaults if they are not specified.
     *
     * @param note {Note || String} Note object or string
     * @param time {Number} Duration of the note in ticks
     * @returns MIDI event with type NOTE_ON for the note specified
     */
    MidiEvent.noteOn = function(note, duration) {
        console.log("printing note");
        console.log(note);
        return new MidiEvent({
            time:    note.duration || duration || 0,
            type:    EVT_NOTE_ON,
            channel: note.channel || DEFAULT_CHANNEL,
            param1:  note.pitch   || note,
            param2:  note.volume  || DEFAULT_VOLUME
        });
    };

    /**
     * Returns an event of the type NOTE_OFF taking the values passed and falling
     * back to defaults if they are not specified.
     *
     * @param note {Note || String} Note object or string
     * @param time {Number} Duration of the note in ticks
     * @returns MIDI event with type NOTE_OFF for the note specified
     */

    MidiEvent.noteOff = function(note, duration) {
        return new MidiEvent({
            time:    note.duration || duration || 0,
            type:    EVT_NOTE_OFF,
            channel: note.channel || DEFAULT_CHANNEL,
            param1:  note.pitch   || note,
            param2:  note.volume  || DEFAULT_VOLUME
        });
    };


    MidiEvent.prototype = {
        type: 0,
        channel: 0,
        time: 0,
        setTime: function(ticks) {
            // The 0x00 byte is always the last one. This is how Midi
            // interpreters know that the time measure specification ends and the
            // rest of the event signature starts.

            this.time = translateTickTime(ticks || 0);
        },
        setType: function(type) {
            if (type < EVT_NOTE_OFF || type > EVT_PITCH_BEND) {
                throw new Error("Trying to set an unknown event: " + type);
            }

            this.type = type;
        },
        setChannel: function(channel) {
            if (channel < 0 || channel > 15) {
                throw new Error("Channel is out of bounds.");
            }

            this.channel = channel;
        },
        setParam1: function(p) {
            this.param1 = p;
        },
        setParam2: function(p) {
            this.param2 = p;
        },
        toBytes: function() {
            var byteArray = [];

            var typeChannelByte =
                parseInt(this.type.toString(16) + this.channel.toString(16), 16);

            byteArray.push.apply(byteArray, this.time);
            byteArray.push(typeChannelByte);
            byteArray.push(this.param1);

            // Some events don't have a second parameter
            if (this.param2 !== undefined && this.param2 !== null) {
                byteArray.push(this.param2);
            }
            return byteArray;
        }
    };

    var MetaEvent = function(params) {
        if (params) {
            this.setType(params.type);
            this.setData(params.data);
        }
    };

    MetaEvent.prototype = {
        setType: function(t) {
            this.type = t;
        },
        setData: function(d) {
            this.data = d;
        },
        toBytes: function() {
            if (!this.type || !this.data) {
                throw new Error("Type or data for meta-event not specified.");
            }

            var byteArray = [0xff, this.type];

            // If data is an array, we assume that it contains several bytes. We
            // apend them to byteArray.
            if (isArray(this.data)) {
                AP.push.apply(byteArray, this.data);
            }

            return byteArray;
        }
    };

    var MidiTrack = function(cfg) {
        this.events = [];
        for (var p in cfg) {
            if (cfg.hasOwnProperty(p)) {
                // Get the setter for the property. The property is capitalized.
                // Probably a try/catch should go here.
                this["set" + p.charAt(0).toUpperCase() + p.substring(1)](cfg[p]);
            }
        }
    };

    //"MTrk" Marks the start of the track data
    MidiTrack.TRACK_START = [0x4d, 0x54, 0x72, 0x6b];
    MidiTrack.TRACK_END   = [0x0, 0xFF, 0x2F, 0x0];

    MidiTrack.prototype = {
        /*
         * Adds an event to the track.
         *
         * @param event {MidiEvent} Event to add to the track
         * @returns the track where the event has been added
         */
        addEvent: function(event) {
            this.events.push(event);
            return this;
        },
        setEvents: function(events) {
            AP.push.apply(this.events, events);
            return this;
        },
        /*
         * Adds a text meta-event to the track.
         *
         * @param type {Number} type of the text meta-event
         * @param text {String} Optional. Text of the meta-event.
         * @returns the track where the event ahs been added
         */
        setText: function(type, text) {
            // If the param text is not specified, it is assumed that a generic
            // text is wanted and that the type parameter is the actual text to be
            // used.
            if (!text) {
                type = META_TEXT;
                text = type;
            }
            return this.addEvent(new MetaEvent({ type: type, data: text }));
        },
        // The following are setters for different kinds of text in MIDI, they all
        // use the |setText| method as a proxy.
        setCopyright:  function(text) { return this.setText(META_COPYRIGHT, text);  },
        setTrackName:  function(text) { return this.setText(META_TRACK_NAME, text); },
        setInstrument: function(text) { return this.setText(META_INSTRUMENT, text); },
        setLyric:      function(text) { return this.setText(META_LYRIC, text);      },
        setMarker:     function(text) { return this.setText(META_MARKER, text);     },
        setCuePoint:   function(text) { return this.setText(META_CUE_POINT, text);  },

        setTempo: function(tempo) {
            this.addEvent(new MetaEvent({ type: META_TEMPO, data: tempo }));
        },

        toBytes: function() {
            var trackLength = 0;
            var eventBytes = [];
            var startBytes = MidiTrack.TRACK_START;
            var endBytes   = MidiTrack.TRACK_END;

            /*
             * Adds the bytes of an event to the eventBytes array and add the
             * amount of bytes to |trackLength|.
             *
             * @param event {MidiEvent} MIDI event we want the bytes from.
             */
            var addEventBytes = function(event) {
                var bytes = event.toBytes();
                trackLength += bytes.length;
                AP.push.apply(eventBytes, bytes);
            };

            this.events.forEach(addEventBytes);

            // Add the end-of-track bytes to the sum of bytes for the track, since
            // they are counted (unlike the start-of-track ones).
            trackLength += endBytes.length;

            // Makes sure that track length will fill up 4 bytes with 0s in case
            // the length is less than that (the usual case).
            var lengthBytes = str2Bytes(trackLength.toString(16), 4);

            return startBytes.concat(lengthBytes, eventBytes, endBytes);
        }
    };

        // Toggle between Pause and Play modes.
    $scope.pausePlayStop = function(stop) {
        var d = document.getElementById("pausePlayStop");
        if (stop) {
            MIDI.Player.stop();
            d.src = "./img/play.png";
        } else if (MIDI.Player.playing) {
            d.src = "./img/play.png";
            MIDI.Player.pause(true);
        } else {
            d.src = "./img/pause.png";
            player = MIDI.Player;
            player.timeWarp = 1; // speed the song is played back
            console.log(this.songString);
            player.loadFile(song[0] + this.songString, player.start);
            MIDI.Player.resume();
        }
    };

    window.MidiWriter = MidiWriter;
    window.MidiEvent = MidiEvent;
    window.MetaEvent = MetaEvent;
    window.MidiTrack = MidiTrack;
    window.noteTable = noteTable;








    if (typeof (console) === "undefined") var console = {
        log: function() {}
    };
    // Toggle between Pause and Play modes.
    var pausePlayStop = function(stop) {
        var d = document.getElementById("pausePlayStop");
        if (stop) {
            MIDI.Player.stop();
            d.src = "./images/play.png";
        } else if (MIDI.Player.playing) {
            d.src = "./images/play.png";
            MIDI.Player.pause(true);
        } else {
            d.src = "./images/pause.png";
            MIDI.Player.resume();
        }
    };
    eventjs.add(window, "load", function(event) {
        var link = document.createElement("link");
        link.href = "//fonts.googleapis.com/css?family=Oswald";
        link.ref = "stylesheet";
        link.type = "text/css";
        document.body.appendChild(link);
        var link = document.createElement("link");
        link.href = "//fonts.googleapis.com/css?family=Andada";
        link.ref = "stylesheet";
        link.type = "text/css";
        document.body.appendChild(link);
        
        /// load up the piano keys
        var colors = document.getElementById("colors");
        var colorElements = [];
        for (var n = 0; n < 88; n++) {
            var d = document.createElement("div");
            d.innerHTML = MIDI.noteToKey[n + 21];
            colorElements.push(d);
            colors.appendChild(d);
        }
        ///
        MIDI.loader = new sketch.ui.Timer;
        MIDI.loadPlugin({
            soundfontUrl: "./soundfont/",
            onprogress: function(state, progress) {
                MIDI.loader.setValue(progress * 100);
            },
            onsuccess: function() {
                /// this is the language we are running in
                var title = document.getElementById("title");
                title.innerHTML = "Sound being generated with " + MIDI.api + " " + JSON.stringify(MIDI.supports);

                /// this sets up the MIDI.Player and gets things going...
                player = MIDI.Player;
                player.timeWarp = 1; // speed the song is played back
                player.loadFile(song[songid++ % song.length], player.start);

                /// control the piano keys colors
                var colorMap = MIDI.Synesthesia.map();
                player.addListener(function(data) {
                    var pianoKey = data.note - 21;
                    var d = colorElements[pianoKey];
                    if (d) {
                        if (data.message === 144) {
                            var map = colorMap[data.note - 27];
                            if (map) d.style.background = map.hex;
                            d.style.color = "#fff";
                        } else {
                            d.style.background = "";
                            d.style.color = "";
                        }
                    }
                });
                ///
                ColorSphereBackground();
                MIDIPlayerPercentage(player);
            }
        });
    });

    var MIDIPlayerPercentage = function(player) {
        // update the timestamp
        var time1 = document.getElementById("time1");
        var time2 = document.getElementById("time2");
        var capsule = document.getElementById("capsule");
        var timeCursor = document.getElementById("cursor");
        //
        eventjs.add(capsule, "drag", function(event, self) {
            eventjs.cancel(event);
            player.currentTime = (self.x) / 420 * player.endTime;
            if (player.currentTime < 0) player.currentTime = 0;
            if (player.currentTime > player.endTime) player.currentTime = player.endTime;
            if (self.state === "down") {
                player.pause(true);
            } else if (self.state === "up") {
                player.resume();
            }
        });
        //
        function timeFormatting(n) {
            var minutes = n / 60 >> 0;
            var seconds = String(n - (minutes * 60) >> 0);
            if (seconds.length == 1) seconds = "0" + seconds;
            return minutes + ":" + seconds;
        };
        player.getNextSong = function(n) {
            var id = Math.abs((songid += n) % song.length);
            player.loadFile(song[id], player.start); // load MIDI
        };
        player.setAnimation(function(data, element) {
            var percent = data.now / data.end;
            var now = data.now >> 0; // where we are now
            var end = data.end >> 0; // end of song
            if (now === end) { // go to next song
                var id = ++songid % song.length;
                player.loadFile(song[id], player.start); // load MIDI
            }
            // display the information to the user
            timeCursor.style.width = (percent * 100) + "%";
            time1.innerHTML = timeFormatting(now);
            time2.innerHTML = "-" + timeFormatting(end - now);
        });
    };
    
    var ColorSphereBackground = function() {
        var d = document;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.style.cssText = "position: fixed; left: 0; top: 0; opacity: 1";
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        document.body.appendChild(canvas);
        //
        eventjs.add(window, "resize", function() {
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.drawImage(theSphere = sphere(percent), 0, 0)
        });
        eventjs.add(d, "scroll", function(e) {
            var percent = 1 - document.body.scrollTop / document.body.scrollHeight;
            ctx.drawImage(theSphere = sphere(percent), 0, 0);
            onMouseMove();
        });
        var theSphere;
        var px = window.innerWidth / 2;
        var py = window.innerHeight / 2;
        var onMouseMove = function(event) {
            ctx.drawImage(theSphere, 0, 0);
            if (event) {
                var coords = eventjs.proxy.getCoord(event);
                coords.x -= document.body.scrollLeft;
                coords.y -= document.body.scrollTop;
                px = coords.x;
                py = coords.y;
            } else { // 
                var coords = {
                    x: px,
                    y: py
                };
            }
            //
            var x = (coords.x / window.innerWidth) * 255 - 127; // grab mouse pixel coords, center at midpoint
            var y = (coords.y / window.innerHeight) * 255 - 127;
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // get image data
            var data = imageData.data;
            for (var n = 0, length = data.length; n < length; n += 4) {
                data[n] = data[n] + x - y; // red (control left)
                data[n + 1] = data[n + 1] - x - y; // green (control right)
                data[n + 2] = data[n + 2] + y + y; // blue (control down)
            }
            ctx.putImageData(imageData, 0, 0);
        };
        eventjs.add(d, "mousemove", onMouseMove);
        ///
        function sphere(top) { // create Sphere image, and apply to <canvas>
            var canvas1 = document.createElement("canvas");
            var ctx = canvas1.getContext("2d");
            var w = 75;
            var left = -20;
            var top = top * -50;
            canvas.width = canvas1.width = w * window.innerWidth / window.innerHeight;
            canvas.height = canvas1.height = w;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            n = 360;
            while (n--) { // go through hues
                var x = left + w;
                var y = top + w;
                var g = ctx.createLinearGradient(x, top, x, y);
                g.addColorStop(0, "#000");
                g.addColorStop(.5, "hsl(" + ((n + 60) % 360) + ",100%,50%)");
                g.addColorStop(1, "#FFF");
                ctx.beginPath(); // draw triangle
                ctx.moveTo(x, top);
                ctx.lineTo(x, y);
                ctx.lineTo(x + 2, y);
                ctx.lineTo(x + 5, top);
                ctx.fillStyle = g; // apply gradient
                ctx.fill();
                ctx.translate(x, y); // rotate + translate into position
                ctx.rotate((1 / 360) * Math.PI * 2);
                ctx.translate(-x, -y);
            }
            return canvas1;
        };
        //
        var percent = 1 - document.body.scrollTop / document.body.scrollHeight;
        ctx.drawImage(theSphere = sphere(percent), 0, 0)
    };

      /*  var song = [
        'data:audio/mid;base64, '
    ];*/
    
    // Begin loading indication.
    var player;
    // MIDI files from Disklavier World
    var songid = 0;
    var song = [
        'data:audio/mid;base64, '
    ];
    /*var song = [
        // Test 1
//      'data:audio/mid;base64,TVRoZAAAAAYAAQABAMBNVHJrAAAARwD/WAQEAhgIAP9RAwehIAD/AwlOZXcgVHJhY2sAwHMAkDxkMoA8MIEOkDxkMoA8MIEOkDxkMoA8MIEOkDxkgT+APDAB/y8A',
        // Test 2
//      'data:audio/mid;base64,TVRoZAAAAAYAAQABAMBNVHJrAAAAVwD/WAQEAhgIAP9RAwehIAD/AwlOZXcgVHJhY2sAwAAAkDxkgRCAPDAwkDxkgRCAPDAwkDxkAJBAZACQQ2SBEIA8MACAQDAAgEMwMJA8ZIE/gDwwJv8vAA==',
        // Test 3
//      'data:audio/mid;base64,TVRoZAAAAAYAAQABAMBNVHJrAAAAXwD/WAQEAhgIAP9RAwehIAD/AwlOZXcgVHJhY2sAwAAAkDxkgRCAPDAwkDxkgRCAPDAwkDxkAJBAZACQQ2QHkEhkgQmAPDAAgEAwAIBDMACASDAwkDxkgT+APDAm/y8A',

        // Sinding - Rustles of Spring Op-32 No-3
        'data:audio/midi;base64,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',
        // Tchaikovsky - Arabian Dance
        'data:audio/midi;base64,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',
        // Tchaikovsky - Waltz of the Flowers
        'data:audio/midi;base64,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',
        // Granados - Oriental
        'data:audio/midi;base64,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',
        // Joplin - The Entertainer
        'data:audio/midi;base64,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'
    ];*/

}
] );
