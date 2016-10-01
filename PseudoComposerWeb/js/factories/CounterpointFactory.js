angular.module( 'PseudoComposer' ).factory( 'Counterpoint', function () {

    var validNoteValues = [ 26, 28, 29, 31, 33, 35, 36, 38 ];

    function Counterpoint() {
    }

    function Counterpoint( numNotes ) {
    }

    Counterpoint.prototype.isConsonantMelodically = function( firstNote, secondNote ) {
        var diff = secondNote - firstNote,
            isConsonant = false;

        switch( diff ) {
            case -12:
            case -7:
            case -5:
            case -4:
            case -3:
            case -2:
            case -1:
            case 0:
            case 2:
            case 3:
            case 4:
            case 5:
            case 7:
            case 8:
            case 12:
                isConsonant = true;
                break;
            default:
                isConsonant = false;
                break;
        }
        return isConsonant;
    }

    Counterpoint.prototype.isConsonantVertically = function( tenor, soprano ) {
        var diff = soprano - tenor,
            isConsonant = false;

        switch( diff ) {
            case -19:
            case -16:
            case -15:
            case -12:
            case -9:
            case -8:
            case -7:
            case -4:
            case -3:
            case 0:
            case 3:
            case 4:
            case 7:
            case 8:
            case 9:
            case 12:
            case 15:
            case 16:
            case 19:
                isConsonant = true;
                break;
            default:
                isConsonant = false;
                break;
        }
        return isConsonant;
    }

    Counterpoint.prototype.isApproachedFromOppositeDirection = function( firstNote, secondNote, thirdNote ) {
        if( secondNote > firstNote && secondNote > thirdNote )
            return true;

        if( secondNote < firstNote && secondNote < thirdNote )
            return true;

        return false;
    }

    Counterpoint.prototype.isContraryOrOblique = function( prevSoprano, prevTenor, currSoprano, currTenor ) {
        if( currSoprano - prevSoprano > 0 ) {
            if( currTenor - prevTenor <= 0 )
                return true;
        } 
        else if( currSoprano - prevSoprano == 0 ) {
            if( currTenor - prevTenor != 0 )
                return true;
        } 
        else if( currSoprano - prevSoprano < 0 ) {
            if( currTenor - prevTenor >= 0 )
                return true;
        }
        return false;
    }

    Counterpoint.prototype.isImperfectConsonance = function( tenor, soprano ) {
        var diff = soprano - tenor,
            isImperfectConsonance = false;

        switch( diff ) {
            case 3:
            case 4:
            case 8:
            case 9:
            case 15:
            case 16:
                isImperfectConsonance = true;
                break;
            default:
                isImperfectConsonance = false;
                break;
        }
        return isImperfectConsonance;
    }


    return Counterpoint;
} );
