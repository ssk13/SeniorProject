angular.module( 'PseudoComposer' ).factory( 'Note', function() {

    var names = [ 'C', 'C', 'D', 'D', 'E', 'F', 'F', 'G', 'G', 'A', 'A', 'B' ];

    function Note( val, dur ) {
        this.val = val;
        this.dur = dur;
    }

    function Note( val ) {
        this.val = val;
        this.durr = 'q';
    }
 
    Note.prototype.transpose = function( halfsteps ) {
        this.val += halfsteps;
        while( this.val < 0 || this.val > 60 ) {
            if( this.val < 0 )
                this.transpose( 12 );
            if( this.val > 60 )
                this.transpose( -12 );
        }
    };

    return Note;
});
