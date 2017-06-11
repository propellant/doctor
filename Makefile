.PHONY: all test ci-test release help lint

all:		## Run test and release below
all: ci-test release

help:		## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

ci-test: lint
	@npm run mocha

test:		## Run linter and all tests
test: lint
	@npm run test

lint:		## Run linter
	@npm run lint$(FIX_FLAG)

release:	## Create a release of js and css in the lib folder
	@echo "\nCreating a release of propDoc\n"
	@npm run release

push-to-npm:
	npm publish

cleanup-lib:
	rm -rf lib

publish: all push-to-npm cleanup-lib

bump:
	npm version patch
