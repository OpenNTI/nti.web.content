.PHONY: bundle clean check test

REPORTS = reports
LIB = lib

MAKE_PACKAGE=webpack --progress --cache --bail --hide-modules=true --display-chunks=false

all: clean test bundle

node_modules: package.json
	@rm -rf node_modules
	@npm install
	@touch node_modules

test: node_modules check
	@jest --coverage

check:
	@eslint --ext .js,.jsx ./src

clean:
	@rm -rf $(LIB)
	@rm -rf $(REPORTS)

bundle: node_modules
	@$(MAKE_PACKAGE)
