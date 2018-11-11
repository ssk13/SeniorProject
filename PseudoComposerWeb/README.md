# PseudoComposer
Senior Project - A dynamic angular application that algorithmically verifies species counterpoint according to 16th century standards (research paper selected for publication in Journal of Undergraduate Research, Summer 2018, http://ufdc.ufl.edu/UF00091523/00872)

Install Node and run the following commands from folder
	npm install http-server -g
	http-server

app location: localhost:8080

BUGS
* Make rules account for rests
* Make rests appear on middle of staff

Future Rules To Implement:
* Hard rules
	* Direct repetition of contrapuntal combinaiton is forbidden - only 2 sequential repetitions allowed (p26)
	* 2nd species
		* may begin with a half-note rest, but first sounding note must be perfect consonance
	* 3rd species
		* account for larger leaps in changing directions, p58
	* Check cadence
	* Repeated notes in counterpoint can't ocur against repeated notes in cf
* Soft rules
	* Avoid skipping in both voices - not as bad if 3rds
	* It is preferable to precede a skip with a step or steps in the opposite direction.
	* Try to fill in skips
	* No outline of 7th, 9th, other dissonant intervals
	* Try to cover the whole octave every 10-20 CF notes (first species)
	* Try to cover the whole octave every 4-8 CF notes (2nd species)
	* 2nd
		* The same vertical interval should not be used in more than four successive whole-note units, regardless of what beat if falls on
	* 3rd
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
* Bank of cantus firmuses - to practice with
* Practice exercises with randomly generated cantus firmuses

Rules to fix:
* Make repeated intervals check for enharmonic spellings of intervals
* For violation of a melodic/harmonic interval, outline *what* the illegal interval is and indicate it
* For violation of parallels, indicate *what* the intervals are
* For tritone outline, outline of diminished 5th must be filled in and followed by step in the opposite direction
* Make melodic intervals check for legal Bb
