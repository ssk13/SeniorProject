PseudoComposer.controller( 'inputController', [ '$scope', '$rootScope', 
    function( $scope, $rootScope ) {

        $scope.duration = 'whole';
        $scope.floatingNoteheadTopPos = 59;

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
                margin = margin.slice( margin.indexOf('margin') + 13 );
                margin = margin.slice( 0, margin.indexOf( 'px' ) ) ;
                margin = parseInt( margin ) - 105;

            if( !targetNote )
                return;

            if( $( targetNote ).hasClass( 'hasAccidental' ) ) {
                accEl = $( $( targetNote )[ 0 ].previousElementSibling )[ 0 ];
                accClass = $( $( accEl )[ 0 ].firstElementChild )[ 0 ].className;
                accEl.remove();
                notes[ activeStaff ][ index ][ 0 ] = notes[ activeStaff ][ index ][ 0 ].slice( 0, -1 );

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
                     $scope.largeSkipOnTop[ 1 ] && $scope.melodic6th[ 1 ] && $scope.voiceCrossing[ 1 ] && $scope.repeatedNoteInCounterpoint[ 1 ] &&
                     $scope.leapIn3rdSpecies[ 1 ] && $scope.outlineOfTritone[ 1 ] && $scope.surroundSkipWithStepsInOppositeDirection[ 1 ] &&
                     $scope.skippingToAndFromExtreme[ 1 ] && $scope.repeatedNoteInBothVoices[ 1 ] && $scope.motivicRepetition[ 1 ] && $scope.skippingInBothVoices[ 1 ] &&
                     $scope.changeDirectionAfterLargeSkip[ 1 ] && $scope.fillInSkips[ 1 ] && $scope.coverOctave[ 1 ] && $scope.overusedVerticalIntervalSecondSpecies[ 1 ] &&
                     $scope.slowTrill[ 1 ] && $scope.tooMuchChangingDirection[ 1 ] && $scope.skippingUpToWeakQuarter[ 1 ] && $scope.tempHighOnWeakQuarter[ 1 ] );
        };

        $scope.areAllHidden = function() {
            return ( !$scope.imperfectStartingOrEndingInterval[ 1 ] && !$scope.incorrectAccidental[ 1 ] && !$scope.incorrectHarmony[ 1 ] && !$scope.incorrectMelody[ 1 ] &&
                     !$scope.largerThan12th[ 1 ] && !$scope.parallelPerfect[ 1 ] && !$scope.perfectApproachedBySimilarMotion[ 1 ] && !$scope.repeatedNotes[ 1 ] &&
                     !$scope.tooManyParallelIntervals[ 1 ] && !$scope.consecutivePerfect[ 1 ] && !$scope.consecutiveSkips[ 1 ] && !$scope.internalUnison[ 1 ] &&
                     !$scope.largeSkipOnTop[ 1 ] && !$scope.melodic6th[ 1 ] && !$scope.voiceCrossing[ 1 ] && !$scope.repeatedNoteInCounterpoint[ 1 ] &&
                     !$scope.leapIn3rdSpecies[ 1 ] && !$scope.outlineOfTritone[ 1 ] && !$scope.surroundSkipWithStepsInOppositeDirection[ 1 ] &&
                     !$scope.skippingToAndFromExtreme[ 1 ] && !$scope.repeatedNoteInBothVoices[ 1 ] && !$scope.motivicRepetition[ 1 ] && !$scope.skippingInBothVoices[ 1 ] &&
                     !$scope.changeDirectionAfterLargeSkip[ 1 ] && !$scope.fillInSkips[ 1 ] && !$scope.coverOctave[ 1 ] && !$scope.overusedVerticalIntervalSecondSpecies[ 1 ] &&
                     !$scope.slowTrill[ 1 ] && !$scope.tooMuchChangingDirection[ 1 ] && !$scope.skippingUpToWeakQuarter[ 1 ] && !$scope.tempHighOnWeakQuarter[ 1 ] );
        };

        $scope.changeDuration = function( dur ) {
            var staffIndex, noteIndex, val, prevDur, noteVal;

            $scope.duration = dur;

            if( targetNote ) {
                staffIndex = $( targetNote )[ 0 ].getAttribute( 'data-staff-index' );
                noteIndex = $( targetNote )[ 0 ].getAttribute( 'data-note-index' );
                val = notes[ staffIndex ][ noteIndex ][ 1 ];
                prevDur = notes[ staffIndex ][ noteIndex ][ 2 ];
                $( targetNote ).removeClass( 'whole quarterup quarterdown halfup halfdown' );

                if( prevDur == 'whole' )
                    beatIndex[ staffIndex ] -= 4;
                else if( prevDur == 'half' )
                    beatIndex[ staffIndex ] -= 2;
                else
                    beatIndex[ staffIndex ] -= 1;

                noteVal = getNoteFromDurationAndValue( dur, val, $rootScope.inputParams.clef[ staffIndex ] );

                $( targetNote )[ 0 ].setAttribute( 'src', 'img/' + noteVal + '.png' );
                $( targetNote ).addClass( noteVal );
                if( dur == 'quarter' )
                    beatIndex[ staffIndex ] += 1;
                else if( dur == 'half' )
                    beatIndex[ staffIndex ] += 2;
                else
                    beatIndex[ staffIndex ] += 4;

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

            if( prevDur == 'whole' )
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
                    }
                }
                else if( $rootScope.inputParams.clef[ staffNumber ] == 'img/altoclef.png' ) {
                    if( topPosValue == topPosToNoteTableAlto[ i ][ 0 ] ) {
                        numericValue = topPosToNoteTableAlto[ i ][ 2 ];
                        noteName = topPosToNoteTableAlto[ i ][ 1 ];
                        i = topPosToNoteTableTreble.length;
                    }
                }
                else if( $rootScope.inputParams.clef[ staffNumber ] == 'img/tenorclef.png' ) {
                    if( topPosValue == topPosToNoteTableTenor[ i ][ 0 ] ) {
                        numericValue = topPosToNoteTableTenor[ i ][ 2 ];
                        noteName = topPosToNoteTableTenor[ i ][ 1 ];
                        i = topPosToNoteTableTreble.length;
                    }
                }
                else {
                    if( topPosValue == topPosToNoteTableBass[ i ][ 0 ] ) {
                        numericValue = topPosToNoteTableBass[ i ][ 2 ];
                        noteName = topPosToNoteTableBass[ i ][ 1 ];
                        i = topPosToNoteTableTreble.length;
                    }
                }
            }

            noteVal = getNoteFromDurationAndValue( $scope.duration, numericValue, $rootScope.inputParams.clef[ staffNumber ] );
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
                species: 0,
                voiceType: [ 'Cantus Firmus', 'Counterpoint', 'Counterpoint', 'Counterpoint' ],
                clef: [ 'img/trebleclef.png', 'img/trebleclef.png', 'img/trebleclef.png', 'img/trebleclef.png' ]
            };

            $scope.duration = 'whole';
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
            connections.connections('update');

            $scope.counterpointChecked = true;
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
        }

        /*
            Checks for:
            * invalid melodic intervals
            * invalid accidentals
            * too many horizontal repeated notes
            * too many consecutive skips if one is large
            * consecutive skips with larger on top
            * large leaps in 3rd species
        */
        function checkHorizontallyBeatByBeat() {
            var numberOfSkips = 0,
                numberOfConsecutiveSkips = 0,
                hadLargeSkip = false,
                isAscending = false,
                numberOfTimesChangedDirections = 0,
                numberOfSteps = 0,
                counterpointStaff = $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ? 1 : 0,
                i, j, k, noteEl, classA, classB, diff, note, accEl, nextNote, repeatedNote, firstNoteOfOutline;

            for( i = 0; i < $rootScope.notes.length; ++i ) {
                firstNoteOfOutline = 0;
                for( j = 0; j < $rootScope.notes[ i ].length; ++j ) {
                    if( j < ( $rootScope.notes[ i ].length - 1 ) ) {
                        diff = $rootScope.notes[ i ][ j + 1 ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ];
                        isAscending = diff > 0;
                        if( $rootScope.inputParams.species == 3 ) {
                            if( ( diff > 2 ) && ( ( j % 2 ) == 0 ) && ( i == counterpointStaff ) )
                                markTwoConsecutiveNotes( i, j, 'skippingUpToWeakQuarter' );

                            if( j < ( $rootScope.notes[ i ].length - 5 ) ) {
                                numberOfTimesChangedDirections = ( diff != 0 ) ? 1 : 0;
                                for( k = 1; k < 5; ++k ) {
                                    diff = $rootScope.notes[ i ][ j + k + 1 ][ 1 ] - $rootScope.notes[ i ][ j + k ][ 1 ];
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
                            if( ( ( $rootScope.notes[ i ][ j - 1 ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ] ) ) *
                                ( $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ j + 1 ][ 1 ] ) < 0 ) {
                                //if there are skips on both sides
                                if( ( Math.abs( $rootScope.notes[ i ][ j - 1 ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ] ) > 2 ) &&
                                    ( Math.abs( $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ j + 1 ][ 1 ] ) > 2 ) )
                                    markThreeConsecutiveNotes( i, j, 'skippingToAndFromExtreme' );
                            }

                            if( j > 1 ) {
                            //if this note is changing direction
                                if( ( ( $rootScope.notes[ i ][ j - 1 ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ] ) ) *
                                    ( $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ j + 1 ][ 1 ] ) < 0 ) {
                                    if( $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ firstNoteOfOutline ][ 1 ] == 6 )
                                        markIllegalOutline( i, firstNoteOfOutline, j, 'outlineOfTritone')
                                    firstNoteOfOutline = j;
                                }
                            }
                        }

                        if( !isValidMelodically( $rootScope.notes[ i ][ j + 1 ], $rootScope.notes[ i ][ j ] ) ) {
                            diff = Math.abs( $rootScope.notes[ i ][ j + 1 ][ 1 ] - $rootScope.notes[ i ][ j ][ 1 ] );
                            if( ( diff == 8 ) || ( diff == 9 ) )
                                markTwoConsecutiveNotes( i, j, 'melodic6th' );
                            else
                                markTwoConsecutiveNotes( i, j, 'melodic' );
                        }

                        if( $rootScope.notes[ i ][ j + 1 ][ 1 ] == $rootScope.notes[ i ][ j ][ 1 ] ) {
                            if( ( $rootScope.inputParams.species > 1 ) && ( $rootScope.inputParams.voiceType[ $rootScope.inputParams.species  - 1 ] == 'Counterpoint' ) )
                                markTwoConsecutiveNotes( i, j, 'repeatedNoteInCounterpoint' );
                            if( repeatedNote == $rootScope.notes[ i ][ j ][ 1 ] )
                                markThreeConsecutiveNotes( i, j, 'repeatedNote' );
                            else
                                repeatedNote = $rootScope.notes[ i ][ j ][ 1 ];
                        }
                        else
                            repeatedNote = 0;

                        if( isSkip( $rootScope.notes[ i ][ j + 1 ], $rootScope.notes[ i ][ j ] ) ) {
                            ++numberOfSkips;
                            ++numberOfConsecutiveSkips;
                            if( isLargeSkip( $rootScope.notes[ i ][ j + 1 ], $rootScope.notes[ i ][ j ] ) ) {
                                hadLargeSkip = true;
                                if( ( j < ( $rootScope.notes[ i ].length - 2 ) ) &&
                                    ( isSkip( $rootScope.notes[ i ][ j + 2 ], $rootScope.notes[ i ][ j + 1 ] ) ||
                                      ( isAscending == ( ( $rootScope.notes[ i ][ j + 2 ][ 1 ] - $rootScope.notes[ i ][ j + 1 ][ 1 ] ) > 0 ) ) ||
                                      ( ( $rootScope.notes[ i ][ j + 2 ][ 1 ] - $rootScope.notes[ i ][ j + 1 ][ 1 ] ) == 0 )
                                    )
                                  )
                                        markThreeConsecutiveNotes( i, j + 1, 'surroundSkipWithStepsInOppositeDirection' );
                                    if( $rootScope.inputParams.species == 3 )
                                        markTwoConsecutiveNotes( i, j, 'leapIn3rdSpecies' );
                            }
                            if( numberOfConsecutiveSkips > 1 ) {
                                if( ( $rootScope.notes[ i ][ j ][ 1 ] - $rootScope.notes[ i ][ j - 1 ][ 1 ] ) < ( $rootScope.notes[ i ][ j + 1 ][ 1 ] - 
                                      $rootScope.notes[ i ][ j ][ 1 ] ) )
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

                    note =  $rootScope.notes[ i ][ j ];

                    if( note[ 0 ].indexOf( 'sharp' ) !== -1 ) {
                        if( note[ 0 ].indexOf( 'c' ) !== -1 ) {
                            if( ( j + 1 ) < $rootScope.notes[ i ].length )
                                nextNote = ( ( j + 1 ) < $rootScope.notes[ i ].length ) ? $rootScope.notes[ i ][ j + 1 ] : undefined;
                            else
                                nextNote = "";

                            if( ( !nextNote[ 0 ] ) || ( nextNote[ 0 ].indexOf( 'd' ) === -1 ) || ( nextNote[ 0 ].indexOf( 'sharp' ) !== -1 ) || 
                                ( nextNote[ 0 ].indexOf( 'flat' ) !== -1 ) || ( nextNote[ 1 ] - note[ 1 ] != 1 ) )
                                    markInvalidAccidental( i, j )
                        }
                        else
                            markInvalidAccidental( i, j )
                    }

                    if( note[ 0 ].indexOf( 'flat' ) > 0 ) {
                        if( ( note[ 0 ].indexOf( 'b' ) === -1 ) || ( j == 0 ) || !( ( ( note[ 1 ] - $rootScope.notes[ i ][ j - 1 ][ 1 ] ) == 1 ) ||
                                                                                    ( ( note[ 1 ] - $rootScope.notes[ i ][ j - 1 ][ 1 ] ) == 5 ) ) )
                            markInvalidAccidental( i, j );
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
                checkVoiceCrossing( i, j );

                if( !isConsonantHarmonically( $rootScope.notes[ 0 ][ i ], $rootScope.notes[ 1 ][ j ] ) ) {
                    if( isStrongBeat( i, j ) )
                        markHarmony( 'harmonic', i, j );
                    else if( !isPassing( i, j ) ) {
                        if( $rootScope.inputParams.species == 2 )
                            markHarmony( 'harmonic', i, j );
                        else if( $rootScope.inputParams.species == 3 ) {
                            if( !isLowerNeighbor( i, j ) )
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
            var diff = secondNote[ 1 ] - firstNote[ 1 ],
                validityTable = [ 
                                    [ -12, 0 ], [ -7, -4 ], [ -7, 3 ], [ -5, 4 ], [ -5, -3 ], [ -4, 5 ], [ -4, -2 ], [ -3, -5 ], [ -3, -2 ], 
                                    [-2, 6 ], [ -2, -1 ], [ -1, -6 ], [ -1, -1 ], [ 0, 0 ], [ 1, -6 ], [ 1, 1 ], [ 2, -6 ], [ 2, 1 ], 
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

        function markInvalidAccidental( i, j ) {
            var noteEl = $( document.querySelector( '[data-note-index="' + j + '"][data-staff-index="' + i + '"]' ) ),
                accEl = $( $( $( $( noteEl )[ 0 ].previousElementSibling )[ 0 ] )[ 0 ].firstElementChild );

            $( accEl ).addClass( 'invalidAccidental' );
            $scope.incorrectAccidental[ 0 ] = true;
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

        function getNoteFromDurationAndValue( dur, val, clef ) {
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
            Checks if this note in the counterpoint is a lower neighbor tone
        */
        function isLowerNeighbor( topVoiceBeat, bottomVoiceBeat ) {
            var beatInCounterpoint = topVoiceBeat,
                counterpointStaff = 0;

            if( $rootScope.inputParams.voiceType[ 1 ] == 'Counterpoint' ) {
                beatInCounterpoint = bottomVoiceBeat;
                counterpointStaff = 1;
            }

            if( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ] ) ) {
                if( ( ( beatInCounterpoint + 1 ) < $rootScope.notes[ counterpointStaff ].length ) && 
                    ( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ] ) ) ) {
                    if( ( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ][ 1 ] - $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ][ 1 ] ) < 0 ) {
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

            if( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint - 1 ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ] ) ) {
                if( ( ( beatInCounterpoint + 1 ) < $rootScope.notes[ counterpointStaff ].length ) && 
                    ( !isSkip( $rootScope.notes[ counterpointStaff ][ beatInCounterpoint ], $rootScope.notes[ counterpointStaff ][ beatInCounterpoint + 1 ] ) ) ) {
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
                $scope.overusedVerticalIntervalSecondSpecies[ 0 ] || $scope.skippingUpToWeakQuarter[ 0 ] || $scope.tempHighOnWeakQuarter[ 0 ] )
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

            if( $( target ).hasClass( 'whole' ) )
                $scope.duration = 'whole';
            else if( $( target ).hasClass( 'quarterup' ) || $( target ).hasClass( 'quarterdown' ) )
                $scope.duration = 'quarter';
            else
                $scope.duration = 'half';
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
    }
] );


        /*function getNoteAtBeat( beat, staff ) {
            var currentBeat = 0,
                noteIndex = 0;
                console.log(staff);

            while( currentBeat < beat ) {
                console.log("note index: " + noteIndex);
                if( notes[ staff ][ noteIndex ][ 2 ] == 'whole' )
                    currentBeat += 4;
                else if( notes[ staff ][ noteIndex ][ 2 ] == 'half' )
                    currentBeat += 2;
                else
                    currentBeat += 1;

                ++noteIndex;
            }

            return noteIndex;
        };*/

                /*function isFillingInBeat( beat, duration, staffNumber ) {
            var currentBeat = 0,
                dur = 1,
                noteIndex = 0;

            if( duration == 'whole' )
                dur = 4;
            else if( duration == 'half' )
                dur = 2;

            while( ( currentBeat + dur ) <= beat ) {
                console.log(noteIndex);
                if( notes[ staffNumber ][ noteIndex ][ 2 ] == 'whole' )
                    currentBeat += 4;
                else if( notes[ staffNumber ][ noteIndex ][ 2 ] == 'half' )
                    currentBeat += 2;
                else
                    currentBeat += 1;

                ++noteIndex;
            }

            if( ( currentBeat == beat ) || ( ( currentBeat + dur ) == beat ) ) {
                console.log("nope");
                return false;
            }

            console.log("yep");
            return true;
        };

       /* function isAfterCurrentBeatInOtherLine( beat, duration, staffNumber ) {
            var currentBeat = 0,
                dur = 1,
                noteIndex = 0;

            if( duration == 'whole' )
                dur = 4;
            else if( duration == 'half' )
                dur = 2;

            while( ( currentBeat + dur ) <= beat ) {
                console.log(noteIndex);
                if( notes[ staffNumber ][ noteIndex ][ 2 ] == 'whole' )
                    currentBeat += 4;
                else if( notes[ staffNumber ][ noteIndex ][ 2 ] == 'half' )
                    currentBeat += 2;
                else
                    currentBeat += 1;

                ++noteIndex;
            }

            if( ( currentBeat == beat ) || ( ( currentBeat + dur ) == beat ) ) {
                console.log("nope");
                return false;
            }

            console.log("yep");
            return true;
        };*/


           // console.log(beatIndex);

            /*if( beatIndex[ staffNumber ] < beatIndex[ otherStaffNumber ] ) {
                if( isAfterCurrentBeatInOtherLine( beatIndex[ staffNumber ], $scope.duration, otherStaffNumber ) )
                    currentLeftPos[ staffNumber ] += 40;
                if( isFillingInBeat( beatIndex[ staffNumber ], $scope.duration, otherStaffNumber ) ) {
                    var notesArr = $( document.querySelectorAll( '[data-staff-index="' + otherStaffNumber + '"].static' ) ),
                        index =  getNoteAtBeat( beatIndex[ staffNumber ], otherStaffNumber ),
                        offset = 40,
                        note, acc, margin;

                    for( i = index; i != notesArr.length ; ++i ) {
                        note = $( document.querySelector( '[data-note-index="' + ( i ) + '"][data-staff-index="' + otherStaffNumber + '"]' ) );
                        note[ 0 ].style.marginLeft = ( parseInt( note[ 0 ].style.marginLeft ) + offset ) + 'px';
                        if( note.hasClass( 'hasAccidental' ) ) {
                            acc = note[ 0 ].previousElementSibling;
                            margin = $( acc )[ 0 ].getAttribute( 'style' );
                            margin = parseInt( margin.slice( 13, margin.indexOf( 'px' ) ) ) + offset;
                            $( acc )[ 0 ].style = 'margin-left: ' + margin + 'px;';
                        }
                    }

                    currentLeftPos[ otherStaffNumber ] += offset;
                }
            }*/
