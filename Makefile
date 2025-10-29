NAME = servicedeskai

all:
	docker-compose up --build -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v

re: clean all

seed:
	docker exec -it servicedeskai_backend node src/scripts/createTestUsers.js

reset: clean all
	@echo "⏳ Waiting for containers to be ready..."
	@sleep 5
	@echo "🌱 Creating test data..."
	@make seed
