PseudoComposer.controller( 'pseudoComposerController', [ '$scope', '$rootScope', 'CantusFirmus', 'TwoVoiceCounterpoint', 
    function( $scope, $rootScope, CantusFirmus, TwoVoiceCounterpoint ) {

        $scope.formState = 0;

        $scope.changeFormState = function( value ) {
            $scope.formState = value;
        };

        $scope.writeMusics = function() {
            var cantusFirmus = new CantusFirmus( 4 ),
                counterpoint;

            cantusFirmus.pseudoComposeFromScratch();

            if( $rootScope.inputParams.numberOfVoices == 1 )
            {
                $rootScope.$emit( 'printMusic', cantusFirmus );
                return;
            }

            counterpoint = new TwoVoiceCounterpoint( cantusFirmus, 4, $rootScope.inputParams.species );
            counterpoint.pseudoComposeFromScratch();
            $rootScope.$emit( 'printMusic', counterpoint );
        };
    }
] );
