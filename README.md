# pomus_tcc
Plataforma para auxiliar os alunos da escola politécnica a compartilharem conteúdo de estudo das disciplinas de graduação. Trabalho de TCC de Victor Funabashi e Gabriel Paliari Zanoni.

## Primeiro setup

Tenha certeza de que o Python 3.6.x e pipenv já estão instalados
Clone o repositório e configure o ambiente virtual:
```$ git clone https://github.com/GabrielPaliari/pomus_tcc.git
$ cd pomus_tcc
$ pipenv install
$ pipenv shell
```



Certifique-se de que o mysql client está instalado.
Se não estiver, rode o comando: `pip install mysqlclient`
Caso não seja possível compilar, siga o link abaixo para saber como instalar o mysqlclient:
[install mysqlclient python](https://stackoverflow.com/questions/26866147/mysql-python-install-error-cannot-open-include-file-config-win-h#)

Realize as migrações iniciais, crie um usuário e inicie o servidor:
```(pomus_tcc) $ python manage.py makemigrations
(pomus_tcc) $ python manage.py migrate
(pomus_tcc) $ python manage.py createsuperuser
(pomus_tcc) $ python manage.py runserver
```
O aplicativo está utilizando o rest framework e rest-auth para implementar uma autenticação baseada em sessão. Depois do login é necessário armazenar o cookie para manter o usuário conectado ao sistema. 
Foi utilizado este [guia](https://wsvincent.com/django-rest-framework-user-authentication-tutorial/)

Endpoints
```
Login: http://127.0.0.1:8000/api/rest-auth/login/
Logout: http://127.0.0.1:8000/api/rest-auth/logout/
Registro: http://127.0.0.1:8000/api/rest-auth/registration/
Usuários: http://127.0.0.1:8000/api/usuarios/
```
