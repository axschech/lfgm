container="-container"

build:
	docker-compose build
up:
	docker-compose up -d
logs:
	docker-compose logs -f $(service)
stop:
	docker-compose stop
down:
	docker-compose down
