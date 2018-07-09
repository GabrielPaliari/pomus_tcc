# pomus_tcc
Plataforma para auxiliar os alunos da escola politécnica a compartilharem conteúdo de estudo das disciplinas de graduação. Trabalho de TCC de Victor Funabashi e Gabriel Paliari Zanoni.

#Primeiro setup

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
