.PHONY: test release

all:		## Run test and release below
all: release-test release

help:		## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

release-test: lint
	@npm run mocha

test:		## Run linter and all tests
test: lint
	@npm run test

lint:		## Run linter
	@npm run lint$(FIX_FLAG)

release:	## Create a release of js and css in the lib folder
	@echo "\nCreating a release of propDoc\n"
	@npm run release
