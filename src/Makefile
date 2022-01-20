
browserify = ../node_modules/.bin/browserify
light-server = ../node_modules/.bin/light-server
port = 9181

js_bundle = ../docs/bundle.js

js_sources = main.js controller/controls.js model/board.js model/moves.js model/pieces.js view/graphics.js view/history.js

build : $(js_bundle)

$(js_bundle): $(js_sources)
	$(browserify) $(js_sources) -o $@

clean :
	rm -f $(js_bundle)

start: build
	$(light-server) -s ../docs -p $(port) -w "Makefile,*.js,*/*.js,../docs/*.html,../docs/*.css,../docs/*.svg # make"

run: start