# Como Inicializar

Para subir tudo (pela primeira vez ou após mudanças no Dockerfile):
``` bash
docker-compose up --build
```

Para rodar o script de inicialização do banco de dados (`db:init`):
``` bash
docker exec -it finance_backend npm run db:init
```

Para rodar em segundo plano (_método padrão após o primeito init_):
``` bash
docker-compose up -d
```
