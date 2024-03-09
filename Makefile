all: copy-html build restore-html

copy-html:
	@cp index.html index.html.bak

build:
	@mdbook build c-programming

restore-html:
	@mv index.html.bak index.html
