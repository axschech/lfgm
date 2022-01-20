build: 
	docker-compose build
up:
	docker-compose up -d ${service}

down:
	docker-compose down

dev:
	npm run start:watch

db:
	docker-compose exec db mysql -u root -p lfgm
logs:
	@docker-compose logs -f