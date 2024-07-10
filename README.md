Voice Search
============

Voice Search is a Google Chrome extension that provides a method to search by
speaking. For example, just click on microphone and say <q>kittens</q> to search for
kittens. If you specifically  want <em>pictures</em> of kittens, say <q><strong>google
images</strong> kittens</q>. Want to learn more about World War II? Say
<q><strong>wikipedia</strong> world war two</q>.

Screenshots
-----------

* [Voice Search popup][1]
* [Options page][2]
* [Google][3]
* [Bing][4]
* [reddit][5]

Roadmap
-------

<dl>
	<dt>Version 1.2</dt>
	<dd>
		One-click voice search from the browser button and Chrome OS integration with the Search key.
	</dd>
	<dt>Version 1.3</dt>
	<dd>
		Implement functionality to import and export search engines and settings. Also
		provide an interface for setting common "task" terms and give it appropriate
		defaults. For example, set <em>map</em> to Google Maps and <em>buy</em> to Google
		Shopping and say <q><strong>map</strong> atlantis</q>, <q><strong>buy</strong>
		flux capacitor</q>, or even  <q><strong>calculate</strong> cloud height for a 1
		megaton nuclear explosion</q> (assuming <em>calculate</em> is set to
		Wolfram|Alpha). Currently, one must create new terms to do this, and modifying the
		old term's URI template does not update the new term's URI template. <em>listen
		to</em> and/or <em>play</em> are likely to be included in this version, but I'm
		not sure what the default should be so I'm open to suggestions.
	</dd>
	<dt>Version 1.4</dt>
	<dd>
		Detect OpenSearch description files and provide a method to easily add them to
		Voice Search. If Google Chrome stable implements
		<code>SpeechInputResultCollection</code>, it will be used to chose the closest
		utterance to using a term, and if <code>SpeechInputError</code> events get
		implemented, they will be handled appropriately to inform the user of any problems
		recognizing speech input.
	</dd>
	<dt>Version 2.0</dt>
	<dd>
		Support scripted terms and revamp the options interface accordingly. There will
		also need to be a way for websites to signal that they provide a scripted term.
		This release is aimed at providing at least some of the features that Mozilla
		Ubiquity implemented, but for voice.
	</dd>
</dl>

![Tracking image](//in.getclicky.com/212712ns.gif)

  [1]: http://purl.eligrey.com/github/voice-search/raw/master/screenshots/popup.png
  [2]: http://purl.eligrey.com/github/voice-search/raw/master/screenshots/options.png
  [3]: http://purl.eligrey.com/github/voice-search/raw/master/screenshots/google.png
  [4]: http://purl.eligrey.com/github/voice-search/raw/master/screenshots/bing.png
  [5]: http://purl.eligrey.com/github/voice-search/raw/master/screenshots/reddit.png
