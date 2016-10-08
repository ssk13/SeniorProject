# PseudoComposer
Senior Project

Install Node and run the following commands from folder
	npm install http-server -g
	http-server


app location: localhost:8080

Rules To Implement:
* Hard rules
	* Circumstances for Eb
	* Bb as upper neighbor to A or to avoid tritone ONLY
	* No outline of augmented fourth
	* Outline of diminished 5th must be filled in and followed by step in the opposite direction
	* Direct repetition of contrapuntal combinaiton is forbidden - only 2 sequential repetitions allowed
	* 2nd species
		* repeated notes are not allowed in added voice
		* may begin with a half-note rest, but first sounding note must be perfect consonance
	* 3rd species
		* Do not use same neighbor twice in a row
		* Do not change direction more than 3 times in 6 quarter notes
		* cambiata, echappee, double neighbor allowed allowed
	* Check cadence
* Soft rules
	* Avoid skipping to and from a temporary high point
	* Accidental Bb's followed by descending motion
	* Avoid skipping in both voices - not as bad if 3rds
	* Change direction after a large skip (larger than a 4th) with a step
	* Try to fill in skips
	* no outline of 7th, 9th, other dissonant intervals
	* Try to cover the whole octave every 10-20 CF notes (first species)
	* Try to cover the whole octave every 4-8 CF notes (2nd species)
	* 3rd
		* Avoid skipping up to a weak quarter
		* avoid temporary high note on weak quarter
		* rarely exceed a 3rd in this species
		* avoid breaking up parallel intervals with only one quarter

Features To Implement
* Information about rules broken
	* Add information
* MIDI playback
* MusicXML
* Check if invertible (just omit the 5ths if invertible at the octave...)
* 4th and 5th species CP
* Page that just lists all da rulez
* Don't let users add 2 cantus firmuses
* Add elaboration on "is this voice the cantus firmus or the counterpoint" dialogue

Aesthetic:
* Find way to connect parallel/consecutive perfect intervals horizontally to better group them

Rules to fix:
* Make repeated intervals check for enharmonic spellings of intervals

Questions for Richards
* In the case that the user put in incorrect rhythmic values (i.e. not proper to species selected) how should I determine strong v/ weak beats?
