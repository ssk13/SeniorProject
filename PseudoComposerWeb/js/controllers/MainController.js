PseudoComposer.controller( 'mainController', [ '$scope', '$rootScope', '$location', 
    function( $scope, $rootScope, $location ) {

        $rootScope.inputParams = {
            numberOfVoices: 0,
            species: 0,
            voiceType: [ 'Cantus Firmus', 'Counterpoint', 'Counterpoint', 'Counterpoint' ],
            clef: [ 'img/trebleclef.png', 'img/trebleclef.png', 'img/trebleclef.png', 'img/trebleclef.png' ]
        };

        $scope.routeTo = function( value ) {
            $location.path( value );
        };

        $scope.getArrayOfSizeNumber = function( num ) {
            return new Array( num );   

        };

        $rootScope.getAsciiDiff = function( a, b ) {
            return ( a.charCodeAt( 0 ) - b.charCodeAt( 0 ) );
        }
    }
] );
