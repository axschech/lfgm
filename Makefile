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
make deploy:
	docker build -t lfgm .
	docker tag lfgm:latest 160043760558.dkr.ecr.us-east-2.amazonaws.com/lfgm:latest
	docker push 160043760558.dkr.ecr.us-east-2.amazonaws.com/lfgm:latest
