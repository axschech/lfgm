container="-container"

build:
	docker-compose build $(service)
up:
	docker-compose up -d $(service)
logs:
	docker-compose logs -f $(service)
stop:
	docker-compose stop
down:
	docker-compose down
deploy:
	docker build -t lfgm .
	docker tag lfgm:latest 160043760558.dkr.ecr.us-east-2.amazonaws.com/lfgm:latest
	docker push 160043760558.dkr.ecr.us-east-2.amazonaws.com/lfgm:latest

db-connect:
	docker exec -it db-container mysql -u root -p -D lfgm