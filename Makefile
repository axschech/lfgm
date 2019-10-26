container="-container"

build:
	docker-compose build
up:
	docker-compose up -d
logs:
	docker logs -f $(service)$(container)
stop:
	docker-compose stop
down:
	docker-compose down
