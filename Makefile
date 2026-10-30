.PHONY: up down logs api-shell migrate seed

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f api mysql

api-shell:
	docker compose exec api sh

migrate:
	docker compose exec api php artisan migrate --force

seed:
	docker compose exec api php artisan db:seed --force
