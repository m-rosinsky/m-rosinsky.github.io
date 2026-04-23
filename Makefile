all: copy-html build restore-html

copy-html:
	@cp index.html index.html.bak

build:
	@mdbook build xapi
	@rm -rf xapi/book/_md_src
	@mkdir -p xapi/book/_md_src
	@cd xapi && find src -name '*.md' -print0 | while IFS= read -r -d '' f; do \
		rel="$${f#src/}"; \
		mkdir -p "book/_md_src/$$(dirname "$$rel")"; \
		cp "$$f" "book/_md_src/$$rel"; \
	done
	@cp README.md xapi/book/_md_src/README.md

restore-html:
	@mv index.html.bak index.html
