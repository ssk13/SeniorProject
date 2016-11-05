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
	* No outline of augmented fourth, outline of diminished 5th must be filled in and followed by step in the opposite direction
	* Direct repetition of contrapuntal combinaiton is forbidden - only 2 sequential repetitions allowed (p26)
	* 2nd species
		* may begin with a half-note rest, but first sounding note must be perfect consonance
	* 3rd species
		* Do not change direction more than 3 times in 6 quarter notes (account for larger leaps too, p58)
		* cambiata, echappee, double neighbor allowed allowed
	* Check cadence
	* Repeated notes in counterpoint can't ocur against repeated notes in cf
* Soft rules
	* Avoid skipping to and from a temporary high point
	* Accidental Bb's followed by descending motion
	* Avoid skipping in both voices - not as bad if 3rds
	* Change direction after a large skip (larger than a 4th) with a step
	* It is preferable to precede and/or follow a skip with a step or steps in the opposite direction.
	* Try to fill in skips
	* no outline of 7th, 9th, other dissonant intervals
	* Try to cover the whole octave every 10-20 CF notes (first species)
	* Try to cover the whole octave every 4-8 CF notes (2nd species)
	* 2nd
		* The same vertical interval should not be used in more than four successive whole-note units, regardless of what beat if falls on
	* 3rd
		* Avoid skipping up to a weak quarter
		* avoid temporary high note on weak quarter
		* avoid breaking up parallel intervals with only one quarter
	* If you're going to skip more than twice in succession, keep them small

Features To Implement
* MIDI playback
* MusicXML
* Check if invertible (just omit the 5ths if invertible at the octave...)
* 4th and 5th species CP
* Don't let users add 2 cantus firmuses
* Add elaboration on "is this voice the cantus firmus or the counterpoint" dialogue
* Create a form that sends me the composition and a brief message about what is mistaken
* Verify mode
* Let users change clef/species later

Features intentionally omitted
* Page that just lists all da rulez	- nah just direct to schubert

Aesthetic:
* Find way to connect parallel/consecutive perfect intervals horizontally to better group them

Rules to fix:
* Make repeated intervals check for enharmonic spellings of intervals
* For violation of a melodic/harmonic interval, outline *what* the illegal interval is and indicate it
* For violation of parallels, indicate *what* the intervals are

Questions for Richards
* In the case that the user put in incorrect rhythmic values (i.e. not proper to species selected) how should I determine strong v/ weak beats?
	nah just go ahead and assume that they want it checked anyway
* In the rule enumerations, should I cater it to the species that they're using?
	Such as, for harmonic violations, should I only discuss passing tones and such when relevant?
		make it specific
* How to account for larger leaps in 3rd species regarding excessively changing direction

change 'change duration' so the next note changes ,not the current one

Bank of cantus firmuses - to practice with
Practice exercises with randomly generated cantus firmuses