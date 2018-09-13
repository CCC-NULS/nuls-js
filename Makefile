.PHONY: build test coverage shell down lint publish link

YML_DEV=environment/dev/docker-compose.yml
COMPOSE_DEV=docker-compose -f ${YML_DEV}

build:
	${COMPOSE_DEV} build

publish: build down
	${COMPOSE_DEV} run --rm --no-deps --service-ports nuls_js publish

link: build down
	${COMPOSE_DEV} run --rm --no-deps --service-ports nuls_js link

test: build down
	${COMPOSE_DEV} run --rm --no-deps --service-ports nuls_js test

coverage: build down
	${COMPOSE_DEV} run --rm --no-deps --service-ports nuls_js coverage

lint: build down
	${COMPOSE_DEV} run --rm --no-deps --service-ports nuls_js lint

shell: build down
	${COMPOSE_DEV} run --rm --no-deps nuls_js /bin/bash

down:
	${COMPOSE_DEV} down